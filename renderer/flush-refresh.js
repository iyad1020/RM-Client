/**
 * Whether offline flush should refresh the open issue card (navigate/show issue page).
 * @param {object} opts
 * @param {boolean} opts.trackerViewVisible
 * @param {boolean} opts.issuePageVisible
 * @param {number|null|undefined} opts.selectedIssueId
 * @param {number[]} opts.flushedIssueIds
 */
function shouldRefreshIssueCardOnFlush({
  trackerViewVisible = false,
  issuePageVisible = false,
  selectedIssueId = null,
  flushedIssueIds = [],
} = {}) {
  if (trackerViewVisible) return false;
  if (!issuePageVisible) return false;
  const selected = Number(selectedIssueId);
  if (!Number.isFinite(selected) || selected <= 0) return false;
  const ids = (flushedIssueIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  return ids.includes(selected);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { shouldRefreshIssueCardOnFlush };
}

if (typeof window !== "undefined") {
  window.FlushRefresh = { shouldRefreshIssueCardOnFlush };
}
