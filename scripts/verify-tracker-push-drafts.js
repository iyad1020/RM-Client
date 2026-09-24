/**
 * Step 3 verification: create draft TE on #32737, push via tracker:push-drafts path,
 * confirm in Redmine API.
 *
 * Run: npx electron scripts/verify-tracker-push-drafts.js
 */
const path = require("path");
const fs = require("fs");
const { app, safeStorage } = require("electron");

const REAL_USER_DATA = path.join(process.env.APPDATA || "", "rm-client");
if (REAL_USER_DATA && fs.existsSync(REAL_USER_DATA)) {
  app.setPath("userData", REAL_USER_DATA);
}
if (process.platform === "win32") {
  app.setAppUserModelId("ru.grandproject.rmclient");
}

const ISSUE_ID = 32737;

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
  if (value.startsWith(prefix)) {
    return tryDecrypt(value.slice(prefix.length)) || "";
  }
  return tryDecrypt(value) || value;
}

function loadCredentials(userData) {
  const settings = JSON.parse(fs.readFileSync(path.join(userData, "settings.json"), "utf8"));
  return {
    redmineUrl: String(settings.redmineUrl || "").replace(/\/$/, ""),
    apiKey: decryptSecret(settings.apiKey),
  };
}

app.whenReady().then(async () => {
  const marker = `tracker-push-${Date.now()}`;
  let exitCode = 0;
  try {
    const userData = app.getPath("userData");
    const realUserData = path.join(app.getPath("appData"), "rm-client");
    const credsDir = fs.existsSync(path.join(realUserData, "settings.json")) ? realUserData : userData;
    const { redmineUrl, apiKey } = loadCredentials(credsDir);
    if (!redmineUrl || !apiKey) throw new Error("Missing redmineUrl/apiKey");

    const db = require("../db/database");
    const redmine = require("../sync/redmine-client");
    const offlineQueue = require("../sync/offline-queue");
    const backupEngine = require("../sync/backup-engine");

    db.openDatabase(path.join(credsDir, "cache.db"));

    // Ensure schema v8 columns exist on real DB.
    const ver = db.getMeta("schema_version");
    console.log("schema_version=", ver);

    const activities = db.getReferenceData("activities") || [];
    const activityId = activities.find((a) => a.is_default)?.id || activities[0]?.id;
    if (!activityId) throw new Error("No activities in local cache — sync reference first");

    const drafts = [];
    for (const hours of [0.02, 0.03]) {
      const row = db.insertLocalTimeEntry({
        issue_id: ISSUE_ID,
        hours,
        spent_on: new Date().toISOString().slice(0, 10),
        comments: `${marker} ${hours}h`,
        activity_id: activityId,
        sync_status: "draft",
        entry_source: "timer",
        entry_kind: "work",
        started_at: new Date(Date.now() - hours * 3600 * 1000).toISOString(),
        ended_at: new Date().toISOString(),
      });
      drafts.push(row);
      console.log("created draft", row.id, hours);
    }

    // Bad activity draft — should not block others; ends in sync_failures after flush.
    const bad = db.insertLocalTimeEntry({
      issue_id: ISSUE_ID,
      hours: 0.01,
      spent_on: new Date().toISOString().slice(0, 10),
      comments: `${marker} bad-activity`,
      activity_id: 999999001,
      sync_status: "draft",
      entry_source: "timer",
      entry_kind: "work",
    });
    drafts.push(bad);
    console.log("created bad draft", bad.id);

    const ids = drafts.map((d) => d.id);
    const results = [];
    for (const id of ids) {
      const entry = db.getTimeEntryById(id);
      if (!entry || entry.sync_status !== "draft") {
        results.push({ id, ok: false, reason: "not-a-draft" });
        continue;
      }
      if (!entry.issue_id || !(entry.hours > 0) || !["work", "external"].includes(entry.entry_kind || "work")) {
        results.push({ id, ok: false, reason: "validation" });
        continue;
      }
      try {
        await offlineQueue.createTimeEntryWithOffline(
          redmineUrl,
          apiKey,
          {
            issue_id: entry.issue_id,
            hours: entry.hours,
            spent_on: entry.spent_on,
            comments: entry.comments,
            activity_id: entry.activity_id,
            customer_name: entry.customer_name,
          },
          { skipFlush: true },
        );
        db.deleteLocalTimeEntry(id);
        results.push({ id, ok: true });
      } catch (error) {
        results.push({ id, ok: false, reason: error.message });
      }
    }
    console.log("push results", results);

    const flushResult = await offlineQueue.flushOfflineQueue(redmineUrl, apiKey);
    console.log("flush result", flushResult);

    const backupsDir = path.join(credsDir, "backups");
    await backupEngine.runBackupSnapshot(db.getDb(), backupsDir);
    backupEngine.pruneOldBackups(backupsDir, 20);

    // Confirm good entries in Redmine
    const remote = await redmine.fetchTimeEntries(redmineUrl, apiKey, { issue_id: ISSUE_ID });
    const matched = (remote || []).filter((e) => String(e.comments || "").includes(marker) && !String(e.comments).includes("bad-activity"));
    console.log("remote matched good entries:", matched.map((e) => ({ id: e.id, hours: e.hours, comments: e.comments })));

    if (matched.length < 2) {
      throw new Error(`Expected >=2 remote entries with marker, got ${matched.length}`);
    }

    const failures = db.getUnreadSyncFailures();
    console.log(
      "sync_failures sample:",
      failures.slice(0, 5).map((f) => ({ entity: f.entity_label, message: String(f.message || "").slice(0, 120) })),
    );

    console.log("PASS tracker push-drafts verification");
  } catch (error) {
    exitCode = 1;
    console.error("FAIL", error);
  } finally {
    try {
      require("../db/database").closeDatabase();
    } catch {
      /* ignore */
    }
    app.exit(exitCode);
  }
});
