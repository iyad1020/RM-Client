const path = require("path");
const { app } = require("electron");
app.setName("rm-client");
app.setPath("userData", path.join(process.env.APPDATA || "", "rm-client"));
app.whenReady().then(() => {
  const db = require("../db/database");
  db.openDatabase(path.join(app.getPath("userData"), "cache.db"));
  const priorities = db.getReferenceData("priorities") || [];
  console.log(JSON.stringify(priorities, null, 2));
  db.closeDatabase();
  app.quit();
});
