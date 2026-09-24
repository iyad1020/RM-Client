/** Order of fields in the full time-entry modal (not inline popover). */
(function (factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.TimeEntryFormOrder = api;
})(function createTimeEntryFormOrder() {
  const FIELD_KEYS = ["spent_on", "hours", "comments", "activity_id", "customer_name"];
  const FIELD_LABELS = {
    spent_on: "Дата",
    hours: "Часы",
    comments: "Комментарий",
    activity_id: "Вид деятельности",
    customer_name: "ФИО заказчика",
  };
  /** Redmine web form: date, hours, comment first. */
  const REDMINE_DEFAULT_ORDER = ["spent_on", "hours", "comments", "activity_id", "customer_name"];

  function normalizeOrder(order) {
    const seen = new Set();
    const out = [];
    (Array.isArray(order) ? order : []).forEach((key) => {
      const k = String(key || "");
      if (!FIELD_KEYS.includes(k) || seen.has(k)) return;
      seen.add(k);
      out.push(k);
    });
    FIELD_KEYS.forEach((k) => {
      if (!seen.has(k)) out.push(k);
    });
    return out;
  }

  function getRedmineDefaultOrder() {
    return REDMINE_DEFAULT_ORDER.slice();
  }

  function moveKey(order, key, direction) {
    const next = normalizeOrder(order);
    const idx = next.indexOf(key);
    if (idx < 0) return next;
    const swap = direction < 0 ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= next.length) return next;
    const tmp = next[idx];
    next[idx] = next[swap];
    next[swap] = tmp;
    return next;
  }

  /**
   * Reorder `[data-te-field]` rows inside form; keep issue row and actions fixed.
   * @param {HTMLElement|null} form
   * @param {string[]} order
   */
  function applyOrderToForm(form, order) {
    if (!form) return;
    const normalized = normalizeOrder(order);
    const actions = form.querySelector(".actions");
    const issueRow = form.querySelector('[data-te-field="issue_id"]');
    const rowsByKey = new Map();
    form.querySelectorAll("[data-te-field]").forEach((row) => {
      const key = row.getAttribute("data-te-field");
      if (key && key !== "issue_id") rowsByKey.set(key, row);
    });
    const anchor = actions || null;
    normalized.forEach((key) => {
      const row = rowsByKey.get(key);
      if (!row) return;
      if (anchor) form.insertBefore(row, anchor);
      else form.appendChild(row);
    });
    if (issueRow && form.firstElementChild !== issueRow) {
      form.insertBefore(issueRow, form.firstElementChild);
    }
  }

  return {
    FIELD_KEYS,
    FIELD_LABELS,
    REDMINE_DEFAULT_ORDER,
    getRedmineDefaultOrder,
    normalizeOrder,
    moveKey,
    applyOrderToForm,
  };
});
