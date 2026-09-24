function formatMatrixHours(n) {
  const v = Math.round(Number(n || 0) * 100) / 100;
  if (!Number.isFinite(v) || v === 0) return "";
  return v.toFixed(2);
}

function issueMatrixLabel(entry) {
  const id = entry?.issue_id;
  if (id == null || id === "") return "Без задачи";
  const subject = String(entry.issue_subject || "").trim();
  return subject ? `Задача #${id}: ${subject}` : `Задача #${id}`;
}

/**
 * Сводка часов: строки — задачи, колонки — дни периода.
 * @param {Array<{issue_id?: number, issue_subject?: string, spent_on?: string, hours?: number}>} entries
 * @param {string[]} days ISO dates
 */
function buildIssueDayMatrix(entries, days) {
  const dayList = Array.isArray(days) ? days.slice() : [];
  const byIssue = new Map();
  (entries || []).forEach((e) => {
    const key = e.issue_id == null || e.issue_id === "" ? "none" : String(e.issue_id);
    if (!byIssue.has(key)) {
      byIssue.set(key, {
        issueId: e.issue_id == null || e.issue_id === "" ? null : Number(e.issue_id),
        label: issueMatrixLabel(e),
        hoursByDay: Object.create(null),
        total: 0,
      });
    }
    const row = byIssue.get(key);
    const hours = Number(e.hours || 0);
    const day = e.spent_on ? String(e.spent_on) : "";
    if (day) {
      row.hoursByDay[day] = (row.hoursByDay[day] || 0) + hours;
    }
    row.total += hours;
  });

  const rows = [...byIssue.values()].sort((a, b) => b.total - a.total);
  const colTotals = {};
  let grandTotal = 0;
  dayList.forEach((d) => {
    colTotals[d] = 0;
  });
  rows.forEach((row) => {
    dayList.forEach((d) => {
      colTotals[d] += row.hoursByDay[d] || 0;
    });
    grandTotal += row.total;
  });

  return { days: dayList, rows, colTotals, grandTotal };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    buildIssueDayMatrix,
    formatMatrixHours,
    issueMatrixLabel,
  };
}

if (typeof window !== "undefined") {
  window.ReportMatrix = {
    buildIssueDayMatrix,
    formatMatrixHours,
    issueMatrixLabel,
  };
}
