/** Discard stuck empty-comment time entry for #32573. */
const path = require("path");
const { app } = require("electron");

app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));

app.whenReady().then(() => {
  try {
    const db = require("../db/database");
    db.openDatabase(path.join(app.getPath("userData"), "cache.db"));

    const queue = db.getOfflineQueue();
    let removedQueue = 0;
    for (const item of queue) {
      if (item.type !== "create_time_entry") continue;
      let payload = {};
      try {
        payload = JSON.parse(item.payload_json);
      } catch {
        payload = {};
      }
      const comments = String(payload?.entryData?.comments || "").trim();
      const hours = Number(payload?.entryData?.hours);
      if (!comments || !hours) {
        if (payload.localId != null) {
          const local = db.queryTimeEntries({}).find((e) => Number(e.id) === Number(payload.localId));
          if (local?.issue_id && local.hours) {
            db.addIssueSpentHours(local.issue_id, -Number(local.hours));
          }
          db.deleteLocalTimeEntry(payload.localId);
        }
        db.removeOfflineItem(item.id);
        removedQueue += 1;
        console.log(`removed queue id=${item.id} localId=${payload.localId}`);
      }
    }

    // Also sweep orphan local error rows with empty comments
    const bad = db
      .queryTimeEntries({})
      .filter((e) => (e.sync_status === "error" || e.sync_status === "pending" || Number(e.id) < 0) && !String(e.comments || "").trim());
    for (const entry of bad) {
      if (entry.issue_id && entry.hours) db.addIssueSpentHours(entry.issue_id, -Number(entry.hours));
      db.deleteLocalTimeEntry(entry.id);
      console.log(`removed orphan local te id=${entry.id}`);
    }

    console.log(`RESULT=PASS removedQueue=${removedQueue} remainingQueue=${db.getOfflineQueue().length}`);
    db.closeDatabase();
  } catch (error) {
    console.error("RESULT=FAIL", error.message);
  }
  app.quit();
});
