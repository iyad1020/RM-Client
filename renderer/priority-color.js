/**
 * Priority text colors for list / detail views.
 * Heat-map convention: urgent = warm/red, low = cool/green, deferred = muted gray.
 * "Обычный" stays default (null) so it doesn't compete visually.
 */
(function (root) {
  const PRIORITY_COLORS = [
    [/немедленно/i, "#922B3E"], // bordeaux / maroon
    [/срочн/i, "#E03131"], // bright red
    [/высок/i, "#E8590C"], // orange
    [/обычн|normal/i, null], // default text
    [/низк|low/i, "#2F9E44"], // green
    [/отлож|deferred|postpone/i, "#868E96"], // gray
  ];

  function getPriorityColor(priorityName) {
    const text = String(priorityName || "").trim();
    if (!text || text === "-" || text === "—") return null;
    for (let i = 0; i < PRIORITY_COLORS.length; i += 1) {
      if (PRIORITY_COLORS[i][0].test(text)) return PRIORITY_COLORS[i][1];
    }
    return null;
  }

  const api = { PRIORITY_COLORS, getPriorityColor };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.PriorityColor = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
