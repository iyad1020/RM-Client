/**
 * Read-only: issue custom fields for project 243 / sample issues.
 * Run: npx electron scripts/inspect-create-cf-fio.js
 */
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const { app, safeStorage } = require("electron");

const REAL_USER_DATA = path.join(process.env.APPDATA || "", "rm-client");
if (REAL_USER_DATA && fs.existsSync(REAL_USER_DATA)) {
  app.setPath("userData", REAL_USER_DATA);
}
if (process.platform === "win32") {
  app.setAppUserModelId("ru.grandproject.rmclient");
}

function decryptSecret(stored) {
  const value = String(stored || "");
  const prefix = "safeStorage:v1:";
  const tryDecrypt = (base64Payload) => {
    try {
      if (!safeStorage?.isEncryptionAvailable?.()) return null;
      return safeStorage.decryptString(Buffer.from(base64Payload, "base64"));
    } catch {
      return null;
    }
  };
  if (value.startsWith(prefix)) return tryDecrypt(value.slice(prefix.length)) || "";
  return tryDecrypt(value) || value;
}

app.whenReady().then(async () => {
  try {
    const dir = path.join(app.getPath("appData"), "rm-client");
    const settings = JSON.parse(fs.readFileSync(path.join(dir, "settings.json"), "utf8"));
    const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
    const apiKey = decryptSecret(settings.apiKey);
    const redmine = require("../sync/redmine-client");

    console.log("=== Create-form CF probe (read-only) ===");
    console.log("Project: #243 Филипп Плейн, tracker #3 Задача");

    for (const [name, fn] of [
      [
        "/custom_fields.json",
        () => redmine.redmineRequest(redmineUrl, apiKey, "/custom_fields.json"),
      ],
      [
        "/issues/new.json",
        () =>
          redmine.redmineRequest(redmineUrl, apiKey, "/issues/new.json", {
            project_id: 243,
            tracker_id: 3,
          }),
      ],
    ]) {
      try {
        const data = await fn();
        if (data.custom_fields) {
          console.log(`${name}: ${data.custom_fields.length} fields`);
          data.custom_fields.forEach((cf) =>
            console.log(`  #${cf.id} ${cf.name} type=${cf.customized_type || cf.type} req=${cf.is_required}`),
          );
        } else {
          console.log(`${name}: ok, issue CFs=`, data.issue?.custom_fields || []);
        }
      } catch (error) {
        console.log(`${name}: ${error.message}`);
      }
    }

    const fields = await redmine.fetchIssueFormFields(redmineUrl, apiKey, 243, 3);
    console.log(`fetchIssueFormFields: ${fields.length} →`, fields.map((f) => `#${f.id} ${f.name} req=${f.is_required}`));

    const te = await redmine.redmineRequest(redmineUrl, apiKey, "/time_entries.json", {
      project_id: 243,
      limit: 1,
    });
    const entry = (te.time_entries || [])[0];
    console.log(
      "Time-entry CFs sample:",
      (entry?.custom_fields || []).map((c) => `#${c.id} ${c.name}`).join("; ") || "(none)",
    );

    const sqlite = new Database(path.join(dir, "cache.db"), { readonly: true });
    const rows = sqlite
      .prepare("SELECT id, subject FROM issues WHERE project_id = 243 ORDER BY updated_on DESC LIMIT 3")
      .all();
    sqlite.close();
    console.log("Cached issues in #243:", rows.length);
    for (const row of rows) {
      try {
        const issue = await redmine.fetchIssueDetail(redmineUrl, apiKey, row.id);
        console.log(
          `Issue #${row.id} CFs:`,
          (issue.custom_fields || []).map((c) => `#${c.id} ${c.name}`).join("; ") || "(none)",
        );
      } catch (error) {
        console.log(`Issue #${row.id}: ${error.message}`);
      }
    }

    app.exit(0);
  } catch (error) {
    console.error(error);
    app.exit(1);
  }
});
