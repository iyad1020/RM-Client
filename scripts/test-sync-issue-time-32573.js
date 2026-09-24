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
  const tryDecrypt = (b) => {
    try {
      return safeStorage.decryptString(Buffer.from(b, "base64"));
    } catch {
      return null;
    }
  };
  if (value.startsWith(API_KEY_ENC_PREFIX)) return tryDecrypt(value.slice(API_KEY_ENC_PREFIX.length)) || "";
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

    const before = db.queryTimeEntries({ issueId: ISSUE_ID }).length;
    const syncEngine = require("../sync/sync-engine");
    const count = await syncEngine.syncTimeEntriesForIssue(redmineUrl, apiKey, ISSUE_ID);
    const after = db.queryTimeEntries({ issueId: ISSUE_ID });
    console.log(`before=${before} synced=${count} after=${after.length}`);
    after.forEach((e) =>
      console.log(`  id=${e.id} h=${e.hours} user=${e.user_name} act=${e.activity_name} c=${String(e.comments || "").slice(0, 40)}`),
    );
    console.log("RESULT=PASS");
  } catch (e) {
    console.error("RESULT=FAIL", e.message);
  } finally {
    try {
      require("../db/database").closeDatabase();
    } catch {}
    app.quit();
  }
});
