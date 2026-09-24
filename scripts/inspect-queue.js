const path = require("path");
const { app, safeStorage } = require("electron");

app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));

app.whenReady().then(() => {
  try {
    const db = require("../db/database");
    db.openDatabase(path.join(app.getPath("userData"), "cache.db"));
    const q = db.getOfflineQueue();
    console.log("QUEUE_COUNT", q.length);
    q.forEach((item) => {
      console.log("---");
      console.log("id=", item.id, "type=", item.type, "attempts=", item.attempts);
      console.log("error=", item.last_error);
      console.log("payload=", item.payload_json);
    });
    const entries = db.queryTimeEntries({});
    const bad = entries.filter((e) => e.sync_status === "error" || e.sync_status === "pending" || Number(e.id) < 0);
    console.log("BAD_TE_COUNT", bad.length);
    bad.forEach((e) => console.log(JSON.stringify(e)));
    db.closeDatabase();
  } catch (error) {
    console.error("FAIL", error.message);
  }
  app.quit();
});
