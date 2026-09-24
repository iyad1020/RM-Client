const path = require("path");
const fs = require("fs");
const { app, safeStorage } = require("electron");

const REAL = path.join(process.env.APPDATA || "", "rm-client");
app.setPath("userData", REAL);
if (process.platform === "win32") app.setAppUserModelId("ru.grandproject.rmclient");

function decryptSecret(stored) {
  const value = String(stored || "");
  const prefix = "safeStorage:v1:";
  if (!value) return "";
  const tryDecrypt = (base64Payload) => {
    try {
      if (!safeStorage?.isEncryptionAvailable?.()) return null;
      return safeStorage.decryptString(Buffer.from(base64Payload, "base64"));
    } catch {
      return null;
    }
  };
  if (value.startsWith(prefix)) return tryDecrypt(value.slice(prefix.length)) || "";
  return tryDecrypt(value) || value;
}

app.whenReady().then(async () => {
  const settings = JSON.parse(fs.readFileSync(path.join(REAL, "settings.json"), "utf8"));
  const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
  const apiKey = decryptSecret(settings.apiKey);
  const db = require("../db/database");
  const offlineQueue = require("../sync/offline-queue");
  db.openDatabase(path.join(REAL, "cache.db"));
  console.log("queue before", db.getOfflineQueue().length);
  const result = await offlineQueue.flushOfflineQueue(redmineUrl, apiKey);
  console.log("flush", result);
  console.log("queue after", db.getOfflineQueue().length);
  console.log(
    "failures",
    db.getUnreadSyncFailures().slice(0, 5).map((f) => ({
      l: f.entity_label,
      m: String(f.message || "").slice(0, 160),
    })),
  );
  db.closeDatabase();
  app.exit(0);
});
