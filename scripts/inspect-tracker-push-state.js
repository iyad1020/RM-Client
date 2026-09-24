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
  try {
    if (value.startsWith(prefix) && safeStorage?.isEncryptionAvailable?.()) {
      return safeStorage.decryptString(Buffer.from(value.slice(prefix.length), "base64"));
    }
  } catch {
    /* ignore */
  }
  return value;
}

app.whenReady().then(async () => {
  const db = require("../db/database");
  db.openDatabase(path.join(REAL, "cache.db"));
  console.log("queue", db.getOfflineQueue().map((i) => ({ id: i.id, type: i.type, err: i.last_error, p: i.payload_json.slice(0, 250) })));
  console.log(
    "failures",
    db.getUnreadSyncFailures().slice(0, 8).map((f) => ({
      at: f.created_at,
      l: f.entity_label,
      m: String(f.message || "").slice(0, 200),
    })),
  );
  const today = new Date().toISOString().slice(0, 10);
  const entries = db.queryTimeEntries({ issueId: 32737, from: today });
  console.log(
    "local today",
    entries.map((e) => ({
      id: e.id,
      h: e.hours,
      st: e.sync_status,
      act: e.activity_id,
      c: e.comments,
      src: e.entry_source,
    })),
  );
  db.closeDatabase();
  app.exit(0);
});
