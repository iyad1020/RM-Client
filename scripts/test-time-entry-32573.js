/**
 * One-off integration test: create time entry on issue 32573 via the same
 * offline-queue path as the UI, then verify it appears in Redmine.
 * Does not print secrets.
 */
const path = require("path");
const fs = require("fs");
const { app, safeStorage } = require("electron");

const ISSUE_ID = 32573;
const API_KEY_ENC_PREFIX = "safeStorage:v1:";

// Match RM Client encryption / userData context before app ready.
app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));

function decryptSecret(stored) {
  const value = String(stored || "");
  if (!value) return "";
  const tryDecrypt = (base64Payload) => {
    try {
      if (typeof safeStorage?.decryptString !== "function") return null;
      if (typeof safeStorage?.isEncryptionAvailable === "function" && !safeStorage.isEncryptionAvailable()) {
        return null;
      }
      return safeStorage.decryptString(Buffer.from(base64Payload, "base64"));
    } catch (error) {
      console.error(`[decrypt] failed: ${error.message}`);
      return null;
    }
  };
  if (value.startsWith(API_KEY_ENC_PREFIX)) {
    const decrypted = tryDecrypt(value.slice(API_KEY_ENC_PREFIX.length));
    return decrypted !== null ? decrypted : "";
  }
  const decrypted = tryDecrypt(value);
  return decrypted !== null ? decrypted : value;
}

app.whenReady().then(async () => {
  const log = (msg) => console.log(msg);
  try {
    log(`[0] userData=${app.getPath("userData")} encryption=${safeStorage.isEncryptionAvailable()}`);
    const userData = app.getPath("userData");
    const settingsPath = path.join(userData, "settings.json");
    const dbPath = path.join(userData, "cache.db");

    if (!fs.existsSync(settingsPath)) throw new Error(`settings not found: ${settingsPath}`);
    if (!fs.existsSync(dbPath)) throw new Error(`cache.db not found: ${dbPath}`);

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
    let apiKey = decryptSecret(settings.apiKey);

    const db = require("../db/database");
    db.openDatabase(dbPath);
    if (!apiKey) {
      apiKey = decryptSecret(db.getMeta("api_key", "") || "");
      log(`[0] fallback meta api_key present=${Boolean(apiKey)}`);
    }
    if (!redmineUrl || !apiKey) {
      throw new Error(
        `redmineUrl/apiKey missing after decrypt (url=${Boolean(redmineUrl)} key=${Boolean(apiKey)} prefix=${String(settings.apiKey || "").slice(0, 14)})`,
      );
    }

    const redmine = require("../sync/redmine-client");
    const offlineQueue = require("../sync/offline-queue");

    log(`[1] Loading activities from Redmine…`);
    const reference = await redmine.loadReferenceData(redmineUrl, apiKey);
    db.saveReferenceData("activities", reference.activities || []);
    const activities = reference.activities || [];
    log(`[1] activities: ${activities.length}`);
    if (!activities.length) throw new Error("No time_entry_activities from Redmine");

    const byName = activities.find((a) => /разработ/i.test(String(a.name || "")));
    const activity = byName || activities[0];
    log(`[1] using activity id=${activity.id} name=${activity.name}`);

    log(`[2] Checking issue #${ISSUE_ID}…`);
    const issue = await redmine.fetchIssueDetail(redmineUrl, apiKey, ISSUE_ID);
    if (!issue?.id) throw new Error(`Issue #${ISSUE_ID} not found`);
    log(`[2] ok: #${issue.id} «${issue.subject}» project=${issue.project?.name || issue.project?.id}`);

    const marker = `RM Client inline-time test ${new Date().toISOString()}`;
    const entryData = {
      issue_id: ISSUE_ID,
      hours: 0.25,
      spent_on: new Date().toISOString().slice(0, 10),
      comments: marker,
      activity_id: Number(activity.id),
      activity_name: activity.name || "",
    };

    log(`[3] createTimeEntryWithOffline (local + background flush)…`);
    const localResult = await offlineQueue.createTimeEntryWithOffline(redmineUrl, apiKey, entryData);
    log(
      `[3] local: ok=${localResult.ok} offline=${localResult.offline} localId=${localResult.timeEntry?.id} sync=${localResult.timeEntry?.sync_status}`,
    );

    log(`[4] Waiting for flush…`);
    await new Promise((r) => setTimeout(r, 2000));
    const flush = await offlineQueue.flushOfflineQueue(redmineUrl, apiKey);
    log(`[4] flush: processed=${flush.processed} failed=${flush.failed}`);

    log(`[5] Verifying in Redmine time_entries…`);
    const entries = await redmine.fetchTimeEntries(redmineUrl, apiKey, {
      issue_id: ISSUE_ID,
      spent_on: entryData.spent_on,
    });
    const found = (entries || []).find((e) => String(e.comments || "") === marker);
    if (!found) {
      const local = db.queryTimeEntries({ from: entryData.spent_on, to: entryData.spent_on });
      log(`[5] FAIL: marker not found in Redmine. local rows today: ${local.length}`);
      local
        .filter((row) => String(row.comments || "").includes("RM Client inline-time test"))
        .forEach((row) => {
          log(
            `  local id=${row.id} sync=${row.sync_status} hours=${row.hours} err=${row.sync_error || ""} comments=${row.comments}`,
          );
        });
      throw new Error("Created time entry not found in Redmine");
    }

    log(
      `[5] OK: Redmine time_entry id=${found.id} hours=${found.hours} activity=${found.activity?.name || found.activity?.id} comments=${found.comments}`,
    );
    log(`RESULT=PASS issue=${ISSUE_ID} time_entry_id=${found.id}`);
    process.exitCode = 0;
  } catch (error) {
    console.error(`RESULT=FAIL ${error.message}`);
    process.exitCode = 1;
  } finally {
    try {
      require("../db/database").closeDatabase();
    } catch {
      /* ignore */
    }
    app.quit();
  }
});
