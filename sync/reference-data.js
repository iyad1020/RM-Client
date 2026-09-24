/** @typedef {import("../db/database")} Database */

/**
 * Read cached Redmine reference bundles from SQLite.
 * @param {Database} db
 */
function getCachedReference(db) {
  return {
    projects: db.getReferenceData("projects") || [],
    users: db.getReferenceData("users") || [],
    issueStatuses: db.getReferenceData("issue_statuses") || [],
    trackers: db.getReferenceData("trackers") || [],
    priorities: db.getReferenceData("priorities") || [],
    activities: db.getReferenceData("activities") || [],
    roles: db.getReferenceData("roles") || [],
    currentUser: db.getReferenceData("current_user") || null,
  };
}

/**
 * Minimum set required before issue/time-entry sync can run offline from cache.
 * @param {Database} db
 */
function referenceCacheHasEssentials(db) {
  const ref = getCachedReference(db);
  return (
    ref.projects.length > 0 &&
    ref.issueStatuses.length > 0 &&
    ref.activities.length > 0 &&
    Boolean(ref.currentUser?.id)
  );
}

/**
 * Persist reference data without wiping cached lists when Redmine returns empty
 * (transient API/network failure).
 * @param {Database} db
 * @param {object} reference
 */
function persistReferenceData(db, reference) {
  const pairs = [
    ["projects", reference.projects],
    ["users", reference.users],
    ["issue_statuses", reference.issueStatuses],
    ["trackers", reference.trackers],
    ["priorities", reference.priorities],
    ["activities", reference.activities],
    ["roles", reference.roles],
  ];

  pairs.forEach(([type, incoming]) => {
    const existing = db.getReferenceData(type);
    const existingArr = Array.isArray(existing) ? existing : [];
    const incomingArr = Array.isArray(incoming) ? incoming : [];
    if (incomingArr.length > 0) {
      db.saveReferenceData(type, incomingArr);
    } else if (existingArr.length === 0) {
      db.saveReferenceData(type, incomingArr);
    }
  });

  if (reference.currentUser?.id) {
    db.saveReferenceData("current_user", reference.currentUser);
  }

  db.setMeta("reference_data_updated_at", new Date().toISOString());
  return getCachedReference(db);
}

/**
 * Force refresh from Redmine (manual sync in settings).
 * @param {Database} db
 * @param {object} redmine
 * @param {string} redmineUrl
 * @param {string} apiKey
 */
async function refreshReferenceDataFromRedmine(db, redmine, redmineUrl, apiKey) {
  const reference = await redmine.loadReferenceData(redmineUrl, apiKey);
  return persistReferenceData(db, reference);
}

/**
 * Use local cache during routine sync; fetch from Redmine only when cache is incomplete.
 * @param {Database} db
 * @param {object} redmine
 * @param {string} redmineUrl
 * @param {string} apiKey
 */
async function ensureReferenceData(db, redmine, redmineUrl, apiKey) {
  if (referenceCacheHasEssentials(db)) {
    return getCachedReference(db);
  }
  return refreshReferenceDataFromRedmine(db, redmine, redmineUrl, apiKey);
}

module.exports = {
  getCachedReference,
  referenceCacheHasEssentials,
  persistReferenceData,
  refreshReferenceDataFromRedmine,
  ensureReferenceData,
};
