/**
 * Guards async issue-card open against Back / Esc / Alt+Left mid-flight.
 * @param {object} opts
 * @param {number} opts.navGeneration
 * @param {number} opts.expectedGeneration
 * @param {number|null|undefined} opts.selectedIssueId
 * @param {number|string} opts.issueId
 * @param {boolean} opts.issuePageVisible
 * @param {boolean} [opts.previewMode]
 */
function shouldContinueIssueOpen({
  navGeneration,
  expectedGeneration,
  selectedIssueId,
  issueId,
  issuePageVisible = false,
  previewMode = false,
} = {}) {
  if (Number(navGeneration) !== Number(expectedGeneration)) return false;
  if (Number(selectedIssueId) !== Number(issueId)) return false;
  if (!previewMode && !issuePageVisible) return false;
  return true;
}

/** True when comments are acceptable for Redmine time-entry create/update. */
function timeEntryCommentsReady(comments) {
  return Boolean(String(comments || "").trim());
}

/**
 * In-memory stack of issue ids for Back: list → parent → child → Back → parent.
 * @param {number[]} [initial]
 */
function createIssueNavStack(initial = []) {
  const stack = Array.isArray(initial) ? initial.map(Number).filter((id) => Number.isFinite(id) && id > 0) : [];

  return {
    /** @returns {number[]} */
    snapshot() {
      return [...stack];
    },
    clear() {
      stack.length = 0;
    },
    /**
     * Push current id when navigating to a different issue from an open card.
     * @param {number|string|null|undefined} fromId
     * @param {number|string} toId
     * @param {{ fromCard?: boolean }} [opts]
     */
    pushIfNavigating(fromId, toId, { fromCard = false } = {}) {
      const from = Number(fromId);
      const to = Number(toId);
      if (!fromCard) return;
      if (!Number.isFinite(from) || from <= 0) return;
      if (!Number.isFinite(to) || to <= 0) return;
      if (from === to) return;
      if (stack[stack.length - 1] === from) return;
      stack.push(from);
    },
    /** @returns {number|null} */
    pop() {
      if (!stack.length) return null;
      return stack.pop() ?? null;
    },
    get length() {
      return stack.length;
    },
  };
}

/**
 * Prefer list/optimistic status over stale getIssue payload.
 * @param {object|null|undefined} issue
 * @param {object[]} loadedIssues
 */
function mergeIssueStatusFromList(issue, loadedIssues) {
  if (!issue?.id) return issue;
  const list = Array.isArray(loadedIssues) ? loadedIssues : [];
  const fromList = list.find((row) => Number(row?.id) === Number(issue.id));
  const listStatusId = Number(fromList?.status?.id);
  if (!Number.isFinite(listStatusId) || listStatusId <= 0) return issue;
  if (Number(issue.status?.id) === listStatusId) return issue;
  return {
    ...issue,
    status: {
      id: listStatusId,
      name: fromList.status?.name || issue.status?.name || `#${listStatusId}`,
      is_closed: Boolean(fromList.status?.is_closed),
    },
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    shouldContinueIssueOpen,
    timeEntryCommentsReady,
    createIssueNavStack,
    mergeIssueStatusFromList,
  };
}

if (typeof window !== "undefined") {
  window.IssueNav = {
    shouldContinueIssueOpen,
    timeEntryCommentsReady,
    createIssueNavStack,
    mergeIssueStatusFromList,
  };
}
