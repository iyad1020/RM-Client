const path = require("path");
const fs = require("fs");

/**
 * Online backup of the open SQLite DB into backupsDir.
 * Uses better-sqlite3 Database#backup() — not fs.copyFile.
 * @param {import("better-sqlite3").Database} db
 * @param {string} backupsDir
 * @returns {Promise<string>} path to the created snapshot
 */
async function runBackupSnapshot(db, backupsDir) {
  if (!db) throw new Error("runBackupSnapshot: db is required");
  if (!backupsDir) throw new Error("runBackupSnapshot: backupsDir is required");
  fs.mkdirSync(backupsDir, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(backupsDir, `cache-${timestamp}.db`);
  await db.backup(dest);
  return dest;
}

/**
 * Keep only the newest `keep` snapshot files (by mtime). Older ones are deleted.
 * @param {string} backupsDir
 * @param {number} [keep=20]
 */
function pruneOldBackups(backupsDir, keep = 20) {
  if (!backupsDir || !fs.existsSync(backupsDir)) return;
  const limit = Math.max(1, Number(keep) || 20);
  const files = fs
    .readdirSync(backupsDir)
    .filter((name) => /^cache-.*\.db$/i.test(name))
    .map((name) => {
      const full = path.join(backupsDir, name);
      let mtimeMs = 0;
      try {
        mtimeMs = fs.statSync(full).mtimeMs;
      } catch {
        mtimeMs = 0;
      }
      return { full, mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  for (const file of files.slice(limit)) {
    try {
      fs.unlinkSync(file.full);
    } catch (error) {
      console.error("pruneOldBackups: failed to remove", file.full, error.message);
    }
  }
}

/**
 * Periodic auto-backups. Caller supplies getters so settings/path can change.
 * @param {() => import("better-sqlite3").Database | null} getDb
 * @param {() => string | null} getBackupsDir — return null/empty to skip a tick
 * @param {number} [intervalMinutes=15]
 * @returns {NodeJS.Timeout}
 */
function scheduleAutoBackups(getDb, getBackupsDir, intervalMinutes = 15) {
  const minutes = Math.max(1, Number(intervalMinutes) || 15);
  const timer = setInterval(() => {
    Promise.resolve()
      .then(async () => {
        const db = typeof getDb === "function" ? getDb() : null;
        const dir = typeof getBackupsDir === "function" ? getBackupsDir() : null;
        if (!db || !dir) return;
        await runBackupSnapshot(db, dir);
        pruneOldBackups(dir, 20);
      })
      .catch((error) => {
        console.error("Auto backup failed:", error.message);
      });
  }, minutes * 60 * 1000);
  if (typeof timer.unref === "function") timer.unref();
  return timer;
}

module.exports = {
  runBackupSnapshot,
  pruneOldBackups,
  scheduleAutoBackups,
};
