const db = require("../db/database");
const redmine = require("./redmine-client");
const journalActivity = require("./journal-activity");
const referenceData = require("./reference-data");

const DETAIL_CONCURRENCY = 4;

let syncState = {
  running: false,
  cancelled: false,
  phase: "idle",
  projectName: "",
  projectDone: 0,
  projectTotal: 0,
  overallDone: 0,
  overallTotal: 0,
  lastError: null,
  lastCompletedAt: null,
};

function getSyncStatus() {
  const projectPercent =
    syncState.projectTotal > 0 ? syncState.projectDone / syncState.projectTotal : 0;
  const percent =
    syncState.overallTotal > 0
      ? Math.min(100, Math.round(((syncState.overallDone + projectPercent) / syncState.overallTotal) * 100))
      : 0;
  return { ...syncState, percent };
}

function emitProgress(onProgress) {
  if (typeof onProgress === "function") {
    onProgress(getSyncStatus());
  }
}

function buildStatusMap(statuses) {
  const map = {};
  (statuses || []).forEach((status) => {
    map[status.id] = status;
  });
  return map;
}

function buildActivityLookups(statusMap, detail, existingIssue) {
  const priorities = {};
  const trackers = {};
  const users = {};
  const addUser = (id, name) => {
    if (id == null || id === "" || !name) return;
    users[String(id)] = String(name);
  };
  (db.getReferenceData("priorities") || []).forEach((item) => {
    if (item?.id != null) priorities[item.id] = item.name || String(item.id);
  });
  (db.getReferenceData("trackers") || []).forEach((item) => {
    if (item?.id != null) trackers[item.id] = item.name || String(item.id);
  });
  (db.getReferenceData("users") || []).forEach((item) => {
    if (item?.id != null) users[item.id] = item.name || String(item.id);
  });
  const currentUser = db.getReferenceData("current_user");
  if (currentUser?.id != null) {
    addUser(currentUser.id, currentUser.name || users[currentUser.id] || "Я");
  }
  // Enrich names from current detail payload.
  addUser(detail?.author?.id, detail?.author?.name);
  addUser(detail?.assigned_to?.id, detail?.assigned_to?.name);
  (detail?.watchers || []).forEach((watcher) => addUser(watcher?.id, watcher?.name));
  (detail?.journals || []).forEach((journal) => addUser(journal?.user?.id, journal?.user?.name));
  // Enrich names from previous cached state to resolve old assignee values.
  addUser(existingIssue?.author_id, existingIssue?.author_name);
  addUser(existingIssue?.assigned_to_id, existingIssue?.assigned_to_name);
  (existingIssue?.watchers || []).forEach((watcher) => addUser(watcher?.id, watcher?.name));
  return journalActivity.buildLookupsFromMaps({ statusMap, priorities, trackers, users });
}

function isActivityRelevantIssue(issue, currentUserId, watchedSet) {
  const userId = Number(currentUserId);
  if (!Number.isFinite(userId)) return false;
  const assigneeId = Number(issue?.assigned_to?.id ?? issue?.assigned_to_id);
  if (assigneeId === userId) return true;
  return watchedSet.has(Number(issue?.id));
}

function collectActivityFromDetail(detail, {
  existingJournalIds,
  existingIssue,
  isNewIssue = false,
  statusMap,
  watchedSet,
  sinceIso,
  currentUserId,
} = {}) {
  if (!detail?.id || !currentUserId) return 0;
  if (!isActivityRelevantIssue(detail, currentUserId, watchedSet)) return 0;

  const lookups = buildActivityLookups(statusMap, detail, existingIssue);
  const context = {
    issueId: detail.id,
    issueSubject: detail.subject || "",
    projectName: detail.project?.name || "",
    currentUserId,
    sinceIso,
    lookups,
  };

  const events = journalActivity.eventsFromNewJournals(detail.journals || [], existingJournalIds, context);
  if (isNewIssue) {
    const assigned = journalActivity.assignedEventForNewIssue(detail, currentUserId, sinceIso);
    if (assigned) events.push(assigned);
  }
  if (!events.length) return 0;
  return db.insertActivityEvents(events);
}

