/**
 * Windows + `npm start` shows the icon of electron.exe in the taskbar.
 * BrowserWindow({ icon }) alone is not enough in that mode.
 * This patches node_modules/electron/dist/electron.exe with build/icon.ico.
 */
const path = require("path");
const fs = require("fs");

async function main() {
  if (process.platform !== "win32") {
    console.log("set-dev-icon: skip (not Windows)");
    return;
  }

  const root = path.join(__dirname, "..");
  const exePath = path.join(root, "node_modules", "electron", "dist", "electron.exe");
  const icoPath = path.join(root, "build", "icon.ico");

  if (!fs.existsSync(exePath)) {
    console.warn("set-dev-icon: electron.exe not found, skip");
    return;
  }
  if (!fs.existsSync(icoPath)) {
    console.warn("set-dev-icon: build/icon.ico not found, skip");
    return;
  }

  const rcedit = require("rcedit");
  await rcedit(exePath, { icon: icoPath });
  console.log("set-dev-icon: applied build/icon.ico to electron.exe");
}

main().catch((error) => {
  console.warn("set-dev-icon failed:", error.message);
  process.exitCode = 0;
});
