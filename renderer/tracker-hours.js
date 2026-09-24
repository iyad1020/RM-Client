/** @param {string} raw */
function normalizeTrackerHoursTyping(raw) {
  let s = String(raw || "").replace(",", ".");
  s = s.replace(/[^\d.]/g, "");
  const parts = s.split(".");
  if (parts.length > 2) {
    s = `${parts[0]}.${parts.slice(1).join("")}`;
  }
  return s;
}

/** @param {number|null} n */
function formatTrackerHoursValue(n) {
  if (n == null || !Number.isFinite(n)) return "0.00";
  return Math.max(0, Math.round(n * 100) / 100).toFixed(2);
}

/**
 * Round hours to nearest 0.5. Zero stays zero.
 * Any positive duration that would round to 0 becomes 0.5 (short touches).
 * @param {number|null|undefined} hours
 * @param {boolean} [enabled=true]
 */
function roundHoursToHalf(hours, enabled = true) {
  const n = Number(hours);
  if (!Number.isFinite(n) || n <= 0) return Number.isFinite(n) && n <= 0 ? 0 : n;
  if (!enabled) return Math.round(n * 100) / 100;
  const rounded = Math.round(n * 2) / 2;
  return rounded === 0 ? 0.5 : rounded;
}

/**
 * Block deleting the decimal separator when value looks like X.XX
 * @param {HTMLInputElement} input
 * @param {KeyboardEvent} event
 */
function shouldBlockHoursDecimalDelete(input, event) {
  if (event.key !== "Backspace" && event.key !== "Delete") return false;
  const val = String(input.value || "");
  const dot = val.indexOf(".");
  if (dot < 0) return false;
  const selStart = input.selectionStart ?? 0;
  const selEnd = input.selectionEnd ?? 0;
  if (selStart !== selEnd) {
    const selected = val.slice(selStart, selEnd);
    return selected.includes(".");
  }
  if (event.key === "Backspace" && selStart === dot + 1) return true;
  if (event.key === "Delete" && selStart === dot) return true;
  return false;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalizeTrackerHoursTyping,
    formatTrackerHoursValue,
    roundHoursToHalf,
    shouldBlockHoursDecimalDelete,
  };
}

if (typeof window !== "undefined") {
  window.TrackerHours = {
    normalizeTrackerHoursTyping,
    formatTrackerHoursValue,
    roundHoursToHalf,
    shouldBlockHoursDecimalDelete,
  };
}