function ingestActivityForIssueDetail(detail, statusMap, { isNewIssue = false, previousIssue = null } = {}) {
  const currentUser = db.getReferenceData("current_user");
  const currentUserId = currentUser?.id;
  if (!currentUserId || !detail?.id) {
    db.saveIssueDetail(detail, statusMap);
    return 0;
  }

  const sinceIso = db.ensureActivityFeedWatermark();
  const existingJournalIds = new Set(db.getJournalIdsForIssue(detail.id));
  const existingIssue = previousIssue || db.getIssueById(detail.id);
  const watchedSet = new Set(db.getWatchedIssueIds().map(Number));
  const inserted = collectActivityFromDetail(detail, {
    existingJournalIds,
    existingIssue,
    isNewIssue,
    statusMap,
    watchedSet,
    sinceIso,
    currentUserId,
  });
  db.saveIssueDetail(detail, statusMap);
  return inserted;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      if (syncState.cancelled) return;
      const current = index;
      index += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length || 1) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function syncReferenceData(redmineUrl, apiKey) {
  return referenceData.refreshReferenceDataFromRedmine(db, redmine, redmineUrl, apiKey);
}

async function ensureReferenceData(redmineUrl, apiKey) {
  return referenceData.ensureReferenceData(db, redmine, redmineUrl, apiKey);
}

async function syncWatchedIssues(redmineUrl, apiKey, statusMap = {}) {
  try {
    const issues = await redmine.fetchWatchedIssues(redmineUrl, apiKey);
    const enabledIds = new Set(db.getEnabledSyncProjectIds());
    const inEnabled = enabledIds.size
      ? issues.filter((issue) => enabledIds.has(Number(issue.project?.id)))
      : issues;
    db.replaceWatchedIssues(inEnabled.map((issue) => issue.id));
    inEnabled.forEach((issue) => db.upsertIssueSummary(issue, statusMap));
    return inEnabled.length;
  } catch (error) {
    console.error("syncWatchedIssues failed:", error.message);
    return 0;
  }
}

async function syncProjectIssues({
  redmineUrl,
  apiKey,
  projectId,
  projectName,
  cacheMode,
  incrementalSince,
  statusMap,
  onProgress,
}) {
  syncState.phase = incrementalSince ? "incremental" : "issues";
  syncState.projectName = projectName;

  const fetched = await redmine.fetchProjectIssues(redmineUrl, apiKey, projectId, incrementalSince);
  const projectIdNum = Number(projectId);
  const issues = fetched.filter((issue) => {
    const pid = Number(issue.project?.id);
    return !Number.isFinite(pid) || pid === projectIdNum;
  });
  syncState.projectTotal = issues.length || 1;
  syncState.projectDone = 0;
  emitProgress(onProgress);

  const newIssueIds = new Set();
  const previousIssueById = new Map();
  issues.forEach((issue) => {
    const prev = db.getIssueById(issue.id);
    if (!prev) newIssueIds.add(Number(issue.id));
    else previousIssueById.set(Number(issue.id), prev);
    db.upsertIssueSummary(issue, statusMap);
  });

  const needsDetail = cacheMode !== "issues-only" || Boolean(incrementalSince);

  if (needsDetail && issues.length) {
    syncState.phase = "details";
    syncState.projectDone = 0;
    emitProgress(onProgress);

    // Only collect activity on incremental sync (or when watermark already set for incremental).
    const collectActivity = Boolean(incrementalSince);

    await mapWithConcurrency(issues, DETAIL_CONCURRENCY, async (summary) => {
      if (syncState.cancelled) return;
      try {
        const detail = await redmine.fetchIssueDetail(redmineUrl, apiKey, summary.id);
        if (cacheMode === "issues-only") {
          db.upsertIssueSummary({ ...detail, has_detail: 1 }, statusMap);
        } else if (collectActivity) {
          ingestActivityForIssueDetail(detail, statusMap, {
            isNewIssue: newIssueIds.has(Number(summary.id)),
            previousIssue: previousIssueById.get(Number(summary.id)) || null,
          });
        } else {
          db.saveIssueDetail(detail, statusMap);
        }
      } catch (error) {
        console.error(`Detail fetch failed for #${summary.id}:`, error.message);
      }
      syncState.projectDone += 1;
      emitProgress(onProgress);
    });
  } else {
    syncState.projectDone = issues.length;
    emitProgress(onProgress);
  }

  const issueCount = db.countIssuesByProject(projectId);
  const now = new Date().toISOString();
  db.updateSyncProjectState(projectId, { lastSyncAt: now, issueCount });
  return issues.length;
}

