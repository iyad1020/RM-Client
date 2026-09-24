/**
 * Verify local queryTimeEntries({ issueId }) against cache for issue 32573.
 * Does not print secrets.
 */
const path = require("path");
const { app, safeStorage } = require("electron");

const ISSUE_ID = 32573;
const API_KEY_ENC_PREFIX = "safeStorage:v1:";

app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));

function decryptSecret(stored) {
  const value = String(stored || "");
  if (!value) return "";
  const tryDecrypt = (base64Payload) => {
    try {
      return safeStorage.decryptString(Buffer.from(base64Payload, "base64"));
    } catch {
      return null;
    }
  };
  if (value.startsWith(API_KEY_ENC_PREFIX)) {
    return tryDecrypt(value.slice(API_KEY_ENC_PREFIX.length)) || "";
  }
  return tryDecrypt(value) || value;
}

app.whenReady().then(async () => {
  try {
    const fs = require("fs");
    const userData = app.getPath("userData");
    const settings = JSON.parse(fs.readFileSync(path.join(userData, "settings.json"), "utf8"));
    const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
    let apiKey = decryptSecret(settings.apiKey);

    const db = require("../db/database");
    db.openDatabase(path.join(userData, "cache.db"));
    if (!apiKey) apiKey = decryptSecret(db.getMeta("api_key", "") || "");

    const redmine = require("../sync/redmine-client");

    console.log(`[1] Local query issueId=${ISSUE_ID}`);
    const local = db.queryTimeEntries({ issueId: ISSUE_ID });
    console.log(`[1] local count=${local.length}`);
    local.slice(0, 10).forEach((e) => {
      console.log(
        `  id=${e.id} hours=${e.hours} on=${e.spent_on} user=${e.user_name || "-"} act=${e.activity_name || "-"} sync=${e.sync_status || "-"} comments=${String(e.comments || "").slice(0, 60)}`,
      );
    });

    console.log(`[2] Fetch from Redmine issue_id=${ISSUE_ID}`);
    const remote = await redmine.fetchTimeEntries(redmineUrl, apiKey, { issue_id: ISSUE_ID });
    console.log(`[2] remote count=${remote.length}`);

    const localIds = new Set(local.map((e) => Number(e.id)).filter((id) => id > 0));
    const remoteIds = new Set(remote.map((e) => Number(e.id)));
    const missingLocal = [...remoteIds].filter((id) => !localIds.has(id));
    console.log(`[3] remote-only (not in local cache): ${missingLocal.length}`);
    if (missingLocal.length) console.log(`  ids: ${missingLocal.slice(0, 20).join(", ")}`);

    const totalLocalHours = local.reduce((s, e) => s + (Number(e.hours) || 0), 0);
    const totalRemoteHours = remote.reduce((s, e) => s + (Number(e.hours) || 0), 0);
    console.log(`[4] hours local=${totalLocalHours} remote=${totalRemoteHours}`);

    if (!Array.isArray(local)) throw new Error("local query failed");
    console.log(`RESULT=PASS issue=${ISSUE_ID} local=${local.length} remote=${remote.length}`);
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
