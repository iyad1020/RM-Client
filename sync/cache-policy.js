/**
 * Cache policy helpers: retention of closed issues and size limits.
 */

function parseFavoriteIds(raw) {
  if (Array.isArray(raw)) return raw.map(Number).filter((id) => Number.isFinite(id) && id > 0);
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parseFavoriteIds(parsed);
    } catch {
      /* ignore */
    }
  }
  return [];
}

/**
 * Decide which closed issues are eligible for eviction.
 * @param {object} opts
 * @param {Array<{id:number,status_is_closed?:number|boolean,updated_on?:string}>} opts.issues
 * @param {number[]} opts.favoriteIds
 * @param {number} opts.retentionDays — 0 = never auto-delete
 * @param {string} [opts.nowIso]
 */
function closedIssuesEligibleForEviction({
  issues = [],
  favoriteIds = [],
  retentionDays = 90,
  nowIso = new Date().toISOString(),
} = {}) {
  const days = Number(retentionDays);
  if (!Number.isFinite(days) || days <= 0) return [];
  const fav = new Set((favoriteIds || []).map(Number));
  const now = Date.parse(nowIso);
  if (!Number.isFinite(now)) return [];
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  return (issues || []).filter((issue) => {
    const id = Number(issue.id);
    if (!Number.isFinite(id) || id <= 0) return false;
    if (fav.has(id)) return false;
    if (!issue.status_is_closed && !issue.status?.is_closed) return false;
    const updated = Date.parse(issue.updated_on || issue.closed_on || "");
    if (!Number.isFinite(updated)) return false;
    return updated < cutoff;
  });
}

function cacheMaxBytesFromMb(mb) {
  const n = Number(mb);
  if (!Number.isFinite(n) || n <= 0) return 0; // 0 = unlimited
  return Math.floor(n * 1024 * 1024);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseFavoriteIds,
    closedIssuesEligibleForEviction,
    cacheMaxBytesFromMb,
  };
}
