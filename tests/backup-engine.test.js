const path = require("path");
const fs = require("fs");
const os = require("os");
const Database = require("better-sqlite3");
const backupEngine = require("../sync/backup-engine");

describe("backup-engine", () => {
  let tmpDir;
  let db;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "rm-backup-"));
    db = new Database(":memory:");
    db.exec("CREATE TABLE t (id INTEGER PRIMARY KEY, v TEXT); INSERT INTO t (v) VALUES ('x');");
  });

  afterEach(() => {
    if (db) db.close();
    if (tmpDir && fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("runBackupSnapshot creates a cache-*.db file", async () => {
    const dest = await backupEngine.runBackupSnapshot(db, tmpDir);
    expect(dest).toMatch(/cache-.*\.db$/);
    expect(fs.existsSync(dest)).toBe(true);
  });

  it("pruneOldBackups keeps only the newest N files", async () => {
    for (let i = 0; i < 5; i += 1) {
      const name = path.join(tmpDir, `cache-2026-01-0${i + 1}.db`);
      fs.writeFileSync(name, `x${i}`);
      // stagger mtimes
      const t = Date.now() - (5 - i) * 1000;
      fs.utimesSync(name, new Date(t), new Date(t));
    }
    backupEngine.pruneOldBackups(tmpDir, 2);
    const left = fs.readdirSync(tmpDir).filter((n) => n.endsWith(".db")).sort();
    expect(left).toHaveLength(2);
    expect(left).toEqual(["cache-2026-01-04.db", "cache-2026-01-05.db"]);
  });
});
