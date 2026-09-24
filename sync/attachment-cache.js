const path = require("path");
const fs = require("fs");

/**
 * Disk cache for Redmine attachment binaries under userData/attachments.
 */
function getAttachmentsDir(userDataPath) {
  return path.join(userDataPath, "attachments");
}

function ensureAttachmentsDir(userDataPath) {
  const dir = getAttachmentsDir(userDataPath);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function localPathForAttachment(userDataPath, attachmentId, filename) {
  const safeName = String(filename || "file").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").slice(0, 120);
  return path.join(getAttachmentsDir(userDataPath), `${Number(attachmentId)}-${safeName}`);
}

function readCachedAttachment(localPath) {
  if (!localPath || !fs.existsSync(localPath)) return null;
  try {
    return fs.readFileSync(localPath);
  } catch {
    return null;
  }
}

function writeCachedAttachment(userDataPath, attachmentId, filename, buffer) {
  ensureAttachmentsDir(userDataPath);
  const dest = localPathForAttachment(userDataPath, attachmentId, filename);
  fs.writeFileSync(dest, buffer);
  return dest;
}

function removeCachedAttachment(localPath) {
  if (!localPath) return;
  try {
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  } catch (error) {
    console.error("removeCachedAttachment:", error.message);
  }
}

function dirSizeBytes(dir) {
  if (!dir || !fs.existsSync(dir)) return 0;
  let total = 0;
  const walk = (current) => {
    for (const name of fs.readdirSync(current)) {
      const full = path.join(current, name);
      let st;
      try {
        st = fs.statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) walk(full);
      else total += st.size;
    }
  };
  walk(dir);
  return total;
}

/**
 * Evict oldest non-favorite attachment files until under maxBytes.
 * @param {object} opts
 * @param {string} opts.userDataPath
 * @param {number} opts.maxBytes
 * @param {(row:{id:number,local_path:string,cached_at:string,issue_id:number})=>boolean} opts.isProtected
 * @param {() => Array} opts.listCachedAttachments
 * @param {(id:number)=>void} opts.clearLocalPath
 */
function evictAttachmentCache({
  userDataPath,
  maxBytes,
  isProtected,
  listCachedAttachments,
  clearLocalPath,
}) {
  const limit = Number(maxBytes);
  if (!Number.isFinite(limit) || limit <= 0) return { removed: 0 };
  const dir = getAttachmentsDir(userDataPath);
  let size = dirSizeBytes(dir);
  if (size <= limit) return { removed: 0 };

  const rows = (typeof listCachedAttachments === "function" ? listCachedAttachments() : [])
    .filter((row) => row?.local_path)
    .sort((a, b) => String(a.cached_at || "").localeCompare(String(b.cached_at || "")));

  let removed = 0;
  for (const row of rows) {
    if (size <= limit) break;
    if (typeof isProtected === "function" && isProtected(row)) continue;
    let fileSize = 0;
    try {
      fileSize = fs.statSync(row.local_path).size;
    } catch {
      fileSize = 0;
    }
    removeCachedAttachment(row.local_path);
    if (typeof clearLocalPath === "function") clearLocalPath(row.id);
    size = Math.max(0, size - fileSize);
    removed += 1;
  }
  return { removed, size };
}

module.exports = {
  getAttachmentsDir,
  ensureAttachmentsDir,
  localPathForAttachment,
  readCachedAttachment,
  writeCachedAttachment,
  removeCachedAttachment,
  dirSizeBytes,
  evictAttachmentCache,
};
