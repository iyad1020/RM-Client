const http = require("http");
const crypto = require("crypto");
const { shell } = require("electron");

function base64Url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function createPkcePair() {
  const verifier = base64Url(crypto.randomBytes(32));
  const challenge = base64Url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

/**
 * Listen once on 127.0.0.1 for OAuth redirect with ?code=
 * @returns {Promise<{code:string, redirectUri:string, port:number}>}
 */
function waitForOAuthCode({ timeoutMs = 180000 } = {}) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || "/", "http://127.0.0.1");
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (err) {
          res.end("<h2>Доступ не выдан</h2><p>Можно закрыть окно и вернуться в RM Client.</p>");
          server.close();
          reject(new Error(err));
          return;
        }
        if (!code) {
          res.end("<h2>Нет кода</h2>");
          return;
        }
        res.end("<h2>Готово</h2><p>Можно закрыть вкладку и вернуться в RM Client.</p>");
        server.close();
        resolve({ code, redirectUri: `http://127.0.0.1:${server.address().port}/callback`, port: server.address().port });
      } catch (error) {
        reject(error);
      }
    });
    server.listen(0, "127.0.0.1", () => {
      /* port assigned */
    });
    server.on("error", reject);
    const timer = setTimeout(() => {
      try {
        server.close();
      } catch {
        /* ignore */
      }
      reject(new Error("Время ожидания входа истекло"));
    }, timeoutMs);
    server.on("close", () => clearTimeout(timer));
  });
}

async function postForm(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  if (!res.ok) {
    throw new Error(json?.error_description || json?.error || `OAuth token HTTP ${res.status}`);
  }
  return json;
}

/**
 * Yandex OAuth (authorization code + optional PKCE).
 * Requires registered app with Redirect URI http://127.0.0.1:<port>/callback
 * — for desktop we use dynamic port; register http://127.0.0.1/callback may not work.
 * Practical approach: use token page flow OR fixed port 42813 registered in app.
 */
async function connectYandexDisk({ clientId, clientSecret, fixedPort = 42813 }) {
  if (!clientId) throw new Error("Укажите Client ID приложения Яндекс OAuth");
  const { verifier, challenge } = createPkcePair();
  const redirectUri = `http://127.0.0.1:${fixedPort}/callback`;

  const codePromise = new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || "/", redirectUri);
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (err) {
          res.end("<h2>Доступ не выдан</h2><p>Закройте вкладку.</p>");
          server.close();
          reject(new Error(err));
          return;
        }
        if (!code) {
          res.end("<h2>Ожидание кода…</h2>");
          return;
        }
        res.end("<h2>Яндекс.Диск подключён</h2><p>Можно закрыть вкладку.</p>");
        server.close();
        resolve(code);
      } catch (error) {
        reject(error);
      }
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        reject(new Error(`Порт ${fixedPort} занят — закройте другое приложение или смените порт`));
      } else reject(error);
    });
    server.listen(fixedPort, "127.0.0.1");
    setTimeout(() => {
      try {
        server.close();
      } catch {
        /* ignore */
      }
      reject(new Error("Время ожидания входа в Яндекс истекло"));
    }, 180000);
  });

  const authUrl =
    `https://oauth.yandex.ru/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&force_confirm=yes` +
    `&code_challenge=${encodeURIComponent(challenge)}` +
    `&code_challenge_method=S256`;
  await shell.openExternal(authUrl);
  const code = await codePromise;
  const tokenBody = {
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  };
  if (clientSecret) tokenBody.client_secret = clientSecret;
  const tokens = await postForm("https://oauth.yandex.ru/token", tokenBody);
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    expiresIn: tokens.expires_in,
  };
}

/**
 * Google Drive OAuth for desktop.
 * IMPORTANT: open in the *system* browser via shell.openExternal — never in an
 * Electron BrowserWindow. Google blocks embedded Electron UAs with
 * "This browser or app may not be secure" (see SO 59685927). Loopback
 * http://127.0.0.1:port/callback + PKCE is the supported native/desktop flow.
 */
async function connectGoogleDrive({ clientId, clientSecret, fixedPort = 42814 }) {
  if (!clientId || !clientSecret) {
    throw new Error("Укажите Google Client ID и Client Secret (тип Desktop)");
  }
  const { verifier, challenge } = createPkcePair();
  const redirectUri = `http://127.0.0.1:${fixedPort}/callback`;
  const codePromise = new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url || "/", redirectUri);
        const code = url.searchParams.get("code");
        const err = url.searchParams.get("error");
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        if (err) {
          res.end("<h2>Доступ не выдан</h2>");
          server.close();
          reject(new Error(err));
          return;
        }
        if (!code) {
          res.end("<h2>Ожидание…</h2>");
          return;
        }
        res.end("<h2>Google Drive подключён</h2><p>Можно закрыть вкладку.</p>");
        server.close();
        resolve(code);
      } catch (error) {
        reject(error);
      }
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        reject(new Error(`Порт ${fixedPort} занят`));
      } else reject(error);
    });
    server.listen(fixedPort, "127.0.0.1");
    setTimeout(() => {
      try {
        server.close();
      } catch {
        /* ignore */
      }
      reject(new Error("Время ожидания входа в Google истекло"));
    }, 180000);
  });

  const scope = encodeURIComponent("https://www.googleapis.com/auth/drive.file");
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&access_type=offline&prompt=consent` +
    `&code_challenge=${encodeURIComponent(challenge)}` +
    `&code_challenge_method=S256`;
  await shell.openExternal(authUrl);
  const code = await codePromise;
  const tokens = await postForm("https://oauth2.googleapis.com/token", {
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || "",
    expiresIn: tokens.expires_in,
  };
}

async function listYandexFolders(token, path = "app:/") {
  const enc = encodeURIComponent(path);
  const res = await fetch(
    `https://cloud-api.yandex.net/v1/disk/resources?path=${enc}&limit=100&sort=name`,
    { headers: { Authorization: `OAuth ${token}` } },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || `Yandex list HTTP ${res.status}`);
  return (json?._embedded?.items || [])
    .filter((item) => item.type === "dir")
    .map((item) => ({ id: item.path, name: item.name, path: item.path }));
}

async function listGoogleFolders(accessToken, parentId = "root") {
  const q = encodeURIComponent(
    `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=100`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Google list HTTP ${res.status}`);
  return (json.files || []).map((f) => ({ id: f.id, name: f.name, path: f.id }));
}

module.exports = {
  connectYandexDisk,
  connectGoogleDrive,
  listYandexFolders,
  listGoogleFolders,
  waitForOAuthCode,
  createPkcePair,
};
