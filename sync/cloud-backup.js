const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");

function requestJson(url, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const req = lib.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: `${parsed.pathname}${parsed.search}`,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = null;
          }
          if (res.statusCode >= 400) {
            const err = new Error(
              `HTTP ${res.statusCode}: ${(json && (json.message || json.error)) || text.slice(0, 200)}`,
            );
            err.statusCode = res.statusCode;
            err.body = json;
            reject(err);
            return;
          }
          resolve({ status: res.statusCode, json, text, headers: res.headers });
        });
      },
    );
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function uploadBinary(url, buffer, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const req = lib.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        path: `${parsed.pathname}${parsed.search}`,
        method: "PUT",
        headers: {
          "Content-Length": buffer.length,
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          if (res.statusCode >= 400) {
            reject(new Error(`Upload failed: HTTP ${res.statusCode}`));
            return;
          }
          resolve({ status: res.statusCode });
        });
      },
    );
    req.on("error", reject);
    req.write(buffer);
    req.end();
  });
}

/**
 * Upload a local file to Yandex Disk via REST API.
 * @param {object} opts
 * @param {string} opts.token OAuth token
 * @param {string} opts.localPath
 * @param {string} opts.remotePath e.g. app:/RM Client/backups/cache-….db
 */
async function uploadToYandexDisk({ token, localPath, remotePath }) {
  if (!token) throw new Error("Нет OAuth-токена Яндекс.Диска");
  if (!localPath || !fs.existsSync(localPath)) throw new Error("Файл бэкапа не найден");
  const pathEnc = encodeURIComponent(remotePath);
  const link = await requestJson(
    `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${pathEnc}&overwrite=true`,
    { headers: { Authorization: `OAuth ${token}` } },
  );
  const href = link.json?.href;
  if (!href) throw new Error("Яндекс.Диск не вернул ссылку для загрузки");
  const buffer = fs.readFileSync(localPath);
  await uploadBinary(href, buffer);
  return { ok: true, provider: "yandex", remotePath };
}

/**
 * List files in a Yandex Disk folder (flat).
 */
async function listYandexDiskFolder({ token, remoteDir }) {
  const pathEnc = encodeURIComponent(remoteDir);
  const res = await requestJson(
    `https://cloud-api.yandex.net/v1/disk/resources?path=${pathEnc}&limit=100&sort=-created`,
    { headers: { Authorization: `OAuth ${token}` } },
  );
  return (res.json?._embedded?.items || []).filter((item) => item.type === "file");
}

async function deleteYandexDiskPath({ token, remotePath }) {
  const pathEnc = encodeURIComponent(remotePath);
  await requestJson(`https://cloud-api.yandex.net/v1/disk/resources?path=${pathEnc}&permanently=true`, {
    method: "DELETE",
    headers: { Authorization: `OAuth ${token}` },
  });
}

async function ensureYandexFolder({ token, remoteDir }) {
  const pathEnc = encodeURIComponent(remoteDir);
  try {
    await requestJson(`https://cloud-api.yandex.net/v1/disk/resources?path=${pathEnc}`, {
      method: "PUT",
      headers: { Authorization: `OAuth ${token}` },
    });
  } catch (error) {
    // 409 = already exists
    if (error.statusCode !== 409) throw error;
  }
}

/** Find or create a Drive folder by name under My Drive root. Returns folder id. */
async function ensureGoogleBackupFolder({ accessToken, folderName = "RM Client backups" }) {
  if (!accessToken) throw new Error("Нет access token Google Drive");
  const name = String(folderName || "RM Client backups").replace(/'/g, "\\'");
  const q = encodeURIComponent(
    `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and 'root' in parents and trashed = false`,
  );
  const listed = await requestJson(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const existing = listed.json?.files?.[0];
  if (existing?.id) return existing.id;

  const body = JSON.stringify({
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  });
  const created = await requestJson("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    },
    body,
  });
  if (!created.json?.id) throw new Error("Не удалось создать папку на Google Drive");
  return created.json.id;
}

/**
 * Google Drive simple upload with access token (drive.file scope).
 * Caller refreshes token externally if needed.
 */
async function uploadToGoogleDrive({ accessToken, localPath, fileName, folderId }) {
  if (!accessToken) throw new Error("Нет access token Google Drive");
  if (!localPath || !fs.existsSync(localPath)) throw new Error("Файл бэкапа не найден");
  const metadata = {
    name: fileName || path.basename(localPath),
  };
  if (folderId) metadata.parents = [folderId];

  const boundary = `rmclient_${Date.now()}`;
  const metaPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const fileBuffer = fs.readFileSync(localPath);
  const fileHeader = `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`;
  const end = `\r\n--${boundary}--`;
  const body = Buffer.concat([
    Buffer.from(metaPart, "utf8"),
    Buffer.from(fileHeader, "utf8"),
    fileBuffer,
    Buffer.from(end, "utf8"),
  ]);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "www.googleapis.com",
        path: "/upload/drive/v3/files?uploadType=multipart",
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode >= 400) {
            reject(new Error(`Google Drive upload: HTTP ${res.statusCode} ${text.slice(0, 200)}`));
            return;
          }
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            json = null;
          }
          resolve({ ok: true, provider: "google", file: json });
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function listGoogleDriveFiles({ accessToken, folderId, pageSize = 50 }) {
  const q = folderId
    ? `'${folderId}' in parents and trashed=false`
    : `name contains 'cache-' and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&orderBy=createdTime desc&q=${encodeURIComponent(q)}&fields=files(id,name,createdTime,size)`;
  const res = await requestJson(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  return res.json?.files || [];
}

async function deleteGoogleDriveFile({ accessToken, fileId }) {
  await requestJson(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Prune cloud copies keeping newest `keep` files.
 */
async function pruneCloudBackups({ provider, token, accessToken, remoteDir, folderId, keep = 10 }) {
  const limit = Math.max(1, Number(keep) || 10);
  if (provider === "yandex") {
    const items = await listYandexDiskFolder({ token, remoteDir });
    const files = items
      .filter((item) => /^cache-.*\.db$/i.test(item.name || ""))
      .sort((a, b) => String(b.created || "").localeCompare(String(a.created || "")));
    for (const item of files.slice(limit)) {
      await deleteYandexDiskPath({ token, remotePath: item.path });
    }
    return { pruned: Math.max(0, files.length - limit) };
  }
  if (provider === "google") {
    const files = await listGoogleDriveFiles({ accessToken, folderId });
    const matched = files.filter((f) => /^cache-.*\.db$/i.test(f.name || ""));
    for (const file of matched.slice(limit)) {
      await deleteGoogleDriveFile({ accessToken, fileId: file.id });
    }
    return { pruned: Math.max(0, matched.length - limit) };
  }
  return { pruned: 0 };
}

module.exports = {
  uploadToYandexDisk,
  listYandexDiskFolder,
  deleteYandexDiskPath,
  ensureYandexFolder,
  ensureGoogleBackupFolder,
  uploadToGoogleDrive,
  listGoogleDriveFiles,
  deleteGoogleDriveFile,
  pruneCloudBackups,
};
