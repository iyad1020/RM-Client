// Purely presentational helper — turns Redmine's inline "!filename.png!"
// textile image tokens into real <img> thumbnails, plus a tiny click-to-zoom
// lightbox. No network calls and no attachment fetching here: renderer.js
// already resolves each attachment to a downloadable URL for the
// "Вложения" list — pass that same filename->url map in so tokens can be
// swapped for real <img> tags.
//
// Usage from renderer.js, when building the HTML for a description or a
// journal/comment body:
//
//   const html = window.renderTextileImages(rawHtmlOrText, {
//     'clipboard-202607081455-y10wl.png': 'https://example.redmine.com/attachments/download/123/clipboard-202607081455-y10wl.png'
//   });
//   container.innerHTML = html;
//
// Tokens for filenames not present in the map are left as plain text (with
// the surrounding "!...!" stripped) so nothing ever renders as a broken tag.
(function () {
  var TOKEN_RE = /!([^\s!]+\.(?:png|jpe?g|gif|webp|bmp))!/gi;
  var MARKDOWN_IMAGE_RE = /!\[([^\]]*)\]\(([^)\s]+)\)/gi;
  var IMG_TAG_RE = /<img\b[^>]*>/gi;

  function escapeAttr(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function basename(path) {
    var source = String(path || "").split(/[?#]/)[0];
    var parts = source.split(/[\\/]/);
    return parts[parts.length - 1] || "";
  }

  function resolveAttachmentUrl(nameOrPath, attachmentsByFilename) {
    var source = String(nameOrPath || "").trim();
    if (!source) return "";

    if (attachmentsByFilename[source]) return attachmentsByFilename[source];

    var decoded = source;
    try {
      decoded = decodeURIComponent(source);
    } catch {}
    if (attachmentsByFilename[decoded]) return attachmentsByFilename[decoded];

    var file = basename(decoded);
    if (!file) return "";
    if (attachmentsByFilename[file]) return attachmentsByFilename[file];

    var fileLower = file.toLowerCase();
    for (var key in attachmentsByFilename) {
      if (Object.prototype.hasOwnProperty.call(attachmentsByFilename, key) && String(key).toLowerCase() === fileLower) {
        return attachmentsByFilename[key];
      }
    }
    return "";
  }

  function toInlineShot(src, alt) {
    return (
      '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(alt) + '" class="inline-shot" data-lightbox="1" />'
    );
  }

  function renderTextileImages(html, attachmentsByFilename) {
    attachmentsByFilename = attachmentsByFilename || {};
    var rendered = String(html)
      .replace(TOKEN_RE, function (match, filename) {
        var url = resolveAttachmentUrl(filename, attachmentsByFilename);
        if (!url) return filename;
        return toInlineShot(url, filename);
      })
      .replace(MARKDOWN_IMAGE_RE, function (match, alt, src) {
        var url = resolveAttachmentUrl(src, attachmentsByFilename) || String(src || "").trim();
        if (!url) return "";
        return toInlineShot(url, alt || basename(url));
      })
      .replace(IMG_TAG_RE, function (imgTag) {
        var srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(imgTag);
        if (!srcMatch) return imgTag;
        var altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(imgTag);
        var rawSrc = String(srcMatch[2] || "").trim();
        var alt = altMatch ? altMatch[2] : basename(rawSrc);
        // Upload placeholders until Redmine assigns a real attachment id — avoid broken <img>.
        if (/\/attachments\/download\/0\//i.test(rawSrc)) {
          var mapped = resolveAttachmentUrl(rawSrc, attachmentsByFilename) || resolveAttachmentUrl(alt, attachmentsByFilename);
          if (!mapped) return alt || "";
          return toInlineShot(mapped, alt || basename(mapped));
        }
        var src = resolveAttachmentUrl(rawSrc, attachmentsByFilename) || rawSrc;
        if (!src) return imgTag;
        return toInlineShot(src, alt || basename(src));
      });
    return rendered;
  }

  function initLightbox() {
    var overlay = document.getElementById("image-lightbox");
    var img = document.getElementById("image-lightbox-img");
    if (!overlay || !img) return;

    function closeLightbox() {
      overlay.classList.add("hidden");
      img.removeAttribute("src");
    }

    document.addEventListener("click", function (e) {
      if (!overlay.classList.contains("hidden")) {
        if (e.target === overlay || e.target === img) {
          closeLightbox();
          return;
        }
      }

      var shot = e.target.closest(".inline-shot");
      if (shot) {
        img.src = shot.src;
        overlay.classList.remove("hidden");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.classList.contains("hidden")) {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initLightbox);

  window.renderTextileImages = renderTextileImages;
})();
