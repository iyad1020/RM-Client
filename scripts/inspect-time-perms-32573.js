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
    const redmine = require("../sync/redmine-client");
    db.openDatabase(path.join(userData, "cache.db"));
    if (!apiKey) apiKey = decryptSecret(db.getMeta("api_key", "") || "");

    let currentUser = db.getReferenceData("current_user");
    let roles = db.getReferenceData("roles") || [];
    console.log("cached current_user id=", currentUser?.id, "admin=", currentUser?.admin);
    console.log("cached memberships=", (currentUser?.memberships || []).length);
    console.log("cached roles=", roles.length);
    if (roles[0]) {
      console.log("role sample", roles[0].id, roles[0].name, "perms=", (roles[0].permissions || []).slice(0, 8));
    }

    // Refresh reference for accurate check
    const ref = await redmine.loadReferenceData(redmineUrl, apiKey);
    currentUser = ref.currentUser;
    roles = ref.roles || [];
    console.log("fresh memberships=", (currentUser?.memberships || []).length);
    (currentUser?.memberships || []).slice(0, 5).forEach((m) => {
      console.log(
        "  project",
        m.project?.id,
        m.project?.name,
        "roles=",
        (m.roles || []).map((r) => `${r.id}:${r.name}`).join(","),
      );
    });
    console.log("fresh roles=", roles.length);
    const manager = roles.find((r) => /менедж|manager/i.test(r.name || ""));
    const withEdit = roles.filter(
      (r) =>
        (r.permissions || []).includes("edit_time_entries") ||
        (r.permissions || []).includes("edit_own_time_entries"),
    );
    console.log(
      "roles with edit time:",
      withEdit.map((r) => `${r.id}:${r.name}[${(r.permissions || []).filter((p) => p.includes("time")).join(",")}]`),
    );

    const entries = db.queryTimeEntries({ issueId: ISSUE_ID });
    entries.forEach((e) => {
      const ok = redmine.canEditTimeEntry(e, currentUser, roles);
      console.log(
        `entry id=${e.id} project_id=${e.project_id} user_id=${e.user_id} sync=${e.sync_status} canEdit=${ok}`,
      );
    });
  } catch (e) {
    console.error("FAIL", e.message, e.stack);
  } finally {
    try {
      require("../db/database").closeDatabase();
    } catch {}
    app.quit();
  }
});
