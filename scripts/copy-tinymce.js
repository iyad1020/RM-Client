/**
 * Copies self-hosted TinyMCE runtime into renderer/vendor for Electron (offline).
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "tinymce");
const dest = path.join(__dirname, "..", "renderer", "vendor", "tinymce");

function copyRecursive(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(fromPath, toPath);
    } else if (/\.(js|css|woff2?|svg|gif|png|ttf|eot)$/i.test(entry.name) || /\.md$/i.test(entry.name)) {
      fs.copyFileSync(fromPath, toPath);
    }
  }
}

if (!fs.existsSync(src)) {
  console.error("tinymce not found in node_modules. Run: npm install");
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

for (const name of ["tinymce.min.js", "tinymce.js", "license.md", "notices.txt"]) {
  const fromPath = path.join(src, name);
  if (fs.existsSync(fromPath)) fs.copyFileSync(fromPath, path.join(dest, name));
}
for (const dir of ["icons", "models", "plugins", "skins", "themes"]) {
  copyRecursive(path.join(src, dir), path.join(dest, dir));
}

console.log("TinyMCE copied to renderer/vendor/tinymce");
