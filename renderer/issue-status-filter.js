/** Статус считается закрытым для пресета «Открытые» (Решённый остаётся открытым). */
function isClosedForOpenScope(status) {
  if (!status) return false;
  if (status.is_closed) return true;
  return /закрыт|closed|отклон|reject/i.test(String(status.name || ""));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { isClosedForOpenScope };
}

if (typeof window !== "undefined") {
  window.IssueStatusFilter = { isClosedForOpenScope };
}
