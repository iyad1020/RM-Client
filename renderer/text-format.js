(function (exports) {
  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function decodeHtmlEntities(text) {
    return String(text || "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&");
  }

  /** Redmine HTML/textile notes → plain textile-ish text before formatting. */
  function normalizeRedmineText(text) {
    let s = String(text || "");
    const looksHtml = /<[a-z/!][\s\S]*>/i.test(s);
    const looksEntities = /&(?:nbsp|quot|amp|lt|gt|#\d+|#x[\da-f]+);/i.test(s);
    if (looksHtml) {
      s = s
        .replace(/\r\n/g, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
        .replace(/<\/?(?:p|div|h[1-6]|li|tr)[^>]*>/gi, "\n")
        .replace(/<\/?(?:ul|ol|table|thead|tbody|span|strong|b|em|i|u|a|pre|code)[^>]*>/gi, "")
        .replace(/<[^>]+>/g, "");
    }
    if (looksHtml || looksEntities) {
      s = decodeHtmlEntities(s);
    }
    return s.replace(/\n{3,}/g, "\n\n").trim();
  }

  function sanitizeRedmineHtml(html) {
    let s = String(html || "");
    s = s.replace(/<\/(?:script|style)[^>]*>/gi, "");
    s = s.replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi, "");
    s = s.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
    s = s.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
    s = s.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag, attrs) => {
      const name = String(tag).toLowerCase();
      const allowed = new Set([
        "strong", "b", "em", "i", "u", "s", "del", "p", "br", "ul", "ol", "li",
        "h1", "h2", "h3", "h4", "h5", "h6", "a", "code", "pre", "span", "div", "img",
        "table", "thead", "tbody", "tr", "th", "td",
      ]);
      if (!allowed.has(name)) return "";
      if (name === "br") return "<br>";
      if (name === "img") {
        if (full.startsWith("</")) return "";
        const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(attrs);
        const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(attrs);
        let src = srcMatch ? String(srcMatch[2] || "").trim() : "";
        const alt = altMatch ? String(altMatch[2] || "").trim() : "";
        // Strip cache-buster query TinyMCE may append to data URLs.
        if (/^data:image\//i.test(src) && src.includes("?")) {
          src = src.slice(0, src.indexOf("?"));
        }
        const safe = /^(https?:|\/|data:image\/)/i.test(src) ? src : "";
        if (!safe) return "";
        return `<img src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}">`;
      }
      if (name === "a") {
        const href = /href\s*=\s*(['"])(.*?)\1/i.exec(attrs);
        const safe = href && /^(https?:|\/|#|mailto:)/i.test(href[2] || "") ? href[2] : "#";
        return full.startsWith("</") ? "</a>" : `<a href="${escapeHtml(safe)}">`;
      }
      if (name === "table") {
        return full.startsWith("</") ? "</table>" : '<table class="textile-table">';
      }
      return full.startsWith("</") ? `</${name}>` : `<${name}>`;
    });
    return s;
  }

  function isGfmTableSeparator(line) {
    const trimmed = String(line || "").trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false;
    return trimmed
      .slice(1, -1)
      .split("|")
      .every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell));
  }

  function parseTextileTableRow(line) {
    const trimmed = String(line || "").trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null;
    if (isGfmTableSeparator(trimmed)) return { separator: true, cells: [] };
    return trimmed
      .slice(1, -1)
      .split("|")
      .map((cell) => {
        let content = String(cell || "").trim();
        let isHeader = false;
        if (/^[._=^\-+~\\]/.test(content) && !/^[-:]+$/.test(content)) {
          isHeader = /^[._=]/.test(content);
          content = content.replace(/^[._=^\-+~\\]+/, "");
        }
        return { content, isHeader };
      });
  }

  function renderTextileTable(lines) {
    const parsed = lines.map(parseTextileTableRow).filter(Boolean);
    const hasSeparator = parsed.some((row) => row.separator);
    let html = '<table class="textile-table"><tbody>';
    let dataIndex = 0;
    for (const row of parsed) {
      if (row.separator) continue;
      const cells = row.cells || row;
      if (!cells.length) continue;
      const rowIsHeader = cells.some((cell) => cell.isHeader) || (hasSeparator && dataIndex === 0);
      html += "<tr>";
      for (const cell of cells) {
        const tag = rowIsHeader || cell.isHeader ? "th" : "td";
        html += `<${tag}>${applyInlineTextileFormatting(escapeHtml(cell.content))}</${tag}>`;
      }
      html += "</tr>";
      dataIndex += 1;
    }
    html += "</tbody></table>";
    return html;
  }

  function splitTextileChunks(text) {
    const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
    const chunks = [];
    let textBuffer = [];
    let tableBuffer = [];

    function flushText() {
      if (!textBuffer.length) return;
      chunks.push({ type: "text", text: textBuffer.join("\n") });
      textBuffer = [];
    }

    function flushTable() {
      if (!tableBuffer.length) return;
      chunks.push({ type: "table", lines: tableBuffer.slice() });
      tableBuffer = [];
    }

    for (const line of lines) {
      if (parseTextileTableRow(line) || isGfmTableSeparator(line)) {
        flushText();
        tableBuffer.push(line);
      } else {
        flushTable();
        textBuffer.push(line);
      }
    }
    flushTable();
    flushText();
    return chunks;
  }

  function applyInlineTextileFormatting(html) {
    return String(html || "")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/\+(.+?)\+/g, "<u>$1</u>");
  }

  function renderTextileTextBlock(text) {
    let block = String(text || "");
    if (!block.trim()) return "";

    block = block.replace(/^######\s+(.+)$/gim, (_, t) => `<h6>${applyInlineTextileFormatting(escapeHtml(t))}</h6>`);
    block = block.replace(/^#####\s+(.+)$/gim, (_, t) => `<h5>${applyInlineTextileFormatting(escapeHtml(t))}</h5>`);
    block = block.replace(/^####\s+(.+)$/gim, (_, t) => `<h5>${applyInlineTextileFormatting(escapeHtml(t))}</h5>`);
    block = block.replace(/^###\s+(.+)$/gim, (_, t) => `<h4>${applyInlineTextileFormatting(escapeHtml(t))}</h4>`);
    block = block.replace(/^##\s+(.+)$/gim, (_, t) => `<h3>${applyInlineTextileFormatting(escapeHtml(t))}</h3>`);
    block = block.replace(/^h1\.\s*(.+)$/gim, (_, t) => `<h3>${applyInlineTextileFormatting(escapeHtml(t))}</h3>`);
    block = block.replace(/^h2\.\s*(.+)$/gim, (_, t) => `<h4>${applyInlineTextileFormatting(escapeHtml(t))}</h4>`);
    block = block.replace(/^h3\.\s*(.+)$/gim, (_, t) => `<h5>${applyInlineTextileFormatting(escapeHtml(t))}</h5>`);

    const lines = block.split("\n");
    const parts = [];
    let listType = null;
    let listItems = [];

    function flushList() {
      if (!listItems.length) return;
      parts.push(`<${listType}>${listItems.map((item) => `<li>${item}</li>`).join("")}</${listType}>`);
      listItems = [];
      listType = null;
    }

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        flushList();
        parts.push("<hr>");
        continue;
      }
      const bullet = line.match(/^[-*+]\s+(.+)$/);
      const numbered = line.match(/^(?:#|\d+\.)\s+(.+)$/);
      if (bullet) {
        if (listType && listType !== "ul") flushList();
        listType = "ul";
        listItems.push(applyInlineTextileFormatting(escapeHtml(bullet[1])));
        continue;
      }
      if (numbered) {
        if (listType && listType !== "ol") flushList();
        listType = "ol";
        listItems.push(applyInlineTextileFormatting(escapeHtml(numbered[1])));
        continue;
      }
      flushList();
      if (!line.trim()) {
        parts.push("");
        continue;
      }
      if (/^<(h[1-6]|hr)\b/.test(line.trim())) {
        parts.push(line.trim());
      } else {
        parts.push(applyInlineTextileFormatting(escapeHtml(line)));
      }
    }
    flushList();

    const paragraphs = [];
    let current = [];
    for (const part of parts) {
      if (!part) {
        if (current.length) {
          paragraphs.push(current.join("<br>"));
          current = [];
        }
        continue;
      }
      if (/^<(h[1-6]|ul|ol|hr)\b/.test(part)) {
        if (current.length) {
          paragraphs.push(current.join("<br>"));
          current = [];
        }
        paragraphs.push(part);
        continue;
      }
      current.push(part);
    }
    if (current.length) paragraphs.push(current.join("<br>"));

    return paragraphs
      .map((chunk) => {
        if (/^<(h[1-6]|ul|ol|table|hr)\b/.test(chunk)) return chunk;
        return chunk ? `<p>${chunk}</p>` : "";
      })
      .join("");
  }

  function convertTextileDocument(text) {
    return splitTextileChunks(text)
      .map((chunk) => (chunk.type === "table" ? renderTextileTable(chunk.lines) : renderTextileTextBlock(chunk.text)))
      .join("");
  }

  function looksLikeHtml(text) {
    return /<(?:strong|b|em|i|u|s|del|p|br|ul|ol|li|h[1-6]|a|code|pre|img|table)\b/i.test(String(text || ""));
  }

  function looksLikeMarkdown(text) {
    const s = String(text || "");
    if (looksLikeHtml(s)) return false;
    return /(?:^|\n)#{1,6}\s+|(?:^|\n)[-*]{3,}\s*(?:\n|$)|(?:^|\n)\d+\.\s+|(?:^|\n)\[[^\]]+\]\(https?:\/\/|(?:^|\n)\|[^|\n]+\|/.test(s);
  }

  function textileToHtml(text) {
    const raw = String(text || "");
    if (looksLikeHtml(raw)) {
      return sanitizeRedmineHtml(raw);
    }
    return convertTextileDocument(normalizeRedmineText(raw));
  }

  /** Convert composer markup to HTML. For CKEditor/HTML fields only — not journal notes. */
  function markupToRedmineHtml(text) {
    const raw = String(text || "");
    if (!raw.trim()) return "";
    if (looksLikeHtml(raw)) {
      return raw;
    }
    if (!/[\n]|^h[123]\.|^\*\s+|^#\s+|^\|/m.test(raw)) {
      return applyInlineTextileFormatting(escapeHtml(raw));
    }
    return convertTextileDocument(normalizeRedmineText(raw));
  }

  exports.escapeHtml = escapeHtml;
  exports.decodeHtmlEntities = decodeHtmlEntities;
  exports.normalizeRedmineText = normalizeRedmineText;
  exports.sanitizeRedmineHtml = sanitizeRedmineHtml;
  exports.textileToHtml = textileToHtml;
  exports.markupToRedmineHtml = markupToRedmineHtml;
  exports.looksLikeHtml = looksLikeHtml;
  exports.looksLikeMarkdown = looksLikeMarkdown;
})(typeof module !== "undefined" && module.exports ? module.exports : (window.TextFormat = {}));
