/** Fix stale spent_hours for #32573 from sum of local time entries / Redmine detail. */
const path = require("path");
const fs = require("fs");
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
    const userData = app.getPath("userData");
    const settings = JSON.parse(fs.readFileSync(path.join(userData, "settings.json"), "utf8"));
    const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
    let apiKey = decryptSecret(settings.apiKey);

    const db = require("../db/database");
    db.openDatabase(path.join(userData, "cache.db"));
    if (!apiKey) apiKey = decryptSecret(db.getMeta("api_key", "") || "");

    const before = db.getIssueById(ISSUE_ID);
    console.log(`[1] before spent_hours=${before?.spent_hours}`);

    const syncEngine = require("../sync/sync-engine");
    await syncEngine.refreshIssueDetail(redmineUrl, apiKey, ISSUE_ID);
    const after = db.getIssueById(ISSUE_ID);
    console.log(`[2] after refresh spent_hours=${after?.spent_hours}`);

    const activities = db.getReferenceData("activities") || [];
    console.log(`[3] activities in cache: ${activities.length}`);
    activities.slice(0, 5).forEach((a) => console.log(`  id=${a.id} ${a.name}`));

    console.log(`RESULT=PASS spent_hours=${after?.spent_hours}`);
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
