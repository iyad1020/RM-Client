const path = require("path");
const fs = require("fs");
const db = require("../db/database");

const src = path.join(process.env.APPDATA, "rm-client", "cache.db");
const copy = path.join(process.env.TEMP, "rm-client-cache-v8-test.db");

fs.copyFileSync(src, copy);
for (const ext of ["-wal", "-shm"]) {
  const side = src + ext;
  if (fs.existsSync(side)) fs.copyFileSync(side, copy + ext);
}

db.closeDatabase();
db.openDatabase(copy);
const ver = db.getMeta("schema_version");
const timer = db.getActiveTimer();
const cols = db
  .getDb()
  .prepare("PRAGMA table_info(time_entries)")
  .all()
  .map((c) => c.name);
const hasActiveTimer = Boolean(
  db.getDb().prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='active_timer'").get(),
);
const issuesCount = db.getDb().prepare("SELECT COUNT(*) AS c FROM issues").get().c;
console.log(
  JSON.stringify(
    {
      ver,
      timer,
      hasStartedAt: cols.includes("started_at"),
      hasEntryKind: cols.includes("entry_kind"),
      hasActiveTimer,
      issuesCount,
    },
    null,
    2,
  ),
);
db.closeDatabase();