async function refreshIssueSpentHours(redmineUrl, apiKey, issueIds) {
  const ids = [...new Set((issueIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) return;
  await mapWithConcurrency(ids, DETAIL_CONCURRENCY, async (issueId) => {
    try {
      const data = await redmine.redmineRequest(redmineUrl, apiKey, `/issues/${issueId}.json`);
      if (data?.issue && data.issue.spent_hours !== undefined) {
        db.setIssueSpentHours(issueId, data.issue.spent_hours);
      }
    } catch (error) {
      console.error(`spent_hours refresh failed for #${issueId}:`, error.message);
    }
  });
}

async function syncTimeEntries(redmineUrl, apiKey, userId, fromDate) {
  const filters = { userId, from: fromDate };
  const entries = await redmine.fetchTimeEntries(redmineUrl, apiKey, {
    user_id: userId,
    from: fromDate,
  });
  entries.forEach((entry) => upsertTimeEntryUnlessPending(entry));
  // Redmine omits deleted entries — drop matching local synced rows still in cache.
  const { affectedIssueIds } = db.removeOrphanSyncedTimeEntries(
    filters,
    entries.map((e) => e.id),
  );
  if (affectedIssueIds.length) {
    await refreshIssueSpentHours(redmineUrl, apiKey, affectedIssueIds);
  }
  return entries.length;
}

/** All time entries for one issue (any user) — used by «Показать все». */
async function syncTimeEntriesForIssue(redmineUrl, apiKey, issueId) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || id <= 0) return 0;
  const entries = await redmine.fetchTimeEntries(redmineUrl, apiKey, {
    issue_id: id,
  });
  entries.forEach((entry) => upsertTimeEntryUnlessPending(entry));
  db.removeOrphanSyncedTimeEntries({ issueId: id }, entries.map((e) => e.id));
  // Always refresh issue spent_hours — TE delete on server may not bump issue into incremental sync.
  await refreshIssueSpentHours(redmineUrl, apiKey, [id]);
  return entries.length;
}

/** Do not overwrite local edits that are still waiting to be sent (or failed). */
function upsertTimeEntryUnlessPending(entry) {
  const entryId = entry?.id;
  if (entryId != null) {
    const local = db.getTimeEntryById(entryId);
    if (local && (local.sync_status === "pending" || local.sync_status === "error" || local.sync_status === "draft")) {
      return;
    }
  }
  db.upsertTimeEntry(entry);
}

function incrementalSinceFrom(lastSyncAt) {
  if (!lastSyncAt) return null;
  const parsed = new Date(lastSyncAt);
  if (Number.isNaN(parsed.getTime())) return null;
  // Overlap window so we don't miss updates around the previous sync boundary.
  parsed.setMinutes(parsed.getMinutes() - 15);
  return parsed.toISOString().replace(/\.\d{3}Z$/, "Z");
}

async function runFullSync({ redmineUrl, apiKey, projectIds, cacheMode, onProgress }) {
  if (syncState.running) {
    throw new Error("Синхронизация уже выполняется.");
  }

  syncState = {
    running: true,
    cancelled: false,
    phase: "reference",
    projectName: "",
    projectDone: 0,
    projectTotal: 0,
    overallDone: 0,
    overallTotal: 0,
    lastError: null,
    lastCompletedAt: null,
  };

  try {
    emitProgress(onProgress);

    // Full sync should not flood the feed with historical journals.
    db.resetActivityFeedWatermark();
    db.clearActivityFeed();

    const reference = await ensureReferenceData(redmineUrl, apiKey);
    const statusMap = buildStatusMap(reference.issueStatuses);

    const projects = reference.projects.filter((p) => projectIds.includes(Number(p.id)));
    db.setSyncProjects(
      reference.projects.map((p) => ({
        project_id: p.id,
        project_name: p.name,
        enabled: projectIds.includes(Number(p.id)) ? 1 : 0,
        last_sync_at: null,
        issue_count: db.countIssuesByProject(p.id),
      })),
    );

    syncState.phase = "projects";
    syncState.overallTotal = Math.max(projects.length, 1);
    syncState.overallDone = 0;
    emitProgress(onProgress);

    for (const project of projects) {
      if (syncState.cancelled) break;
      await syncProjectIssues({
        redmineUrl,
        apiKey,
        projectId: project.id,
        projectName: project.name,
        cacheMode,
        incrementalSince: null,
        statusMap,
        onProgress,
      });
      syncState.overallDone += 1;
      emitProgress(onProgress);
    }

    if (reference.currentUser?.id) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      await syncTimeEntries(redmineUrl, apiKey, reference.currentUser.id, fromDate.toISOString().slice(0, 10));
    }

    await syncWatchedIssues(redmineUrl, apiKey, buildStatusMap(reference.issueStatuses));

    if (!syncState.cancelled) {
      db.setMeta("cache_mode", cacheMode);
      db.setMeta("last_full_sync", new Date().toISOString());
      db.setMeta("last_incremental_sync", new Date().toISOString());
      syncState.lastCompletedAt = new Date().toISOString();
    }
  } catch (error) {
    syncState.lastError = error.message;
    throw error;
  } finally {
    syncState.running = false;
    syncState.phase = syncState.cancelled ? "cancelled" : "idle";
    emitProgress(onProgress);
  }

  return { ok: true, cancelled: Boolean(syncState.cancelled) };
}

