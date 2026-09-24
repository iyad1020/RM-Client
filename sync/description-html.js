/** Helpers for description HTML with inline attachment placeholders. */

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function resolveDescriptionAttachmentUrls(html, attachments) {
  const byFilename = new Map();
  (attachments || []).forEach((att) => {
    if (att?.filename && att?.content_url) byFilename.set(String(att.filename), att.content_url);
  });
  return String(html || "").replace(/<img\b([^>]*)>/gi, (tag, attrs) => {
    const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(attrs);
    const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(attrs);
    const src = srcMatch ? String(srcMatch[2] || "").trim() : "";
    const alt = altMatch ? String(altMatch[2] || "").trim() : "";
    const placeholder = src.match(/\/attachments\/download\/0\/([^"'?\s]+)/i);
    const filename = placeholder ? decodeURIComponent(placeholder[1]) : alt;
    const contentUrl = filename ? byFilename.get(filename) : "";
    if (!contentUrl) return tag;
    let next = tag.replace(/src\s*=\s*(['"]).*?\1/i, `src="${escapeAttr(contentUrl)}"`);
    if (!/alt\s*=/i.test(next) && filename) {
      next = next.replace(/<img\b/i, `<img alt="${escapeAttr(filename)}"`);
    }
    return next;
  });
}

function descriptionHasUploadPlaceholders(html) {
  return /\/attachments\/download\/0\//i.test(String(html || ""));
}

const TEXTILE_IMAGE_RE = /!([^\s!]+\.(?:png|jpe?g|gif|webp|bmp))!/gi;
const MARKDOWN_IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)\)/g;

function notesHaveImageTokens(notes) {
  const s = String(notes || "");
  return /![^\s!]+\.(?:png|jpe?g|gif|webp|bmp)!/i.test(s) || /!\[[^\]]*\]\([^)\s]+\)/.test(s);
}

function attachmentDownloadPath(att) {
  const contentUrl = String(att?.content_url || "").trim();
  if (contentUrl) {
    try {
      const parsed = new URL(contentUrl, "https://redmine.local");
      return `${parsed.pathname}${parsed.search}`;
    } catch {
      return contentUrl;
    }
  }
  const id = Number(att?.id);
  const filename = String(att?.filename || "").trim();
  if (Number.isFinite(id) && id > 0 && filename) {
    return `/attachments/download/${id}/${encodeURIComponent(filename)}`;
  }
  return "";
}

function lookupAttachmentPath(filename, byFilename) {
  const name = String(filename || "").trim();
  if (!name) return "";
  if (byFilename.has(name)) return byFilename.get(name);
  try {
    const decoded = decodeURIComponent(name);
    if (byFilename.has(decoded)) return byFilename.get(decoded);
  } catch {
    /* ignore */
  }
  const base = name.split(/[\\/]/).pop();
  if (base && byFilename.has(base)) return byFilename.get(base);
  const lower = (base || name).toLowerCase();
  for (const [key, path] of byFilename.entries()) {
    if (String(key).toLowerCase() === lower) return path;
  }
  return "";
}

/**
 * Visual editor / CommonMark в Redmine не понимает Textile `!file.png!`.
 * После аплоада подставляем markdown-картинки с /attachments/download/id/file.
 */
function resolveNotesImageMarkup(notes, attachments) {
  const byFilename = new Map();
  (attachments || []).forEach((att) => {
    const filename = String(att?.filename || "").trim();
    const path = attachmentDownloadPath(att);
    if (filename && path) byFilename.set(filename, path);
  });

  let s = String(notes || "");
  s = s.replace(TEXTILE_IMAGE_RE, (match, filename) => {
    const path = lookupAttachmentPath(filename, byFilename) || filename;
    return `\n\n![](${path})\n\n`;
  });
  s = s.replace(MARKDOWN_IMAGE_RE, (match, alt, src) => {
    const source = String(src || "").trim();
    if (/^https?:\/\//i.test(source) || source.startsWith("/attachments/")) return match;
    const path = lookupAttachmentPath(source, byFilename);
    if (!path) return match;
    return `![${alt}](${path})`;
  });
  return s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

module.exports = {
  resolveDescriptionAttachmentUrls,
  descriptionHasUploadPlaceholders,
  notesHaveImageTokens,
  resolveNotesImageMarkup,
};
