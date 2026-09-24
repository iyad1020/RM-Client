/**
 * Manual integration test for issue #32737:
 * - create time entry with customer_name (CF 20)
 * - verify round-trip from Redmine
 * - verify pending local edit is not overwritten by sync
 *
 * Run: npx electron scripts/test-issue-32737.js
 */
const path = require("path");
const fs = require("fs");
const { app, safeStorage } = require("electron");

// Must match installed app before ready — otherwise safeStorage cannot decrypt the API key.
const REAL_USER_DATA = path.join(process.env.APPDATA || "", "rm-client");
if (REAL_USER_DATA && fs.existsSync(REAL_USER_DATA)) {
  app.setPath("userData", REAL_USER_DATA);
}
if (process.platform === "win32") {
  app.setAppUserModelId("ru.grandproject.rmclient");
}

const ISSUE_ID = 32737;
const CUSTOMER_NAME_FIELD_ID = 20;
const TEST_MARKER = `RM-Client-test-${Date.now()}`;

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
  const settingsPath = path.join(userData, "settings.json");
  const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
  const redmineUrl = String(settings.redmineUrl || "").replace(/\/$/, "");
  let apiKey = decryptSecret(settings.apiKey);
  return { redmineUrl, apiKey, settings };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

app.whenReady().then(async () => {
  const results = [];
  const log = (ok, msg) => {
    results.push({ ok, msg });
    console.log(`${ok ? "PASS" : "FAIL"}  ${msg}`);
  };

  let createdEntryId = null;
  try {
    const userData = app.getPath("userData");
    // Prefer the real installed profile if this electron process uses a different userData.
    const realUserData = path.join(app.getPath("appData"), "rm-client");
    const credsDir = fs.existsSync(path.join(realUserData, "settings.json")) ? realUserData : userData;
    const { redmineUrl, apiKey } = loadCredentials(credsDir);
    assert(redmineUrl, "redmineUrl missing in settings");
    assert(apiKey, "apiKey decrypt failed / empty");

    const db = require("../db/database");
    const redmine = require("../sync/redmine-client");
    const syncEngine = require("../sync/sync-engine");
    const offlineQueue = require("../sync/offline-queue");

    const dbPath = path.join(credsDir, "cache.db");
    db.openDatabase(dbPath);

    // --- 0. Issue present locally or fetchable ---
    let issue = db.getIssueById(ISSUE_ID);
    if (!issue) {
      try {
        issue = await syncEngine.getIssueDetail(redmineUrl, apiKey, ISSUE_ID, { forceRefresh: true });
      } catch (e) {
        log(false, `Issue #${ISSUE_ID} not in cache and fetch failed: ${e.message}`);
        throw e;
      }
    }
    log(Boolean(issue), `Issue #${ISSUE_ID} available (${issue?.subject || "no subject"})`);

    // --- 1. Create time entry with customer_name via API path used by client ---
    const activities = db.getReferenceData("activities") || [];
    const activity = activities.find((a) => /разработ/i.test(String(a.name || ""))) || activities[0];
    assert(activity?.id, "No time entry activity in reference data — sync reference first");

    const spentOn = new Date().toISOString().slice(0, 10);
    const entryData = {
      issue_id: ISSUE_ID,
      hours: 0.25,
      spent_on: spentOn,
      comments: TEST_MARKER,
      customer_name: "Тестов Тест Тестович",
      activity_id: Number(activity.id),
      activity_name: activity.name || "",
      project_id: issue.project_id || issue.project?.id || null,
      project_name: issue.project_name || issue.project?.name || "",
    };

    const created = await redmine.createTimeEntry(redmineUrl, apiKey, entryData);
    createdEntryId = created.timeEntry?.id || null;
    log(Boolean(createdEntryId), `Created time entry id=${createdEntryId}`);
    log(
      created.timeEntry?.customer_name === "Тестов Тест Тестович",
      `normalizeTimeEntry returned customer_name="${created.timeEntry?.customer_name || ""}"`,
    );

    // Persist like the client does after create
    if (created.timeEntry) db.upsertTimeEntry(created.timeEntry);

    // --- 2. Fetch back from Redmine (raw + normalized) ---
    const fetched = await redmine.fetchTimeEntries(redmineUrl, apiKey, {
      issue_id: ISSUE_ID,
    });
    const found = (fetched || []).find((e) => Number(e.id) === Number(createdEntryId));
    log(Boolean(found), `Entry #${createdEntryId} found in fetchTimeEntries for issue`);
    log(
      found?.customer_name === "Тестов Тест Тестович",
      `Fetched customer_name="${found?.customer_name || ""}" (expect Тестов Тест Тестович)`,
    );

    // Raw check of custom_fields in case normalize missed
    const raw = await fetch(
      `${redmineUrl}/time_entries/${createdEntryId}.json?key=${encodeURIComponent(apiKey)}`,
      { headers: { Accept: "application/json" } },
    );
    const rawJson = await raw.json();
    const cf = (rawJson?.time_entry?.custom_fields || []).find(
      (f) => Number(f.id) === CUSTOMER_NAME_FIELD_ID,
    );
    log(
      String(cf?.value || "") === "Тестов Тест Тестович",
      `Raw Redmine CF#${CUSTOMER_NAME_FIELD_ID} value="${cf?.value ?? "(missing)"}"`,
    );

    // --- 3. Update customer_name ---
    const updated = await redmine.updateTimeEntry(redmineUrl, apiKey, createdEntryId, {
      hours: 0.25,
      spent_on: spentOn,
      comments: TEST_MARKER,
      customer_name: "Иванов Иван Иванович",
      activity_id: Number(activity.id),
    });
    log(
      updated.timeEntry?.customer_name === "Иванов Иван Иванович",
      `After update normalize customer_name="${updated.timeEntry?.customer_name || ""}"`,
    );
    if (updated.timeEntry) db.upsertTimeEntry(updated.timeEntry);

    // --- 4. Pending protection: local pending must survive sync pull ---
    db.updateLocalTimeEntry(createdEntryId, {
      hours: 9.75,
      comments: `${TEST_MARKER}-PENDING-LOCAL`,
      customer_name: "Локальный Незатертый",
      sync_status: "pending",
      sync_error: null,
    });
    const before = db.getTimeEntryById(createdEntryId);
    await syncEngine.syncTimeEntriesForIssue(redmineUrl, apiKey, ISSUE_ID);
    const after = db.getTimeEntryById(createdEntryId);
    log(
      after?.sync_status === "pending" &&
        Number(after?.hours) === 9.75 &&
        after?.comments === `${TEST_MARKER}-PENDING-LOCAL` &&
        after?.customer_name === "Локальный Незатертый",
      `Pending local preserved after syncTimeEntriesForIssue (hours=${after?.hours}, comments=${after?.comments}, customer=${after?.customer_name}, status=${after?.sync_status})`,
    );
    // restore synced values for cleanup readability
    if (updated.timeEntry) {
      db.upsertTimeEntry({ ...updated.timeEntry }); // would skip because pending — force:
      db.updateLocalTimeEntry(createdEntryId, {
        hours: 0.25,
        comments: TEST_MARKER,
        customer_name: "Иванов Иван Иванович",
        sync_status: "synced",
        sync_error: null,
      });
    }

    // --- 5. Local DB query for issue time entries ---
    const localList = db.queryTimeEntries({ issueId: ISSUE_ID }) || [];
    const localHit = localList.find((e) => Number(e.id) === Number(createdEntryId));
    log(Boolean(localHit), `Local queryTimeEntries contains test entry #${createdEntryId}`);

    void before;
    void offlineQueue;
  } catch (error) {
    log(false, `Unhandled: ${error.stack || error.message}`);
  } finally {
    // Cleanup: delete test time entry from Redmine if created
    try {
      if (createdEntryId) {
        const userData = app.getPath("userData");
        const realUserData = path.join(app.getPath("appData"), "rm-client");
        const credsDir = fs.existsSync(path.join(realUserData, "settings.json")) ? realUserData : userData;
        const { redmineUrl, apiKey } = loadCredentials(credsDir);
        const redmine = require("../sync/redmine-client");
        const db = require("../db/database");
        await redmine.deleteTimeEntry(redmineUrl, apiKey, createdEntryId);
        try {
          db.deleteLocalTimeEntry(createdEntryId);
        } catch {
          /* ignore */
        }
        console.log(`CLEANUP  deleted time entry #${createdEntryId}`);
      }
    } catch (e) {
      console.log(`CLEANUP  failed: ${e.message}`);
    }

    const failed = results.filter((r) => !r.ok).length;
    console.log("\n---");
    console.log(`Result: ${results.length - failed}/${results.length} passed`);
    try {
      require("../db/database").closeDatabase?.();
    } catch {
      /* ignore */
    }
    app.exit(failed ? 1 : 0);
  }
});