async function clearProjectsCache({ projectIds, projectNames = {}, onProgress } = {}) {
  const ids = (projectIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  if (!ids.length) return { ok: true, cleared: 0 };
  if (syncState.running) {
    throw new Error("Синхронизация уже выполняется.");
  }

  syncState = {
    running: true,
    cancelled: false,
    phase: "cleanup",
    projectName: "",
    projectDone: 0,
    projectTotal: 0,
    overallDone: 0,
    overallTotal: ids.length,
    lastError: null,
    lastCompletedAt: syncState.lastCompletedAt,
  };
  emitProgress(onProgress);

  let cleared = 0;
  try {
    for (const projectId of ids) {
      if (syncState.cancelled) break;
      syncState.projectName = projectNames[projectId] || `Проект #${projectId}`;
      syncState.projectDone = 0;
      syncState.projectTotal = 1;
      emitProgress(onProgress);

      const preserveRaw = db.getMeta("favorite_issue_ids", "[]");
      let preserveIssueIds = [];
      try {
        const parsed = JSON.parse(preserveRaw);
        if (Array.isArray(parsed)) {
          preserveIssueIds = parsed.map(Number).filter((id) => Number.isFinite(id) && id > 0);
        }
      } catch {
        preserveIssueIds = [];
      }
      const result = db.clearProjectData(projectId, { preserveIssueIds });
      cleared += result?.removedIssues || 0;
      syncState.projectDone = 1;
      syncState.overallDone += 1;
      emitProgress(onProgress);
      // Small yield so UI can paint between fast SQL steps.
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
  } catch (error) {
    syncState.lastError = error.message;
    throw error;
  } finally {
    syncState.running = false;
    syncState.phase = syncState.cancelled ? "cancelled" : "idle";
    emitProgress(onProgress);
  }

  return { ok: true, cancelled: Boolean(syncState.cancelled), cleared };
}

async function runPartialProjectsSync({ redmineUrl, apiKey, projectIds, cacheMode, onProgress }) {
  const ids = (projectIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  if (!ids.length) return { ok: true, cancelled: false, synced: 0 };
  if (syncState.running) {
    throw new Error("Синхронизация уже выполняется.");
  }

  syncState = {
    running: true,
    cancelled: false,
    phase: "reference",
    projectName: "",
    projectDone: 0,
    projectTotal: 0,
    overallDone: 0,
    overallTotal: Math.max(ids.length, 1),
    lastError: null,
    lastCompletedAt: syncState.lastCompletedAt,
  };

  try {
    emitProgress(onProgress);
    const reference = await ensureReferenceData(redmineUrl, apiKey);
    const statusMap = buildStatusMap(reference.issueStatuses);
    const projects = reference.projects.filter((p) => ids.includes(Number(p.id)));

    const existing = db.getSyncProjects();
    const existingById = new Map(existing.map((p) => [Number(p.project_id), p]));
    const enabledSet = new Set([
      ...existing.filter((p) => p.enabled).map((p) => Number(p.project_id)),
      ...ids,
    ]);

    db.setSyncProjects(
      reference.projects.map((p) => {
        const prev = existingById.get(Number(p.id));
        const enabled = enabledSet.has(Number(p.id));
        return {
          project_id: p.id,
          project_name: p.name,
          enabled: enabled ? 1 : 0,
          last_sync_at: enabled ? prev?.last_sync_at || null : null,
          issue_count: enabled ? prev?.issue_count || db.countIssuesByProject(p.id) : 0,
        };
      }),
    );

    syncState.phase = "projects";
    syncState.overallTotal = Math.max(projects.length, 1);
    syncState.overallDone = 0;
    emitProgress(onProgress);

    for (const project of projects) {
      if (syncState.cancelled) break;
      await syncProjectIssues({
        redmineUrl,
        apiKey,
        projectId: project.id,
        projectName: project.name,
        cacheMode,
        incrementalSince: null,
        statusMap,
        onProgress,
      });
      syncState.overallDone += 1;
      emitProgress(onProgress);
    }

    if (!syncState.cancelled) {
      db.setMeta("cache_mode", cacheMode || db.getMeta("cache_mode", "issues-history"));
      db.setMeta("last_incremental_sync", new Date().toISOString());
      syncState.lastCompletedAt = new Date().toISOString();
    }
  } catch (error) {
    syncState.lastError = error.message;
    throw error;
  } finally {
    syncState.running = false;
    syncState.phase = syncState.cancelled ? "cancelled" : "idle";
    emitProgress(onProgress);
  }

  return { ok: true, cancelled: Boolean(syncState.cancelled), synced: syncState.overallDone };
}

async function applySyncProjectsSelection({
  redmineUrl,
  apiKey,
  enabledProjectIds,
  projects = [],
  cacheMode,
  onProgress,
}) {
  const enabledIds = (enabledProjectIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  const previous = db.getSyncProjects().filter((p) => p.enabled).map((p) => Number(p.project_id));
  const previousSet = new Set(previous);
  const enabledSet = new Set(enabledIds);

  const removedIds = previous.filter((id) => !enabledSet.has(id));
  const addedIds = enabledIds.filter((id) => !previousSet.has(id));

  const nameById = {};
  (projects || []).forEach((p) => {
    if (p?.id != null) nameById[Number(p.id)] = p.name || `Проект #${p.id}`;
  });
  db.getSyncProjects().forEach((p) => {
    if (!nameById[Number(p.project_id)]) nameById[Number(p.project_id)] = p.project_name;
  });
  const cachedProjects = db.getReferenceData("projects") || [];
  (cachedProjects || []).forEach((p) => {
    if (!nameById[Number(p.id)]) nameById[Number(p.id)] = p.name || `Проект #${p.id}`;
  });

  const existing = db.getSyncProjects();
  const existingById = new Map(existing.map((p) => [Number(p.project_id), p]));
  const allKnown = new Map();
  Object.entries(nameById).forEach(([id, name]) => allKnown.set(Number(id), name));
  existing.forEach((p) => {
    if (!allKnown.has(Number(p.project_id))) allKnown.set(Number(p.project_id), p.project_name);
  });
  enabledIds.forEach((id) => {
    if (!allKnown.has(id)) allKnown.set(id, nameById[id] || `Проект #${id}`);
  });

  db.setSyncProjects(
    Array.from(allKnown.entries())
      .sort((a, b) => String(a[1]).localeCompare(String(b[1]), "ru"))
      .map(([projectId, projectName]) => {
        const prev = existingById.get(projectId);
        const enabled = enabledSet.has(projectId);
        return {
          project_id: projectId,
          project_name: projectName,
          enabled: enabled ? 1 : 0,
          last_sync_at: enabled ? prev?.last_sync_at || null : null,
          issue_count: enabled ? prev?.issue_count || db.countIssuesByProject(projectId) : 0,
        };
      }),
  );

  let cleanup = { ok: true, cleared: 0, cancelled: false };
  if (removedIds.length) {
    cleanup = await clearProjectsCache({
      projectIds: removedIds,
      projectNames: nameById,
      onProgress,
    });
    if (cleanup.cancelled) {
      return { ok: true, cancelled: true, addedIds, removedIds, cleanup, sync: null };
    }
  }

  let sync = { ok: true, synced: 0, cancelled: false };
  if (addedIds.length) {
    if (!redmineUrl || !apiKey) {
      throw new Error("Нет подключения к Redmine для синхронизации новых проектов.");
    }
    sync = await runPartialProjectsSync({
      redmineUrl,
      apiKey,
      projectIds: addedIds,
      cacheMode: cacheMode || db.getMeta("cache_mode", "issues-history"),
      onProgress,
    });
  }

  return {
    ok: true,
    cancelled: Boolean(cleanup.cancelled || sync.cancelled),
    addedIds,
    removedIds,
    cleanup,
    sync,
  };
}

async function runIncrementalSync({ redmineUrl, apiKey, onProgress }) {
  if (!redmineUrl || !apiKey) {
    return { ok: false, skipped: true, reason: "no_credentials" };
  }
  if (syncState.running) {
    return { ok: false, skipped: true, reason: "already_running" };
  }

  const projects = db.getSyncProjects().filter((p) => p.enabled);
  if (!projects.length) {
    return { ok: false, skipped: true, reason: "no_projects" };
  }

  syncState = {
    running: true,
    cancelled: false,
    phase: "incremental",
    projectName: "",
    projectDone: 0,
    projectTotal: 0,
    overallDone: 0,
    overallTotal: projects.length,
    lastError: null,
    lastCompletedAt: syncState.lastCompletedAt,
  };

  let issuesUpdated = 0;

  try {
    db.ensureActivityFeedWatermark();
    const statuses = db.getReferenceData("issue_statuses") || [];
    const statusMap = buildStatusMap(statuses);
    const cacheMode = db.getMeta("cache_mode", "issues-history");

    for (const project of projects) {
      if (syncState.cancelled) break;
      const since = incrementalSinceFrom(project.last_sync_at);
      const fetched = await syncProjectIssues({
        redmineUrl,
        apiKey,
        projectId: project.project_id,
        projectName: project.project_name,
        cacheMode,
        incrementalSince: since,
        statusMap,
        onProgress,
      });
      issuesUpdated += fetched || 0;
      syncState.overallDone += 1;
      emitProgress(onProgress);
    }

    const currentUser = db.getReferenceData("current_user");
    let timeEntriesUpdated = 0;
    if (currentUser?.id) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 14);
      timeEntriesUpdated = await syncTimeEntries(
        redmineUrl,
        apiKey,
        currentUser.id,
        fromDate.toISOString().slice(0, 10),
      );
    }

    await syncWatchedIssues(redmineUrl, apiKey, statusMap);

    db.pruneActivityFeed();
    db.setMeta("last_incremental_sync", new Date().toISOString());
    syncState.lastCompletedAt = new Date().toISOString();
    return {
      ok: true,
      issuesUpdated,
      timeEntriesUpdated,
      projects: projects.length,
      activityUnseen: db.countUnseenActivity(),
    };
  } catch (error) {
    syncState.lastError = error.message;
    throw error;
  } finally {
    syncState.running = false;
    syncState.phase = "idle";
    emitProgress(onProgress);
  }
}

function cancelSync() {
  syncState.cancelled = true;
}

async function fetchAndSaveIssueDetail(redmineUrl, apiKey, issueId) {
  const statuses = db.getReferenceData("issue_statuses") || [];
  const detail = await redmine.fetchIssueDetail(redmineUrl, apiKey, issueId);
  ingestActivityForIssueDetail(detail, buildStatusMap(statuses));
  return db.getIssueById(issueId);
}

async function ensureIssueDetail(redmineUrl, apiKey, issueId) {
  const cached = db.getIssueById(issueId);
  if (cached?.has_detail) return cached;

  try {
    return await fetchAndSaveIssueDetail(redmineUrl, apiKey, issueId);
  } catch (error) {
    return cached || null;
  }
}

async function getIssueDetail(redmineUrl, apiKey, issueId, { forceRefresh = false } = {}) {
  const cached = db.getIssueById(issueId);
  if (forceRefresh) {
    return refreshIssueDetail(redmineUrl, apiKey, issueId);
  }
  if (!cached || !cached.has_detail) {
    return ensureIssueDetail(redmineUrl, apiKey, issueId);
  }
  return cached;
}

async function refreshIssueDetail(redmineUrl, apiKey, issueId) {
  try {
    return await fetchAndSaveIssueDetail(redmineUrl, apiKey, issueId);
  } catch (error) {
    return db.getIssueById(issueId);
  }
}

module.exports = {
  getSyncStatus,
  runFullSync,
  runIncrementalSync,
  runPartialProjectsSync,
  clearProjectsCache,
  applySyncProjectsSelection,
  cancelSync,
  syncReferenceData,
  ensureReferenceData,
  syncTimeEntriesForIssue,
  ensureIssueDetail,
  refreshIssueDetail,
  getIssueDetail,
};
