const path = require("path");
const { app } = require("electron");
app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));
app.whenReady().then(() => {
  const db = require("../db/database");
  db.openDatabase(path.join(app.getPath("userData"), "cache.db"));
  const i = db.getIssueById(32573);
  console.log("spent_hours", i?.spent_hours);
  console.log("queue", db.getOfflineQueue().length);
  db.closeDatabase();
  app.quit();
});
