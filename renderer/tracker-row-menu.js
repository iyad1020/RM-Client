const TRACKER_COPY_ROW_CONTROL_SELECTOR =
  "input, textarea, select, button, a, option, [contenteditable='true']";

/**
 * «Скопировать строку» — только по пустому месту строки, не по полям и не по тексту/числам.
 * @param {EventTarget|null} target
 * @param {{ clientX?: number, clientY?: number, caretRangeFromPoint?: Function|null }} [hit]
 */
function shouldOpenTrackerCopyRowMenu(target, hit = {}) {
  if (!target || typeof target.closest !== "function") return false;
  const row = target.closest("tr[data-entry-id]");
  if (!row) return false;
  if (target.closest(TRACKER_COPY_ROW_CONTROL_SELECTOR)) return false;

  const clientX = hit.clientX;
  const clientY = hit.clientY;
  const caretFn =
    hit.caretRangeFromPoint ||
    (typeof document !== "undefined" && typeof document.caretRangeFromPoint === "function"
      ? document.caretRangeFromPoint.bind(document)
      : null);
  if (typeof clientX === "number" && typeof clientY === "number" && caretFn) {
    let range = null;
    try {
      range = caretFn(clientX, clientY);
    } catch {
      range = null;
    }
    if (range && range.startContainer && range.startContainer.nodeType === 3) {
      const raw = String(range.startContainer.textContent || "");
      if (raw.replace(/\s+/g, "")) {
        const len = raw.length;
        const offset = Math.min(Math.max(0, range.startOffset), Math.max(0, len - 1));
        try {
          const probe = range.cloneRange();
          probe.setStart(range.startContainer, offset);
          probe.setEnd(range.startContainer, Math.min(len, offset + 1));
          const rects = Array.from(probe.getClientRects() || []);
          const onGlyph = rects.some(
            (r) =>
              clientX >= r.left &&
              clientX <= r.right &&
              clientY >= r.top &&
              clientY <= r.bottom,
          );
          if (onGlyph) return false;
        } catch {
          return false;
        }
      }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shouldOpenTrackerCopyRowMenu,
    TRACKER_COPY_ROW_CONTROL_SELECTOR,
  };
}

if (typeof window !== "undefined") {
  window.TrackerRowMenu = {
    shouldOpenTrackerCopyRowMenu,
    TRACKER_COPY_ROW_CONTROL_SELECTOR,
  };
}
