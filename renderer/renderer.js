const form = document.getElementById("connection-form");
const urlInput = document.getElementById("redmine-url");
const apiKeyInput = document.getElementById("api-key");
const checkButton = document.getElementById("check-btn");
const saveButton = document.getElementById("save-btn");
const statusText = document.getElementById("status");
const syncReferenceButton = document.getElementById("sync-reference-btn");
const resetFiltersButton = document.getElementById("reset-filters-btn");
const projectSelect = document.getElementById("project-filter");
const statusFilterTrigger = document.getElementById("status-filter-trigger");
const statusFilterPanel = document.getElementById("status-filter-panel");
const statusFilterList = document.getElementById("status-filter-list");
const statusFilterSummary = document.getElementById("status-filter-summary");
const statusFilterSelectAll = document.getElementById("status-filter-select-all");
const statusFilterClearAll = document.getElementById("status-filter-clear-all");
const priorityFilterTrigger = document.getElementById("priority-filter-trigger");
const priorityFilterPanel = document.getElementById("priority-filter-panel");
const priorityFilterList = document.getElementById("priority-filter-list");
const priorityFilterSummary = document.getElementById("priority-filter-summary");
const priorityFilterSelectAll = document.getElementById("priority-filter-select-all");
const priorityFilterClearAll = document.getElementById("priority-filter-clear-all");
const authorFilterTrigger = document.getElementById("author-filter-trigger");
const authorFilterPanel = document.getElementById("author-filter-panel");
const authorFilterList = document.getElementById("author-filter-list");
const authorFilterSummary = document.getElementById("author-filter-summary");
const authorFilterSelectAll = document.getElementById("author-filter-select-all");
const authorFilterClearAll = document.getElementById("author-filter-clear-all");
const statusScopeOpenBtn = document.getElementById("status-scope-open-btn");
const statusScopeAllBtn = document.getElementById("status-scope-all-btn");
const assigneeSelect = document.getElementById("assignee-filter");
const searchInput = document.getElementById("global-search");
const issuesList = document.getElementById("issues-list");
const issuesCount = document.getElementById("issues-count");
const bulkStatusConfirmModal = document.getElementById("bulk-status-confirm-modal");
const bulkStatusConfirmText = document.getElementById("bulk-status-confirm-text");
const bulkStatusConfirmBtn = document.getElementById("bulk-status-confirm-btn");
const bulkStatusSkipBtn = document.getElementById("bulk-status-skip-btn");
const bulkStatusSubtasksWarning = document.getElementById("bulk-status-subtasks-warning");
const bulkStatusCancelBtn = document.getElementById("bulk-status-cancel-btn");
const issuesView = document.getElementById("issues-view");
const issuePage = document.getElementById("issue-page");
const issueTitle = document.getElementById("issue-title");
const issueParentChip = document.getElementById("issue-parent-chip");
const copyIssueLinkButton = document.getElementById("copy-issue-link-btn");
const openIssueBrowserButton = document.getElementById("open-issue-browser-btn");
const issueFavoriteButton = document.getElementById("issue-favorite-btn");
const createSubtaskButton = document.getElementById("create-subtask-btn");
const issueMainMeta = document.getElementById("issue-main-meta");
const issueDescription = document.getElementById("issue-description");
const issueDescriptionWrap = document.getElementById("issue-description-wrap");
const toggleDescriptionBtn = document.getElementById("toggle-description-btn");
const issueAttachments = document.getElementById("issue-attachments");
const issueAttachmentsDrop = document.getElementById("issue-attachments-drop");
const issueAttachInput = document.getElementById("issue-attach-input");
const issueAttachPickBtn = document.getElementById("issue-attach-pick-btn");
const issueJournalsComments = document.getElementById("issue-journals-comments");
const issueJournalsHistory = document.getElementById("issue-journals-history");
const activityPanelComments = document.getElementById("activity-panel-comments");
const activityPanelHistory = document.getElementById("activity-panel-history");
const issueEditForm = document.getElementById("issue-edit-form");
const issueCommentForm = document.getElementById("issue-comment-form");
const commentAttachInput = document.getElementById("comment-attach-input");
const commentAttachmentsList = document.getElementById("comment-attachments-list");
const toggleEditButton = document.getElementById("toggle-edit-btn");
const backToListButton = document.getElementById("back-to-list-btn");
const createIssueButton = document.getElementById("create-issue-btn");
const createIssueModal = document.getElementById("create-issue-modal");
const createIssueForm = document.getElementById("create-issue-form");
const createIssueCancelButton = document.getElementById("create-issue-cancel-btn");
const createProject = document.getElementById("create-project");
const createTracker = document.getElementById("create-tracker");
const createSubject = document.getElementById("create-subject");
const createDescription = document.getElementById("create-description");
const createPriority = document.getElementById("create-priority");
const createAssignee = document.getElementById("create-assignee");
const createStartDate = document.getElementById("create-start-date");
const createDueDate = document.getElementById("create-due-date");
const createNoDeadlineCheckbox = document.getElementById("create-no-deadline-checkbox");
const createEstimatedHours = document.getElementById("create-estimated-hours");
const createCustomFieldsHost = document.getElementById("create-custom-fields");
const createStatus = document.getElementById("create-status");
const createDoneRatio = document.getElementById("create-done-ratio");
const createParentIdInput = document.getElementById("create-parent-id");
const createParentQuery = document.getElementById("create-parent-query");
const createParentSuggestList = document.getElementById("create-parent-suggest-list");
const createParentSelected = document.getElementById("create-parent-selected");
const createWatchersChips = document.getElementById("create-watchers-chips");
const createWatchersRow = document.getElementById("create-watchers-row");
const createAddWatcherBtn = document.getElementById("create-add-watcher-btn");
const createWatcherPicker = document.getElementById("create-watcher-picker");
const createWatcherPickerSearch = document.getElementById("create-watcher-picker-search");
const createWatcherPickerList = document.getElementById("create-watcher-picker-list");
const createIssueFullBtn = document.getElementById("create-issue-full-btn");
const createIssueQuickBtn = document.getElementById("create-issue-quick-btn");
const createEditDescriptionBtn = document.getElementById("create-edit-description-btn");
const createDescriptionCtaHint = document.getElementById("create-description-cta-hint");
const createDescriptionQuickWrap = document.getElementById("create-description-quick-wrap");
const createDescriptionFullWrap = document.getElementById("create-description-full-wrap");
const createAttachButton = document.getElementById("create-attach-btn");
const createAttachInput = document.getElementById("create-attach-input");
const createAttachmentsList = document.getElementById("create-attachments-list");
const createDropZone = document.getElementById("create-drop-zone");
const createParentRow = document.getElementById("create-parent-row");
const createParentLabel = document.getElementById("create-parent-label");
const closeConnectionButton = document.getElementById("close-connection-btn");
const editSubject = document.getElementById("edit-subject");
const editDescriptionBtn = document.getElementById("edit-description-btn");
let editStatus = document.getElementById("edit-status");
let editAssignee = document.getElementById("edit-assignee");
let editPriority = document.getElementById("edit-priority");
const editStartDate = document.getElementById("edit-start-date");
let editDueDate = document.getElementById("edit-due-date");
let editDoneRatio = document.getElementById("edit-done-ratio");
let editEstimatedHours = document.getElementById("edit-estimated-hours");
const editWatchers = document.getElementById("edit-watchers");
const editNotes = document.getElementById("edit-notes");
const saveIssueButton = document.getElementById("save-issue-btn");
const cancelEditButton = document.getElementById("cancel-edit-btn");
const saveCommentButton = document.getElementById("save-comment-btn");
const quickOpenModal = document.getElementById("quick-open-modal");
const quickOpenInput = document.getElementById("quick-open");
const quickOpenButton = document.getElementById("quick-open-btn");
const closeQuickOpenButton = document.getElementById("close-quick-open-btn");
const quickIssueByIdPopover = document.getElementById("quick-issue-by-id-popover");
const quickIssueByIdInput = document.getElementById("quick-issue-by-id-input");
const quickIssueByIdGoBtn = document.getElementById("quick-issue-by-id-go");
const quickIssueByIdError = document.getElementById("quick-issue-by-id-error");
let quickIssuePopoverAnchor = null;
const notificationsList = document.getElementById("notifications-list");
const clearNotificationsButton = document.getElementById("clear-notifications-btn");
const notificationsPopover = document.getElementById("notifications-popover");
const activityFeedList = document.getElementById("activity-feed-list");
const activityFeedLimitSelect = document.getElementById("activity-feed-limit");
const activityTypeSummary = document.getElementById("activity-type-summary");
const activityTypePanel = document.getElementById("activity-type-panel");
const activityTypeList = document.getElementById("activity-type-list");
const activityTypeTrigger = document.getElementById("activity-type-trigger");
const activityResetFiltersBtn = document.getElementById("activity-reset-filters-btn");
const activityMarkAllSeenBtn = document.getElementById("activity-mark-all-seen-btn");
const activityBackBtn = document.getElementById("activity-back-btn");
const issueScopeToggle = document.getElementById("issue-scope-toggle");
const syncStatusText = document.getElementById("sync-status-text");
const syncStatusDot = document.getElementById("sync-status-dot");
const footerSyncDot = document.getElementById("footer-sync-dot");
const footerSyncLabel = document.getElementById("footer-sync-label");
const footerSyncProgress = document.getElementById("footer-sync-progress");
const footerSyncProgressFill = document.getElementById("footer-sync-progress-fill");
const footerSyncStrip = document.getElementById("footer-sync-strip");
const footerQueueBadge = document.getElementById("footer-queue-badge");
const syncNowButton = document.getElementById("sync-now-btn");
const offlineQueueBadge = document.getElementById("offline-queue-badge");
const syncProjectsList = document.getElementById("sync-projects-list");
const cacheDbSize = document.getElementById("cache-db-size");
const cacheIssuesCount = document.getElementById("cache-issues-count");
const cacheAttachmentsCount = document.getElementById("cache-attachments-count");
const cacheMaxSizeMbSelect = document.getElementById("cache-max-size-mb");
const cacheRetentionDaysSelect = document.getElementById("cache-retention-days");
const settingsCacheAttachments = document.getElementById("settings-cache-attachments");
const settingsSearchDeep = document.getElementById("settings-search-deep");
const prefetchCacheBtn = document.getElementById("prefetch-cache-btn");
const rebuildFtsBtn = document.getElementById("rebuild-fts-btn");
const cacheMaintenanceBtn = document.getElementById("cache-maintenance-btn");
const settingsAutosyncToggle = document.getElementById("settings-autosync-toggle");
const autosyncInterval = document.getElementById("autosync-interval");
const deadlineAlertDaysSelect = document.getElementById("deadline-alert-days");
const settingsAutobackupToggle = document.getElementById("settings-autobackup-toggle");
const backupFolderPathInput = document.getElementById("backup-folder-path");
const chooseBackupFolderBtn = document.getElementById("choose-backup-folder-btn");
const backupNowBtn = document.getElementById("backup-now-btn");
const idleThresholdSelect = document.getElementById("idle-threshold-minutes");
const trackerTimeInputModeSelect = document.getElementById("tracker-time-input-mode");
const trackerEntryModeSelect = document.getElementById("tracker-entry-mode");
const settingsTrackerMinFloor = document.getElementById("settings-tracker-min-floor");
const settingsTrackerShowCustomer = document.getElementById("settings-tracker-show-customer");
const settingsTrackerShowAi = document.getElementById("settings-tracker-show-ai");
const settingsProjectsHierarchy = document.getElementById("settings-projects-hierarchy");
const teFormOrderList = document.getElementById("te-form-order-list");
const teFormOrderRedmineBtn = document.getElementById("te-form-order-redmine-btn");
const trackerTimeInputModeRow = document.getElementById("tracker-time-input-mode-row");
const editSyncedProjectsButton = document.getElementById("edit-synced-projects-btn");
const resyncAllButton = document.getElementById("resync-all-btn");
const clearCacheButton = document.getElementById("clear-cache-btn");
const syncProgressOverlay = document.getElementById("sync-progress-overlay");
const syncProgressTitle = document.getElementById("sync-progress-title");
const syncProgressFill = document.getElementById("sync-progress-fill");
const syncProgressPercent = document.getElementById("sync-progress-percent");
const syncProjectLine = document.getElementById("sync-project-line");
const syncDetailLine = document.getElementById("sync-detail-line");
const syncWarningText = document.getElementById("sync-warning-text");
const syncMinimizeBtn = document.getElementById("sync-minimize-btn");
const syncCancelBtn = document.getElementById("sync-cancel-btn");
const editSyncProjectsModal = document.getElementById("edit-sync-projects-modal");
const editSyncProjectsList = document.getElementById("edit-sync-projects-list");
const editSyncSelectedCount = document.getElementById("edit-sync-selected-count");
const editSyncSelectAllBtn = document.getElementById("edit-sync-select-all");
const editSyncClearAllBtn = document.getElementById("edit-sync-clear-all");
const editSyncProjectsSaveBtn = document.getElementById("edit-sync-projects-save-btn");
const editSyncProjectsCancelBtn = document.getElementById("edit-sync-projects-cancel-btn");
const projectStatusModelSettings = document.querySelector(".project-status-model-settings");
const projectStatusModelProject = document.getElementById("project-status-model-project");
const projectStatusModelList = document.getElementById("project-status-model-list");
const projectStatusModelDefaultBtn = document.getElementById("project-status-model-default-btn");
const projectStatusModelAllBtn = document.getElementById("project-status-model-all-btn");
const issueRelatedChip = document.getElementById("issue-related-chip");
const issueChildrenBlock = document.getElementById("issue-children-block");
const issueChildren = document.getElementById("issue-children");
const issueRelationsBlock = document.getElementById("issue-relations-block");
const issueRelations = document.getElementById("issue-relations");
const issueWatchers = document.getElementById("issue-watchers");
const addWatcherBtn = document.getElementById("add-watcher-btn");
const watcherPicker = document.getElementById("watcher-picker");
const watcherPickerSearch = document.getElementById("watcher-picker-search");
const watcherPickerList = document.getElementById("watcher-picker-list");
const watcherPickerApply = document.getElementById("watcher-picker-apply");
const watcherPickerCancel = document.getElementById("watcher-picker-cancel");
const dueFromInput = document.getElementById("due-from");
const dueToInput = document.getElementById("due-to");
const dueEmptyOnlyCheckbox = document.getElementById("due-empty-only");
const dueFilterField = document.getElementById("due-filter-field");
const listInlinePopover = document.getElementById("list-inline-popover");
const listInlinePopoverBody = document.getElementById("list-inline-popover-body");
const timeEntriesView = document.getElementById("time-entries-view");
const timeEntriesList = document.getElementById("time-entries-list");
const backFromTimeBtn = document.getElementById("back-from-time-btn");
const addTimeEntryBtn = document.getElementById("add-time-entry-btn");
const timeEntryModal = document.getElementById("time-entry-modal");
const timeEntryForm = document.getElementById("time-entry-form");
const timeEntryIssueId = document.getElementById("time-entry-issue-id");
const timeEntryHours = document.getElementById("time-entry-hours");
const timeEntryActivity = document.getElementById("time-entry-activity");
const timeEntryDate = document.getElementById("time-entry-date");
const timeEntryComments = document.getElementById("time-entry-comments");
const timeEntryCustomer = document.getElementById("time-entry-customer");
const timeEntryEditId = document.getElementById("time-entry-edit-id");
const timeEntryCancelBtn = document.getElementById("time-entry-cancel-btn");
const timeEntryModalTitle = document.querySelector("#time-entry-modal h3");

let currentSettings = null;
let referenceData = null;
let loadedIssues = [];
let selectedIssueId = null;
/** Bumped when leaving the issue card so in-flight openIssueDetails aborts. */
let issueNavGeneration = 0;
const issueNavStack =
  window.IssueNav?.createIssueNavStack?.() ||
  (() => {
    const stack = [];
    return {
      snapshot: () => [...stack],
      clear: () => {
        stack.length = 0;
      },
      pushIfNavigating: () => {},
      pop: () => null,
      get length() {
        return stack.length;
      },
    };
  })();
let currentIssue = null;
let currentIssueJournals = [];
let currentIssueJournalLookups = { statuses: {}, users: {}, priorities: {}, trackers: {} };
let currentIssueAttachmentsMap = {};
let journalSortOrder = "desc";
let activityTab = "comments";
let notifications = [];
let syncFailureCount = 0;
let activityFeedPrefs = window.ActivityFeedSettings?.loadSettings?.() || { limit: 10, groups: ["comment", "params", "assigned", "attachment"] };
let activityUnseenCount = 0;
let currentIssueScope = "mine";
let autosyncTimer = null;
let networkOnline = true;
let createPendingAttachments = [];
let commentPendingAttachments = [];
let createParentIssueId = null;
let boardIssuesCache = [];
let boardStatusesCache = [];
let issuePreviewMode = false;
let reopenPreviewIssueId = null;
/** null | "asc" | "desc" — client-side sort by due_date */
let issuesDueSortDir = null;
let issuesPrioritySortDir = null;
let issuesProjectSortDir = null;
let issuesAssigneeSortDir = null;
let issuesStatusSortDir = null;
let issuesUpdatedSortDir = null;
let selectedIssueIds = new Set();
let pendingBulkStatusId = null;
let pendingBulkAllIds = [];
let pendingBulkSafeIds = [];
let watcherPickerUsers = [];
/** Checked user ids in the watcher picker (survives search re-render). */
let watcherPickerSelectedIds = new Set();
let listInlinePopoverIssueId = null;
let listInlinePopoverKind = null;
/** True when pointer went down inside the open list-inline popover (text selection / drag). */
let listInlinePointerDownInside = false;
/** Drafts for quick TE popover, keyed by issue id. */
const inlineTimeDraftsByIssueId = new Map();
/** True when pointer went down inside an open tracker suggest list. */
let trackerSuggestPointerDownInside = false;
/** Backdrop close for tracker issue picker: only if down+up both on backdrop. */
let trackerIssuePickerBackdropDown = false;
let timeEntriesActiveFilters = null;
/** Full-resync / project-edit overlay is visible (not just minimized to status pill). */
let syncOverlayVisible = false;
let fullSyncInProgress = false;
let syncOperationKind = "sync"; // "sync" | "cleanup" | "projects"

const STATUS_SCOPE_KEY = "redmine-client:status-scope";
const DUE_SORT_KEY = "redmine-client:issues-due-sort";
const PRIORITY_SORT_KEY = "redmine-client:issues-priority-sort";
const PROJECT_SORT_KEY = "redmine-client:issues-project-sort";
const ASSIGNEE_SORT_KEY = "redmine-client:issues-assignee-sort";
const STATUS_SORT_KEY = "redmine-client:issues-status-sort";
const UPDATED_SORT_KEY = "redmine-client:issues-updated-sort";
const SUBJECT_WIDTH_KEY = "redmine-client:subject-col-width";
let subjectColWidth = Number(localStorage.getItem(SUBJECT_WIDTH_KEY)) || null;

function applySubjectColWidth() {
  if (subjectColWidth) {
    document.documentElement.style.setProperty("--issues-subject-width", `${subjectColWidth}px`);
  } else {
    document.documentElement.style.removeProperty("--issues-subject-width");
  }
}

function initSubjectColResize() {
  const handle = document.getElementById("subject-col-resize");
  if (!handle || handle.dataset.resizeBound === "1") return;
  handle.dataset.resizeBound = "1";
  let startX = 0;
  let startWidth = 0;
  const onMove = (e) => {
    const delta = e.clientX - startX;
    subjectColWidth = Math.min(700, Math.max(150, startWidth + delta));
    applySubjectColWidth();
  };
  const onUp = () => {
    handle.classList.remove("resizing");
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    if (subjectColWidth) localStorage.setItem(SUBJECT_WIDTH_KEY, String(subjectColWidth));
  };
  handle.addEventListener("mousedown", (e) => {
    e.preventDefault();
    handle.classList.add("resizing");
    startX = e.clientX;
    const subjectHeadEl = handle.closest('[data-col="subject"]');
    startWidth = subjectHeadEl?.getBoundingClientRect().width || 260;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
  handle.addEventListener("dblclick", () => {
    subjectColWidth = null;
    localStorage.removeItem(SUBJECT_WIDTH_KEY);
    applySubjectColWidth();
  });
}

/** Selected status ids for the multi-select. Empty = all statuses (no filter). */
let selectedStatusIds = [];
/** Selected priority ids for the multi-select. Empty = all priorities (no filter). */
let selectedPriorityIds = [];
/** Estimate chip: "any" | "has" | "none" */
let estimateFilterMode = "any";
/** Selected author ids for the multi-select. Empty = all authors (no filter). */
let selectedAuthorIds = [];
/** Authors available for the current project filter (from distinct issue authors). */
let filterAuthorsCache = [];
let currentProjectStatusOptions = [];

function getReferenceStatuses() {
  return referenceData?.issue_statuses || referenceData?.issueStatuses || [];
}

function getCurrentProjectIdValue() {
  return projectSelect?.value && projectSelect.value !== "all" ? Number(projectSelect.value) : "all";
}

function getAvailableStatusesForCurrentProject() {
  const all = getReferenceStatuses();
  const currentProjectId = getCurrentProjectIdValue();
  if (!window.ProjectStatusSettings) return all;
  const effective = window.ProjectStatusSettings.getEffectiveStatuses(currentProjectId, all, all);
  return effective.length ? effective : all;
}

function getReferencePriorities() {
  return referenceData?.priorities || [];
}

function isClosedStatus(status) {
  if (!status) return false;
  if (status.is_closed) return true;
  return /закрыт|closed|отклон|reject/i.test(String(status.name || ""));
}

function isClosedForOpenScope(status) {
  return window.IssueStatusFilter?.isClosedForOpenScope?.(status) ?? isClosedStatus(status);
}

function getOpenReferenceStatusIds() {
  return getAvailableStatusesForCurrentProject()
    .filter((s) => !isClosedForOpenScope(s))
    .map((s) => Number(s.id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function getStatusScope() {
  return localStorage.getItem(STATUS_SCOPE_KEY) || "open";
}

function setStatusScope(mode, { persist = true } = {}) {
  const next = mode === "all" ? "all" : "open";
  if (persist) localStorage.setItem(STATUS_SCOPE_KEY, next);
  statusScopeOpenBtn?.classList.toggle("active", next === "open");
  statusScopeAllBtn?.classList.toggle("active", next === "all");
}

function getCheckedStatusIdsFromDom() {
  if (!statusFilterList) return selectedStatusIds.slice();
  return Array.from(statusFilterList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((el) => Number(el.value))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function getEffectiveStatusFilterIds() {
  const all = getAvailableStatusesForCurrentProject().map((s) => Number(s.id)).filter(Boolean);
  const selected = selectedStatusIds.slice();
  if (!selected.length || (all.length && selected.length === all.length)) return null;
  return selected;
}

function updateStatusFilterSummary() {
  if (!statusFilterSummary) return;
  const all = getAvailableStatusesForCurrentProject();
  const selected = selectedStatusIds;
  if (!selected.length || (all.length && selected.length === all.length)) {
    statusFilterSummary.textContent = "Все статусы";
  } else if (selected.length === 1) {
    const match = all.find((s) => Number(s.id) === selected[0]);
    statusFilterSummary.textContent = match?.name || `Статус #${selected[0]}`;
  } else {
    statusFilterSummary.textContent = `Выбрано ${selected.length}`;
  }
  window.FilterChips?.updateStatusSummary?.();
}

function renderStatusFilterList() {
  if (!statusFilterList) return;
  const statuses = getAvailableStatusesForCurrentProject();
  const selected = new Set(selectedStatusIds.map(Number));
  statusFilterList.innerHTML = statuses.length
    ? statuses
        .map((status) => {
          const id = Number(status.id);
          const checked = selected.has(id) ? "checked" : "";
          return `<label class="checklist-item"><input type="checkbox" value="${id}" ${checked} /> ${escapeHtml(status.name || `#${id}`)}</label>`;
        })
        .join("")
    : `<span class="muted">Статусы не загружены</span>`;
  updateStatusFilterSummary();
}

function setSelectedStatusIds(ids, { syncScope = true } = {}) {
  const all = getAvailableStatusesForCurrentProject().map((s) => Number(s.id)).filter(Boolean);
  const unique = Array.from(new Set((ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0)));
  selectedStatusIds = unique;
  if (statusFilterList) {
    statusFilterList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = selectedStatusIds.includes(Number(input.value));
    });
  }
  updateStatusFilterSummary();

  if (syncScope) {
    const openIds = getOpenReferenceStatusIds();
    const isOpenPreset =
      openIds.length > 0 &&
      selectedStatusIds.length === openIds.length &&
      openIds.every((id) => selectedStatusIds.includes(id));
    const isAllPreset = !selectedStatusIds.length || (all.length > 0 && selectedStatusIds.length === all.length);
    if (isOpenPreset) setStatusScope("open");
    else if (isAllPreset) setStatusScope("all");
    else {
      statusScopeOpenBtn?.classList.remove("active");
      statusScopeAllBtn?.classList.remove("active");
    }
  }
}

function applyStatusScopePreset(mode) {
  setStatusScope(mode);
  if (mode === "open") {
    const openIds = getOpenReferenceStatusIds();
    setSelectedStatusIds(openIds.length ? openIds : [], { syncScope: false });
  } else {
    setSelectedStatusIds([], { syncScope: false });
  }
  setStatusScope(mode);
}

function closeStatusFilterPanel() {
  statusFilterPanel?.classList.add("hidden");
  statusFilterTrigger?.setAttribute("aria-expanded", "false");
}

function toggleStatusFilterPanel() {
  if (!statusFilterPanel) return;
  const willOpen = statusFilterPanel.classList.contains("hidden");
  window.FilterChips?.closeAllPopovers?.();
  if (willOpen) {
    statusFilterPanel.classList.remove("hidden");
    statusFilterTrigger?.setAttribute("aria-expanded", "true");
  } else {
    closeStatusFilterPanel();
  }
}

async function refreshCurrentProjectStatusOptions() {
  const all = getReferenceStatuses();
  const projectId = getCurrentProjectIdValue();
  if (!projectId || projectId === "all") {
    currentProjectStatusOptions = all.slice();
  } else {
    try {
      const statuses = await window.desktopApi.getProjectStatuses({ projectId: Number(projectId) });
      currentProjectStatusOptions = Array.isArray(statuses) && statuses.length ? statuses : all.slice();
    } catch {
      currentProjectStatusOptions = all.slice();
    }
  }
  const allowedIds = new Set(getAvailableStatusesForCurrentProject().map((status) => Number(status.id)).filter(Boolean));
  if (selectedStatusIds.length) {
    setSelectedStatusIds(
      selectedStatusIds.filter((id) => allowedIds.has(Number(id))),
      { syncScope: true },
    );
  }
}

function getCheckedPriorityIdsFromDom() {
  if (!priorityFilterList) return selectedPriorityIds.slice();
  return Array.from(priorityFilterList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((el) => Number(el.value))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function getEffectivePriorityFilterIds() {
  const all = getReferencePriorities().map((p) => Number(p.id)).filter(Boolean);
  const selected = selectedPriorityIds.slice();
  if (!selected.length || (all.length && selected.length === all.length)) return null;
  return selected;
}

function updatePriorityFilterSummary() {
  if (!priorityFilterSummary) return;
  const all = getReferencePriorities();
  const selected = selectedPriorityIds;
  if (!selected.length || (all.length && selected.length === all.length)) {
    priorityFilterSummary.textContent = "Все приоритеты";
  } else if (selected.length === 1) {
    const match = all.find((p) => Number(p.id) === selected[0]);
    priorityFilterSummary.textContent = match?.name || `Приоритет #${selected[0]}`;
  } else {
    priorityFilterSummary.textContent = `Выбрано ${selected.length}`;
  }
}

function renderPriorityFilterList() {
  if (!priorityFilterList) return;
  const priorities = getReferencePriorities();
  const selected = new Set(selectedPriorityIds.map(Number));
  priorityFilterList.innerHTML = priorities.length
    ? priorities
        .map((priority) => {
          const id = Number(priority.id);
          const checked = selected.has(id) ? "checked" : "";
          return `<label class="checklist-item"><input type="checkbox" value="${id}" ${checked} /> ${escapeHtml(priority.name || `#${id}`)}</label>`;
        })
        .join("")
    : `<span class="muted">Приоритеты не загружены</span>`;
  updatePriorityFilterSummary();
}

function setSelectedPriorityIds(ids) {
  const unique = Array.from(new Set((ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0)));
  selectedPriorityIds = unique;
  if (priorityFilterList) {
    priorityFilterList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = selectedPriorityIds.includes(Number(input.value));
    });
  }
  updatePriorityFilterSummary();
}

function closePriorityFilterPanel() {
  priorityFilterPanel?.classList.add("hidden");
  priorityFilterTrigger?.setAttribute("aria-expanded", "false");
}

function togglePriorityFilterPanel() {
  if (!priorityFilterPanel) return;
  const willOpen = priorityFilterPanel.classList.contains("hidden");
  window.FilterChips?.closeAllPopovers?.();
  if (willOpen) {
    priorityFilterPanel.classList.remove("hidden");
    priorityFilterTrigger?.setAttribute("aria-expanded", "true");
  } else {
    closePriorityFilterPanel();
  }
}

function getCheckedAuthorIdsFromDom() {
  if (!authorFilterList) return selectedAuthorIds.slice();
  return Array.from(authorFilterList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((el) => Number(el.value))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function getEffectiveAuthorFilterIds() {
  const all = filterAuthorsCache.map((a) => Number(a.id)).filter(Boolean);
  const selected = selectedAuthorIds.slice();
  if (!selected.length || (all.length && selected.length === all.length)) return null;
  return selected;
}

function updateAuthorFilterSummary() {
  if (!authorFilterSummary) return;
  const all = filterAuthorsCache;
  const selected = selectedAuthorIds;
  if (!selected.length || (all.length && selected.length === all.length)) {
    authorFilterSummary.textContent = "Все авторы";
  } else if (selected.length === 1) {
    const match = all.find((a) => Number(a.id) === selected[0]);
    authorFilterSummary.textContent = match?.name || `Автор #${selected[0]}`;
  } else {
    authorFilterSummary.textContent = `Выбрано ${selected.length}`;
  }
}

function renderAuthorFilterList() {
  if (!authorFilterList) return;
  const authors = filterAuthorsCache;
  const selected = new Set(selectedAuthorIds.map(Number));
  authorFilterList.innerHTML = authors.length
    ? authors
        .map((author) => {
          const id = Number(author.id);
          const checked = selected.has(id) ? "checked" : "";
          return `<label class="checklist-item"><input type="checkbox" value="${id}" ${checked} /> ${escapeHtml(author.name || `#${id}`)}</label>`;
        })
        .join("")
    : `<span class="muted">Авторы не загружены</span>`;
  updateAuthorFilterSummary();
}

function setSelectedAuthorIds(ids) {
  const unique = Array.from(new Set((ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0)));
  selectedAuthorIds = unique;
  if (authorFilterList) {
    authorFilterList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = selectedAuthorIds.includes(Number(input.value));
    });
  }
  updateAuthorFilterSummary();
}

function closeAuthorFilterPanel() {
  authorFilterPanel?.classList.add("hidden");
  authorFilterTrigger?.setAttribute("aria-expanded", "false");
}

function toggleAuthorFilterPanel() {
  if (!authorFilterPanel) return;
  const willOpen = authorFilterPanel.classList.contains("hidden");
  window.FilterChips?.closeAllPopovers?.();
  if (willOpen) {
    authorFilterPanel.classList.remove("hidden");
    authorFilterTrigger?.setAttribute("aria-expanded", "true");
  } else {
    closeAuthorFilterPanel();
  }
}

let statusClearTimer = null;

function setStatus(message, type = "info") {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.className = `status ${type}`;
  if (statusClearTimer) {
    clearTimeout(statusClearTimer);
    statusClearTimer = null;
  }
  const text = String(message || "").trim();
  if (!text) return;
  // Errors and notices shouldn't stick forever in the footer.
  statusClearTimer = setTimeout(() => {
    if (!statusText) return;
    if (statusText.textContent !== message) return;
    statusText.textContent = "Готово.";
    statusText.className = "status ok";
    statusClearTimer = null;
  }, 30000);
}

function setConnectionFeedback(message, isOk) {
  setStatus(message, isOk ? "ok" : "error");
  updateConnectionStatusChip(Boolean(isOk));
  const formEl = document.getElementById("connection-form");
  if (!formEl) return;
  let feedback = document.getElementById("connection-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "connection-feedback";
    feedback.style.marginTop = "8px";
    feedback.style.fontSize = "12px";
    formEl.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.color = isOk ? "var(--accent)" : "var(--danger)";
}

function updateConnectionStatusChip(isOk) {
  const statusChip =
    document.getElementById("connection-status-chip") ||
    document.querySelector("#connection-card .connection-status");
  if (!statusChip) return;
  statusChip.classList.toggle("connected", Boolean(isOk));
  const dot = statusChip.querySelector(".dot");
  const label =
    statusChip.querySelector(".connection-status-label") ||
    statusChip.childNodes[statusChip.childNodes.length - 1];
  if (dot) dot.style.background = isOk ? "var(--accent)" : "";
  if (label) label.textContent = isOk ? "Подключено" : "Не подключено";
}

function refreshConnectionStatusFromState() {
  const hasCreds = Boolean(currentSettings?.redmineUrl && currentSettings?.apiKey);
  updateConnectionStatusChip(hasCreds && networkOnline);
}

function formatBytes(bytes) {
  if (!bytes) return "0 Б";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatHours(value) {
  if (value === null || value === undefined || value === "") return "-";
  return `${Number(value).toFixed(1)} ч`;
}

function autoGrowTextarea(el, { maxPx } = {}) {
  if (!el) return;
  el.style.height = "auto";
  const cap = Number(maxPx) > 0 ? Number(maxPx) : null;
  const next = cap ? Math.min(el.scrollHeight, cap) : el.scrollHeight;
  el.style.height = `${next}px`;
}

/** Native confirm via main process — avoids Electron/Windows focus bug after window.confirm(). */
async function confirmAction(message, options = {}) {
  const text = String(message || "");
  if (window.desktopApi?.confirm) {
    return window.desktopApi.confirm({
      title: options.title || "RM Client",
      message: text,
      detail: options.detail || undefined,
      type: options.type || "question",
      buttons: options.buttons,
      confirmId: options.confirmId,
      cancelId: options.cancelId,
      defaultId: options.defaultId,
    });
  }
  const fallback = options.detail ? `${text}\n\n${options.detail}` : text;
  return window.confirm(fallback);
}

async function refreshCustomerNameSuggestions() {
  const list = document.getElementById("customer-name-suggestions");
  if (!list || !window.desktopApi?.getCustomerNames) return;
  try {
    const names = await window.desktopApi.getCustomerNames();
    list.innerHTML = (Array.isArray(names) ? names : [])
      .map((row) => {
        const name = String(row?.name || "").trim();
        if (!name) return "";
        return `<option value="${escapeHtml(name)}"></option>`;
      })
      .filter(Boolean)
      .join("");
  } catch {
    /* ignore suggestion refresh errors */
  }
}

function getIssueScope() {
  return currentIssueScope || "mine";
}

const FAVORITE_ISSUE_IDS_KEY = "redmine-client:favorite-issue-ids";

function getFavoriteIssueIds() {
  try {
    const raw = localStorage.getItem(FAVORITE_ISSUE_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(Number).filter((id) => Number.isFinite(id) && id > 0);
  } catch {
    return [];
  }
}

function saveFavoriteIssueIds(ids) {
  const unique = [];
  const seen = new Set();
  (Array.isArray(ids) ? ids : []).forEach((raw) => {
    const id = Number(raw);
    if (!Number.isFinite(id) || id <= 0 || seen.has(id)) return;
    seen.add(id);
    unique.push(id);
  });
  try {
    localStorage.setItem(FAVORITE_ISSUE_IDS_KEY, JSON.stringify(unique));
  } catch {
    /* ignore quota / private mode */
  }
  window.desktopApi?.setFavoriteIssueIds?.(unique).catch(() => {});
  return unique;
}

function isFavoriteIssue(issueId) {
  const id = Number(issueId);
  return Number.isFinite(id) && getFavoriteIssueIds().includes(id);
}

function toggleFavoriteIssue(issueId) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || id <= 0) return false;
  const ids = getFavoriteIssueIds();
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(id);
  saveFavoriteIssueIds(ids);
  return idx < 0;
}

/** Remembers assignee while scope «Мои» locks the filter to «Я». */
let assigneeBeforeMineLock = null;
let assigneeChipVisibleBeforeMineLock = false;
/** Snapshot list filters before entering «Избранные». */
let filtersBeforeFavorites = null;
let currentIssueCustomFieldRows = [];

function captureFiltersSnapshot() {
  return {
    projectId: projectSelect?.value || "all",
    statusIds: getEffectiveStatusFilterIds(),
    priorityIds: getEffectivePriorityFilterIds(),
    assigneeId: assigneeSelect?.value || "all",
    authorIds: getEffectiveAuthorFilterIds(),
    searchQuery: searchInput?.value || "",
    dueFrom: dueFromInput?.value || "",
    dueTo: dueToInput?.value || "",
    dueEmptyOnly: Boolean(dueEmptyOnlyCheckbox?.checked),
    estimateMode: estimateFilterMode,
    chipVisibility: {
      status: isFilterChipVisible("status-chip"),
      priority: isFilterChipVisible("priority-chip"),
      due: isFilterChipVisible("due-chip"),
      assignee: isFilterChipVisible("assignee-chip"),
      author: isFilterChipVisible("author-chip"),
      estimate: isFilterChipVisible("estimate-chip"),
    },
  };
}

function applyNeutralFiltersForFavorites() {
  if (projectSelect) projectSelect.value = "all";
  applyStatusScopePreset("open");
  if (Array.from(assigneeSelect?.options || []).some((o) => o.value === "all")) {
    assigneeSelect.value = "all";
  }
  if (searchInput) searchInput.value = "";
  if (dueFromInput) dueFromInput.value = "";
  if (dueToInput) dueToInput.value = "";
  if (dueEmptyOnlyCheckbox) dueEmptyOnlyCheckbox.checked = false;
  window.FilterChips?.setChipVisible?.("status-chip", false);
  window.FilterChips?.setChipVisible?.("priority-chip", false);
  window.FilterChips?.setChipVisible?.("due-chip", false);
  window.FilterChips?.setChipVisible?.("assignee-chip", false);
  window.FilterChips?.setChipVisible?.("author-chip", false);
  window.FilterChips?.setChipVisible?.("estimate-chip", false);
  window.FilterChips?.setDueMode?.("period", true);
  setSelectedPriorityIds([]);
  setSelectedAuthorIds([]);
  estimateFilterMode = "any";
  document.querySelectorAll('input[name="estimate-filter-mode"]').forEach((radio) => {
    radio.checked = radio.value === "any";
  });
  updateEstimateChipSummary();
  syncDueFilterUi();
  syncFavoritesFilterUi();
}

function restoreFiltersFromSnapshot(snapshot) {
  if (!snapshot) return;
  if (projectSelect && Array.from(projectSelect.options).some((o) => o.value === snapshot.projectId)) {
    projectSelect.value = snapshot.projectId;
  }
  setSelectedPriorityIds(snapshot.priorityIds || []);
  setSelectedAuthorIds(snapshot.authorIds || []);
  estimateFilterMode = snapshot.estimateMode || "any";
  document.querySelectorAll('input[name="estimate-filter-mode"]').forEach((radio) => {
    radio.checked = radio.value === estimateFilterMode;
  });
  updateEstimateChipSummary();
  if (searchInput) searchInput.value = snapshot.searchQuery || "";
  if (dueFromInput) dueFromInput.value = snapshot.dueFrom || "";
  if (dueToInput) dueToInput.value = snapshot.dueTo || "";
  if (dueEmptyOnlyCheckbox) dueEmptyOnlyCheckbox.checked = Boolean(snapshot.dueEmptyOnly);
  const chips = snapshot.chipVisibility || {};
  window.FilterChips?.setChipVisible?.("status-chip", Boolean(chips.status));
  window.FilterChips?.setChipVisible?.("priority-chip", Boolean(chips.priority));
  window.FilterChips?.setChipVisible?.("due-chip", Boolean(chips.due));
  window.FilterChips?.setChipVisible?.("assignee-chip", Boolean(chips.assignee));
  window.FilterChips?.setChipVisible?.("author-chip", Boolean(chips.author));
  window.FilterChips?.setChipVisible?.("estimate-chip", Boolean(chips.estimate));
  if (assigneeSelect && Array.from(assigneeSelect.options).some((o) => o.value === snapshot.assigneeId)) {
    assigneeSelect.value = snapshot.assigneeId;
  }
  syncDueFilterUi();
  syncFavoritesFilterUi();
}

function syncFavoritesFilterUi() {
  const favorites = getIssueScope() === "favorites";
  issuesView?.classList.toggle("favorites-scope", favorites);
  document.querySelector(".filter-chips-row")?.classList.toggle("hidden", favorites);
}

function updateIssueFavoriteButton(issueId) {
  if (!issueFavoriteButton) return;
  const on = isFavoriteIssue(issueId);
  issueFavoriteButton.textContent = on ? "★" : "☆";
  issueFavoriteButton.classList.toggle("is-on", on);
  issueFavoriteButton.title = on ? "Убрать из избранного" : "Добавить в избранное";
  issueFavoriteButton.setAttribute("aria-pressed", on ? "true" : "false");
}

async function loadIssueCustomFieldDefs(issue) {
  const projectId = issue?.project?.id;
  const trackerId = issue?.tracker?.id;
  if (!projectId || !trackerId) {
    return window.CustomFieldForm?.defsFromIssueValues?.(issue.custom_fields || []) || [];
  }
  let defs = [];
  try {
    const payload = getFormValues();
    defs =
      (await window.desktopApi.getIssueFormFields({
        redmineUrl: payload.redmineUrl,
        apiKey: payload.apiKey,
        projectId,
        trackerId,
      })) || [];
  } catch (error) {
    console.warn("getIssueFormFields failed:", error.message);
  }
  if (!defs.length) {
    defs = window.CustomFieldForm?.defsFromIssueValues?.(issue.custom_fields || []) || [];
  }
  return defs;
}

function issueCustomFieldRowsForDisplay(issue) {
  const estimateCf = findEstimateCustomField(issue);
  return currentIssueCustomFieldRows.filter((row) => Number(row.id) !== Number(estimateCf?.id));
}

function updateIssueCustomFieldsEdit(rows) {
  const cfEditEl = document.getElementById("issue-custom-fields-edit");
  if (!cfEditEl) return;
  cfEditEl.innerHTML = rows.length
    ? window.CustomFieldForm?.renderCustomFieldsEditHtml?.(rows) || ""
    : "";
}

function isFilterChipVisible(chipId) {
  if (window.FilterChips?.isChipVisible) return window.FilterChips.isChipVisible(chipId);
  const chip = document.getElementById(chipId);
  return !!(chip && !chip.classList.contains("chip-hidden"));
}

function rememberAssigneeFilterBeforeMine() {
  const chip = document.getElementById("assignee-chip");
  const locked = Boolean(chip?.classList.contains("filter-chip-locked"));
  assigneeChipVisibleBeforeMineLock = isFilterChipVisible("assignee-chip") && !locked;
  const current = assigneeSelect?.value || "all";
  assigneeBeforeMineLock = current === "me" && !assigneeChipVisibleBeforeMineLock ? "all" : current;
}

function restoreAssigneeFilterAfterMine() {
  if (!assigneeSelect) return;
  const restore = assigneeBeforeMineLock != null ? assigneeBeforeMineLock : "all";
  if (Array.from(assigneeSelect.options).some((o) => o.value === restore)) {
    assigneeSelect.value = restore;
  } else if (Array.from(assigneeSelect.options).some((o) => o.value === "all")) {
    assigneeSelect.value = "all";
  }
  window.FilterChips?.setChipVisible?.("assignee-chip", Boolean(assigneeChipVisibleBeforeMineLock));
}

function syncAssigneeFilterForScope({ leavingMine = false } = {}) {
  if (!assigneeSelect) return;
  const mine = getIssueScope() === "mine";

  if (mine) {
    if (!Array.from(assigneeSelect.options).some((o) => o.value === "me")) {
      const meOption = document.createElement("option");
      meOption.value = "me";
      meOption.textContent = "Я (текущий ключ API)";
      assigneeSelect.insertBefore(meOption, assigneeSelect.firstChild);
    }
    assigneeSelect.value = "me";
    assigneeSelect.disabled = true;
    assigneeSelect.title = "В режиме «Мои» исполнитель зафиксирован";
  } else {
    assigneeSelect.disabled = false;
    assigneeSelect.title = "";
    if (leavingMine) restoreAssigneeFilterAfterMine();
  }

  window.FilterChips?.updateAssigneeLock?.();
  if (!mine && leavingMine) {
    window.FilterChips?.setChipVisible?.("assignee-chip", Boolean(assigneeChipVisibleBeforeMineLock));
  }
  window.FilterChips?.syncAssigneeChipLabel?.();
}

function syncProjectFilterForScope() {
  if (!projectSelect) return;
  const favorites = getIssueScope() === "favorites";
  projectSelect.disabled = favorites;
  projectSelect.title = favorites
    ? "В «Избранных» показываются задачи из всех проектов"
    : "";
}

function setIssueScope(scope, { persist = true } = {}) {
  const next = ["mine", "authored", "watched", "favorites", "all"].includes(scope) ? scope : "mine";
  const prev = currentIssueScope;
  if (next === "favorites" && prev !== "favorites") {
    filtersBeforeFavorites = captureFiltersSnapshot();
    applyNeutralFiltersForFavorites();
  } else if (prev === "favorites" && next !== "favorites") {
    restoreFiltersFromSnapshot(filtersBeforeFavorites);
    filtersBeforeFavorites = null;
  }
  if (next === "mine" && prev !== "mine") {
    rememberAssigneeFilterBeforeMine();
  }
  currentIssueScope = next;
  issueScopeToggle?.querySelectorAll("[data-issue-scope]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-issue-scope") === next);
  });
  syncAssigneeFilterForScope({ leavingMine: prev === "mine" && next !== "mine" });
  syncProjectFilterForScope();
  syncFavoritesFilterUi();
  if (persist) persistUiState().catch(() => {});
}

function getFormValues() {
  const scope = getIssueScope();
  if (scope === "favorites") {
    return {
      redmineUrl: currentSettings?.redmineUrl || "",
      apiKey: currentSettings?.apiKey || "",
      filters: {
        selectedProjectId: "all",
        selectedStatusId: "all",
        selectedStatusIds: [],
        selectedPriorityIds: [],
        selectedAssigneeId: "all",
        selectedAuthorIds: [],
        searchQuery: searchInput?.value.trim() || "",
        issueScope: scope,
        favoriteIds: getFavoriteIssueIds(),
        dueFrom: "",
        dueTo: "",
        dueEmptyOnly: false,
        estimateMode: "any",
        favoritesBare: true,
      },
    };
  }
  const mine = scope === "mine";
  const dueActive = isFilterChipVisible("due-chip");
  const assigneeActive = mine || isFilterChipVisible("assignee-chip");
  const emptyOnly = dueActive && Boolean(dueEmptyOnlyCheckbox?.checked);

  return {
    redmineUrl: currentSettings?.redmineUrl || "",
    apiKey: currentSettings?.apiKey || "",
    filters: {
      selectedProjectId: projectSelect?.value || "all",
      selectedStatusId: "all",
      selectedStatusIds: getEffectiveStatusFilterIds(),
      selectedPriorityIds: getEffectivePriorityFilterIds(),
      selectedAssigneeId: mine ? "me" : assigneeActive ? assigneeSelect?.value || "all" : "all",
      selectedAuthorIds: getEffectiveAuthorFilterIds(),
      searchQuery: searchInput?.value.trim() || "",
      searchDeep: false,
      issueScope: scope,
      favoriteIds: scope === "favorites" ? getFavoriteIssueIds() : [],
      dueFrom: emptyOnly || !dueActive ? "" : dueFromInput?.value || "",
      dueTo: emptyOnly || !dueActive ? "" : dueToInput?.value || "",
      dueEmptyOnly: emptyOnly,
      estimateMode: isFilterChipVisible("estimate-chip") ? estimateFilterMode : "any",
    },
  };
}

function getBoardPayload() {
  return {
    redmineUrl: currentSettings?.redmineUrl || "",
    apiKey: currentSettings?.apiKey || "",
    filters: {
      selectedProjectId: projectSelect?.value || "all",
    },
  };
}

function syncDueFilterUi() {
  const emptyOnly = Boolean(dueEmptyOnlyCheckbox?.checked);
  if (window.FilterChips?.setDueMode) {
    window.FilterChips.setDueMode(emptyOnly ? "empty" : "period", true);
  } else {
    dueFilterField?.classList.toggle("is-due-empty-mode", emptyOnly);
    if (dueFromInput) dueFromInput.disabled = emptyOnly;
    if (dueToInput) dueToInput.disabled = emptyOnly;
  }
  window.FilterChips?.updateDueSummary?.();
}

function captureInlineTimeDraftFromDom() {
  if (listInlinePopoverKind !== "time" || !listInlinePopoverIssueId) return;
  const issueId = Number(listInlinePopoverIssueId);
  if (!Number.isFinite(issueId)) return;
  const comments = String(document.getElementById("inline-time-comment")?.value || "");
  const hours = String(document.getElementById("inline-time-hours")?.value || "");
  const customer = String(document.getElementById("inline-time-customer")?.value || "");
  const activityId = String(document.getElementById("inline-time-activity")?.value || "");
  const spentOn = String(document.getElementById("inline-time-date")?.value || "");
  const showDate = !document.getElementById("inline-time-date-row")?.classList.contains("hidden");
  const hasContent = Boolean(
    comments.trim() || hours.trim() || customer.trim() || (showDate && spentOn && spentOn !== todayIsoDate()),
  );
  if (!hasContent) {
    inlineTimeDraftsByIssueId.delete(issueId);
    return;
  }
  inlineTimeDraftsByIssueId.set(issueId, {
    comments,
    hours,
    customer,
    activityId,
    spentOn,
    showDate,
  });
}

function clearInlineTimeDraft(issueId) {
  const id = Number(issueId);
  if (Number.isFinite(id)) inlineTimeDraftsByIssueId.delete(id);
}

function closeListInlinePopover({ discardTimeDraft = false } = {}) {
  if (listInlinePopoverKind === "time" && listInlinePopoverIssueId) {
    if (discardTimeDraft) clearInlineTimeDraft(listInlinePopoverIssueId);
    else captureInlineTimeDraftFromDom();
  }
  listInlinePopover?.classList.remove("is-time");
  listInlinePopover?.classList.add("hidden");
  if (listInlinePopoverBody) listInlinePopoverBody.innerHTML = "";
  listInlinePopoverIssueId = null;
  listInlinePopoverKind = null;
  listInlinePointerDownInside = false;
}

function positionListInlinePopover(anchorEl) {
  if (!listInlinePopover || !anchorEl) return;
  listInlinePopover.classList.remove("hidden");
  const rect = anchorEl.getBoundingClientRect();
  const pad = 8;
  const width = listInlinePopover.offsetWidth || 220;
  const maxH = Math.max(160, window.innerHeight - pad * 2);
  listInlinePopover.style.maxHeight = `${maxH}px`;
  const height = Math.min(listInlinePopover.offsetHeight || 120, maxH);
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - width - pad);
  if (top + height > window.innerHeight - pad) {
    const above = rect.top - height - 6;
    top = above >= pad ? above : pad;
  }
  listInlinePopover.style.left = `${Math.max(pad, left)}px`;
  listInlinePopover.style.top = `${Math.max(pad, top)}px`;
}

async function patchIssueFields(issueId, patch, { successMessage } = {}) {
  const snapshot = applyOptimisticIssuePatch(issueId, patch);
  if (snapshot) renderIssuesList();
  const navGen = issueNavGeneration;

  try {
    const payload = getFormValues();
    const result = await window.desktopApi.updateIssue({ ...payload, issueId, patch });
    const toastText = result.offline
      ? "Сохранено локально — отправится при появлении сети"
      : successMessage || "Изменение сохранено";
    showAppToast(toastText, result.offline ? "info" : "success");

    // Подтянуть свежие данные из локальной БД (уже обновлена в main), без «Готово».
    await loadIssues(false, { quiet: true });

    const pageVisible = issuePage && !issuePage.classList.contains("hidden");
    const canReopen = window.IssueNav?.shouldContinueIssueOpen?.({
      navGeneration: issueNavGeneration,
      expectedGeneration: navGen,
      selectedIssueId,
      issueId,
      issuePageVisible: pageVisible,
      previewMode: issuePreviewMode,
    });
    if (canReopen) {
      await openIssueDetails(issueId);
    }
    return result;
  } catch (error) {
    if (snapshot) {
      const idx = loadedIssues.findIndex((issue) => Number(issue.id) === Number(issueId));
      if (idx >= 0) {
        loadedIssues[idx] = snapshot;
        renderIssuesList();
      }
    }
    showAppToast(error.message || "Не удалось сохранить изменение", "error");
    throw error;
  }
}

function applyOptimisticIssuePatch(issueId, patch) {
  const hasListField =
    patch.status_id !== undefined || Object.prototype.hasOwnProperty.call(patch, "due_date");
  if (!hasListField) return null;

  const idx = loadedIssues.findIndex((issue) => Number(issue.id) === Number(issueId));
  if (idx < 0) return null;

  const previous = {
    ...loadedIssues[idx],
    status: loadedIssues[idx].status ? { ...loadedIssues[idx].status } : null,
  };
  const next = {
    ...loadedIssues[idx],
    status: loadedIssues[idx].status ? { ...loadedIssues[idx].status } : null,
  };

  if (patch.status_id !== undefined && patch.status_id !== "") {
    const statuses = referenceData?.issue_statuses || referenceData?.issueStatuses || [];
    const matched = statuses.find((status) => String(status.id) === String(patch.status_id));
    next.status = {
      id: Number(patch.status_id),
      name: matched?.name || next.status?.name || `#${patch.status_id}`,
      is_closed: Boolean(matched?.is_closed),
    };
  }

  if (Object.prototype.hasOwnProperty.call(patch, "due_date")) {
    next.due_date = patch.due_date || null;
  }

  loadedIssues[idx] = next;
  return previous;
}

async function applyBulkStatusChange(issueIds, statusId) {
  const payload = getFormValues();
  issueIds.forEach((id) => applyOptimisticIssuePatch(id, { status_id: statusId }));
  renderIssuesList();
  let successCount = 0;
  for (const id of issueIds) {
    try {
      await window.desktopApi.updateIssue({ ...payload, issueId: id, patch: { status_id: statusId } });
      successCount += 1;
    } catch (error) {
      showAppToast(`Задача #${id}: ${error.message}`, "error");
    }
  }
  showAppToast(
    `Статус изменён у ${successCount} из ${issueIds.length} задач — применяется в фоне`,
    "info",
  );
  selectedIssueIds.clear();
  syncSelectedRowsVisual();
  await loadIssues(false, { quiet: true });
}

function askCloseWithSubtasks(childCount) {
  return new Promise((resolve) => {
    const modal = document.getElementById("close-with-subtasks-modal");
    const textEl = document.getElementById("close-with-subtasks-text");
    const confirmBtn = document.getElementById("close-with-subtasks-confirm-btn");
    const cancelBtn = document.getElementById("close-with-subtasks-cancel-btn");
    if (textEl) {
      textEl.textContent = `У задачи есть незакрытые подзадачи (${childCount} шт.). Закрыть их тоже вместе с этой задачей?`;
    }
    modal?.classList.remove("hidden");
    const cleanup = () => {
      confirmBtn?.removeEventListener("click", onConfirm);
      cancelBtn?.removeEventListener("click", onCancel);
      modal?.classList.add("hidden");
    };
    const onConfirm = () => {
      cleanup();
      resolve(true);
    };
    const onCancel = () => {
      cleanup();
      resolve(false);
    };
    confirmBtn?.addEventListener("click", onConfirm);
    cancelBtn?.addEventListener("click", onCancel);
  });
}

async function checkOpenChildrenBeforeClose(issueId, statusId) {
  const statuses = referenceData?.issue_statuses || referenceData?.issueStatuses || [];
  const statusMeta = statuses.find((s) => Number(s.id) === Number(statusId));
  if (!statusMeta?.is_closed) return { proceed: true, extraIds: [] };

  const current =
    loadedIssues.find((i) => Number(i.id) === Number(issueId)) ||
    (currentIssue && Number(currentIssue.id) === Number(issueId) ? currentIssue : null);
  if (current && Number(current.status?.id) === Number(statusId)) {
    return { proceed: true, extraIds: [] };
  }

  let openChildren = [];
  try {
    openChildren = (await window.desktopApi.getOpenChildren([Number(issueId)])) || [];
  } catch (error) {
    openChildren = [];
  }
  if (!openChildren.length) return { proceed: true, extraIds: [] };
  const childIds = openChildren.map((c) => Number(c.id));
  const confirmed = await askCloseWithSubtasks(childIds.length);
  if (!confirmed) return { proceed: false, extraIds: [] };
  return { proceed: true, extraIds: childIds };
}

let appToastTimer = null;
let appToastActionHandler = null;

function hideAppToast() {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  if (appToastTimer) {
    clearTimeout(appToastTimer);
    appToastTimer = null;
  }
  toast.classList.remove("is-visible");
  setTimeout(() => {
    if (!toast.classList.contains("is-visible")) toast.classList.add("hidden");
  }, 200);
}

function showAppToast(message, type = "success", options = {}) {
  const toast = document.getElementById("app-toast");
  const textEl = document.getElementById("app-toast-text");
  const actionBtn = document.getElementById("app-toast-action");
  const spinner = document.getElementById("app-toast-spinner");
  if (!toast || !message) return;
  if (textEl) textEl.textContent = message;
  else toast.textContent = message;

  const kind = type === "error" ? "error" : type === "loading" ? "loading" : type === "info" ? "info" : "success";
  const hasAction = Boolean(options.actionLabel && typeof options.onAction === "function");
  const sticky = Boolean(options.sticky) || kind === "loading";
  toast.className = `app-toast is-visible is-${kind}${hasAction ? " has-action" : ""}`;
  toast.classList.remove("hidden");

  if (spinner) spinner.classList.toggle("hidden", kind !== "loading");

  if (actionBtn) {
    if (hasAction) {
      actionBtn.textContent = options.actionLabel;
      actionBtn.classList.remove("hidden");
      appToastActionHandler = options.onAction;
    } else {
      actionBtn.classList.add("hidden");
      actionBtn.textContent = "";
      appToastActionHandler = null;
    }
  }

  if (appToastTimer) clearTimeout(appToastTimer);
  appToastTimer = null;
  if (sticky) return;
  const ttl = hasAction ? Number(options.durationMs) || 12000 : Number(options.durationMs) || 2200;
  appToastTimer = setTimeout(() => hideAppToast(), ttl);
}

document.getElementById("app-toast-action")?.addEventListener("click", async () => {
  const handler = appToastActionHandler;
  appToastActionHandler = null;
  hideAppToast();
  document.getElementById("app-toast-action")?.classList.add("hidden");
  if (typeof handler === "function") {
    try {
      await handler();
    } catch (error) {
      setStatus(error.message || "Действие не выполнено", "error");
    }
  }
});

const {
  escapeHtml,
  textileToHtml,
  sanitizeRedmineHtml,
} = window.TextFormat;

function formatDateRu(value) {
  if (!value) return "не задано";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    const [y, m, dd] = String(value).split("-");
    return `${dd}.${m}.${y}`;
  }
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("ru-RU");
  }
  return String(value);
}

function formatDateTimeRu(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildLookupMap(items, key = "id", label = "name") {
  const map = {};
  (items || []).forEach((item) => {
    if (item && item[key] !== undefined && item[key] !== null) {
      map[String(item[key])] = item[label] || String(item[key]);
    }
  });
  return map;
}

function humanizeJournalDetail(detail, lookups) {
  const property = String(detail.property || "").toLowerCase();
  const fieldName = String(detail.name || "");

  if (property === "attachment") {
    const filename = detail.new_value || detail.old_value || "файл";
    if (detail.old_value && (detail.new_value === "" || detail.new_value == null)) {
      return `Файл удалён: ${filename}`;
    }
    return `Файл добавлен: ${filename}`;
  }

  if (fieldName === "description") {
    return "Описание изменено";
  }

  const fieldLabels = {
    status_id: "Статус",
    assigned_to_id: "Исполнитель",
    assigned_to: "Исполнитель",
    priority_id: "Приоритет",
    tracker_id: "Трекер",
    done_ratio: "% готовности",
    start_date: "Дата начала",
    due_date: "Срок",
    estimated_hours: "Оценка",
    subject: "Тема",
    description: "Описание",
  };
  const name = fieldLabels[fieldName] || fieldName || detail.property || "Поле";
  let oldVal = detail.old_value;
  let newVal = detail.new_value;

  if (fieldName === "status_id") {
    oldVal = lookups.statuses[oldVal] || oldVal || "не задано";
    newVal = lookups.statuses[newVal] || newVal || "не задано";
  } else if (fieldName === "assigned_to_id" || fieldName === "assigned_to") {
    oldVal = resolveJournalUserLabel(oldVal, lookups.users);
    newVal = resolveJournalUserLabel(newVal, lookups.users);
  } else if (fieldName === "priority_id") {
    oldVal = lookups.priorities[oldVal] || oldVal || "не задано";
    newVal = lookups.priorities[newVal] || newVal || "не задано";
  } else if (fieldName === "tracker_id") {
    oldVal = lookups.trackers[oldVal] || oldVal || "не задано";
    newVal = lookups.trackers[newVal] || newVal || "не задано";
  } else if (fieldName === "done_ratio") {
    oldVal = oldVal === "" || oldVal == null ? "0%" : `${oldVal}%`;
    newVal = newVal === "" || newVal == null ? "0%" : `${newVal}%`;
  } else if (fieldName === "start_date" || fieldName === "due_date") {
    oldVal = formatDateRu(oldVal);
    newVal = formatDateRu(newVal);
  } else if (/^cf_/i.test(fieldName)) {
    const label = fieldName.replace(/^cf_/i, "Доп. поле #");
    return `${label}: ${oldVal ?? "—"} → ${newVal ?? "—"}`;
  }

  const oldText = oldVal === "" || oldVal == null ? "—" : oldVal;
  const newText = newVal === "" || newVal == null ? "—" : newVal;
  return `${name}: ${oldText} → ${newText}`;
}

function resolveJournalUserLabel(value, usersLookup) {
  if (value === "" || value == null) return "не назначен";
  const key = String(value);
  return usersLookup?.[key] || usersLookup?.[Number(key)] || key;
}

async function buildJournalLookups(issue, journals) {
  const users = { ...buildLookupMap(referenceData?.users) };
  const addUser = (id, name) => {
    if (id == null || id === "" || !name) return;
    users[String(id)] = name;
  };

  addUser(issue?.assigned_to?.id, issue?.assigned_to?.name);
  addUser(issue?.author?.id, issue?.author?.name);
  (issue?.watchers || []).forEach((w) => addUser(w.id, w.name));
  (journals || []).forEach((journal) => addUser(journal.user?.id, journal.user?.name));
  (loadedIssues || []).forEach((item) => {
    addUser(item.assigned_to?.id, item.assigned_to?.name);
    addUser(item.author?.id, item.author?.name);
  });

  try {
    const projectIds = issue?.project?.id ? [Number(issue.project.id)] : null;
    const [assignees, authors] = await Promise.all([
      window.desktopApi.getAssignees({ projectIds }),
      window.desktopApi.getAuthors({ projectIds }),
    ]);
    (assignees || []).forEach((user) => addUser(user.id, user.name));
    (authors || []).forEach((user) => addUser(user.id, user.name));
  } catch {
    // lookup enrichment is best-effort
  }

  return {
    statuses: buildLookupMap(referenceData?.issue_statuses || referenceData?.issueStatuses),
    users,
    priorities: buildLookupMap(referenceData?.priorities),
    trackers: buildLookupMap(referenceData?.trackers),
  };
}

function journalHasNotes(journal) {
  return Boolean(String(journal?.notes || "").trim());
}

function journalHasDetails(journal) {
  return Array.isArray(journal?.details) && journal.details.length > 0;
}

function formatJournalWhen(createdOn) {
  if (!createdOn) return "";
  try {
    return new Date(createdOn).toLocaleString("ru-RU");
  } catch {
    return String(createdOn);
  }
}

function renderCommentJournalItem(journal, lookups, attachmentsMap) {
  let body = textileToHtml(journal.notes || "");
  if (window.renderTextileImages) body = window.renderTextileImages(body, attachmentsMap);
  return `
    <div class="journal-item journal-item-comment">
      <div class="journal-head">
        <strong>${escapeHtml(journal.user?.name || "Пользователь")}</strong>
        <span class="journal-when">${escapeHtml(formatJournalWhen(journal.created_on))}</span>
      </div>
      <div class="journal-body">${body}</div>
    </div>`;
}

function renderHistoryJournalItem(journal, lookups) {
  const lines = (journal.details || [])
    .map((d) => humanizeJournalDetail(d, lookups))
    .filter(Boolean);
  if (!lines.length) return "";
  return `
    <div class="journal-item journal-item-history">
      <div class="journal-head">
        <strong>${escapeHtml(journal.user?.name || "Пользователь")}</strong>
        <span class="journal-when">${escapeHtml(formatJournalWhen(journal.created_on))}</span>
      </div>
      <ul class="journal-change-list">
        ${lines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
      </ul>
    </div>`;
}

function orderJournals(journals) {
  const list = Array.isArray(journals) ? [...journals] : [];
  return journalSortOrder === "desc" ? list.reverse() : list;
}

function renderJournalsList(journals) {
  const list = Array.isArray(journals) ? journals : [];
  const ordered = orderJournals(list);
  const lookups = currentIssueJournalLookups || {};
  const attachmentsMap = currentIssueAttachmentsMap || {};

  if (issueJournalsComments) {
    const comments = ordered.filter(journalHasNotes);
    issueJournalsComments.innerHTML = comments.length
      ? comments.map((j) => renderCommentJournalItem(j, lookups, attachmentsMap)).join("")
      : `<span class="muted">Комментариев пока нет.</span>`;
    issueJournalsComments.classList.toggle("muted", !comments.length);
    hydrateInlineShotPreviews(issueJournalsComments, attachmentsMap, getFormValues());
  }

  if (issueJournalsHistory) {
    const history = ordered.filter(journalHasDetails);
    const html = history.map((j) => renderHistoryJournalItem(j, lookups)).filter(Boolean).join("");
    issueJournalsHistory.innerHTML = html || `<span class="muted">Изменений свойств пока нет.</span>`;
    issueJournalsHistory.classList.toggle("muted", !html);
  }
}

function setActivityTab(tab) {
  activityTab = tab === "history" ? "history" : "comments";
  const isComments = activityTab === "comments";

  document.querySelectorAll(".activity-tab").forEach((btn) => {
    const active = btn.getAttribute("data-activity-tab") === activityTab;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (activityPanelComments) {
    activityPanelComments.classList.toggle("hidden", !isComments);
    activityPanelComments.hidden = !isComments;
  }
  if (activityPanelHistory) {
    activityPanelHistory.classList.toggle("hidden", isComments);
    activityPanelHistory.hidden = isComments;
  }
}

function resolveAttachmentContentUrl(candidate, attachmentsMap) {
  if (!candidate || !attachmentsMap) return "";
  const source = String(candidate).trim();
  if (!source) return "";
  if (attachmentsMap[source]) return attachmentsMap[source];
  let decoded = source;
  try {
    decoded = decodeURIComponent(source);
  } catch {
    decoded = source;
  }
  if (attachmentsMap[decoded]) return attachmentsMap[decoded];
  const clear = decoded.split(/[?#]/)[0];
  const basename = clear.split(/[\\/]/).pop();
  if (basename && attachmentsMap[basename]) return attachmentsMap[basename];
  const lowered = String(basename || "").toLowerCase();
  if (!lowered) return "";
  const key = Object.keys(attachmentsMap).find((name) => String(name).toLowerCase() === lowered);
  return key ? attachmentsMap[key] : "";
}

async function hydrateInlineShotPreviews(container, attachmentsMap, payload) {
  if (!container || !networkOnline) return;
  const shots = Array.from(container.querySelectorAll("img.inline-shot"));
  if (!shots.length) return;
  const previewCache = new Map();
  for (const shot of shots) {
    const rawSrc = shot.getAttribute("src") || "";
    const alt = shot.getAttribute("alt") || "";
    const contentUrl =
      resolveAttachmentContentUrl(rawSrc, attachmentsMap) ||
      resolveAttachmentContentUrl(alt, attachmentsMap);
    if (!contentUrl) continue;
    let dataUrl = previewCache.get(contentUrl);
    if (!dataUrl) {
      try {
        const preview = await window.desktopApi.getAttachmentPreview({
          ...payload,
          contentUrl,
        });
        dataUrl = `data:${preview.mimeType};base64,${preview.dataBase64}`;
        previewCache.set(contentUrl, dataUrl);
      } catch {
        continue;
      }
    }
    if (dataUrl) shot.src = dataUrl;
  }
}

function setIssueEditingMode(on) {
  document.getElementById("issue-page")?.classList.toggle("editing", Boolean(on));
}

/** Exit edit mode and restore controls from currentIssue — without reloading the card. */
async function cancelIssueEditing() {
  setIssueEditingMode(false);
  if (!currentIssue) return;
  rebindIssueEditFields();
  populateIssueEditSelects();
  populateDoneRatioSelect(editDoneRatio, currentIssue.done_ratio ?? 0);
  if (editStatus) editStatus.value = currentIssue.status?.id ? String(currentIssue.status.id) : "";
  if (editPriority) editPriority.value = currentIssue.priority?.id ? String(currentIssue.priority.id) : "";
  if (editDueDate) editDueDate.value = currentIssue.due_date || "";
  if (editEstimatedHours) {
    const estimateValue = resolveIssueEstimateHours(currentIssue);
    editEstimatedHours.value = estimateValue ?? "";
  }
  if (editSubject) editSubject.value = currentIssue.subject || "";
  if (editStartDate) editStartDate.value = currentIssue.start_date || "";
  await populateIssueEditAssignee(currentIssue);
  syncEditWatchersSelection(currentIssue);
  updateIssueCustomFieldsEdit(issueCustomFieldRowsForDisplay(currentIssue));
}

function rebindIssueEditFields() {
  editStatus = document.getElementById("edit-status");
  editAssignee = document.getElementById("edit-assignee");
  editPriority = document.getElementById("edit-priority");
  editDoneRatio = document.getElementById("edit-done-ratio");
  editDueDate = document.getElementById("edit-due-date");
  editEstimatedHours = document.getElementById("edit-estimated-hours");
}

async function populateIssueStatusSelect(issue) {
  if (!editStatus || !referenceData) return;
  const all = referenceData.issue_statuses || referenceData.issueStatuses || [];
  let list = all;
  if (Array.isArray(issue?.allowed_statuses) && issue.allowed_statuses.length) {
    const byId = new Map(all.map((status) => [Number(status.id), status]));
    list = issue.allowed_statuses.map((status) => byId.get(Number(status.id)) || status);
    if (issue.status?.id && !list.some((status) => Number(status.id) === Number(issue.status.id))) {
      list = [issue.status, ...list];
    }
  } else if (window.ProjectStatusSettings) {
    const projectId = issue?.project?.id ? Number(issue.project.id) : getCurrentProjectIdValue();
    const projectScoped = window.ProjectStatusSettings.getEffectiveStatuses(projectId, all, all);
    if (projectScoped.length) list = projectScoped;
    if (issue?.status?.id && !list.some((status) => Number(status.id) === Number(issue.status.id))) {
      list = [issue.status, ...list];
    }
  }
  populateSelect(editStatus, list);
}

function populateIssueEditSelects() {
  if (!referenceData) return;
  populateIssueStatusSelect(currentIssue).catch(() => {});
  populateSelect(editPriority, referenceData.priorities || []);
}

function populateDoneRatioSelect(select, currentValue) {
  if (!select) return;
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const current = Number(currentValue) || 0;
  const options = steps.includes(current) ? steps : [current, ...steps].sort((a, b) => a - b);
  select.innerHTML = options
    .map((v) => `<option value="${v}" ${v === current ? "selected" : ""}>${v}%</option>`)
    .join("");
}

async function populateIssueEditAssignee(issue) {
  if (!editAssignee) return;
  const payload = getFormValues();
  let users = [];
  if (issue?.project?.id) {
    users = await loadAssigneesForProject(Number(issue.project.id), payload);
  }
  if (!users.length) {
    users = referenceData?.users || [];
  }
  if (
    issue?.assigned_to?.id &&
    !users.some((u) => Number(u.id) === Number(issue.assigned_to.id))
  ) {
    users = [{ id: issue.assigned_to.id, name: issue.assigned_to.name }, ...users];
  }
  populateSelect(editAssignee, users, { labelKey: "name", allLabel: "не назначен", allValue: "" });
  editAssignee.value = issue?.assigned_to?.id ? String(issue.assigned_to.id) : "";
}

function findEstimateCustomField(issue) {
  const fields = issue?.custom_fields || [];
  return (
    fields.find((f) => Number(f.id) === 5) ||
    fields.find((f) => /оценк\w*\s*трудо|estimated\s*hours?/i.test(String(f.name || ""))) ||
    null
  );
}

function resolveIssueEstimateHours(issue) {
  const cf = findEstimateCustomField(issue);
  if (cf && cf.value !== undefined && cf.value !== null && String(cf.value).trim() !== "") {
    return cf.value;
  }
  return issue?.estimated_hours ?? "";
}

function hideSecondaryViews() {
  document.getElementById("report-view")?.classList.add("hidden");
  document.getElementById("tracker-view")?.classList.add("hidden");
  document.getElementById("agile-view")?.classList.add("hidden");
  document.getElementById("activity-view")?.classList.add("hidden");
  document.getElementById("search-view")?.classList.add("hidden");
}

const TOPBAR_MODE_CLASSES = [
  "is-issue-mode",
  "is-agile-mode",
  "is-tracker-mode",
  "is-report-mode",
  "is-activity-mode",
  "is-search-mode",
  "is-settings-mode",
  "is-time-entries-mode",
];

function setTopbarMode(mode) {
  const topbar = document.querySelector("header.topbar");
  if (!topbar) return;
  TOPBAR_MODE_CLASSES.forEach((cls) => topbar.classList.remove(cls));
  if (mode) topbar.classList.add(mode);
}

function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function formatActivityWhen(createdOn) {
  if (!createdOn) return "";
  try {
    return new Date(createdOn).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(createdOn);
  }
}

function formatActivityDayHeader(createdOn) {
  if (!createdOn) return "";
  const date = new Date(createdOn);
  if (Number.isNaN(date.getTime())) return String(createdOn);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startToday - startDate) / 86400000);
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  return date.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
}

function applyActivityBadge(count) {
  activityUnseenCount = Math.max(0, Number(count) || 0);
  document.querySelectorAll("[data-activity-feed-count]").forEach((el) => {
    el.textContent = String(activityUnseenCount);
    el.classList.toggle("hidden", activityUnseenCount === 0);
  });
}

function syncActivityFeedToolbar() {
  if (activityFeedLimitSelect) {
    activityFeedLimitSelect.value = String(activityFeedPrefs.limit || 10);
  }
  if (activityTypeSummary && window.ActivityFeedSettings) {
    activityTypeSummary.textContent = window.ActivityFeedSettings.groupsSummary(activityFeedPrefs.groups);
  }
}

function renderActivityTypeOptions() {
  if (!activityTypeList || !window.ActivityFeedSettings) return;
  const labels = window.ActivityFeedSettings.GROUP_LABELS || {};
  const groups = window.ActivityFeedSettings.ALL_GROUPS || [];
  const selected = new Set(activityFeedPrefs.groups || []);
  activityTypeList.innerHTML = groups
    .map(
      (group) => `
        <label class="checklist-item">
          <input type="checkbox" data-activity-group="${escapeHtml(group)}" ${selected.has(group) ? "checked" : ""} />
          ${escapeHtml(labels[group] || group)}
        </label>`,
    )
    .join("");
}

function closeActivityTypePanel() {
  activityTypePanel?.classList.add("hidden");
  activityTypeTrigger?.setAttribute("aria-expanded", "false");
}

function renderActivityFeedItems(items) {
  if (!activityFeedList) return;
  if (!items.length) {
    const hasFilters =
      (activityFeedPrefs.groups || []).length < (window.ActivityFeedSettings?.ALL_GROUPS?.length || 4);
    activityFeedList.innerHTML = `<div class="activity-feed-empty muted">${
      hasFilters
        ? "Нет активности за выбранные отборы"
        : "Пока нет событий — они появятся после синхронизации"
    }</div>`;
    activityFeedList.classList.add("muted");
    return;
  }
  activityFeedList.classList.remove("muted");
  let html = "";
  let lastDay = "";
  items.forEach((item) => {
    const day = formatActivityDayHeader(item.created_on);
    if (day && day !== lastDay) {
      html += `<div class="activity-day-header">${escapeHtml(day)}</div>`;
      lastDay = day;
    }
    const subject = item.issue_subject || "Без темы";
    const subjectShort = subject.length > 72 ? `${subject.slice(0, 71)}…` : subject;
    const detail = String(item.detail_text || "").trim();
    html += `
      <button type="button" class="activity-item ${item.seen_at ? "" : "is-unseen"}" data-activity-id="${Number(item.id)}" data-issue-id="${Number(item.issue_id)}">
        <span class="activity-avatar" aria-hidden="true">${escapeHtml(initialsFromName(item.actor_name))}</span>
        <span class="activity-item-main">
          <div class="activity-item-line">
            <strong>${escapeHtml(item.actor_name || "Пользователь")}</strong>
            ${escapeHtml(item.summary || "изменил(а) задачу")}
            в <span class="activity-issue-link">#${Number(item.issue_id)}</span>
            — ${escapeHtml(subjectShort)}
          </div>
          ${detail ? `<div class="activity-item-detail">${escapeHtml(detail)}</div>` : ""}
        </span>
        <span class="activity-item-meta">${escapeHtml(formatActivityWhen(item.created_on))}</span>
      </button>`;
  });
  activityFeedList.innerHTML = html;
}

async function refreshActivityFeedView() {
  if (!activityFeedList || !window.desktopApi?.getActivityFeed) return;
  activityFeedList.textContent = "Загрузка…";
  activityFeedList.classList.add("muted");
  try {
    const kinds = window.ActivityFeedSettings?.kindsForGroups(activityFeedPrefs.groups) || [];
    const result = await window.desktopApi.getActivityFeed({
      limit: activityFeedPrefs.limit || 10,
      offset: 0,
      kinds,
    });
    applyActivityBadge(result?.totalUnseen);
    renderActivityFeedItems(Array.isArray(result?.items) ? result.items : []);
  } catch (error) {
    activityFeedList.innerHTML = `<div class="activity-feed-empty muted">${escapeHtml(error.message || "Не удалось загрузить ленту")}</div>`;
    setStatus(error.message || "Не удалось загрузить ленту активности", "error");
  }
}

async function refreshActivityBadgeOnly() {
  if (!window.desktopApi?.getActivityUnseenCount) return;
  try {
    const result = await window.desktopApi.getActivityUnseenCount();
    applyActivityBadge(result?.unseenCount);
  } catch (error) {
    console.error("getActivityUnseenCount failed:", error.message);
  }
}

function showActivityView() {
  closeConnectionSettings();
  closeActivityTypePanel();
  notificationsPopover?.classList.add("hidden");
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  document.getElementById("activity-view")?.classList.remove("hidden");
  setTopbarMode("is-activity-mode");
  syncActivityFeedToolbar();
  renderActivityTypeOptions();
  refreshActivityFeedView().catch((error) => {
    setStatus(error.message || "Не удалось загрузить ленту активности", "error");
  });
}

function showSearchView() {
  closeConnectionSettings();
  closeQuickIssueByIdPopover();
  notificationsPopover?.classList.add("hidden");
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  document.getElementById("search-view")?.classList.remove("hidden");
  setTopbarMode("is-search-mode");
  refreshCacheEstimateLabel().catch(() => {});
  document.getElementById("deep-search-input")?.focus();
}

async function refreshCacheEstimateLabel() {
  const el = document.getElementById("cache-estimate-label");
  if (!el || !window.desktopApi?.estimateCacheDownload) return;
  try {
    const est = await window.desktopApi.estimateCacheDownload();
    const have = formatBytes(est?.haveBytes || 0);
    const need = formatBytes(est?.estimateBytes || 0);
    const issues = est?.issueCount ?? 0;
    const missing = est?.missingDetailCount ?? 0;
    el.textContent =
      `В кэше сейчас ~${have} (${issues} задач). ` +
      `Чтобы подгрузить детали по всем проектам синка (~${missing} без полной истории), ` +
      `может потребоваться ещё порядка ${need} (оценка по размерам описаний и вложений).`;
  } catch (error) {
    el.textContent = error.message || "Не удалось оценить объём кэша.";
  }
}

async function runDeepSearch() {
  const input = document.getElementById("deep-search-input");
  const host = document.getElementById("deep-search-results");
  const q = String(input?.value || "").trim();
  if (!host) return;
  if (!q) {
    host.innerHTML = `<div class="muted">Введите запрос.</div>`;
    return;
  }
  host.innerHTML = `<div class="muted">Ищем…</div>`;
  try {
    const payload = getFormValues();
    payload.filters = {
      ...payload.filters,
      searchQuery: q,
      searchDeep: true,
      selectedProjectId: "all",
      selectedStatusIds: [],
      selectedPriorityIds: [],
      selectedAssigneeId: "all",
      selectedAuthorIds: [],
      issueScope: "all",
      favoritesBare: false,
    };
    const rows = await window.desktopApi.loadIssues(payload);
    if (!rows?.length) {
      host.innerHTML = `<div class="muted">Ничего не найдено в локальном кэше. Подгрузите детали задач и обновите индекс.</div>`;
      return;
    }
    host.innerHTML = rows
      .slice(0, 100)
      .map(
        (issue) => `<button type="button" class="deep-search-row" data-deep-issue="${issue.id}">
        <span class="deep-search-id">#${issue.id}</span>
        <span class="deep-search-subject">${escapeHtml(issue.subject || "(без темы)")}</span>
        <span class="deep-search-meta muted">${escapeHtml(issue.project?.name || "")} · ${escapeHtml(issue.status?.name || "")}</span>
      </button>`,
      )
      .join("");
  } catch (error) {
    host.innerHTML = `<div class="muted">${escapeHtml(error.message || "Ошибка поиска")}</div>`;
  }
}

function showIssuesView() {
  closeIssuePreviewDrawer();
  stopTrackerClockTicks();
  issueNavGeneration += 1;
  selectedIssueId = null;
  currentIssue = null;
  issueNavStack.clear();
  issuesView?.classList.remove("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  setTopbarMode(null);
}

function goToIssuesList() {
  closeConnectionSettings();
  closeQuickIssueByIdPopover();
  closeActivityTypePanel();
  closeTrackerIssuePicker();
  closeIssuePreviewDrawer();
  window.__returnToAgile = false;
  window.__returnToTracker = false;
  trackerCameFromAgile = false;
  document.getElementById("view-list-btn")?.classList.add("active");
  document.getElementById("view-agile-btn")?.classList.remove("active");
  showIssuesView();
  renderIssuesList();
}

function showIssuePreviewDrawer() {
  issuePreviewMode = true;
  issuesView?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  document.getElementById("agile-view")?.classList.remove("hidden");
  issuePage?.classList.remove("hidden");
  issuePage?.classList.add("is-agile-preview");
  document.getElementById("preview-backdrop")?.classList.remove("hidden");
  setTopbarMode("is-agile-mode");
}

function closeIssuePreviewDrawer() {
  issuePreviewMode = false;
  issuePage?.classList.remove("is-agile-preview");
  document.getElementById("preview-backdrop")?.classList.add("hidden");
  if (issuePage && !issuePage.classList.contains("hidden") && document.getElementById("agile-view") && !document.getElementById("agile-view").classList.contains("hidden")) {
    issuePage.classList.add("hidden");
  }
  setIssueEditingMode(false);
}

function expandIssuePreviewToFull() {
  issuePreviewMode = false;
  issuePage?.classList.remove("is-agile-preview");
  document.getElementById("preview-backdrop")?.classList.add("hidden");
  window.__returnToAgile = true;
  showIssuePage();
}

function showIssuePage() {
  issuePreviewMode = false;
  issuePage?.classList.remove("is-agile-preview");
  document.getElementById("preview-backdrop")?.classList.add("hidden");
  issuesView?.classList.add("hidden");
  hideSecondaryViews();
  issuePage?.classList.remove("hidden");
  timeEntriesView?.classList.add("hidden");
  setTopbarMode("is-issue-mode");
}

function handleAppBack() {
  if (document.querySelector(".page.settings-mode")) {
    closeConnectionSettings();
    return;
  }
  const issuesVisible = issuesView && !issuesView.classList.contains("hidden");
  const issuePageVisible = issuePage && !issuePage.classList.contains("hidden");
  const overlayOpen = Boolean(
    document.querySelector(
      "#report-view:not(.hidden), #tracker-view:not(.hidden), #activity-view:not(.hidden), #time-entries-view:not(.hidden), #agile-view:not(.hidden), #search-view:not(.hidden)",
    ),
  );
  if (issuesVisible && !issuePageVisible && !issuePreviewMode && !overlayOpen) return;
  if (issuePreviewMode) {
    closeIssuePreviewDrawer();
    if (window.__showAgileView) window.__showAgileView();
    return;
  }
  if (window.__returnToAgile) {
    window.__returnToAgile = false;
    window.__returnToTracker = false;
    if (window.__showAgileView) window.__showAgileView();
    return;
  }
  if (window.__returnToTracker) {
    window.__returnToTracker = false;
    window.__returnToAgile = false;
    showTrackerView();
    return;
  }
  if (issuePageVisible && issueNavStack.length > 0) {
    const prevId = issueNavStack.pop();
    if (prevId) {
      openIssueDetails(prevId, {
        forceRefresh: false,
        backgroundRefresh: true,
        skipNavPush: true,
      }).catch((error) => {
        setStatus(error.message || "Не удалось открыть задачу", "error");
        showIssuesView();
        renderIssuesList();
      });
      return;
    }
  }
  showIssuesView();
  renderIssuesList();
}

function setQuickIssueByIdError(message) {
  if (!quickIssueByIdInput || !quickIssueByIdError) return;
  const text = String(message || "").trim();
  quickIssueByIdInput.classList.toggle("field-invalid", Boolean(text));
  quickIssueByIdError.textContent = text;
  quickIssueByIdError.classList.toggle("hidden", !text);
}

function closeQuickIssueByIdPopover() {
  quickIssueByIdPopover?.classList.add("hidden");
  quickIssuePopoverAnchor = null;
  setQuickIssueByIdError("");
}

function openQuickIssueByIdPopover(anchorEl) {
  if (!quickIssueByIdPopover) return;
  quickOpenModal?.classList.add("hidden");
  quickIssuePopoverAnchor = anchorEl || quickIssuePopoverAnchor;
  setQuickIssueByIdError("");
  quickIssueByIdPopover.classList.remove("hidden");
  requestAnimationFrame(() => {
    positionQuickIssueByIdPopover(quickIssuePopoverAnchor);
    requestAnimationFrame(() => {
      quickIssueByIdInput?.focus();
      quickIssueByIdInput?.select();
    });
  });
}

function toggleQuickIssueByIdPopover(anchorEl) {
  if (quickIssueByIdPopover?.classList.contains("hidden")) openQuickIssueByIdPopover(anchorEl);
  else closeQuickIssueByIdPopover();
}

async function submitQuickIssueById() {
  const raw = String(quickIssueByIdInput?.value || "")
    .trim()
    .replace(/^#+/, "");
  if (!/^\d+$/.test(raw)) {
    setQuickIssueByIdError("Укажите номер задачи (только цифры).");
    quickIssueByIdInput?.focus();
    return;
  }
  const issueId = Number(raw);
  if (!Number.isFinite(issueId) || issueId <= 0) {
    setQuickIssueByIdError("Укажите корректный номер задачи.");
    quickIssueByIdInput?.focus();
    return;
  }
  if (quickIssueByIdGoBtn) {
    quickIssueByIdGoBtn.disabled = true;
    const prev = quickIssueByIdGoBtn.textContent;
    quickIssueByIdGoBtn.textContent = "Открываем…";
    try {
      await openIssueDetails(issueId);
      closeQuickIssueByIdPopover();
      if (quickIssueByIdInput) quickIssueByIdInput.value = String(issueId);
    } catch (error) {
      setQuickIssueByIdError(error.message || "Задача не найдена.");
      setStatus(error.message || "Не удалось открыть задачу", "error");
    } finally {
      quickIssueByIdGoBtn.disabled = false;
      quickIssueByIdGoBtn.textContent = prev;
    }
    return;
  }
  try {
    await openIssueDetails(issueId);
    closeQuickIssueByIdPopover();
  } catch (error) {
    setQuickIssueByIdError(error.message || "Задача не найдена.");
    setStatus(error.message || "Не удалось открыть задачу", "error");
  }
}

function closeImageLightbox() {
  const overlay = document.getElementById("image-lightbox");
  const img = document.getElementById("image-lightbox-img");
  if (!overlay || overlay.classList.contains("hidden")) return false;
  overlay.classList.add("hidden");
  img?.removeAttribute("src");
  return true;
}

function closeEscapeOverlays() {
  if (closeImageLightbox()) return true;
  if (window.DescriptionEditor?.isOpen?.()) {
    window.DescriptionEditor.close();
    return true;
  }
  if (isTrackerIssuePickerOpen()) {
    closeTrackerIssuePicker();
    return true;
  }
  if (quickIssueByIdPopover && !quickIssueByIdPopover.classList.contains("hidden")) {
    closeQuickIssueByIdPopover();
    return true;
  }
  if (document.getElementById("add-list-filter-popover") && !document.getElementById("add-list-filter-popover").classList.contains("hidden")) {
    document.getElementById("add-list-filter-popover").classList.add("hidden");
    return true;
  }
  if (notificationsPopover && !notificationsPopover.classList.contains("hidden")) {
    notificationsPopover.classList.add("hidden");
    return true;
  }
  if (activityTypePanel && !activityTypePanel.classList.contains("hidden")) {
    closeActivityTypePanel();
    return true;
  }
  if (document.querySelector(".page.settings-mode")) {
    closeConnectionSettings();
    return true;
  }
  const syncOverlay = document.getElementById("sync-progress-overlay");
  if (syncOverlay && !syncOverlay.classList.contains("hidden")) {
    syncOverlay.classList.add("hidden");
    return true;
  }
  const modalClosers = [
    ["quick-open-modal", () => quickOpenModal?.classList.add("hidden")],
    ["create-issue-modal", () => document.getElementById("create-issue-modal")?.classList.add("hidden")],
    ["time-entry-modal", () => document.getElementById("time-entry-modal")?.classList.add("hidden")],
    ["bulk-status-confirm-modal", () => document.getElementById("bulk-status-confirm-modal")?.classList.add("hidden")],
    ["close-with-subtasks-modal", () => document.getElementById("close-with-subtasks-modal")?.classList.add("hidden")],
    ["edit-sync-projects-modal", () => closeEditSyncProjectsModal()],
    ["description-editor-modal", () => window.DescriptionEditor?.close?.()],
  ];
  for (const [id, closeFn] of modalClosers) {
    const el = document.getElementById(id);
    if (el && !el.classList.contains("hidden")) {
      closeFn();
      return true;
    }
  }
  if (listInlinePopover && !listInlinePopover.classList.contains("hidden")) {
    closeListInlinePopover();
    return true;
  }
  if (document.getElementById("issue-context-menu") && !document.getElementById("issue-context-menu").classList.contains("hidden")) {
    closeIssueContextMenu();
    return true;
  }
  if (document.getElementById("tracker-row-context-menu") && !document.getElementById("tracker-row-context-menu").classList.contains("hidden")) {
    closeTrackerRowContextMenu();
    return true;
  }
  if (document.querySelector(".period-picker-panel:not(.hidden)")) {
    trackerPeriodPickerRef?.closePanel?.();
    document.querySelectorAll(".period-picker-panel:not(.hidden)").forEach((panel) => {
      panel.classList.add("hidden");
    });
    return true;
  }
  if (statusFilterPanel && !statusFilterPanel.classList.contains("hidden")) {
    statusFilterPanel.classList.add("hidden");
    statusFilterTrigger?.setAttribute("aria-expanded", "false");
    return true;
  }
  return false;
}

function handleEscapeKey(event) {
  if (event.key !== "Escape") return;
  if (window.ProductTour?.isActive?.()) {
    event.preventDefault();
    window.ProductTour.handleEscape().catch(() => {});
    return;
  }
  const tag = String(event.target?.tagName || "").toLowerCase();
  const inTextField =
    tag === "textarea" ||
    (tag === "input" &&
      !["button", "submit", "reset", "checkbox", "radio", "file", "hidden"].includes(
        String(event.target.type || "").toLowerCase(),
      ));
  if (inTextField && event.target?.closest?.(".modal:not(.hidden), .quick-issue-popover:not(.hidden)")) {
    event.preventDefault();
    closeEscapeOverlays();
    return;
  }
  if (closeEscapeOverlays()) {
    event.preventDefault();
    return;
  }
  if (issuePreviewMode) {
    event.preventDefault();
    closeIssuePreviewDrawer();
    return;
  }
  event.preventDefault();
  handleAppBack();
  if (
    selectedIssueIds.size > 0 &&
    issuesView &&
    !issuesView.classList.contains("hidden") &&
    issuePage?.classList.contains("hidden")
  ) {
    selectedIssueIds.clear();
    syncSelectedRowsVisual();
  }
}

function showTimeEntriesView() {
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  hideSecondaryViews();
  timeEntriesView?.classList.remove("hidden");
  setTopbarMode("is-time-entries-mode");
}

function goBackFromTimeEntries() {
  const issueId = Number(timeEntriesActiveFilters?.issueId);
  if (reopenPreviewIssueId) {
    const previewId = reopenPreviewIssueId;
    reopenPreviewIssueId = null;
    openIssueDetails(previewId, { preview: true, forceRefresh: false }).catch((error) => {
      setStatus(`Не удалось открыть задачу: ${error.message}`, "error");
      if (window.__showAgileView) window.__showAgileView();
    });
    return;
  }
  if (issueId) {
    openIssueDetails(issueId).catch((error) => {
      setStatus(`Не удалось открыть задачу: ${error.message}`, "error");
      showIssuesView();
      renderIssuesList();
    });
    return;
  }
  showIssuesView();
  renderIssuesList();
}

function highlightSelectedIssue() {
  document.querySelectorAll(".issue-item").forEach((row) => {
    row.classList.toggle("selected", Number(row.dataset.issueId) === Number(selectedIssueId));
  });
}

function syncSelectedRowsVisual() {
  document.querySelectorAll(".issue-item[data-issue-id]").forEach((row) => {
    row.classList.toggle("is-selected", selectedIssueIds.has(Number(row.dataset.issueId)));
  });
}

function openIssueContextMenu(x, y) {
  const menu = document.getElementById("issue-context-menu");
  const header = document.getElementById("context-menu-header");
  const list = document.getElementById("context-menu-status-list");
  if (!menu || !header || !list) return;
  const count = selectedIssueIds.size;
  header.textContent = `Выбрано: ${count} ${count === 1 ? "задача" : "задачи"}`;
  const statuses = getAvailableStatusesForCurrentProject();
  list.innerHTML = statuses.length
    ? statuses
        .map(
          (s) =>
            `<button type="button" class="context-menu-item" data-set-bulk-status="${s.id}">${escapeHtml(s.name || `#${s.id}`)}</button>`,
        )
        .join("")
    : `<span class="muted">Статусы не загружены</span>`;
  menu.classList.remove("hidden");
  const pad = 8;
  const width = menu.offsetWidth || 220;
  const height = menu.offsetHeight || 200;
  let left = x;
  let top = y;
  if (left + width > window.innerWidth - pad) left = window.innerWidth - width - pad;
  if (top + height > window.innerHeight - pad) top = window.innerHeight - height - pad;
  menu.style.left = `${Math.max(pad, left)}px`;
  menu.style.top = `${Math.max(pad, top)}px`;
}

function closeIssueContextMenu() {
  document.getElementById("issue-context-menu")?.classList.add("hidden");
}

function populateSelect(select, items, { valueKey = "id", labelKey = "name", allLabel = null, allValue = "all" } = {}) {
  if (!select) return;
  select.innerHTML = "";
  if (allLabel) {
    const option = document.createElement("option");
    option.value = allValue;
    option.textContent = allLabel;
    select.appendChild(option);
  }
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = String(item[valueKey]);
    option.textContent = item[labelKey];
    select.appendChild(option);
  });
}

function enrichProjectsWithParents(projects) {
  const refById = new Map((referenceData?.projects || []).map((p) => [Number(p.id), p]));
  return (projects || [])
    .map((p) => {
      const id = Number(p.id ?? p.project_id);
      if (!Number.isFinite(id)) return null;
      const ref = refById.get(id);
      return {
        id,
        name: p.name || p.project_name || ref?.name || `Проект #${id}`,
        parent: ref?.parent,
        parent_id: ref?.parent_id ?? ref?.parent?.id ?? null,
        status: ref?.status ?? p.status,
      };
    })
    .filter(Boolean);
}

function formatProjectsForUi(projects) {
  const enriched = enrichProjectsWithParents(projects);
  if (window.ProjectTree?.projectsForSelect) {
    return window.ProjectTree.projectsForSelect(enriched, {
      hierarchy: Boolean(currentSettings?.projectsShowHierarchy),
    });
  }
  return enriched
    .slice()
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
}

function getTimeEntryFormFieldOrder() {
  const api = window.TimeEntryFormOrder;
  if (!api) return ["spent_on", "hours", "comments", "activity_id", "customer_name"];
  return api.normalizeOrder(currentSettings?.timeEntryFormFieldOrder);
}

function applyTimeEntryFormFieldOrder() {
  window.TimeEntryFormOrder?.applyOrderToForm?.(timeEntryForm, getTimeEntryFormFieldOrder());
}

function renderTeFormOrderSettings() {
  if (!teFormOrderList || !window.TimeEntryFormOrder) return;
  const order = getTimeEntryFormFieldOrder();
  const labels = window.TimeEntryFormOrder.FIELD_LABELS || {};
  teFormOrderList.innerHTML = order
    .map((key, index) => {
      const label = labels[key] || key;
      return `<div class="te-form-order-item" data-te-order-key="${escapeHtml(key)}">
        <span class="te-form-order-label">${escapeHtml(label)}</span>
        <span class="te-form-order-actions">
          <button type="button" class="btn-secondary btn-sm" data-te-order-up="${escapeHtml(key)}" ${index === 0 ? "disabled" : ""} title="Выше">↑</button>
          <button type="button" class="btn-secondary btn-sm" data-te-order-down="${escapeHtml(key)}" ${index === order.length - 1 ? "disabled" : ""} title="Ниже">↓</button>
        </span>
      </div>`;
    })
    .join("");
}

async function persistTimeEntryFormFieldOrder(order) {
  if (!currentSettings) return;
  currentSettings.timeEntryFormFieldOrder = window.TimeEntryFormOrder?.normalizeOrder?.(order) || order;
  await window.desktopApi.saveSettings(currentSettings);
  applyTimeEntryFormFieldOrder();
  renderTeFormOrderSettings();
}

function normalizeReferencePayload(loaded) {
  if (!loaded || typeof loaded !== "object") return loaded;
  return {
    ...loaded,
    current_user: loaded.current_user || loaded.currentUser,
    currentUser: loaded.currentUser || loaded.current_user,
    issue_statuses: loaded.issue_statuses || loaded.issueStatuses,
    issueStatuses: loaded.issueStatuses || loaded.issue_statuses,
  };
}

async function refreshReferenceData({ forceFromServer = false } = {}) {
  const payload = getFormValues();
  try {
    if (payload.redmineUrl && payload.apiKey) {
      const loaded = forceFromServer
        ? await window.desktopApi.loadReferenceData(payload)
        : await window.desktopApi.ensureReferenceData(payload);
      referenceData = normalizeReferencePayload(loaded);
    } else {
      referenceData = await window.desktopApi.getCachedReferenceData();
    }
  } catch (error) {
    throw new Error(error?.message || "Не удалось загрузить справочники");
  }
  await applyReferenceDataToFilters();
}

async function getEnabledSyncProjects() {
  try {
    const projects = await window.desktopApi.getSyncProjects();
    return (projects || [])
      .filter((p) => p.enabled)
      .map((p) => ({ id: p.project_id, name: p.project_name || `Проект #${p.project_id}` }));
  } catch {
    return [];
  }
}

async function applyReferenceDataToFilters() {
  if (!referenceData) return;

  const enabledProjects = await getEnabledSyncProjects();
  const projectsForFilterRaw =
    enabledProjects.length > 0
      ? enabledProjects
      : (referenceData.projects || []).filter((p) => p.status !== 5);
  const projectsForFilter = formatProjectsForUi(projectsForFilterRaw);

  populateSelect(projectSelect, projectsForFilter, { allLabel: "Все активные проекты" });

  populateIssueStatusSelect(currentIssue);
  populateSelect(editPriority, referenceData.priorities || []);
  populateSelect(createProject, projectsForFilter);
  populateSelect(createTracker, referenceData.trackers || []);
  populateSelect(createPriority, referenceData.priorities || []);
  selectDefaultCreatePriority();
  await refreshCustomerNameSuggestions();

  if (currentSettings?.uiState) {
    const savedProject = currentSettings.uiState.selectedProjectId || "all";
    if (savedProject === "all" || Array.from(projectSelect.options).some((o) => o.value === String(savedProject))) {
      projectSelect.value = savedProject;
    } else {
      projectSelect.value = "all";
    }
    searchInput.value = currentSettings.uiState.searchQuery || "";

    if (dueFromInput) dueFromInput.value = currentSettings.uiState.dueFrom || "";
    if (dueToInput) dueToInput.value = currentSettings.uiState.dueTo || "";
    if (dueEmptyOnlyCheckbox) dueEmptyOnlyCheckbox.checked = Boolean(currentSettings.uiState.dueEmptyOnly);
    syncDueFilterUi();

    window.FilterChips?.setChipVisible?.("status-chip", Boolean(currentSettings.uiState.statusChipVisible));
    window.FilterChips?.setChipVisible?.("priority-chip", Boolean(currentSettings.uiState.priorityChipVisible));
    window.FilterChips?.setChipVisible?.("due-chip", Boolean(currentSettings.uiState.dueChipVisible));
    window.FilterChips?.setChipVisible?.(
      "assignee-chip",
      Boolean(currentSettings.uiState.assigneeChipVisible),
    );
    window.FilterChips?.setChipVisible?.("author-chip", Boolean(currentSettings.uiState.authorChipVisible));
    window.FilterChips?.setChipVisible?.(
      "estimate-chip",
      Boolean(currentSettings.uiState.estimateChipVisible),
    );

    estimateFilterMode = currentSettings.uiState.estimateFilterMode || "any";
    document.querySelectorAll('input[name="estimate-filter-mode"]').forEach((radio) => {
      radio.checked = radio.value === estimateFilterMode;
    });
    updateEstimateChipSummary();

    const savedIds = currentSettings.uiState.selectedStatusIds;
    if (Array.isArray(savedIds) && savedIds.length) {
      selectedStatusIds = savedIds.map(Number).filter(Boolean);
    } else if (currentSettings.uiState.selectedStatusId && currentSettings.uiState.selectedStatusId !== "all") {
      selectedStatusIds = [Number(currentSettings.uiState.selectedStatusId)].filter(Boolean);
    } else {
      applyStatusScopePreset(getStatusScope());
    }

    const savedPriorityIds = currentSettings.uiState.selectedPriorityIds;
    if (Array.isArray(savedPriorityIds) && savedPriorityIds.length) {
      selectedPriorityIds = savedPriorityIds.map(Number).filter(Boolean);
    }
  } else {
    applyStatusScopePreset(getStatusScope());
  }
  await refreshCurrentProjectStatusOptions();
  renderStatusFilterList();
  setSelectedStatusIds(selectedStatusIds);
  renderPriorityFilterList();
  setSelectedPriorityIds(selectedPriorityIds);

  await updateFilterAssigneesForProject();
  if (currentSettings?.uiState?.selectedAssigneeId) {
    const savedAssignee = currentSettings.uiState.selectedAssigneeId;
    if (Array.from(assigneeSelect.options).some((o) => o.value === savedAssignee)) {
      assigneeSelect.value = savedAssignee;
    }
  }
  syncAssigneeFilterForScope();

  await updateFilterAuthorsForProject();
  if (currentSettings?.uiState) {
    const savedAuthorIds = currentSettings.uiState.selectedAuthorIds;
    if (Array.isArray(savedAuthorIds) && savedAuthorIds.length) {
      selectedAuthorIds = savedAuthorIds.map(Number).filter(Boolean);
    } else if (
      currentSettings.uiState.selectedAuthorId &&
      currentSettings.uiState.selectedAuthorId !== "all"
    ) {
      selectedAuthorIds = [Number(currentSettings.uiState.selectedAuthorId)].filter(Boolean);
    }
    const available = new Set(filterAuthorsCache.map((a) => Number(a.id)).filter(Boolean));
    selectedAuthorIds = selectedAuthorIds.filter((id) => available.has(id));
  }
  setSelectedAuthorIds(selectedAuthorIds);

  const users = referenceData.users || [];
  populateSelect(editWatchers, users, { labelKey: "name" });
}

async function loadAssigneesForProject(projectId, payload) {
  let users = await window.desktopApi.getProjectUsers({
    redmineUrl: payload.redmineUrl,
    apiKey: payload.apiKey,
    projectId,
  });

  if (!users.length) {
    const byIssues = loadedIssues
      .filter((issue) => Number(issue.project?.id) === projectId && issue.assigned_to?.id)
      .map((issue) => issue.assigned_to);
    const seen = new Set();
    users = byIssues.filter((user) => {
      if (!user?.id || seen.has(user.id)) return false;
      seen.add(user.id);
      return true;
    });
  }

  return users;
}

async function updateFilterAssigneesForProject() {
  const payload = getFormValues();
  const projectId = projectSelect?.value;
  const prev = assigneeSelect?.value || "me";
  let users = [];

  if (!projectId || projectId === "all") {
    const enabled = await getEnabledSyncProjects();
    const projectIds = enabled.map((p) => Number(p.id)).filter(Boolean);
    users = await window.desktopApi.getAssignees({ projectIds });
    if (!users.length && projectIds.length && payload.redmineUrl && payload.apiKey) {
      const byId = new Map();
      for (const id of projectIds) {
        const members = await loadAssigneesForProject(id, payload);
        members.forEach((u) => {
          if (u?.id) byId.set(Number(u.id), { id: u.id, name: u.name });
        });
      }
      users = Array.from(byId.values()).sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
    }
  } else {
    users = await loadAssigneesForProject(Number(projectId), payload);
  }

  populateSelect(assigneeSelect, users, { labelKey: "name", allLabel: "Все исполнители" });

  if (assigneeSelect && !Array.from(assigneeSelect.options).some((o) => o.value === "me")) {
    const meOption = document.createElement("option");
    meOption.value = "me";
    meOption.textContent = "Я (текущий ключ API)";
    assigneeSelect.insertBefore(meOption, assigneeSelect.firstChild);
  }

  if (prev && Array.from(assigneeSelect.options).some((o) => o.value === prev)) {
    assigneeSelect.value = prev;
  }
  syncAssigneeFilterForScope();
  window.FilterChips?.syncAssigneeChipLabel?.();
}

async function updateFilterAuthorsForProject() {
  const projectId = projectSelect?.value;
  const projectIds = !projectId || projectId === "all"
    ? (await getEnabledSyncProjects()).map((p) => Number(p.id)).filter(Boolean)
    : [Number(projectId)];
  const authors = await window.desktopApi.getAuthors({ projectIds });
  filterAuthorsCache = Array.isArray(authors) ? authors : [];
  // Drop selections that no longer exist for the current project scope.
  const available = new Set(filterAuthorsCache.map((a) => Number(a.id)).filter(Boolean));
  selectedAuthorIds = selectedAuthorIds.filter((id) => available.has(id));
  renderAuthorFilterList();
  setSelectedAuthorIds(selectedAuthorIds);
}

async function updateCreateAssigneesForProject() {
  const payload = getFormValues();
  const projectId = Number(createProject?.value || 0);
  if (!projectId) return;

  const users = await loadAssigneesForProject(projectId, payload);
  createWatcherCandidates = users;
  const prev = createAssignee.value;
  populateSelect(createAssignee, users, { labelKey: "name", allLabel: "Выберите исполнителя", allValue: "" });
  if (prev && Array.from(createAssignee.options).some((o) => o.value === prev)) {
    createAssignee.value = prev;
  }
  await refreshCreateCustomFields();
  if (createIssueFullMode) renderCreateWatcherChips();
}

/** Estimate CF is already exposed as «Оценка трудозатрат» — don't duplicate in CF block. */
const CREATE_ESTIMATE_CF_ID = 5;
let createIssueFullMode = false;
/** Rich HTML description draft for create form (full editor). */
let createDescriptionHtml = "";
/** Pending image uploads from create description editor. */
let createDescriptionPendingFiles = [];
/** DescriptionEditor context: "issue" | "create" */
let descriptionEditorContext = "issue";
let createFormFieldDefs = [];
/** Selected watchers for create: Map<id, name> */
const createSelectedWatchers = new Map();
let createWatcherCandidates = [];
let createParentSuggestTimer = null;
let createParentSuggestItems = [];

function descriptionPlainFromHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getCreateDescriptionValue() {
  if (createIssueFullMode) {
    if (createDescriptionHtml) return createDescriptionHtml;
    return String(createDescription?.value || "").trim();
  }
  return String(createDescription?.value || "").trim();
}

function updateCreateDescriptionPreview() {
  const plain = descriptionPlainFromHtml(createDescriptionHtml || createDescription?.value || "");
  const filled = Boolean(plain);
  createEditDescriptionBtn?.classList.toggle("is-filled", filled);
  const action = createEditDescriptionBtn?.querySelector(".create-description-cta-action");
  if (action) action.textContent = filled ? "Изменить" : "Открыть редактор";
  if (!createDescriptionCtaHint) return;
  createDescriptionCtaHint.textContent = filled ? plain : "Нажмите, чтобы задать описание";
}

function openCreateDescriptionEditor() {
  descriptionEditorContext = "create";
  const initial =
    createDescriptionHtml ||
    (createDescription?.value
      ? `<p>${escapeHtml(createDescription.value).replace(/\n/g, "<br>")}</p>`
      : "");
  const opened = window.DescriptionEditor?.open(initial);
  if (!opened) setStatus("Не удалось открыть редактор описания.", "error");
}

function applyCreateDescriptionFromEditor() {
  if (!window.DescriptionEditor) return;
  const html = window.DescriptionEditor.getHTML?.() || "";
  const pending = window.DescriptionEditor.takePendingImages?.() || [];
  createDescriptionHtml = html;
  if (pending.length) {
    createDescriptionPendingFiles = createDescriptionPendingFiles.concat(pending);
  }
  const plain = descriptionPlainFromHtml(html);
  if (createDescription) createDescription.value = plain;
  updateCreateDescriptionPreview();
  createDescriptionFullWrap?.classList.remove("invalid");
  window.DescriptionEditor.close();
  descriptionEditorContext = "issue";
  setStatus("Описание обновлено.", "success");
}

function renderCreateWatcherChips() {
  if (!createWatchersChips) return;
  if (!createSelectedWatchers.size) {
    createWatchersChips.innerHTML = "Не выбраны";
    createWatchersChips.classList.add("muted");
    return;
  }
  createWatchersChips.classList.remove("muted");
  createWatchersChips.innerHTML = Array.from(createSelectedWatchers.entries())
    .map(
      ([id, name]) => `
      <span class="create-watcher-chip" data-watcher-id="${id}">
        ${escapeHtml(name || `#${id}`)}
        <button type="button" data-remove-create-watcher="${id}" title="Убрать" aria-label="Убрать">&times;</button>
      </span>`,
    )
    .join("");
}

function collectCreateWatcherIds() {
  if (!createIssueFullMode) return [];
  return Array.from(createSelectedWatchers.keys())
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function closeCreateWatcherPicker() {
  createWatcherPicker?.classList.add("hidden");
  if (createWatcherPickerSearch) createWatcherPickerSearch.value = "";
  if (createAddWatcherBtn) createAddWatcherBtn.textContent = "+ Добавить";
}

function renderCreateWatcherPickerList() {
  if (!createWatcherPickerList) return;
  const q = String(createWatcherPickerSearch?.value || "")
    .trim()
    .toLowerCase();
  const users = (createWatcherCandidates || []).filter((user) => {
    if (!q) return true;
    return String(user.name || "").toLowerCase().includes(q);
  });
  if (!users.length) {
    createWatcherPickerList.innerHTML = `<div class="muted" style="padding:8px">Нет подходящих пользователей</div>`;
    return;
  }
  createWatcherPickerList.innerHTML = users
    .map((user) => {
      const id = Number(user.id);
      const checked = createSelectedWatchers.has(id) ? " checked" : "";
      return `<label class="create-watcher-pick-item">
        <input type="checkbox" data-create-watcher-pick="${id}"${checked} />
        <span>${escapeHtml(user.name || `#${id}`)}</span>
      </label>`;
    })
    .join("");
}

async function openCreateWatcherPicker() {
  if (createWatcherPicker && !createWatcherPicker.classList.contains("hidden")) {
    closeCreateWatcherPicker();
    return;
  }
  const projectId = Number(createProject?.value || 0);
  if (!projectId) {
    setStatus("Сначала выберите проект.", "error");
    return;
  }
  try {
    createWatcherCandidates = await loadAssigneesForProject(projectId, getFormValues());
  } catch (error) {
    setStatus(error.message || "Не удалось загрузить участников.", "error");
    createWatcherCandidates = [];
  }
  renderCreateWatcherPickerList();
  createWatcherPicker?.classList.remove("hidden");
  if (createAddWatcherBtn) createAddWatcherBtn.textContent = "Скрыть";
  createWatcherPickerSearch?.focus();
}

function toggleCreateWatcherSelection(userId, checked) {
  const id = Number(userId);
  if (!Number.isFinite(id)) return;
  if (checked) {
    const user = (createWatcherCandidates || []).find((u) => Number(u.id) === id);
    createSelectedWatchers.set(id, user?.name || `#${id}`);
  } else {
    createSelectedWatchers.delete(id);
  }
  renderCreateWatcherChips();
}

function setCreateParentSelection(issue) {
  if (!issue?.id) {
    clearCreateParentSelection();
    return;
  }
  if (createParentIdInput) createParentIdInput.value = String(issue.id);
  if (createParentQuery) createParentQuery.value = "";
  createParentSuggestList?.classList.add("hidden");
  if (createParentSelected) {
    createParentSelected.classList.remove("hidden");
    createParentSelected.innerHTML = `
      <span>#${Number(issue.id)} ${escapeHtml(issue.subject || "")}</span>
      <button type="button" class="link-btn" id="create-parent-clear">Сбросить</button>`;
  }
}

function clearCreateParentSelection() {
  if (createParentIdInput) createParentIdInput.value = "";
  if (createParentQuery) createParentQuery.value = "";
  createParentSuggestList?.classList.add("hidden");
  createParentSuggestItems = [];
  if (createParentSelected) {
    createParentSelected.classList.add("hidden");
    createParentSelected.innerHTML = "";
  }
}

function renderCreateParentSuggest(items) {
  createParentSuggestItems = items || [];
  if (!createParentSuggestList) return;
  if (!createParentSuggestItems.length) {
    createParentSuggestList.innerHTML = `<div class="create-parent-suggest-item muted">Ничего не найдено</div>`;
    createParentSuggestList.classList.remove("hidden");
    return;
  }
  createParentSuggestList.innerHTML = createParentSuggestItems
    .map((item, index) => {
      return `<button type="button" class="create-parent-suggest-item" data-idx="${index}">
        <div>${escapeHtml(item.title)}</div>
        ${item.subtitle ? `<div class="muted">${escapeHtml(item.subtitle)}</div>` : ""}
      </button>`;
    })
    .join("");
  createParentSuggestList.classList.remove("hidden");
}

async function searchCreateParentIssues(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const projectId = createProject?.value || "all";
  const idMatch = q.match(/^#?(\d+)$/);
  if (idMatch) {
    try {
      const issue = await window.desktopApi.getIssue({
        ...getFormValues(),
        issueId: Number(idMatch[1]),
        forceRefresh: false,
      });
      if (issue?.id) {
        return [
          {
            id: issue.id,
            title: `#${issue.id} ${issue.subject || ""}`,
            subtitle: issue.project?.name || "",
            issue,
          },
        ];
      }
    } catch {
      /* fall through to text search */
    }
  }
  return searchTrackerIssues(q, projectId === "all" ? null : Number(projectId));
}

function populateCreateStatusSelect() {
  if (!createStatus) return;
  const statuses = referenceData?.issue_statuses || referenceData?.issueStatuses || [];
  const prev = createStatus.value;
  populateSelect(createStatus, statuses, { labelKey: "name" });
  const byPrev =
    prev && Array.from(createStatus.options).some((o) => o.value === prev) ? prev : "";
  if (byPrev) {
    createStatus.value = byPrev;
    return;
  }
  const byNew = statuses.find((s) => {
    const name = String(s.name || "").trim().toLowerCase();
    return name === "новый" || name === "new" || /^нов(ый|ая|ое)\b/.test(name);
  });
  if (byNew) {
    createStatus.value = String(byNew.id);
    return;
  }
  const byDefault = statuses.find((s) => s.is_default || s.is_closed === false);
  if (byDefault) createStatus.value = String(byDefault.id);
}

async function animateCreateIssueModalResize(mutator) {
  const content = document.getElementById("create-issue-modal-content");
  if (!content || createIssueModal?.classList.contains("hidden")) {
    await mutator();
    return;
  }
  const maxH = Math.max(160, window.innerHeight - 32);
  const start = content.getBoundingClientRect();
  content.style.width = `${start.width}px`;
  content.style.height = `${Math.min(start.height, maxH)}px`;
  content.style.maxHeight = `${maxH}px`;
  content.style.overflow = "hidden";
  content.classList.add("is-resizing");

  await mutator();
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));

  const targetWidth = createIssueFullMode
    ? Math.min(780, window.innerWidth * 0.96)
    : Math.min(560, window.innerWidth * 0.94);

  // Measure under the same viewport cap — never animate to taller-than-screen, then snap back.
  content.style.width = `${targetWidth}px`;
  content.style.height = "auto";
  content.style.maxHeight = `${maxH}px`;
  const measured = content.getBoundingClientRect().height;
  const endHeight = Math.min(Math.max(measured, 120), maxH);

  content.style.height = `${Math.min(start.height, maxH)}px`;
  content.style.width = `${start.width}px`;
  void content.offsetHeight;
  content.style.transition =
    "width 0.4s cubic-bezier(0.32, 0.72, 0, 1), height 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
  content.style.width = `${targetWidth}px`;
  content.style.height = `${endHeight}px`;

  await new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      content.style.transition = "";
      content.style.width = "";
      content.style.height = "";
      content.style.maxHeight = "";
      content.style.overflow = "";
      content.classList.remove("is-resizing");
      resolve();
    };
    content.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 480);
  });
}

async function setCreateIssueFullMode(on) {
  await animateCreateIssueModalResize(async () => {
    createIssueFullMode = Boolean(on);
    createIssueModal?.classList.toggle("is-full", createIssueFullMode);
    document.querySelectorAll(".create-full-only").forEach((el) => {
      el.classList.toggle("hidden", !createIssueFullMode);
    });
    createIssueFullBtn?.classList.toggle("hidden", createIssueFullMode);
    createIssueQuickBtn?.classList.toggle("hidden", !createIssueFullMode);
    const title = document.getElementById("create-issue-modal-title");
    if (title) {
      title.textContent = createIssueFullMode ? "Создать задачу — полная форма" : "Создать задачу";
    }

    if (createIssueFullMode) {
      populateCreateStatusSelect();
      createDescriptionQuickWrap?.classList.add("hidden");
      createDescriptionFullWrap?.classList.remove("hidden");
      if (!createDescriptionHtml && createDescription?.value) {
        createDescriptionHtml = `<p>${escapeHtml(createDescription.value).replace(/\n/g, "<br>")}</p>`;
      }
      updateCreateDescriptionPreview();
      renderCreateWatcherChips();
      if (createParentIssueId) {
        setCreateParentSelection({
          id: createParentIssueId,
          subject: createParentLabel?.textContent?.replace(/^#\d+\s*/, "") || "",
        });
      }
      const projectId = Number(createProject?.value || 0);
      if (projectId && !createWatcherCandidates.length) {
        try {
          createWatcherCandidates = await loadAssigneesForProject(projectId, getFormValues());
        } catch {
          createWatcherCandidates = [];
        }
      }
    } else {
      createDescriptionQuickWrap?.classList.remove("hidden");
      createDescriptionFullWrap?.classList.add("hidden");
      closeCreateWatcherPicker();
      createParentSuggestList?.classList.add("hidden");
      if (createDescriptionHtml && createDescription) {
        createDescription.value = descriptionPlainFromHtml(createDescriptionHtml);
      }
    }
    await refreshCreateCustomFields({ reuseCache: true });
  });
}

let createFormFieldsCacheKey = "";

async function refreshCreateCustomFields(options = {}) {
  if (!createCustomFieldsHost) return;
  const projectId = createProject?.value;
  const trackerId = createTracker?.value;
  if (!projectId || !trackerId) {
    createCustomFieldsHost.innerHTML = "";
    createFormFieldDefs = [];
    createFormFieldsCacheKey = "";
    return;
  }
  const cacheKey = `${projectId}:${trackerId}`;
  const canReuse =
    options.reuseCache &&
    createFormFieldsCacheKey === cacheKey &&
    Array.isArray(createFormFieldDefs) &&
    createFormFieldDefs.length > 0;

  try {
    if (!canReuse) {
      const modalOpen = createIssueModal && !createIssueModal.classList.contains("hidden");
      // Avoid empty → «Загружаем…» → fields height jumps while the modal is already visible.
      if (modalOpen && !createCustomFieldsHost.innerHTML.trim()) {
        createCustomFieldsHost.innerHTML = `<div class="muted create-cf-loading">Загружаем поля…</div>`;
      }
      const payload = getFormValues();
      const defs =
        (await window.desktopApi.getIssueFormFields({
          redmineUrl: payload.redmineUrl,
          apiKey: payload.apiKey,
          projectId,
          trackerId,
          forceRefresh: Boolean(options.forceRefresh),
        })) || [];
      createFormFieldDefs = defs;
      createFormFieldsCacheKey = cacheKey;
    }
    const rows = (
      createIssueFullMode
        ? window.CustomFieldForm?.allCreateFieldRows?.(createFormFieldDefs)
        : window.CustomFieldForm?.requiredCreateFieldRows?.(createFormFieldDefs)
    ) || [];
    const filtered = rows.filter((row) => Number(row.id) !== CREATE_ESTIMATE_CF_ID);
    createCustomFieldsHost.innerHTML = filtered.length
      ? window.CustomFieldForm?.renderCreateCustomFieldsHtml?.(filtered) || ""
      : "";
  } catch (error) {
    console.warn("refreshCreateCustomFields:", error.message);
    createCustomFieldsHost.innerHTML = "";
    setStatus(error.message || "Не удалось загрузить поля формы.", "error");
  }
}

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function selectDefaultCreatePriority() {
  if (!createPriority) return;
  const priorities = referenceData?.priorities || [];
  const byDefault = priorities.find((p) => p.is_default);
  const byName = priorities.find((p) => /обычн|normal/i.test(String(p.name || "")));
  const pick = byDefault || byName;
  if (pick) {
    createPriority.value = String(pick.id);
    return;
  }
  if (!createPriority.value && createPriority.options.length) {
    createPriority.selectedIndex = 0;
  }
}

function getDefaultActivityId() {
  const activities = getTimeEntryActivities();
  const byName = activities.find((a) => /разработ/i.test(String(a.name || "")));
  return byName?.id ?? activities[0]?.id ?? "";
}

function populateTimeEntryActivitySelect() {
  if (!timeEntryActivity) return;
  const activities = getTimeEntryActivities();
  populateSelect(timeEntryActivity, activities);
  const defaultId = String(getDefaultActivityId() || "");
  if (defaultId && Array.from(timeEntryActivity.options).some((o) => o.value === defaultId)) {
    timeEntryActivity.value = defaultId;
  } else if (timeEntryActivity.options.length) {
    timeEntryActivity.selectedIndex = 0;
  }
}

function clearCreateIssueValidation() {
  createIssueForm?.querySelectorAll(".field-row.invalid").forEach((row) => {
    row.classList.remove("invalid");
  });
}

function setCreateFieldInvalid(field, invalid, message) {
  const row = field?.closest?.(".field-row");
  if (!row) return;
  row.classList.toggle("invalid", Boolean(invalid));
  const err = row.querySelector(".field-error");
  if (err && message) err.textContent = message;
}

function resetCreateIssueFormDefaults() {
  createParentIssueId = null;
  createPendingAttachments = [];
  createDescriptionHtml = "";
  createDescriptionPendingFiles = [];
  createSelectedWatchers.clear();
  createWatcherCandidates = [];
  closeCreateWatcherPicker();
  clearCreateParentSelection();
  createParentRow?.classList.add("hidden");
  if (createParentLabel) createParentLabel.textContent = "";
  if (createCustomFieldsHost) createCustomFieldsHost.innerHTML = "";
  createFormFieldDefs = [];
  createFormFieldsCacheKey = "";
  if (createDoneRatio) createDoneRatio.value = "0";
  if (createStatus) createStatus.value = "";
  populateCreateStatusSelect();
  descriptionEditorContext = "issue";
  window.DescriptionEditor?.close?.();
  createIssueFullMode = false;
  createIssueModal?.classList.remove("is-full");
  document.querySelectorAll(".create-full-only").forEach((el) => el.classList.add("hidden"));
  createDescriptionQuickWrap?.classList.remove("hidden");
  createDescriptionFullWrap?.classList.add("hidden");
  createIssueFullBtn?.classList.remove("hidden");
  createIssueQuickBtn?.classList.add("hidden");
  const title = document.getElementById("create-issue-modal-title");
  if (title) title.textContent = "Создать задачу";
  updateCreateDescriptionPreview();
  renderCreateWatcherChips();
  renderCreateAttachmentsList();
  clearCreateIssueValidation();
  if (createStartDate) createStartDate.value = todayIsoDate();
  selectDefaultCreatePriority();
  if (createNoDeadlineCheckbox) createNoDeadlineCheckbox.checked = false;
  // Project assignees + CF are loaded by openCreateIssueModal / callers — do not kick off
  // an unawaited refresh here (it made the open modal jerk ~1s later).
}

async function openCreateIssueModal({ parentIssue = null } = {}) {
  const trigger = createIssueButton;
  const prevLabel = trigger?.textContent;
  if (trigger) {
    trigger.disabled = true;
    trigger.textContent = "Открываем…";
  }
  try {
    resetCreateIssueFormDefaults();
    if (parentIssue?.id) {
      createParentIssueId = parentIssue.id;
      createParentRow?.classList.remove("hidden");
      if (createParentLabel) {
        createParentLabel.textContent = `#${parentIssue.id} ${parentIssue.subject || ""}`;
      }
      if (createProject) {
        createProject.value = String(
          parentIssue.project?.id || projectSelect?.value || createProject.value || "",
        );
      }
    } else {
      const filterProjectId =
        projectSelect?.value && projectSelect.value !== "all" ? projectSelect.value : null;
      if (filterProjectId && createProject) createProject.value = filterProjectId;
    }
    try {
      await updateCreateAssigneesForProject();
    } catch (error) {
      setStatus(error.message || "Не удалось подготовить форму создания.", "error");
    }
    createIssueModal?.classList.remove("hidden");
    // Focus without scrolling the page behind the modal (avoids a one-frame nudge).
    requestAnimationFrame(() => {
      createSubject?.focus?.({ preventScroll: true });
    });
  } finally {
    if (trigger) {
      trigger.disabled = false;
      trigger.textContent = prevLabel || "+ Создать задачу";
    }
  }
}

function renderCreateAttachmentsList() {
  if (!createAttachmentsList) return;
  if (!createPendingAttachments.length) {
    createAttachmentsList.innerHTML = "";
    createAttachmentsList.classList.add("hidden");
    return;
  }
  createAttachmentsList.classList.remove("hidden");
  createAttachmentsList.innerHTML = createPendingAttachments
    .map(
      (file, index) => `
      <div class="create-attachment-item" data-index="${index}">
        <span>${escapeHtml(file.filename)}</span>
        <button type="button" class="link-btn" data-remove-attach="${index}">Удалить</button>
      </div>
    `,
    )
    .join("");
}

async function fileToUploadPayload(file) {
  const dataBase64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
  return {
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    dataBase64,
  };
}

async function addCreateAttachments(fileList) {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;
  for (const file of files) {
    const payload = await fileToUploadPayload(file);
    createPendingAttachments.push(payload);
  }
  renderCreateAttachmentsList();
}

function clipboardImageFilename(file) {
  const ext = (file?.type || "").includes("jpeg") || (file?.type || "").includes("jpg")
    ? "jpg"
    : (file?.type || "").includes("gif")
      ? "gif"
      : (file?.type || "").includes("webp")
        ? "webp"
        : "png";
  const stamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 7);
  return `clipboard-${stamp}-${rand}.${ext}`;
}

function insertTextAtCursor(textarea, text) {
  if (!textarea) return;
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? start;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  const needsSpaceBefore = before && !/\s$/.test(before);
  const needsSpaceAfter = after && !/^\s/.test(after);
  const chunk = `${needsSpaceBefore ? "\n" : ""}${text}${needsSpaceAfter ? "\n" : ""}`;
  textarea.value = before + chunk + after;
  const pos = before.length + chunk.length;
  textarea.focus();
  textarea.setSelectionRange(pos, pos);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function renderCommentAttachmentsList() {
  if (!commentAttachmentsList) return;
  if (!commentPendingAttachments.length) {
    commentAttachmentsList.innerHTML = "";
    commentAttachmentsList.classList.add("hidden");
    return;
  }
  commentAttachmentsList.classList.remove("hidden");
  commentAttachmentsList.innerHTML = commentPendingAttachments
    .map(
      (file, index) => `
      <div class="create-attachment-item" data-index="${index}">
        <span>${escapeHtml(file.filename)}</span>
        <button type="button" class="link-btn" data-remove-comment-attach="${index}">Удалить</button>
      </div>
    `,
    )
    .join("");
  issueCommentForm?.classList.add("expanded");
}

function resetCommentComposer() {
  commentPendingAttachments = [];
  if (editNotes) editNotes.value = "";
  renderCommentAttachmentsList();
  issueCommentForm?.classList.remove("expanded");
}

async function addCommentImageFiles(fileList, { insertTokens = true } = {}) {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;
  for (const file of files) {
    const named =
      file.name && file.name !== "image.png"
        ? file
        : new File([file], clipboardImageFilename(file), { type: file.type || "image/png" });
    const payload = await fileToUploadPayload(named);
    commentPendingAttachments.push(payload);
    if (insertTokens && isImageAttachment(named.name) && editNotes) {
      insertTextAtCursor(editNotes, `!${payload.filename}!`);
    }
  }
  renderCommentAttachmentsList();
}

function bindDropZone(element, onFiles, { expandComment = false } = {}) {
  if (!element || typeof onFiles !== "function") return;
  let dragDepth = 0;
  const setActive = (on) => {
    element.classList.toggle("is-dragover", Boolean(on));
    if (expandComment && issueCommentForm) {
      issueCommentForm.classList.toggle("is-dragover", Boolean(on));
      if (on) issueCommentForm.classList.add("expanded");
    }
  };
  element.addEventListener("dragenter", (event) => {
    if (issuePreviewMode) return;
    if (!event.dataTransfer?.types?.includes("Files")) return;
    event.preventDefault();
    dragDepth += 1;
    setActive(true);
  });
  element.addEventListener("dragover", (event) => {
    if (issuePreviewMode) return;
    if (!event.dataTransfer?.types?.includes("Files")) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setActive(true);
  });
  element.addEventListener("dragleave", (event) => {
    if (!event.dataTransfer?.types?.includes("Files")) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) setActive(false);
  });
  element.addEventListener("drop", async (event) => {
    if (issuePreviewMode) return;
    if (!event.dataTransfer?.files?.length) return;
    event.preventDefault();
    dragDepth = 0;
    setActive(false);
    try {
      await onFiles(event.dataTransfer.files);
    } catch (error) {
      setStatus(error.message || "Не удалось добавить файлы", "error");
      showAppToast(error.message || "Не удалось добавить файлы", "error");
    }
  });
}

async function extractClipboardImageFiles(clipboardData) {
  const items = Array.from(clipboardData?.items || []);
  const files = [];
  for (const item of items) {
    if (!item.type?.startsWith("image/")) continue;
    const blob = item.getAsFile();
    if (blob) files.push(blob);
  }
  if (!files.length && clipboardData?.files?.length) {
    for (const file of Array.from(clipboardData.files)) {
      if (file.type?.startsWith("image/")) files.push(file);
    }
  }
  return files;
}

function issueToBoardItem(issue) {
  return {
    id: issue.id,
    subject: issue.subject || "",
    tracker: issue.tracker?.name || "—",
    assignee: issue.assigned_to?.name || "—",
    author: issue.author?.name || "—",
    priority: issue.priority?.name || "—",
    status: issue.status?.name || "—",
    statusId: issue.status?.id || null,
    statusIsClosed: Boolean(issue.status?.is_closed),
    estimatedHours: resolveIssueEstimateHours(issue),
    updated: issue.updated_on ? new Date(issue.updated_on).toLocaleDateString("ru-RU") : "—",
    updatedOn: issue.updated_on ? new Date(issue.updated_on).getTime() : 0,
    doneRatio: issue.done_ratio ?? 0,
    project: issue.project?.name || "—",
    parentId: issue.parent?.id || null,
    parentSubject: issue.parent?.subject || "",
  };
}

function renderIssuesList() {
  if (!issuesList) return;
  const issues = getSortedIssuesForList();
  const favoriteIds = new Set(getFavoriteIssueIds());
  issuesList.innerHTML = issues.length
    ? issues
        .map((issue) => {
          const statusName = issue.status?.name || "-";
          const statusId = issue.status?.id ? String(issue.status.id) : "";
          const dueUrgency = getIssueDueUrgency(issue);
          const dueClass =
            dueUrgency === "overdue" ? " is-overdue" : dueUrgency === "soon" ? " is-due-soon" : "";
          const dueLabel = issue.due_date ? escapeHtml(formatDateRu(issue.due_date)) : "—";
          const favorited = favoriteIds.has(Number(issue.id));
          return `
            <div class="issue-item${dueClass}" role="button" tabindex="0" data-issue-id="${issue.id}">
              <div class="issue-title" data-col="subject">#${issue.id} ${escapeHtml(issue.subject || "(без темы)")}</div>
              <div class="issue-meta" data-col="project">${escapeHtml(issue.project?.name || "-")}</div>
              <div class="issue-meta" data-col="assignee">${escapeHtml(issue.assigned_to?.name || "-")}</div>
              <div class="issue-meta issue-status-cell" data-col="status">
                <button type="button" class="issue-status-btn" data-inline-status="${issue.id}" data-status-id="${escapeHtml(statusId)}" title="Изменить статус">
                  <span class="issue-status-label">${escapeHtml(statusName)}</span>
                  <span class="issue-status-caret" aria-hidden="true">▾</span>
                </button>
              </div>
              <div class="issue-meta" data-col="priority">${escapeHtml(issue.priority?.name || "-")}</div>
              <div class="issue-meta issue-time-cell" data-col="hours">
                <button type="button" class="issue-time-btn" data-inline-time="${issue.id}" title="Внести трудозатраты">
                  <span aria-hidden="true">&#9201;</span>${formatHours(issue.spent_hours)}
                </button>
              </div>
              <div class="issue-meta hidden" data-col="author">${escapeHtml(issue.author?.name || "-")}</div>
              <div class="issue-meta hidden" data-col="estimated_hours">${formatHours(issue.estimated_hours)}</div>
              <div class="issue-meta issue-due-cell hidden" data-col="due">
                <button type="button" class="issue-due-btn" data-inline-due="${issue.id}" data-due="${escapeHtml(issue.due_date || "")}" title="Изменить срок">
                  ${dueLabel}
                </button>
              </div>
              <div class="issue-meta hidden" data-col="updated_on" title="${escapeHtml(issue.updated_on ? formatDateTimeRu(issue.updated_on) : "")}">${issue.updated_on ? escapeHtml(formatDateTimeRu(issue.updated_on)) : "—"}</div>
              <button
                type="button"
                class="issue-fav-btn${favorited ? " is-on" : ""}"
                data-favorite-toggle="${issue.id}"
                aria-pressed="${favorited ? "true" : "false"}"
                title="${favorited ? "Убрать из избранного" : "Добавить в избранное"}"
              >${favorited ? "★" : "☆"}</button>
            </div>
          `;
        })
        .join("")
    : `<div class="muted" style="padding:16px">${
        getIssueScope() === "favorites"
          ? "Нет избранных задач. Нажмите ★ справа в строке списка, чтобы добавить."
          : "Нет задач по текущим фильтрам."
      }</div>`;

  issuesCount.textContent = `${loadedIssues.length} задач`;
  highlightSelectedIssue();
  updateDueSortHeader();
  updatePrioritySortHeader();
  updateProjectSortHeader();
  updateAssigneeSortHeader();
  updateStatusSortHeader();
  updateUpdatedSortHeader();

  const visibleIds = new Set(loadedIssues.map((issue) => Number(issue.id)).filter(Boolean));
  selectedIssueIds.forEach((id) => {
    if (!visibleIds.has(Number(id))) selectedIssueIds.delete(Number(id));
  });
  syncSelectedRowsVisual();

  requestAnimationFrame(() => {
    issuesList.querySelectorAll('.issue-title[data-col="subject"]').forEach((el) => {
      const row = el.closest("[data-issue-id]");
      const issue = loadedIssues.find((item) => Number(item.id) === Number(row?.dataset.issueId));
      if (issue && el.scrollWidth > el.clientWidth) {
        el.title = issue.subject || "";
      } else {
        el.removeAttribute("title");
      }
    });
  });

  issuesList.querySelectorAll(".issue-item[data-issue-id]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (
        event.target.closest(
          "[data-inline-status], [data-inline-due], [data-inline-time], [data-favorite-toggle]",
        )
      ) {
        return;
      }
      const id = Number(row.dataset.issueId);
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        if (selectedIssueIds.has(id)) selectedIssueIds.delete(id);
        else selectedIssueIds.add(id);
        syncSelectedRowsVisual();
        return;
      }
      if (selectedIssueIds.size > 0) {
        selectedIssueIds.clear();
        syncSelectedRowsVisual();
      }
      openIssueDetails(id);
    });
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const id = Number(row.dataset.issueId);
      if (!selectedIssueIds.has(id)) {
        selectedIssueIds.clear();
        selectedIssueIds.add(id);
        syncSelectedRowsVisual();
      }
      openIssueContextMenu(event.clientX, event.clientY);
    });
  });

  issuesList.querySelectorAll("[data-favorite-toggle]").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const id = Number(btn.getAttribute("data-favorite-toggle"));
      const nowFavorite = toggleFavoriteIssue(id);
      btn.classList.toggle("is-on", nowFavorite);
      btn.setAttribute("aria-pressed", nowFavorite ? "true" : "false");
      btn.title = nowFavorite ? "Убрать из избранного" : "Добавить в избранное";
      btn.textContent = nowFavorite ? "★" : "☆";
      if (getIssueScope() === "favorites") {
        await loadIssues(false, { quiet: true });
      }
    });
  });

  if (window.applyColumnSettings) window.applyColumnSettings();
  if (window.applyStatusColors) window.applyStatusColors();
  if (window.__agileBoardRefresh) window.__agileBoardRefresh();
}

function getSortedIssuesForList() {
  if (
    !issuesPrioritySortDir &&
    !issuesDueSortDir &&
    !issuesProjectSortDir &&
    !issuesAssigneeSortDir &&
    !issuesStatusSortDir &&
    !issuesUpdatedSortDir
  ) {
    return loadedIssues;
  }
  if (window.IssueSort?.sortIssues) {
    return window.IssueSort.sortIssues(loadedIssues, {
      priorityDir: issuesPrioritySortDir,
      dueDir: issuesDueSortDir,
      projectDir: issuesProjectSortDir,
      assigneeDir: issuesAssigneeSortDir,
      statusDir: issuesStatusSortDir,
      updatedDir: issuesUpdatedSortDir,
    });
  }
  return loadedIssues.slice();
}

function updateDueSortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="due"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesDueSortDir));
  if (issuesDueSortDir) btn.setAttribute("data-sort-dir", issuesDueSortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesDueSortDir === "asc"
      ? "Срок: по возрастанию (клик — по убыванию)"
      : issuesDueSortDir === "desc"
        ? "Срок: по убыванию (клик — сбросить)"
        : "Сортировать по сроку";
}

function updatePrioritySortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="priority"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesPrioritySortDir));
  if (issuesPrioritySortDir) btn.setAttribute("data-sort-dir", issuesPrioritySortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesPrioritySortDir === "desc"
      ? "Приоритет: сначала важные (клик — сначала низкие)"
      : issuesPrioritySortDir === "asc"
        ? "Приоритет: сначала низкие (клик — сбросить)"
        : "Сортировать по приоритету";
}

function updateProjectSortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="project"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesProjectSortDir));
  if (issuesProjectSortDir) btn.setAttribute("data-sort-dir", issuesProjectSortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesProjectSortDir === "asc"
      ? "Проект: А→Я (клик — Я→А)"
      : issuesProjectSortDir === "desc"
        ? "Проект: Я→А (клик — сбросить)"
        : "Сортировать по проекту";
}

function updateAssigneeSortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="assignee"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesAssigneeSortDir));
  if (issuesAssigneeSortDir) btn.setAttribute("data-sort-dir", issuesAssigneeSortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesAssigneeSortDir === "asc"
      ? "Исполнитель: А→Я (клик — Я→А)"
      : issuesAssigneeSortDir === "desc"
        ? "Исполнитель: Я→А (клик — сбросить)"
        : "Сортировать по исполнителю";
}

function updateStatusSortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="status"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesStatusSortDir));
  if (issuesStatusSortDir) btn.setAttribute("data-sort-dir", issuesStatusSortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesStatusSortDir === "asc"
      ? "Статус: по процессу (клик — в обратном порядке)"
      : issuesStatusSortDir === "desc"
        ? "Статус: обратный порядок (клик — сбросить)"
        : "Сортировать по статусу";
}

function resetOtherSorts(exceptKey) {
  if (exceptKey !== "priority") {
    issuesPrioritySortDir = null;
    try {
      localStorage.removeItem(PRIORITY_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (exceptKey !== "due") {
    issuesDueSortDir = null;
    try {
      localStorage.removeItem(DUE_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (exceptKey !== "project") {
    issuesProjectSortDir = null;
    try {
      localStorage.removeItem(PROJECT_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (exceptKey !== "assignee") {
    issuesAssigneeSortDir = null;
    try {
      localStorage.removeItem(ASSIGNEE_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (exceptKey !== "status") {
    issuesStatusSortDir = null;
    try {
      localStorage.removeItem(STATUS_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (exceptKey !== "updated_on") {
    issuesUpdatedSortDir = null;
    try {
      localStorage.removeItem(UPDATED_SORT_KEY);
    } catch {
      /* ignore */
    }
  }
}

function cycleDueSort() {
  resetOtherSorts("due");
  if (!issuesDueSortDir) issuesDueSortDir = "asc";
  else if (issuesDueSortDir === "asc") issuesDueSortDir = "desc";
  else issuesDueSortDir = null;
  try {
    if (issuesDueSortDir) localStorage.setItem(DUE_SORT_KEY, issuesDueSortDir);
    else localStorage.removeItem(DUE_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function cyclePrioritySort() {
  resetOtherSorts("priority");
  // First click: most important first (desc by weight).
  if (!issuesPrioritySortDir) issuesPrioritySortDir = "desc";
  else if (issuesPrioritySortDir === "desc") issuesPrioritySortDir = "asc";
  else issuesPrioritySortDir = null;
  try {
    if (issuesPrioritySortDir) localStorage.setItem(PRIORITY_SORT_KEY, issuesPrioritySortDir);
    else localStorage.removeItem(PRIORITY_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function cycleProjectSort() {
  resetOtherSorts("project");
  if (!issuesProjectSortDir) issuesProjectSortDir = "asc";
  else if (issuesProjectSortDir === "asc") issuesProjectSortDir = "desc";
  else issuesProjectSortDir = null;
  try {
    if (issuesProjectSortDir) localStorage.setItem(PROJECT_SORT_KEY, issuesProjectSortDir);
    else localStorage.removeItem(PROJECT_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function cycleAssigneeSort() {
  resetOtherSorts("assignee");
  if (!issuesAssigneeSortDir) issuesAssigneeSortDir = "asc";
  else if (issuesAssigneeSortDir === "asc") issuesAssigneeSortDir = "desc";
  else issuesAssigneeSortDir = null;
  try {
    if (issuesAssigneeSortDir) localStorage.setItem(ASSIGNEE_SORT_KEY, issuesAssigneeSortDir);
    else localStorage.removeItem(ASSIGNEE_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function cycleStatusSort() {
  resetOtherSorts("status");
  if (!issuesStatusSortDir) issuesStatusSortDir = "asc";
  else if (issuesStatusSortDir === "asc") issuesStatusSortDir = "desc";
  else issuesStatusSortDir = null;
  try {
    if (issuesStatusSortDir) localStorage.setItem(STATUS_SORT_KEY, issuesStatusSortDir);
    else localStorage.removeItem(STATUS_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function cycleUpdatedSort() {
  resetOtherSorts("updated_on");
  if (!issuesUpdatedSortDir) issuesUpdatedSortDir = "desc";
  else if (issuesUpdatedSortDir === "desc") issuesUpdatedSortDir = "asc";
  else issuesUpdatedSortDir = null;
  try {
    if (issuesUpdatedSortDir) localStorage.setItem(UPDATED_SORT_KEY, issuesUpdatedSortDir);
    else localStorage.removeItem(UPDATED_SORT_KEY);
  } catch {
    /* ignore */
  }
  renderIssuesList();
}

function updateUpdatedSortHeader() {
  const btn = document.querySelector('.issues-columns-head [data-sort-key="updated_on"]');
  if (!btn) return;
  btn.classList.toggle("is-sorted", Boolean(issuesUpdatedSortDir));
  if (issuesUpdatedSortDir) btn.setAttribute("data-sort-dir", issuesUpdatedSortDir);
  else btn.removeAttribute("data-sort-dir");
  btn.title =
    issuesUpdatedSortDir === "desc"
      ? "Изменено: сначала новые (клик — сначала старые)"
      : issuesUpdatedSortDir === "asc"
        ? "Изменено: сначала старые (клик — сбросить)"
        : "Сортировать по дате последнего изменения";
}

function restoreDueSort() {
  try {
    const savedDue = localStorage.getItem(DUE_SORT_KEY);
    if (savedDue === "asc" || savedDue === "desc") issuesDueSortDir = savedDue;
    const savedPriority = localStorage.getItem(PRIORITY_SORT_KEY);
    if (savedPriority === "asc" || savedPriority === "desc") issuesPrioritySortDir = savedPriority;
    const savedProject = localStorage.getItem(PROJECT_SORT_KEY);
    if (savedProject === "asc" || savedProject === "desc") issuesProjectSortDir = savedProject;
    const savedAssignee = localStorage.getItem(ASSIGNEE_SORT_KEY);
    if (savedAssignee === "asc" || savedAssignee === "desc") issuesAssigneeSortDir = savedAssignee;
    const savedStatus = localStorage.getItem(STATUS_SORT_KEY);
    if (savedStatus === "asc" || savedStatus === "desc") issuesStatusSortDir = savedStatus;
    const savedUpdated = localStorage.getItem(UPDATED_SORT_KEY);
    if (savedUpdated === "asc" || savedUpdated === "desc") issuesUpdatedSortDir = savedUpdated;

    // Only one sort key may stay active (legacy could have due+priority together).
    const active = [
      ["due", issuesDueSortDir, DUE_SORT_KEY, (v) => { issuesDueSortDir = v; }],
      ["priority", issuesPrioritySortDir, PRIORITY_SORT_KEY, (v) => { issuesPrioritySortDir = v; }],
      ["project", issuesProjectSortDir, PROJECT_SORT_KEY, (v) => { issuesProjectSortDir = v; }],
      ["assignee", issuesAssigneeSortDir, ASSIGNEE_SORT_KEY, (v) => { issuesAssigneeSortDir = v; }],
      ["status", issuesStatusSortDir, STATUS_SORT_KEY, (v) => { issuesStatusSortDir = v; }],
      ["updated_on", issuesUpdatedSortDir, UPDATED_SORT_KEY, (v) => { issuesUpdatedSortDir = v; }],
    ].filter((row) => Boolean(row[1]));
    if (active.length > 1) {
      active.slice(1).forEach(([, , key, setDir]) => {
        setDir(null);
        localStorage.removeItem(key);
      });
    }
  } catch {
    /* ignore */
  }
  updateDueSortHeader();
  updatePrioritySortHeader();
  updateProjectSortHeader();
  updateAssigneeSortHeader();
  updateStatusSortHeader();
  updateUpdatedSortHeader();
}

async function refreshBoardData() {
  const projectId = projectSelect?.value;
  if (!projectId || projectId === "all") {
    boardIssuesCache = [];
    boardStatusesCache = [];
    if (window.__agileBoardRefresh) window.__agileBoardRefresh();
    return;
  }

  const payload = getBoardPayload();
  const [issues, statuses] = await Promise.all([
    window.desktopApi.loadBoardIssues(payload),
    window.desktopApi.getProjectStatuses({ projectId: Number(projectId) }),
  ]);
  const byId = new Map((issues || []).map((issue) => [Number(issue.id), issue]));
  boardIssuesCache = (issues || []).map((issue) => {
    const parentId = Number(issue.parent?.id);
    if (!parentId) return issue;
    const parent = byId.get(parentId);
    if (!parent) return issue;
    return {
      ...issue,
      parent: { id: parent.id, subject: parent.subject || issue.parent?.subject || "" },
    };
  });
  boardStatusesCache = statuses;
  if (window.__agileBoardRefresh) window.__agileBoardRefresh();
}

async function loadIssues(forceRefresh = false, { quiet = false } = {}) {
  if (forceRefresh && networkOnline) {
    if (!quiet) setStatus("Синхронизируем изменения...", "info");
    try {
      await window.desktopApi.runIncrementalSync();
    } catch (error) {
      if (!quiet) setStatus(`Синхронизация не удалась: ${error.message}`, "error");
      if (quiet) showAppToast(`Синхронизация не удалась: ${error.message}`, "error");
    }
  }

  const payload = getFormValues();
  loadedIssues = await window.desktopApi.loadIssues(payload);
  renderIssuesList();
  await refreshCacheStats();
  await refreshBoardData();
  if (!quiet) setStatus(forceRefresh ? "Список обновлён." : "Готово.");
}

function renderLinkedIssues(container, items, showTag) {
  container.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("a");
    row.className = "linked-issue-item";
    row.href = "#";
    row.addEventListener("click", (e) => {
      e.preventDefault();
      openIssueDetails(item.id);
    });
    if (showTag && item.relation_type) {
      const tag = document.createElement("span");
      tag.className = "relation-tag";
      tag.textContent = item.relation_type;
      row.appendChild(tag);
    }
    const statusText = typeof item.status === "object"
      ? item.status?.name || item.status?.status_name || item.status?.label || ""
      : item.status || "";
    row.innerHTML += `<span class="linked-issue-id">#${item.id}</span><span class="linked-issue-subject">${escapeHtml(item.subject || "")}</span><span class="linked-issue-status">${escapeHtml(statusText)}</span>`;
    container.appendChild(row);
  });
}

function renderSubtasks(container, items) {
  container.innerHTML = "";
  if (!Array.isArray(items) || !items.length) return;

  const head = document.createElement("div");
  head.className = "subtasks-head";
  head.innerHTML = `
    <span>ID</span>
    <span>Тема</span>
    <span>Статус</span>
    <span>Исполнитель</span>
    <span>Срок</span>
  `;
  container.appendChild(head);

  items.forEach((item) => {
    const row = document.createElement("a");
    row.className = "linked-issue-item subtask-item";
    row.href = "#";
    row.addEventListener("click", (e) => {
      e.preventDefault();
      openIssueDetails(item.id);
    });
    const statusText = typeof item.status === "object"
      ? item.status?.name || item.status?.status_name || item.status?.label || "—"
      : item.status || "—";
    const assigneeText = item.assigned_to?.name || item.assigned_to_name || "—";
    const dueText = item.due_date ? formatDateRu(item.due_date) : "—";
    row.innerHTML = `
      <span class="linked-issue-id">#${item.id}</span>
      <span class="linked-issue-subject">${escapeHtml(item.subject || "")}</span>
      <span class="linked-issue-status">${escapeHtml(statusText)}</span>
      <span class="subtask-assignee">${escapeHtml(assigneeText)}</span>
      <span class="subtask-due">${escapeHtml(dueText)}</span>
    `;
    container.appendChild(row);
  });
}

const ATTACHMENT_EXT_LABELS = {
  png: "Изображения PNG",
  jpg: "Изображения JPEG",
  jpeg: "Изображения JPEG",
  gif: "Изображения GIF",
  webp: "Изображения WebP",
  bmp: "Изображения BMP",
  svg: "Изображения SVG",
  xlsx: "Таблицы Excel",
  xls: "Таблицы Excel",
  xlsm: "Таблицы Excel",
  csv: "Таблицы CSV",
  epf: "Внешние обработки 1С",
  erf: "Внешние отчёты 1С",
  pdf: "Документы PDF",
  doc: "Документы Word",
  docx: "Документы Word",
  txt: "Текстовые файлы",
  md: "Текстовые файлы",
  zip: "Архивы ZIP",
  rar: "Архивы RAR",
  "7z": "Архивы 7z",
  json: "JSON",
  xml: "XML",
  log: "Логи",
};

const ATTACHMENT_GROUP_ORDER = [
  "png", "jpg", "jpeg", "gif", "webp", "bmp", "svg",
  "xlsx", "xls", "xlsm", "csv",
  "epf", "erf",
  "pdf", "doc", "docx",
  "txt", "md", "log",
  "zip", "rar", "7z",
  "json", "xml",
];

function getAttachmentExtension(filename) {
  const base = String(filename || "").split(/[?#]/)[0];
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  const ext = base.slice(dot + 1).toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (ext === "xlsm") return "xlsx";
  return ext;
}

function getAttachmentGroupLabel(ext) {
  if (!ext) return "Без расширения";
  return ATTACHMENT_EXT_LABELS[ext] || ext.toUpperCase();
}

function compareAttachmentGroups(a, b) {
  const ai = ATTACHMENT_GROUP_ORDER.indexOf(a.ext);
  const bi = ATTACHMENT_GROUP_ORDER.indexOf(b.ext);
  if (ai !== -1 || bi !== -1) {
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  }
  return a.label.localeCompare(b.label, "ru");
}

function groupAttachmentsByExtension(attachments) {
  const groups = new Map();
  for (const attachment of attachments) {
    const ext = getAttachmentExtension(attachment.filename);
    if (!groups.has(ext)) {
      groups.set(ext, { ext, label: getAttachmentGroupLabel(ext), items: [] });
    }
    groups.get(ext).items.push(attachment);
  }
  for (const group of groups.values()) {
    group.items.sort((a, b) => {
      const at = new Date(a.created_on || 0).getTime();
      const bt = new Date(b.created_on || 0).getTime();
      return bt - at;
    });
  }
  return Array.from(groups.values()).sort(compareAttachmentGroups);
}

function formatAttachmentDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAttachmentMeta(attachment) {
  const author = attachment.author?.name || attachment.author_name || "";
  const date = formatAttachmentDateTime(attachment.created_on);
  if (author && date) return `${author}, ${date}`;
  return author || date || "";
}

function isImageAttachment(filename) {
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(String(filename || ""));
}

function openImageLightbox(src) {
  const overlay = document.getElementById("image-lightbox");
  const img = document.getElementById("image-lightbox-img");
  if (!overlay || !img || !src) return false;
  img.src = src;
  overlay.classList.remove("hidden");
  return true;
}

async function openAttachmentImagePreview(payload, filename, contentUrl) {
  if (!networkOnline) {
    setStatus("Нет сети: изображение нельзя открыть.", "error");
    return;
  }
  setStatus("Открываем изображение…");
  try {
    const preview = await window.desktopApi.getAttachmentPreview({
      ...payload,
      contentUrl,
    });
    if (!preview?.ok || !preview.dataBase64) {
      throw new Error(preview?.error || "Не удалось загрузить изображение.");
    }
    const dataUrl = `data:${preview.mimeType || "image/png"};base64,${preview.dataBase64}`;
    if (!openImageLightbox(dataUrl)) {
      throw new Error("Не удалось открыть просмотр.");
    }
  } catch (error) {
    setStatus(`Не удалось открыть изображение: ${error.message}`, "error");
  }
}

async function renderAttachments(attachments, payload) {
  const list = Array.isArray(attachments) ? attachments : [];
  if (!list.length) {
    issueAttachments.innerHTML = `<span class="muted">Вложений пока нет — перетащите файлы сюда</span>`;
    issueAttachments.classList.add("muted");
    return;
  }

  issueAttachments.classList.remove("muted");
  const groups = groupAttachmentsByExtension(list);
  issueAttachments.innerHTML = `<div class="attachments-grouped">${groups
    .map((group) => {
      const rows = group.items
        .map((attachment) => {
          const size = attachment.filesize
            ? `<span class="attachment-size">(${formatBytes(attachment.filesize)})</span>`
            : "";
          const meta = formatAttachmentMeta(attachment);
          const metaHtml = meta ? `<span class="attachment-meta">${escapeHtml(meta)}</span>` : "";
          const isImage = isImageAttachment(attachment.filename);
          const canDelete = Number(attachment.id) > 0;
          const deleteBtn = canDelete
            ? `<button type="button" class="attachment-delete-btn" data-delete-attachment="${Number(attachment.id)}" data-filename="${escapeHtml(attachment.filename || "")}" title="Удалить вложение">Удалить</button>`
            : `<span class="attachment-meta">отправка…</span>`;
          return `<div class="attachment-row"><button type="button" class="attachment-link${isImage ? " is-image" : ""}" data-content-url="${escapeHtml(attachment.content_url || "")}" data-filename="${escapeHtml(attachment.filename || "")}" data-is-image="${isImage ? "1" : "0"}">${escapeHtml(attachment.filename)}</button>${size}${metaHtml}${deleteBtn}</div>`;
        })
        .join("");
      return `<section class="attachment-group"><header class="attachment-group-head"><span class="attachment-group-title">${escapeHtml(group.label)}</span><span class="attachment-group-count">${group.items.length}</span></header><div class="attachment-group-list">${rows}</div></section>`;
    })
    .join("")}</div>`;

  issueAttachments.querySelectorAll(".attachment-link").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const filename = btn.dataset.filename || "";
      const contentUrl = btn.dataset.contentUrl || "";
      if (!contentUrl) {
        setStatus("Файл ещё отправляется в Redmine.", "info");
        return;
      }
      if (btn.dataset.isImage === "1" || isImageAttachment(filename)) {
        await openAttachmentImagePreview(payload, filename, contentUrl);
        return;
      }
      try {
        btn.disabled = true;
        const label = filename ? `«${filename}»` : "файла";
        setStatus(`Идёт скачивание ${label}…`, "info");
        showAppToast(`Идёт скачивание ${label}…`, "loading", { sticky: true });
        const result = await window.desktopApi.downloadAttachment({
          ...payload,
          filename,
          contentUrl,
        });
        if (result?.cancelled) {
          hideAppToast();
          setStatus("Скачивание отменено.", "info");
          return;
        }
        if (result.ok) notifyFileSaved(result.filePath);
        else {
          hideAppToast();
          setStatus(result?.error || "Не удалось скачать файл", "error");
          showAppToast(result?.error || "Не удалось скачать файл", "error");
        }
      } catch (error) {
        hideAppToast();
        const msg = cleanIpcErrorMessage(error) || error.message || "Не удалось скачать файл";
        setStatus(`Не удалось скачать файл: ${msg}`, "error");
        showAppToast(msg, "error");
      } finally {
        btn.disabled = false;
      }
    });
  });

  issueAttachments.querySelectorAll("[data-delete-attachment]").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const attachmentId = Number(btn.dataset.deleteAttachment);
      const filename = btn.dataset.filename || "файл";
      if (!Number.isFinite(attachmentId) || attachmentId <= 0 || !selectedIssueId) return;
      try {
        const confirmed = await confirmAction(`Удалить «${filename}» из задачи?`, {
          title: "Удалить вложение",
          detail: "Файл будет удалён в Redmine.",
          buttons: ["Отмена", "Удалить"],
          cancelId: 0,
          confirmId: 1,
        });
        if (!confirmed) return;
        btn.disabled = true;
        btn.textContent = "Удаляем…";
        await window.desktopApi.deleteAttachment({
          ...getFormValues(),
          attachmentId,
          issueId: selectedIssueId,
        });
        if (currentIssue?.attachments) {
          currentIssue.attachments = currentIssue.attachments.filter((a) => Number(a.id) !== attachmentId);
        }
        await renderAttachments(currentIssue?.attachments || [], getFormValues());
        setStatus("Вложение удалено локально и будет синхронизировано.", "success");
        showAppToast("Вложение удалено", "success");
      } catch (error) {
        btn.disabled = false;
        btn.textContent = "Удалить";
        setStatus(`Не удалось удалить вложение: ${error.message}`, "error");
        showAppToast(error.message || "Не удалось удалить вложение", "error");
      }
    });
  });
}

async function attachFilesToCurrentIssue(fileList) {
  if (issuePreviewMode) return;
  if (!selectedIssueId) {
    setStatus("Сначала откройте задачу.", "error");
    return;
  }
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) return;

  const uploads = [];
  for (const file of files) {
    uploads.push(await fileToUploadPayload(file));
  }

  const user = getCurrentUserRef();
  const userName =
    user?.name ||
    [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
    "Вы";
  const optimistic = uploads.map((file, index) => ({
    id: -(Date.now() + index),
    filename: file.filename,
    filesize: Math.round(((file.dataBase64 || "").length * 3) / 4) || 0,
    content_type: file.contentType,
    content_url: "",
    author: { name: userName },
    author_name: userName,
    created_on: new Date().toISOString(),
    _pending: true,
  }));

  if (!currentIssue) currentIssue = { id: selectedIssueId, attachments: [] };
  currentIssue.attachments = [...optimistic, ...(currentIssue.attachments || [])];
  await renderAttachments(currentIssue.attachments, getFormValues());

  try {
    const result = await window.desktopApi.updateIssue({
      ...getFormValues(),
      issueId: selectedIssueId,
      patch: { files: uploads },
    });
    const queued = Boolean(result.offline || result.queued);
    setStatus(
      queued
        ? `Файлы добавлены локально (${uploads.length}) и будут отправлены в фоне.`
        : `Добавлено файлов: ${uploads.length}`,
      "success",
    );
    showAppToast(uploads.length === 1 ? "Файл прикреплён" : `Прикреплено: ${uploads.length}`, "success");
  } catch (error) {
    currentIssue.attachments = (currentIssue.attachments || []).filter(
      (a) => !optimistic.some((o) => Number(o.id) === Number(a.id)),
    );
    await renderAttachments(currentIssue.attachments, getFormValues());
    setStatus(`Не удалось прикрепить файлы: ${error.message}`, "error");
    showAppToast(error.message || "Не удалось прикрепить файлы", "error");
  }
}

function attachmentPaintKey(attachments) {
  return (attachments || [])
    .map((att) => `${att?.id || ""}:${att?.filename || ""}:${att?.content_url || ""}`)
    .join("|");
}

function issueDetailPaintFingerprint(issue) {
  if (!issue) return "";
  return [
    issue.id,
    issue.updated_on || "",
    issue.description || "",
    issue.status?.id ?? "",
    issue.assigned_to?.id ?? "",
    issue.priority?.id ?? "",
    issue.done_ratio ?? "",
    issue.due_date || "",
    issue.estimated_hours ?? "",
    issue.spent_hours ?? "",
    issue.subject || "",
    attachmentPaintKey(issue.attachments),
    (issue.journals || []).map((j) => `${j?.id || ""}:${j?.updated_on || j?.created_on || ""}`).join(","),
    (issue.watchers || []).map((w) => w?.id).join(","),
  ].join("\n");
}

async function openIssueDetails(
  issueId,
  { forceRefresh = false, quiet = false, preview, backgroundRefresh = true, skipNavPush = false } = {},
) {
  const usePreview = preview === true || (preview !== false && issuePreviewMode);
  const pageWasVisible = issuePage && !issuePage.classList.contains("hidden");
  const fromCard =
    !skipNavPush &&
    !usePreview &&
    pageWasVisible &&
    Number(selectedIssueId) > 0 &&
    Number(selectedIssueId) !== Number(issueId);
  issueNavStack.pushIfNavigating(selectedIssueId, issueId, { fromCard });

  // Keep last rendered card when reopening the same issue (session cache until app exit).
  const keepVisible =
    quiet || (currentIssue && Number(currentIssue.id) === Number(issueId));
  const prevIssueForPaint =
    currentIssue && Number(currentIssue.id) === Number(issueId) ? currentIssue : null;
  selectedIssueId = issueId;
  const navGen = issueNavGeneration;
  closeWatcherPicker();
  closeListInlinePopover();
  if (usePreview) showIssuePreviewDrawer();
  else showIssuePage();
  if (!keepVisible) {
    const stub = loadedIssues.find((item) => Number(item.id) === Number(issueId));
    issueTitle.textContent = stub
      ? `#${stub.id} ${stub.subject || "(без темы)"}`
      : `Задача #${issueId}`;
    issueDescription.textContent = "Загружаем...";
    resetDescriptionCollapse();
    editDescriptionBtn?.classList.add("hidden");
    window.DescriptionEditor?.close();
    issueAttachments.textContent = "Загружаем...";
    if (issueJournalsComments) issueJournalsComments.textContent = "Загружаем...";
    if (issueJournalsHistory) issueJournalsHistory.textContent = "Загружаем...";
    setActivityTab("comments");
  }

  const stillOnCard = () =>
    window.IssueNav?.shouldContinueIssueOpen?.({
      navGeneration: issueNavGeneration,
      expectedGeneration: navGen,
      selectedIssueId,
      issueId,
      issuePageVisible: issuePage && !issuePage.classList.contains("hidden"),
      previewMode: usePreview && issuePreviewMode,
    }) ??
    (Number(selectedIssueId) === Number(issueId) &&
      ((usePreview && issuePreviewMode) || (issuePage && !issuePage.classList.contains("hidden"))));

  const applyListStatus = (raw) =>
    window.IssueNav?.mergeIssueStatusFromList?.(raw, loadedIssues) || raw;

  try {
    const payload = getFormValues();
    let issue = await window.desktopApi.getIssue({
      ...payload,
      issueId,
      forceRefresh,
    });
    if (!stillOnCard()) return;
    if (!issue) throw new Error("Задача не найдена в локальном кэше.");
    issue = applyListStatus(issue);

    currentIssue = issue;
    patchLoadedIssueSpentHours(issue.id, issue.spent_hours);
    issueTitle.textContent = `#${issue.id} ${issue.subject || "(без темы)"}`;
    issueTitle.title = issueTitle.textContent;

    const relatedMatch = String(issue.subject || "").match(/#(\d+)/);
    if (relatedMatch && Number(relatedMatch[1]) !== issue.id) {
      issueRelatedChip.textContent = `Открыть связанную #${relatedMatch[1]}`;
      issueRelatedChip.classList.remove("hidden");
      issueRelatedChip.onclick = (e) => {
        e.preventDefault();
        openIssueDetails(Number(relatedMatch[1]));
      };
    } else {
      issueRelatedChip.classList.add("hidden");
    }

    if (issue.parent?.id) {
      const parentLabel = `Родительская #${issue.parent.id}${issue.parent.subject ? ` ${issue.parent.subject}` : ""}`;
      issueParentChip.textContent = parentLabel;
      issueParentChip.title = parentLabel;
      issueParentChip.classList.remove("hidden");
      issueParentChip.onclick = (e) => {
        e.preventDefault();
        openIssueDetails(Number(issue.parent.id));
      };
    } else {
      issueParentChip?.classList.add("hidden");
      if (issueParentChip) issueParentChip.removeAttribute("title");
    }

    const estimateCf = findEstimateCustomField(issue);
    const cfDefs = await loadIssueCustomFieldDefs(issue);
    if (!stillOnCard()) return;
    currentIssueCustomFieldRows =
      window.CustomFieldForm?.mergeCustomFieldRows?.(cfDefs, issue.custom_fields || []) || [];
    const cfRowsForDisplay = issueCustomFieldRowsForDisplay(issue);
    const otherCustomFieldsHtml =
      window.CustomFieldForm?.renderCustomFieldsViewHtml?.(cfRowsForDisplay) || "";
    updateIssueCustomFieldsEdit(cfRowsForDisplay);
    updateIssueFavoriteButton(issue.id);
    const dueLabel = issue.due_date ? formatDateRu(issue.due_date) : "-";
    const estimateValue = resolveIssueEstimateHours(issue);

    issueMainMeta.innerHTML = `
      <div class="kv-key">Проект</div><div>${escapeHtml(issue.project?.name || "-")}</div>
      <div class="kv-key">Трудозатраты</div>
      <div class="issue-spent-actions">
        <button type="button" class="issue-time-btn" data-inline-time="${issue.id}" title="Внести трудозатраты">
          <span aria-hidden="true">&#9201;</span>${formatHours(issue.spent_hours)}
        </button>
        <button type="button" class="link-btn" data-show-issue-time-entries="${issue.id}">Показать все</button>
      </div>
      <div class="kv-key">Трекер</div><div>${escapeHtml(issue.tracker?.name || "-")}</div>
      <div class="kv-key">Оценка</div>
      <div>
        <span class="field-view">${formatHours(estimateValue)}</span>
        <input id="edit-estimated-hours" type="number" min="0" step="0.1" class="field-edit" value="${escapeHtml(estimateValue ?? "")}" />
      </div>
      <div class="kv-key">Статус</div>
      <div>
        <button
          type="button"
          id="issue-status-quick-btn"
          class="field-view issue-status-btn"
          data-inline-status="${issue.id}"
          data-status-id="${escapeHtml(issue.status?.id ?? "")}"
          title="Изменить статус"
        >
          <span class="issue-status-label">${escapeHtml(issue.status?.name || "-")}</span>
          <span class="issue-status-caret" aria-hidden="true">▾</span>
        </button>
        <select id="edit-status" class="field-edit"></select>
      </div>
      <div class="kv-key">Готовность</div>
      <div>
        <span class="field-view">${issue.done_ratio ?? 0}%</span>
        <select id="edit-done-ratio" class="field-edit"></select>
      </div>
      <div class="kv-key">Приоритет</div>
      <div>
        <span class="field-view">${escapeHtml(issue.priority?.name || "-")}</span>
        <select id="edit-priority" class="field-edit"></select>
      </div>
      <div class="kv-key">Срок завершения</div>
      <div>
        <span class="field-view">${dueLabel}</span>
        <input id="edit-due-date" type="date" class="field-edit" value="${escapeHtml(issue.due_date || "")}" />
      </div>
      <div class="kv-key">Исполнитель</div>
      <div>
        <span class="field-view">${escapeHtml(issue.assigned_to?.name || "-")}</span>
        <select id="edit-assignee" class="field-edit"></select>
      </div>
      <div class="kv-key">Обновлено</div><div>${issue.updated_on ? new Date(issue.updated_on).toLocaleString("ru-RU") : "-"}</div>
      <div class="kv-key">Автор</div><div>${escapeHtml(issue.author?.name || "-")}</div>
      ${otherCustomFieldsHtml}
    `;

    rebindIssueEditFields();
    populateIssueEditSelects();
    await populateIssueStatusSelect(issue);
    // Quick status change (like on tasks list), without switching to edit mode.
    const quickStatusBtn = document.getElementById("issue-status-quick-btn");
    if (quickStatusBtn) {
      quickStatusBtn.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        openInlineStatusPopover(issue.id, quickStatusBtn, issue.status?.id);
      };
    }
    populateDoneRatioSelect(editDoneRatio, issue.done_ratio ?? 0);
    await populateIssueEditAssignee(issue);
    if (editStatus) editStatus.value = issue.status?.id ? String(issue.status.id) : "";
    if (editPriority) editPriority.value = issue.priority?.id ? String(issue.priority.id) : "";
    if (editDueDate) editDueDate.value = issue.due_date || "";
    if (editEstimatedHours) editEstimatedHours.value = estimateValue ?? "";

    const attachmentsMap = {};
    (issue.attachments || []).forEach((att) => {
      attachmentsMap[att.filename] = att.content_url;
    });
    currentIssueAttachmentsMap = attachmentsMap;
    editDescriptionBtn?.classList.remove("hidden");

    // Re-applying description tears down <img> nodes and re-hydrates previews —
    // that is what made images flash twice on reopen (cache paint + background refresh).
    const descriptionUnchanged =
      prevIssueForPaint &&
      String(prevIssueForPaint.description || "") === String(issue.description || "") &&
      attachmentPaintKey(prevIssueForPaint.attachments) === attachmentPaintKey(issue.attachments);
    if (!(keepVisible && descriptionUnchanged)) {
      await applyRenderedDescription(issue.description || "");
    }

    const attachmentsUnchanged =
      prevIssueForPaint &&
      attachmentPaintKey(prevIssueForPaint.attachments) === attachmentPaintKey(issue.attachments);
    if (!(keepVisible && attachmentsUnchanged)) {
      await renderAttachments(issue.attachments || [], payload);
    }

    if (issue.children?.length) {
      renderSubtasks(issueChildren, issue.children);
      issueChildren.classList.remove("muted");
      issueChildrenBlock.classList.remove("hidden");
    } else {
      issueChildrenBlock.classList.add("hidden");
    }

    if (issue.relations?.length) {
      renderLinkedIssues(
        issueRelations,
        issue.relations.map((rel) => ({
          id: rel.issue_to?.id,
          subject: rel.issue_to?.subject,
          status: rel.issue_to?.status,
          relation_type: rel.relation_type,
        })),
        true,
      );
      issueRelations.classList.remove("muted");
      issueRelationsBlock.classList.remove("hidden");
    } else {
      issueRelationsBlock.classList.add("hidden");
    }

    currentIssueJournals = issue.journals || [];
    currentIssueJournalLookups = await buildJournalLookups(currentIssue, currentIssueJournals);
    const sortBtn = document.getElementById("toggle-journal-sort-btn");
    if (sortBtn) {
      sortBtn.textContent = journalSortOrder === "desc" ? "Сначала старые" : "Сначала новые";
    }
    renderJournalsList(currentIssueJournals);

    renderIssueWatchers(issue);
    syncEditWatchersSelection(issue);

    if (editSubject) editSubject.value = issue.subject || "";
    if (editStartDate) editStartDate.value = issue.start_date || "";
    editNotes.value = "";
    commentPendingAttachments = [];
    renderCommentAttachmentsList();
    issueCommentForm?.classList.remove("expanded");
    setIssueEditingMode(false);
    if (window.applyStatusColors) window.applyStatusColors();

    if (networkOnline && backgroundRefresh && !forceRefresh) {
      const openedFingerprint = issueDetailPaintFingerprint(issue);
      const paintedStatusId = Number(issue.status?.id);
      window.desktopApi
        .getIssue({ ...payload, issueId, forceRefresh: true })
        .then((freshRaw) => {
          if (!stillOnCard()) return;
          if (!freshRaw) return;
          let fresh = applyListStatus(freshRaw);
          // Keep local/optimistic status if list still disagrees with remote.
          if (
            Number.isFinite(paintedStatusId) &&
            paintedStatusId > 0 &&
            Number(fresh.status?.id) !== paintedStatusId
          ) {
            const fromList = loadedIssues.find((row) => Number(row.id) === Number(issueId));
            if (fromList?.status?.id && Number(fromList.status.id) === paintedStatusId) {
              fresh = { ...fresh, status: { ...fromList.status } };
            }
          }
          // Nothing meaningful changed — keep hydrated images/DOM as-is.
          if (issueDetailPaintFingerprint(fresh) === openedFingerprint) {
            currentIssue = fresh;
            return;
          }
          return openIssueDetails(issueId, {
            forceRefresh: false,
            quiet: true,
            preview: usePreview,
            backgroundRefresh: false,
          });
        })
        .catch(() => {});
    }
  } catch (error) {
    if (!stillOnCard()) return;
    issueDescription.textContent = `Не удалось загрузить задачу #${issueId}: ${error.message}`;
    setStatus(error.message, "error");
  }
}

function syncEditWatchersSelection(issue) {
  if (!editWatchers) return;
  const watcherIds = new Set((issue.watchers || []).map((w) => String(w.id)));
  Array.from(editWatchers.options).forEach((option) => {
    option.selected = watcherIds.has(option.value);
  });
}

function renderIssueWatchers(issue) {
  if (!issueWatchers) return;
  const watchers = Array.isArray(issue?.watchers) ? issue.watchers : [];
  if (!watchers.length) {
    issueWatchers.classList.add("muted");
    issueWatchers.textContent = "Нет наблюдателей.";
    return;
  }
  issueWatchers.classList.remove("muted");
  issueWatchers.innerHTML = watchers
    .map((w) => {
      const name = w.name || `Пользователь #${w.id}`;
      return `<div class="watcher-row" data-watcher-id="${Number(w.id)}">
        <span class="watcher-avatar">${escapeHtml(name.slice(0, 2))}</span>
        <span class="watcher-row-name">${escapeHtml(name)}</span>
        <button type="button" class="watcher-remove-btn" data-remove-watcher="${Number(w.id)}" data-watcher-name="${escapeHtml(name)}" title="Удалить наблюдателя">&times;</button>
      </div>`;
    })
    .join("");
}

function closeWatcherPicker() {
  watcherPicker?.classList.add("hidden");
  if (watcherPickerSearch) watcherPickerSearch.value = "";
  if (watcherPickerList) watcherPickerList.innerHTML = "";
  watcherPickerUsers = [];
  watcherPickerSelectedIds = new Set();
  if (watcherPickerApply) watcherPickerApply.disabled = false;
}

function syncWatcherPickerSelectionFromDom() {
  if (!watcherPickerList) return;
  watcherPickerList.querySelectorAll('input[type="checkbox"][data-watcher-id]').forEach((el) => {
    const id = Number(el.getAttribute("data-watcher-id"));
    if (!Number.isFinite(id)) return;
    if (el.checked) watcherPickerSelectedIds.add(id);
    else watcherPickerSelectedIds.delete(id);
  });
}

function getCheckedWatcherPickerIds() {
  syncWatcherPickerSelectionFromDom();
  return Array.from(watcherPickerSelectedIds);
}

function renderWatcherPickerList(filter = "") {
  if (!watcherPickerList) return;
  syncWatcherPickerSelectionFromDom();
  const q = String(filter || "").trim().toLowerCase();
  const currentIds = new Set((currentIssue?.watchers || []).map((w) => Number(w.id)));
  const users = watcherPickerUsers.filter((user) => {
    if (!user?.id || currentIds.has(Number(user.id))) return false;
    if (!q) return true;
    return String(user.name || "").toLowerCase().includes(q);
  });
  if (!users.length) {
    watcherPickerList.innerHTML = `<div class="muted" style="padding:8px">Нет подходящих пользователей</div>`;
    return;
  }
  watcherPickerList.innerHTML = users
    .map((user) => {
      const id = Number(user.id);
      const name = user.name || `Пользователь #${id}`;
      const checked = watcherPickerSelectedIds.has(id) ? " checked" : "";
      return `<label class="watcher-picker-item">
        <input type="checkbox" data-watcher-id="${id}"${checked} />
        <span>${escapeHtml(name)}</span>
      </label>`;
    })
    .join("");
}

async function openWatcherPicker() {
  if (!currentIssue?.project?.id) {
    setStatus("Не удалось определить проект задачи.", "error");
    return;
  }
  if (watcherPicker && !watcherPicker.classList.contains("hidden")) {
    closeWatcherPicker();
    return;
  }
  const payload = getFormValues();
  try {
    watcherPickerUsers = await loadAssigneesForProject(Number(currentIssue.project.id), payload);
    watcherPicker?.classList.remove("hidden");
    renderWatcherPickerList("");
    watcherPickerSearch?.focus();
  } catch (error) {
    setStatus(error.message || "Не удалось загрузить участников проекта.", "error");
  }
}

function setCurrentIssueWatchersOptimistic(nextWatchers) {
  if (!currentIssue) return;
  currentIssue = { ...currentIssue, watchers: nextWatchers };
  renderIssueWatchers(currentIssue);
  syncEditWatchersSelection(currentIssue);
}

async function applyWatcherIds(nextIds, successMessage) {
  if (!selectedIssueId || !currentIssue) return;
  const ids = nextIds.map(Number).filter((id) => Number.isFinite(id) && id > 0);
  const byId = new Map([
    ...(currentIssue.watchers || []).map((w) => [Number(w.id), w]),
    ...watcherPickerUsers.map((u) => [Number(u.id), { id: Number(u.id), name: u.name || `Пользователь #${u.id}` }]),
  ]);
  const optimistic = ids.map((id) => byId.get(id) || { id, name: `Пользователь #${id}` });
  const previous = (currentIssue.watchers || []).slice();
  setCurrentIssueWatchersOptimistic(optimistic);
  closeWatcherPicker();

  try {
    await patchIssueFields(
      selectedIssueId,
      { watcher_user_ids: ids },
      { successMessage },
    );
  } catch (error) {
    setCurrentIssueWatchersOptimistic(previous);
    setStatus(error.message || "Не удалось обновить наблюдателей.", "error");
  }
}

async function applySelectedWatchersFromPicker() {
  if (!currentIssue) return;
  const picked = getCheckedWatcherPickerIds();
  if (!picked.length) {
    setStatus("Отметьте хотя бы одного пользователя.", "error");
    return;
  }
  if (watcherPickerApply) watcherPickerApply.disabled = true;
  const currentIds = (currentIssue.watchers || []).map((w) => Number(w.id)).filter(Boolean);
  const merged = Array.from(new Set([...currentIds, ...picked]));
  const count = picked.length;
  try {
    await applyWatcherIds(
      merged,
      count === 1 ? "Наблюдатель добавлен." : `Добавлено наблюдателей: ${count}.`,
    );
  } finally {
    if (watcherPickerApply) watcherPickerApply.disabled = false;
  }
}

async function removeWatcherById(userId, userName) {
  const id = Number(userId);
  if (!Number.isFinite(id) || !currentIssue) return;
  const ok = await confirmAction(`Удалить наблюдателя «${userName || id}» из задачи?`);
  if (!ok) return;
  const nextIds = (currentIssue.watchers || [])
    .map((w) => Number(w.id))
    .filter((wid) => wid && wid !== id);
  await applyWatcherIds(nextIds, `Наблюдатель «${userName || id}» удалён.`);
}

async function openInlineStatusPopover(issueId, anchorEl, currentStatusId) {
  const allStatuses = getReferenceStatuses();
  if (!listInlinePopover || !listInlinePopoverBody) return;
  if (!allStatuses.length) {
    setStatus("Справочник статусов ещё не загружен. Выполните синхронизацию.", "error");
    return;
  }
  let statuses = allStatuses;
  const issue =
    loadedIssues.find((item) => Number(item.id) === Number(issueId)) ||
    (currentIssue && Number(currentIssue.id) === Number(issueId) ? currentIssue : null);
  if (window.ProjectStatusSettings) {
    const projectId = issue?.project?.id ? Number(issue.project.id) : getCurrentProjectIdValue();
    const effective = window.ProjectStatusSettings.getEffectiveStatuses(projectId, allStatuses, allStatuses);
    if (effective.length) statuses = effective;
  }
  listInlinePopoverIssueId = Number(issueId);
  listInlinePopoverKind = "status";
  listInlinePopoverBody.innerHTML = `
    <div class="list-inline-popover-title">Статус</div>
    <div class="list-inline-status-list">
      ${statuses
        .map((status) => {
          const id = String(status.id);
          const current = id === String(currentStatusId || "") ? " is-current" : "";
          return `<button type="button" class="list-inline-status-item${current}" data-set-status="${id}">${escapeHtml(status.name || `#${id}`)}</button>`;
        })
        .join("")}
    </div>
  `;
  // Position after paint so offsetWidth/Height are correct with fixed CSS.
  requestAnimationFrame(() => positionListInlinePopover(anchorEl));
}

function openInlineDuePopover(issueId, anchorEl, currentDue) {
  if (!listInlinePopover || !listInlinePopoverBody) return;
  listInlinePopoverIssueId = Number(issueId);
  listInlinePopoverKind = "due";
  listInlinePopoverBody.innerHTML = `
    <div class="list-inline-popover-title">Срок завершения</div>
    <input type="date" id="inline-due-input" value="${escapeHtml(currentDue || "")}" />
    <div class="list-inline-due-actions">
      <button type="button" class="btn-primary btn-sm" id="inline-due-save">Сохранить</button>
      <button type="button" class="btn-secondary btn-sm" id="inline-due-clear">Очистить</button>
      <button type="button" class="btn-secondary btn-sm" id="inline-due-cancel">Отмена</button>
    </div>
  `;
  requestAnimationFrame(() => {
    positionListInlinePopover(anchorEl);
    document.getElementById("inline-due-input")?.focus();
  });
}

function openInlineTimePopover(issueId, anchorEl) {
  if (!listInlinePopover || !listInlinePopoverBody) return;
  const activities = referenceData?.activities || [];
  if (!activities.length) {
    setStatus("Справочник видов деятельности ещё не загружен. Выполните синхронизацию.", "error");
    return;
  }
  const defaultActivityId = String(getDefaultActivityId() || "");
  const today = todayIsoDate();
  const draft = inlineTimeDraftsByIssueId.get(Number(issueId)) || null;
  listInlinePopoverIssueId = Number(issueId);
  listInlinePopoverKind = "time";
  listInlinePopover.classList.add("is-time");
  const activityOptions = activities
    .map((a) => {
      const id = String(a.id);
      const selected =
        (draft?.activityId && id === String(draft.activityId)) ||
        (!draft?.activityId && id === defaultActivityId)
          ? " selected"
          : "";
      return `<option value="${escapeHtml(id)}"${selected}>${escapeHtml(a.name || `#${id}`)}</option>`;
    })
    .join("");
  listInlinePopoverBody.innerHTML = `
    <div class="list-inline-popover-title">Трудозатраты</div>
    <div class="list-inline-popover-scroll">
      <div class="field-row">
        <label for="inline-time-comment">Комментарий <span class="req">*</span></label>
        <textarea id="inline-time-comment" rows="3" placeholder="Что сделано…" spellcheck="true" lang="ru"></textarea>
        <div class="list-inline-comment-tools">
          <button type="button" class="link-btn" id="inline-time-clear-comment">Очистить текст</button>
        </div>
        <span class="field-error">Укажите комментарий</span>
      </div>
      <div class="field-row">
        <label for="inline-time-hours">Часы <span class="req">*</span></label>
        <input id="inline-time-hours" type="number" step="any" min="0.25" placeholder="0" />
      </div>
      <div class="field-row">
        <label for="inline-time-customer">ФИО заказчика</label>
        <input id="inline-time-customer" type="text" list="customer-name-suggestions" autocomplete="off" />
      </div>
      <div class="field-row">
        <label for="inline-time-activity">Вид деятельности <span class="req">*</span></label>
        <select id="inline-time-activity">
          ${activityOptions}
        </select>
        <span class="field-error">Выберите вид деятельности</span>
      </div>
      <a href="#" class="list-inline-date-toggle${draft?.showDate ? " hidden" : ""}" id="inline-time-not-today">Не сегодня?</a>
      <div class="field-row${draft?.showDate ? "" : " hidden"}" id="inline-time-date-row">
        <label for="inline-time-date">Дата</label>
        <input id="inline-time-date" type="date" value="${escapeHtml(draft?.spentOn || today)}" />
      </div>
    </div>
    <div class="list-inline-due-actions list-inline-popover-footer">
      <button type="button" class="btn-primary btn-sm" id="inline-time-save">Сохранить</button>
      <button type="button" class="btn-secondary btn-sm" id="inline-time-cancel">Отмена</button>
    </div>
  `;
  requestAnimationFrame(() => {
    positionListInlinePopover(anchorEl);
    const commentEl = document.getElementById("inline-time-comment");
    const hoursEl = document.getElementById("inline-time-hours");
    const customerEl = document.getElementById("inline-time-customer");
    if (draft) {
      if (commentEl) commentEl.value = draft.comments || "";
      if (hoursEl) hoursEl.value = draft.hours || "";
      if (customerEl) customerEl.value = draft.customer || "";
    }
    if (commentEl) {
      const grow = () => {
        autoGrowTextarea(commentEl, { maxPx: 160 });
        positionListInlinePopover(anchorEl);
      };
      grow();
      commentEl.addEventListener("input", grow);
      commentEl.focus();
    }
  });
}

async function saveIssueChanges(event) {
  event.preventDefault();
  if (!selectedIssueId) return;
  const issueId = selectedIssueId;
  const navGen = issueNavGeneration;
  rebindIssueEditFields();
  const payload = getFormValues();
  const estimateValue = editEstimatedHours?.value ?? "";
  const newStatusId = editStatus?.value || "";
  const statusChanging = String(newStatusId) !== String(currentIssue?.status?.id ?? "");

  let closeCheck = { proceed: true, extraIds: [] };
  if (statusChanging && newStatusId) {
    closeCheck = await checkOpenChildrenBeforeClose(issueId, newStatusId);
    if (!closeCheck.proceed) return;
  }

  const patch = {
    subject: editSubject?.value.trim() || "",
    status_id: newStatusId,
    assigned_to_id: editAssignee?.value || "",
    priority_id: editPriority?.value || "",
    start_date: editStartDate?.value || "",
    due_date: editDueDate?.value || "",
    done_ratio: editDoneRatio?.value || "",
    watcher_user_ids: editWatchers
      ? Array.from(editWatchers.selectedOptions).map((o) => o.value)
      : [],
  };

  // На некоторых инстансах Redmine «Оценка трудозатрат» — custom field (часто id=5), не core estimated_hours.
  // Core estimated_hours принимает PUT (204), но значение не сохраняется (поле выключено у трекера).
  const estimateCf = findEstimateCustomField(currentIssue);
  const estimateCfId = Number(estimateCf?.id) || 5;
  const cfEditEl = document.getElementById("issue-custom-fields-edit");
  const cfPatch = window.CustomFieldForm?.collectCustomFieldsPatch?.(cfEditEl) || [];
  patch.custom_fields = [
    { id: estimateCfId, value: estimateValue },
    ...cfPatch.filter((cf) => Number(cf.id) !== estimateCfId),
  ];
  if (!estimateCf) {
    // Запасной путь для инстансов, где используется стандартное поле.
    patch.estimated_hours = estimateValue;
  }

  if (saveIssueButton) {
    saveIssueButton.disabled = true;
    saveIssueButton.textContent = "Сохраняем…";
  }
  try {
    applyOptimisticIssuePatch(issueId, { status_id: newStatusId, due_date: patch.due_date });
    const result = await window.desktopApi.updateIssue({ ...payload, issueId, patch });
    setStatus(result.offline ? "Изменения сохранены локально и будут отправлены при появлении сети." : "Изменения сохранены.", "success");
    if (closeCheck.extraIds.length) {
      await applyBulkStatusChange(closeCheck.extraIds, newStatusId);
    }
    await loadIssues(false);
    const pageVisible = issuePage && !issuePage.classList.contains("hidden");
    const canReopen = window.IssueNav?.shouldContinueIssueOpen?.({
      navGeneration: issueNavGeneration,
      expectedGeneration: navGen,
      selectedIssueId,
      issueId,
      issuePageVisible: pageVisible,
      previewMode: issuePreviewMode,
    });
    if (canReopen) {
      await openIssueDetails(issueId, { forceRefresh: false });
    } else {
      renderIssuesList();
    }
  } catch (error) {
    setStatus(`Не удалось сохранить изменения: ${error.message}`, "error");
  } finally {
    if (saveIssueButton) {
      saveIssueButton.disabled = false;
      saveIssueButton.textContent = "Сохранить";
    }
  }
}

async function applyRenderedDescription(rawDescription) {
  const attachmentsMap = currentIssueAttachmentsMap || {};
  let descriptionHtml = textileToHtml(rawDescription || "");
  if (window.renderTextileImages) {
    descriptionHtml = window.renderTextileImages(descriptionHtml, attachmentsMap);
  }
  issueDescription.innerHTML = descriptionHtml || '<span class="muted">Описание отсутствует</span>';
  issueDescription.classList.toggle("muted", !rawDescription);
  await hydrateInlineShotPreviews(issueDescription, attachmentsMap, getFormValues());
  // Keep expanded/collapsed state if user already toggled (quiet sync refresh).
  const keepExpanded =
    issueDescriptionWrap && !issueDescriptionWrap.classList.contains("is-collapsed");
  if (!keepExpanded) resetDescriptionCollapse();
  requestAnimationFrame(() => {
    updateDescriptionCollapseToggle();
    if (keepExpanded) {
      issueDescriptionWrap?.classList.remove("is-collapsed");
      if (toggleDescriptionBtn) {
        toggleDescriptionBtn.setAttribute("aria-expanded", "true");
        const label = toggleDescriptionBtn.querySelector(".description-toggle-label");
        if (label) label.textContent = "Свернуть";
      }
    }
    issueDescription.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", () => updateDescriptionCollapseToggle(), { once: true });
    });
  });
}

const DESCRIPTION_COLLAPSE_MAX_PX = 280;

function resetDescriptionCollapse() {
  if (!issueDescriptionWrap) return;
  issueDescriptionWrap.classList.add("is-collapsed");
  issueDescriptionWrap.classList.remove("has-overflow");
  if (toggleDescriptionBtn) {
    toggleDescriptionBtn.classList.add("hidden");
    toggleDescriptionBtn.setAttribute("aria-expanded", "false");
    const label = toggleDescriptionBtn.querySelector(".description-toggle-label");
    if (label) label.textContent = "Показать полностью";
  }
}

function updateDescriptionCollapseToggle() {
  if (!issueDescription || !issueDescriptionWrap || !toggleDescriptionBtn) return;
  const collapsed = issueDescriptionWrap.classList.contains("is-collapsed");
  // Measure full height: temporarily remove max-height if collapsed.
  let fullHeight = issueDescription.scrollHeight;
  if (!collapsed) {
    fullHeight = issueDescription.scrollHeight;
  }
  const overflows = fullHeight > DESCRIPTION_COLLAPSE_MAX_PX + 8;
  issueDescriptionWrap.classList.toggle("has-overflow", overflows);
  toggleDescriptionBtn.classList.toggle("hidden", !overflows);
  if (!overflows) {
    issueDescriptionWrap.classList.add("is-collapsed");
    toggleDescriptionBtn.setAttribute("aria-expanded", "false");
    const label = toggleDescriptionBtn.querySelector(".description-toggle-label");
    if (label) label.textContent = "Показать полностью";
    return;
  }
  const isExpanded = !issueDescriptionWrap.classList.contains("is-collapsed");
  toggleDescriptionBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  const label = toggleDescriptionBtn.querySelector(".description-toggle-label");
  if (label) label.textContent = isExpanded ? "Свернуть" : "Показать полностью";
}

function toggleDescriptionCollapse() {
  if (!issueDescriptionWrap || !toggleDescriptionBtn) return;
  if (toggleDescriptionBtn.classList.contains("hidden")) return;
  const willExpand = issueDescriptionWrap.classList.contains("is-collapsed");
  issueDescriptionWrap.classList.toggle("is-collapsed", !willExpand);
  toggleDescriptionBtn.setAttribute("aria-expanded", willExpand ? "true" : "false");
  const label = toggleDescriptionBtn.querySelector(".description-toggle-label");
  if (label) label.textContent = willExpand ? "Свернуть" : "Показать полностью";
}

function rewriteKnownAttachmentDataUrls(html, attachments) {
  const byFilename = new Map();
  (attachments || []).forEach((att) => {
    if (att?.filename && att?.id) byFilename.set(String(att.filename), att);
  });
  if (!byFilename.size) return String(html || "");
  const normalizeSrc =
    window.DescriptionImageUtils && typeof window.DescriptionImageUtils.normalizeDataImageSrc === "function"
      ? window.DescriptionImageUtils.normalizeDataImageSrc
      : (src) => String(src || "").trim();
  return String(html || "").replace(/<img\b[^>]*>/gi, (tag) => {
    const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const src = normalizeSrc(srcMatch ? String(srcMatch[2] || "").trim() : "");
    const alt = altMatch ? String(altMatch[2] || "").trim() : "";
    if (!src.startsWith("data:image/")) return tag;
    const filename = alt && byFilename.has(alt) ? alt : "";
    if (!filename) return tag;
    const att = byFilename.get(filename);
    return `<img src="/attachments/download/${Number(att.id)}/${encodeURIComponent(filename)}" alt="${escapeAttr(filename)}">`;
  });
}

async function prepareDescriptionHtmlForEditor(rawDescription) {
  let html = textileToHtml(rawDescription || "");
  const attachments = currentIssue?.attachments || [];
  if (attachments.length) {
    html = resolveDescriptionAttachmentUrls(
      html,
      attachments.map((att) => ({
        filename: att.filename,
        content_url: att.content_url,
      })),
    );
  }
  if (!networkOnline) return html;
  const payload = getFormValues();
  const imgRe = /<img\b[^>]*>/gi;
  const parts = [];
  let last = 0;
  let match;
  const previewCache = new Map();
  while ((match = imgRe.exec(html))) {
    parts.push(html.slice(last, match.index));
    const tag = match[0];
    const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const src = srcMatch ? String(srcMatch[2] || "").trim() : "";
    const alt = altMatch ? String(altMatch[2] || "").trim() : "";
    last = match.index + tag.length;
    if (!src || src.startsWith("data:image/")) {
      parts.push(tag);
      continue;
    }
    const contentUrl =
      resolveAttachmentContentUrl(src, currentIssueAttachmentsMap) ||
      resolveAttachmentContentUrl(alt, currentIssueAttachmentsMap) ||
      (/^https?:\/\//i.test(src) ? src : "");
    if (!contentUrl || /\/attachments\/download\/0\//i.test(contentUrl)) {
      parts.push(tag);
      continue;
    }
    try {
      let dataUrl = previewCache.get(contentUrl);
      if (!dataUrl) {
        const preview = await window.desktopApi.getAttachmentPreview({
          ...payload,
          contentUrl,
        });
        dataUrl = `data:${preview.mimeType};base64,${preview.dataBase64}`;
        previewCache.set(contentUrl, dataUrl);
      }
      const filename = alt || String(contentUrl).split("/").pop() || "image.png";
      parts.push(`<img src="${dataUrl}" alt="${escapeAttr(filename)}">`);
    } catch {
      parts.push(tag);
    }
  }
  parts.push(html.slice(last));
  return parts.join("");
}

function openDescriptionEditor() {
  if (!currentIssue) {
    setStatus("Сначала откройте задачу.", "error");
    return;
  }
  descriptionEditorContext = "issue";
  prepareDescriptionHtmlForEditor(currentIssue.description || "")
    .then((html) => {
      const opened = window.DescriptionEditor?.open(html);
      if (!opened) setStatus("Не удалось открыть редактор описания.", "error");
    })
    .catch((error) => {
      setStatus(error.message || "Не удалось открыть редактор описания.", "error");
    });
}

function escapeAttr(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function rewriteDescriptionImagesForUpload(html, pendingFiles) {
  const normalizeSrc =
    window.DescriptionImageUtils && typeof window.DescriptionImageUtils.normalizeDataImageSrc === "function"
      ? window.DescriptionImageUtils.normalizeDataImageSrc
      : (src) => String(src || "").trim();
  const byFilename = new Map();
  (pendingFiles || []).forEach((file) => {
    if (file?.filename) byFilename.set(String(file.filename), file);
  });
  return String(html || "").replace(/<img\b[^>]*>/gi, (tag) => {
    const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(tag);
    const src = normalizeSrc(srcMatch ? String(srcMatch[2] || "").trim() : "");
    const alt = altMatch ? String(altMatch[2] || "").trim() : "";
    if (!src.startsWith("data:image/")) return tag;
    let filename = alt && byFilename.has(alt) ? alt : "";
    if (!filename) {
      const entry = [...byFilename.entries()].find(([, file]) => {
        const mime = file.contentType || "image/png";
        const prefix = `data:${mime};base64,`;
        if (!src.startsWith(prefix)) return false;
        const b64 = file.dataBase64 || "";
        return b64 && src.slice(prefix.length) === b64;
      });
      filename = entry?.[0] || "";
    }
    if (!filename && byFilename.size === 1) filename = [...byFilename.keys()][0];
    if (!filename) return tag;
    return `<img src="/attachments/download/0/${encodeURIComponent(filename)}" alt="${escapeAttr(filename)}">`;
  });
}

function resolveDescriptionAttachmentUrls(html, attachments) {
  const byFilename = new Map();
  (attachments || []).forEach((att) => {
    if (att?.filename && att?.content_url) byFilename.set(String(att.filename), att.content_url);
  });
  return String(html || "").replace(/<img\b([^>]*)>/gi, (tag, attrs) => {
    const srcMatch = /src\s*=\s*(['"])(.*?)\1/i.exec(attrs);
    const altMatch = /alt\s*=\s*(['"])(.*?)\1/i.exec(attrs);
    const src = srcMatch ? String(srcMatch[2] || "").trim() : "";
    const alt = altMatch ? String(altMatch[2] || "").trim() : "";
    const placeholder = src.match(/\/attachments\/download\/0\/([^"'?\s]+)/i);
    const filename = placeholder ? decodeURIComponent(placeholder[1]) : alt;
    const contentUrl = filename ? byFilename.get(filename) : "";
    if (!contentUrl) return tag;
    let next = tag.replace(/src\s*=\s*(['"]).*?\1/i, `src="${escapeAttr(contentUrl)}"`);
    if (!/alt\s*=/i.test(next) && filename) {
      next = next.replace(/<img\b/i, `<img alt="${escapeAttr(filename)}"`);
    }
    return next;
  });
}

async function saveIssueDescription() {
  if (!selectedIssueId || !window.DescriptionEditor) return;
  const pendingFiles = window.DescriptionEditor.takePendingImages?.() || [];
  const editorHtml = window.DescriptionEditor.getHTML() || "";
  const displayHtml = sanitizeRedmineHtml ? sanitizeRedmineHtml(editorHtml) : editorHtml;
  let uploadHtml = displayHtml;
  if (pendingFiles.length) {
    uploadHtml = rewriteDescriptionImagesForUpload(displayHtml, pendingFiles);
  }
  // Existing attachments shown as data: previews must go back to Redmine download URLs.
  uploadHtml = rewriteKnownAttachmentDataUrls(uploadHtml, currentIssue?.attachments || []);
  uploadHtml = sanitizeRedmineHtml ? sanitizeRedmineHtml(uploadHtml) : uploadHtml;
  window.DescriptionEditor.setError("");
  window.DescriptionEditor.setSaving(true);
  try {
    const payload = getFormValues();
    const patch = {
      description: uploadHtml,
      files: pendingFiles.slice(),
    };
    if (pendingFiles.length && uploadHtml !== displayHtml) {
      patch.localDescription = displayHtml;
    }
    const result = await window.desktopApi.updateIssue({
      ...payload,
      issueId: selectedIssueId,
      patch,
    });

    if (currentIssue) currentIssue.description = displayHtml;
    await applyRenderedDescription(displayHtml);
    window.DescriptionEditor.close();
    setStatus(
      result.offline || result.queued
        ? pendingFiles.length
          ? "Описание сохранено. Изображения отправятся в Redmine в фоне."
          : "Описание сохранено локально и будет отправлено при появлении сети."
        : "Описание сохранено.",
      "success",
    );
  } catch (error) {
    window.DescriptionEditor.setError(error.message || "Не удалось сохранить описание.");
    setStatus(`Не удалось сохранить описание: ${error.message}`, "error");
  } finally {
    window.DescriptionEditor.setSaving(false);
  }
}

window.__prepareDescriptionImage = async (blob) => {
  const named =
    blob?.name && blob.name !== "image.png"
      ? blob instanceof File
        ? blob
        : new File([blob], blob.name, { type: blob.type || "image/png" })
      : new File([blob], clipboardImageFilename(blob), { type: blob?.type || "image/png" });
  const upload = await fileToUploadPayload(named);
  const dataUrl = `data:${upload.contentType || "image/png"};base64,${upload.dataBase64}`;
  return {
    filename: upload.filename,
    contentType: upload.contentType,
    dataUrl,
    upload,
  };
};

async function saveComment(event) {
  event.preventDefault();
  const notesRaw = (editNotes?.value || "").trim();
  if (!selectedIssueId || (!notesRaw && !commentPendingAttachments.length)) return;
  // В клиенте Textile `!файл.png!` рисуется сам. В веб-Redmine Visual editor /
  // CommonMark это не понимает — после аплоада sync подставит ![](/attachments/download/…).
  const notes = notesRaw;
  const notesForJournal = notes || "(вложение)";
  const payload = getFormValues();
  if (saveCommentButton) {
    saveCommentButton.disabled = true;
    saveCommentButton.textContent = "Отправка...";
  }
  try {
    const result = await window.desktopApi.updateIssue({
      ...payload,
      issueId: selectedIssueId,
      patch: {
        notes: notesForJournal,
        files: commentPendingAttachments.slice(),
      },
    });

    // Local-first: show comment immediately; Redmine sync runs in background queue.
    const user = getCurrentUserRef();
    const userName =
      user?.name ||
      [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
      "Вы";
    const optimisticJournal = {
      id: -Date.now(),
      user: { id: user?.id || null, name: userName },
      notes: notesForJournal,
      created_on: new Date().toISOString(),
      details: [],
      _pending: true,
    };
    currentIssueJournals = [...(currentIssueJournals || []), optimisticJournal];
    if (currentIssue) currentIssue.journals = currentIssueJournals;
    renderJournalsList(currentIssueJournals);
    setActivityTab("comments");
    resetCommentComposer();

    const queued = Boolean(result.offline || result.queued);
    setStatus(
      queued ? "Комментарий сохранён локально и будет отправлен в фоне." : "Комментарий добавлен.",
      "success",
    );
    showAppToast("Комментарий добавлен", "success");
  } catch (error) {
    setStatus(`Не удалось добавить комментарий: ${error.message}`, "error");
    showAppToast(error.message || "Не удалось добавить комментарий", "error");
  } finally {
    if (saveCommentButton) {
      saveCommentButton.disabled = false;
      saveCommentButton.textContent = "Добавить комментарий";
    }
  }
}

async function createIssueSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("create-issue-submit-btn");
  const payload = getFormValues();
  const customFields = window.CustomFieldForm?.collectCustomFieldsPatch?.(createCustomFieldsHost) || [];
  const description = getCreateDescriptionValue();
  const patch = {
    project_id: createProject.value,
    tracker_id: createTracker.value,
    subject: createSubject.value.trim(),
    description,
    priority_id: createPriority.value,
    assigned_to_id: createAssignee.value,
    start_date: createStartDate.value,
    due_date: createDueDate.value,
    estimated_hours: createEstimatedHours?.value ?? "",
    noDeadline: Boolean(createNoDeadlineCheckbox?.checked),
    files: createPendingAttachments.slice(),
  };
  const parentFromFull = createIssueFullMode ? Number(createParentIdInput?.value || 0) : 0;
  if (createParentIssueId) patch.parent_issue_id = createParentIssueId;
  else if (parentFromFull > 0) patch.parent_issue_id = parentFromFull;
  if (createIssueFullMode) {
    if (createStatus?.value) patch.status_id = createStatus.value;
    if (createDoneRatio?.value !== undefined && createDoneRatio?.value !== "") {
      patch.done_ratio = createDoneRatio.value;
    }
    const watchers = collectCreateWatcherIds();
    if (watchers.length) patch.watcher_user_ids = watchers;
  }
  if (createDescriptionPendingFiles.length) {
    patch.files = [...(patch.files || []), ...createDescriptionPendingFiles];
  }
  // «Оценка трудозатрат» на части Redmine — custom field #5; дублируем и в core на случай другого сервера.
  if (patch.estimated_hours !== undefined && patch.estimated_hours !== "") {
    customFields.push({ id: CREATE_ESTIMATE_CF_ID, value: patch.estimated_hours });
  }
  if (customFields.length) patch.custom_fields = customFields;

  clearCreateIssueValidation();
  let valid = true;
  const requireField = (field, condition, message) => {
    setCreateFieldInvalid(field, condition, message);
    if (condition) valid = false;
  };
  requireField(createProject, !patch.project_id, "Обязательное поле");
  requireField(createTracker, !patch.tracker_id, "Обязательное поле");
  requireField(createSubject, !patch.subject, "Обязательное поле");
  const descriptionEmpty = !descriptionPlainFromHtml(patch.description);
  requireField(createDescription, descriptionEmpty && !createIssueFullMode, "Обязательное поле");
  if (descriptionEmpty) {
    createDescriptionQuickWrap?.classList.toggle("invalid", !createIssueFullMode);
    createDescriptionFullWrap?.classList.toggle("invalid", createIssueFullMode);
    valid = false;
  } else {
    createDescriptionQuickWrap?.classList.remove("invalid");
    createDescriptionFullWrap?.classList.remove("invalid");
  }
  requireField(createPriority, !patch.priority_id, "Обязательное поле");
  requireField(createAssignee, !patch.assigned_to_id, "Обязательное поле");
  requireField(createStartDate, !patch.start_date, "Обязательное поле");
  requireField(
    createDueDate,
    !patch.due_date && !patch.noDeadline,
    "Укажите срок или отметьте «Без срока»",
  );
  const missingCf = window.CustomFieldForm?.validateRequiredCreateFields?.(createCustomFieldsHost) || [];
  if (missingCf.length) valid = false;

  if (!valid) {
    setStatus("Заполните обязательные поля.", "error");
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Создаём...";
  }
  try {
    const result = await window.desktopApi.createIssue({ ...payload, patch });
    createIssueModal.classList.add("hidden");
    createIssueForm.reset();
    resetCreateIssueFormDefaults();
    setStatus(
      result.offline ? "Задача будет создана при появлении сети." : `Задача #${result.issueId} создана.`,
      "success",
    );
    await loadIssues(true);
    if (result.issueId) openIssueDetails(result.issueId);
  } catch (error) {
    setStatus(`Не удалось создать задачу: ${error.message}`, "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Создать";
    }
  }
}

function describeSyncSkip(reason) {
  if (reason === "no_credentials") return "Укажите URL Redmine и API key в настройках подключения.";
  if (reason === "no_projects") return "Нет проектов для синхронизации. Включите проекты в настройках → Синхронизация.";
  if (reason === "already_running") return "Синхронизация уже выполняется, подождите завершения.";
  return "Синхронизация не выполнена.";
}

async function runManualSync() {
  if (!networkOnline) {
    setStatus("Нет сети — синхронизация недоступна.", "error");
    return null;
  }
  if (syncNowButton) syncNowButton.disabled = true;
  if (syncStatusText) syncStatusText.textContent = "Синхронизация...";
  if (syncStatusDot) {
    syncStatusDot.classList.add("syncing");
    syncStatusDot.classList.remove("offline");
  }
  setStatus("Синхронизация с Redmine...", "info");

  try {
    const result = await window.desktopApi.runIncrementalSync();
    if (result?.skipped) {
      const message = describeSyncSkip(result.reason);
      setStatus(message, "error");
      if (syncStatusText) syncStatusText.textContent = message;
      return result;
    }

    await loadIssues(false);
    if (selectedIssueId && issuePage && !issuePage.classList.contains("hidden")) {
      await openIssueDetails(selectedIssueId);
    }
    const details = [];
    if (result?.issuesUpdated) details.push(`обновлено задач: ${result.issuesUpdated}`);
    if (result?.timeEntriesUpdated) details.push(`трудозатрат: ${result.timeEntriesUpdated}`);
    const suffix = details.length ? ` (${details.join(", ")})` : "";
    setStatus(`Синхронизация завершена${suffix}.`, "success");
    return result;
  } catch (error) {
    setStatus(`Синхронизация не удалась: ${error.message}`, "error");
    if (syncStatusText) syncStatusText.textContent = `Ошибка: ${error.message}`;
    throw error;
  } finally {
    if (syncNowButton) syncNowButton.disabled = false;
    const syncStatus = await window.desktopApi.getSyncStatus();
    const network = await window.desktopApi.getNetworkStatus();
    updateSyncStatusBar(syncStatus, network);
  }
}

async function refreshDataPaths() {
  const list = document.getElementById("data-paths-list");
  if (!list || !window.desktopApi?.getDataPaths) return;

  try {
    const paths = await window.desktopApi.getDataPaths();
    const rows = [
      {
        id: "userData",
        label: "Папка данных",
        desc: "Настройки, кэш, тема и служебные файлы Electron. Удаляется при очистке данных при деинсталляции.",
        path: paths.userData,
        openAs: "folder",
      },
      {
        id: "cacheDb",
        label: "База кэша",
        desc: "Локальная SQLite-база: задачи, история, справочники, очередь офлайн-изменений.",
        path: paths.cacheDb,
        openAs: "parent",
      },
      {
        id: "settingsFile",
        label: "Файл настроек",
        desc: "URL Redmine, зашифрованный API-ключ, автосинхронизация и параметры интерфейса.",
        path: paths.settingsFile,
        openAs: "parent",
      },
      {
        id: "logs",
        label: "Логи",
        desc: "Журналы работы приложения (если создавались).",
        path: paths.logs,
        openAs: "folder",
      },
      {
        id: "installDir",
        label: "Папка установки",
        desc: "Исполняемые файлы RM Client. При обновлении заменяются установщиком.",
        path: paths.installDir,
        openAs: "folder",
      },
    ].filter((row) => row.path);

    list.innerHTML = rows
      .map((row) => {
        const openTarget = row.openAs === "parent" ? row.path.replace(/[\\/][^\\/]+$/, "") : row.path;
        return `<div class="data-path-row" data-path-id="${escapeHtml(row.id)}">
          <div class="data-path-label">${escapeHtml(row.label)}</div>
          <div class="data-path-desc">${escapeHtml(row.desc)}</div>
          <div class="data-path-line">
            <code class="data-path-value" title="${escapeHtml(row.path)}">${escapeHtml(row.path)}</code>
            <div class="data-path-actions">
              <button type="button" class="btn-secondary btn-sm" data-copy-path="${escapeHtml(row.path)}">Копировать</button>
              <button type="button" class="btn-secondary btn-sm" data-open-path="${escapeHtml(openTarget)}">Открыть</button>
            </div>
          </div>
        </div>`;
      })
      .join("");
  } catch (error) {
    list.innerHTML = `<div class="muted">Не удалось получить пути: ${escapeHtml(error.message || "ошибка")}</div>`;
  }
}

async function refreshCacheStats() {
  const stats = await window.desktopApi.getCacheStats();
  if (cacheDbSize) cacheDbSize.textContent = formatBytes(stats.dbSize);
  if (cacheIssuesCount) cacheIssuesCount.textContent = String(stats.issuesCount);
  if (cacheAttachmentsCount) {
    cacheAttachmentsCount.textContent = String(stats.attachmentsCached ?? 0);
  }

  const projects = await window.desktopApi.getSyncProjects();
  if (syncProjectsList) {
    const enabledProjects = (projects || []).filter((p) => p.enabled);
    syncProjectsList.innerHTML = enabledProjects.length
      ? enabledProjects
          .map((p) => {
            const last = p.last_sync_at ? new Date(p.last_sync_at).toLocaleString("ru-RU") : "никогда";
            return `<label class="sync-project-row"><input type="checkbox" ${p.enabled ? "checked" : ""} disabled /><span class="sync-project-name">${escapeHtml(p.project_name)}</span><span class="sync-project-time">${p.issue_count} задач · ${last}</span></label>`;
          })
          .join("")
      : `<span class="muted">Проекты не настроены. Нажмите «Изменить» или пройдите мастер настройки.</span>`;
  }

  await refreshDataPaths();
}

function describeSyncPhase(status) {
  switch (status?.phase) {
    case "reference":
      return "Загрузка справочников Redmine…";
    case "projects":
      return "Подготовка списка проектов…";
    case "issues":
      return "Загрузка списка задач…";
    case "details":
      return "Загрузка истории и деталей задач…";
    case "incremental":
      return "Инкрементальное обновление…";
    case "cleanup":
      return "Очистка локального кэша проекта…";
    case "cancelled":
      return "Операция отменена";
    case "idle":
      return status?.running ? "Выполняется…" : "Готово";
    default:
      return syncOperationKind === "cleanup" ? "Очистка кэша…" : "Синхронизация…";
  }
}

function updateSyncProgressOverlay(status) {
  if (!status) return;
  if (status.phase === "cleanup") syncOperationKind = "cleanup";
  else if (status.running && syncOperationKind === "cleanup" && status.phase !== "cleanup" && status.phase !== "cancelled" && status.phase !== "idle") {
    syncOperationKind = "sync";
  }

  const pct = Math.max(0, Math.min(100, Number(status.percent) || 0));
  if (syncProgressFill) syncProgressFill.style.width = `${pct}%`;
  if (syncProgressPercent) syncProgressPercent.textContent = `${pct}%`;

  const projectName = status.projectName || "";
  const projectDone = Number(status.projectDone) || 0;
  const projectTotal = Number(status.projectTotal) || 0;
  const overallDone = Number(status.overallDone) || 0;
  const overallTotal = Number(status.overallTotal) || 0;

  if (syncProjectLine) {
    if (status.phase === "cleanup" && projectName) {
      syncProjectLine.textContent = `Очистка: ${projectName}`;
    } else if (projectName && projectTotal > 0) {
      syncProjectLine.textContent = `${projectName} — ${projectDone} / ${projectTotal} задач`;
    } else if (projectName) {
      syncProjectLine.textContent = projectName;
    } else if (overallTotal > 0) {
      const label = status.phase === "cleanup" ? "Проекты" : "Проекты";
      syncProjectLine.textContent = `${label}: ${Math.min(overallDone + (status.running ? 1 : 0), overallTotal)} / ${overallTotal}`;
    } else {
      syncProjectLine.textContent = describeSyncPhase(status);
    }
  }

  if (syncDetailLine) {
    const parts = [describeSyncPhase(status)];
    if (overallTotal > 0 && (projectName || status.phase === "cleanup")) {
      parts.push(`${Math.min(overallDone + (status.running && overallDone < overallTotal ? 1 : 0), overallTotal)} из ${overallTotal}`);
    }
    syncDetailLine.textContent = parts.join(" · ");
  }
}

function showSyncProgressOverlay(options = {}) {
  syncOverlayVisible = true;
  syncOperationKind = options.kind || "sync";
  if (syncProgressTitle) {
    syncProgressTitle.textContent = options.title || "Синхронизация проектов";
  }
  if (syncWarningText) {
    syncWarningText.textContent =
      options.warning ||
      (syncOperationKind === "cleanup"
        ? "Не закрывайте приложение во время очистки. Прерывание может оставить часть данных удалённых проектов в кэше."
        : "Не закрывайте приложение во время синхронизации. Прерывание оставит кэш неполным: часть проектов может обновиться, часть — нет.");
  }
  if (syncCancelBtn) {
    syncCancelBtn.textContent =
      syncOperationKind === "cleanup" ? "Отменить очистку" : "Отменить синхронизацию";
  }
  if (syncProgressOverlay) syncProgressOverlay.classList.remove("hidden");
  updateSyncProgressOverlay({
    running: true,
    phase: options.phase || (syncOperationKind === "cleanup" ? "cleanup" : "reference"),
    percent: 0,
    projectName: "",
    projectDone: 0,
    projectTotal: 0,
    overallDone: 0,
    overallTotal: options.overallTotal || 0,
  });
}

function hideSyncProgressOverlay() {
  syncOverlayVisible = false;
  syncProgressOverlay?.classList.add("hidden");
}

function minimizeSyncProgressOverlay() {
  syncOverlayVisible = false;
  syncProgressOverlay?.classList.add("hidden");
  setStatus("Синхронизация продолжается в фоне — смотрите индикатор справа.", "info");
}

async function cancelFullSyncFromOverlay() {
  const ok = await confirmAction(
    syncOperationKind === "cleanup" ? "Прервать очистку кэша?" : "Прервать операцию?",
    {
      detail:
        syncOperationKind === "cleanup"
          ? "Часть проектов уже могла быть удалена из локального кэша, часть — ещё нет."
          : "Уже обработанные данные останутся в текущем состоянии, но результат будет неполным.\n\nРекомендуется дождаться окончания или запустить операцию позже снова.",
      type: "warning",
    },
  );
  if (!ok) return;
  try {
    await window.desktopApi.cancelSync();
    setStatus("Операция отменена. Кэш может быть в промежуточном состоянии.", "error");
  } catch (error) {
    setStatus(`Не удалось отменить: ${error.message}`, "error");
  }
}

function getEditSyncCandidateProjects() {
  const fromReference = (referenceData?.projects || []).filter((p) => p.status !== 5);
  if (fromReference.length) {
    return fromReference
      .map((p) => ({ id: Number(p.id), name: p.name || `Проект #${p.id}` }))
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
  }
  return [];
}

function updateEditSyncSelectedCount() {
  if (!editSyncSelectedCount || !editSyncProjectsList) return;
  const total = editSyncProjectsList.querySelectorAll('input[type="checkbox"]').length;
  const selected = editSyncProjectsList.querySelectorAll('input[type="checkbox"]:checked').length;
  editSyncSelectedCount.textContent = `Выбрано: ${selected} из ${total}`;
}

function getModalProjectRows() {
  if (!editSyncProjectsList) return [];
  return Array.from(editSyncProjectsList.querySelectorAll('input[type="checkbox"]')).map((input) => ({
    id: Number(input.value),
    name: input.parentElement?.textContent?.trim() || `Проект #${input.value}`,
    enabled: Boolean(input.checked),
  }));
}

function clearProjectStatusModelValidation() {
  projectStatusModelSettings?.classList.remove("invalid");
}

function renderProjectStatusModelProjectSelect(projects) {
  if (!projectStatusModelProject) return;
  const previous = Number(projectStatusModelProject.value);
  const options = (projects || []).filter((project) => Number.isFinite(Number(project.id)));
  projectStatusModelProject.innerHTML = `<option value="">Выберите проект…</option>${options
    .map(
      (project) =>
        `<option value="${Number(project.id)}">${escapeHtml(project.name || `Проект #${project.id}`)}</option>`,
    )
    .join("")}`;
  if (Number.isFinite(previous) && options.some((project) => Number(project.id) === previous)) {
    projectStatusModelProject.value = String(previous);
  } else if (options.length) {
    projectStatusModelProject.value = String(Number(options[0].id));
  } else {
    projectStatusModelProject.value = "";
  }
  clearProjectStatusModelValidation();
}

function renderProjectStatusModelStatusList() {
  if (!projectStatusModelList || !projectStatusModelProject) return;
  const projectId = Number(projectStatusModelProject.value);
  if (!Number.isFinite(projectId) || projectId <= 0) {
    projectStatusModelList.innerHTML = `<span class="muted">Сначала выберите проект.</span>`;
    return;
  }
  const statuses = getReferenceStatuses();
  if (!statuses.length) {
    projectStatusModelList.innerHTML = `<span class="muted">Статусы не загружены. Обновите справочники.</span>`;
    return;
  }
  const enabled = new Set(
    window.ProjectStatusSettings?.getEnabledStatusIds(projectId, statuses, statuses).map(Number) || [],
  );
  projectStatusModelList.innerHTML = statuses
    .map((status) => {
      const id = Number(status.id);
      const checked = enabled.has(id) ? "checked" : "";
      return `<label class="checklist-item"><input type="checkbox" value="${id}" ${checked} /> ${escapeHtml(status.name || `#${id}`)}</label>`;
    })
    .join("");
}

function persistProjectStatusModelFromList() {
  if (!projectStatusModelProject || !projectStatusModelList || !window.ProjectStatusSettings) return;
  const projectId = Number(projectStatusModelProject.value);
  if (!Number.isFinite(projectId) || projectId <= 0) return;
  const ids = Array.from(projectStatusModelList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((input) => Number(input.value))
    .filter((id) => Number.isFinite(id) && id > 0);
  window.ProjectStatusSettings.saveProjectStatusConfig(projectId, ids);
}

async function openEditSyncProjectsModal() {
  if (fullSyncInProgress) {
    showSyncProgressOverlay({ kind: syncOperationKind });
    return;
  }

  let projects = getEditSyncCandidateProjects();
  if (!projects.length && currentSettings?.redmineUrl && currentSettings?.apiKey) {
    try {
      const loaded = await window.desktopApi.ensureReferenceData({
        redmineUrl: currentSettings.redmineUrl,
        apiKey: currentSettings.apiKey,
      });
      referenceData = normalizeReferencePayload(loaded);
      projects = getEditSyncCandidateProjects();
    } catch (error) {
      setStatus(`Не удалось загрузить список проектов: ${error.message}`, "error");
    }
  }

  const synced = await window.desktopApi.getSyncProjects();
  const enabled = new Set(
    (synced || []).filter((p) => p.enabled).map((p) => Number(p.project_id)),
  );

  (synced || [])
    .filter((p) => p.enabled)
    .forEach((p) => {
      if (!projects.some((item) => Number(item.id) === Number(p.project_id))) {
        projects.push({ id: Number(p.project_id), name: p.project_name || `Проект #${p.project_id}` });
      }
    });

  const orderedProjects = formatProjectsForUi(projects);

  if (!editSyncProjectsList) return;
  editSyncProjectsList.innerHTML = orderedProjects.length
    ? orderedProjects
        .map((project) => {
          const checked = enabled.has(Number(project.id)) ? "checked" : "";
          const depth = Number(project.depth) || 0;
          const pad = 8 + depth * 14;
          const labelText = project.rawName || project.name;
          return `<label class="checklist-item" style="padding-left:${pad}px"><input type="checkbox" value="${Number(project.id)}" ${checked} /> ${escapeHtml(labelText)}</label>`;
        })
        .join("")
    : `<span class="muted">Нет проектов. Проверьте подключение к Redmine.</span>`;
  updateEditSyncSelectedCount();
  clearProjectStatusModelValidation();
  renderProjectStatusModelProjectSelect(getModalProjectRows().filter((p) => p.enabled));
  renderProjectStatusModelStatusList();
  editSyncProjectsModal?.classList.remove("hidden");
}

function closeEditSyncProjectsModal() {
  editSyncProjectsModal?.classList.add("hidden");
}

async function saveEditSyncProjects() {
  const projects = getModalProjectRows();
  const enabledProjectIds = projects.filter((p) => p.enabled).map((p) => p.id);

  const current = await window.desktopApi.getSyncProjects();
  const previouslyEnabled = (current || []).filter((p) => p.enabled).map((p) => Number(p.project_id));
  const prevSet = new Set(previouslyEnabled);
  const nextSet = new Set(enabledProjectIds);
  const removed = previouslyEnabled.filter((id) => !nextSet.has(id));
  const added = enabledProjectIds.filter((id) => !prevSet.has(id));

  if (!removed.length && !added.length) {
    closeEditSyncProjectsModal();
    setStatus("Состав проектов не изменился.", "info");
    return;
  }

  const lines = [];
  if (added.length) lines.push(`Добавлено проектов: ${added.length} — будет запущена синхронизация.`);
  if (removed.length) {
    lines.push(`Снято проектов: ${removed.length} — локальный кэш этих проектов будет очищен.`);
  }
  lines.push("", "Не закрывайте приложение до завершения операции.");
  if (!(await confirmAction(lines[0], { detail: lines.slice(1).join("\n").trim(), type: "warning" }))) return;

  closeEditSyncProjectsModal();
  fullSyncInProgress = true;
  if (editSyncedProjectsButton) editSyncedProjectsButton.disabled = true;
  if (resyncAllButton) resyncAllButton.disabled = true;

  showSyncProgressOverlay({
    kind: removed.length ? "cleanup" : "sync",
    title: removed.length && added.length
      ? "Обновление проектов"
      : removed.length
        ? "Очистка кэша проектов"
        : "Синхронизация новых проектов",
    warning: removed.length
      ? "Сначала очищается кэш снятых проектов, затем при необходимости загружаются новые. Прерывание оставит данные в промежуточном состоянии."
      : "Идёт загрузка новых проектов в локальный кэш. Прерывание оставит синхронизацию неполной.",
    phase: removed.length ? "cleanup" : "reference",
    overallTotal: removed.length + added.length,
  });

  try {
    const result = await window.desktopApi.updateSyncProjects({
      redmineUrl: currentSettings.redmineUrl,
      apiKey: currentSettings.apiKey,
      cacheMode: currentSettings.cacheMode || "issues-history",
      enabledProjectIds,
      projects,
    });

    if (result?.cancelled) {
      setStatus("Операция прервана. Кэш может быть в промежуточном состоянии.", "error");
    } else {
      const bits = [];
      if (result?.removedIds?.length) bits.push(`очищено: ${result.removedIds.length}`);
      if (result?.addedIds?.length) bits.push(`синхронизировано: ${result.addedIds.length}`);
      setStatus(`Проекты обновлены${bits.length ? ` (${bits.join(", ")})` : ""}.`, "success");
    }
  } catch (error) {
    setStatus(`Не удалось обновить проекты: ${error.message}`, "error");
  } finally {
    fullSyncInProgress = false;
    syncOperationKind = "sync";
    if (editSyncedProjectsButton) editSyncedProjectsButton.disabled = false;
    if (resyncAllButton) resyncAllButton.disabled = false;
    hideSyncProgressOverlay();
    const syncStatus = await window.desktopApi.getSyncStatus();
    const network = await window.desktopApi.getNetworkStatus();
    updateSyncStatusBar(syncStatus, network);
  }

  try {
    await refreshCacheStats();
    await refreshReferenceData();
    await loadIssues(false);
    await refreshDeadlineAlerts();
  } catch (error) {
    setStatus(`Не удалось обновить список после смены проектов: ${error.message}`, "error");
  }
}

function updateSyncStatusBar(status, network) {
  networkOnline = network?.online !== false;
  const isOffline = !networkOnline;
  const isSyncing = Boolean(status?.running);
  const isOnline = networkOnline && !status?.running;

  const applyDotState = (dot) => {
    if (!dot) return;
    dot.classList.toggle("offline", isOffline);
    dot.classList.toggle("syncing", isSyncing);
    dot.classList.toggle("online", isOnline);
  };
  applyDotState(syncStatusDot);
  applyDotState(footerSyncDot);
  refreshConnectionStatusFromState();

  let label = "Готово";
  let title = "Готово к работе";
  if (!networkOnline) {
    label = "Офлайн";
    title = "Офлайн — показаны локальные данные";
  } else if (status?.running) {
    const pct = Number(status.percent) || 0;
    const kind = status.phase === "cleanup" || syncOperationKind === "cleanup" ? "Очистка" : "Синхронизация";
    label = `${kind} ${pct}%`;
    title = `${kind}: ${status.projectName || "…"} (${pct}%)`;
    if (syncOverlayVisible || fullSyncInProgress) updateSyncProgressOverlay(status);
  } else if (status?.lastCompletedAt) {
    label = "Готово";
    title = `Синхронизировано ${new Date(status.lastCompletedAt).toLocaleString("ru-RU")}`;
  }

  if (syncStatusText) {
    syncStatusText.textContent = label;
    if (syncStatusText.parentElement) syncStatusText.parentElement.title = title;
  }
  if (footerSyncLabel) footerSyncLabel.textContent = label;
  if (footerSyncStrip) footerSyncStrip.title = title;
  if (footerSyncProgress && footerSyncProgressFill) {
    if (isSyncing) {
      const pct = Number(status?.percent) || 0;
      footerSyncProgress.classList.remove("hidden");
      footerSyncProgressFill.style.width = `${pct}%`;
      footerSyncProgress.setAttribute("aria-valuenow", String(pct));
    } else {
      footerSyncProgress.classList.add("hidden");
      footerSyncProgressFill.style.width = "0%";
      footerSyncProgress.setAttribute("aria-valuenow", "0");
    }
  }

  const queueCount = network?.queueCount || 0;
  if (offlineQueueBadge) {
    offlineQueueBadge.classList.toggle("hidden", !queueCount);
    offlineQueueBadge.textContent = queueCount ? `В очереди: ${queueCount}` : "";
  }
  if (footerQueueBadge) {
    footerQueueBadge.classList.toggle("hidden", !queueCount);
    footerQueueBadge.textContent = queueCount ? `В очереди: ${queueCount}` : "";
  }
}

function getCurrentUserRef() {
  return referenceData?.current_user || referenceData?.currentUser || null;
}

function getRolesRef() {
  return referenceData?.roles || [];
}

function canEditTimeEntryLocally(entry) {
  const syncStatus = entry?.sync_status || "synced";
  if (syncStatus === "pending" || syncStatus === "error" || Number(entry?.id) < 0) return true;
  const currentUser = getCurrentUserRef();
  const roles = getRolesRef();
  if (currentUser?.admin) return true;
  const memberships = currentUser?.memberships || [];
  const membership = memberships.find((m) => Number(m.project?.id) === Number(entry.project_id));
  if (!membership) {
    // Own entries: if roles cache is present but membership/project missing, still allow
    // when any role of the user has edit_own/edit_all — fallback below.
    // Prefer project membership when available.
    if (!entry.project_id && Number(entry.user_id) === Number(currentUser?.id)) {
      return roles.some(
        (role) =>
          (role.permissions || []).includes("edit_time_entries") ||
          (role.permissions || []).includes("edit_own_time_entries"),
      );
    }
    return false;
  }
  const roleIds = new Set((membership.roles || []).map((r) => Number(r.id)));
  const permissions = new Set();
  roles.forEach((role) => {
    if (!roleIds.has(Number(role.id))) return;
    (role.permissions || []).forEach((p) => permissions.add(p));
  });
  const isOwn = Number(entry.user_id) === Number(currentUser?.id);
  return permissions.has("edit_time_entries") || (isOwn && permissions.has("edit_own_time_entries"));
}

function openTimeEntryModalForCreate(issueId) {
  applyTimeEntryFormFieldOrder();
  if (timeEntryEditId) timeEntryEditId.value = "";
  if (timeEntryModalTitle) timeEntryModalTitle.textContent = "Добавить трудозатраты";
  timeEntryIssueId.value = issueId || selectedIssueId || "";
  timeEntryDate.value = todayIsoDate();
  if (timeEntryHours) timeEntryHours.value = "";
  if (timeEntryComments) timeEntryComments.value = "";
  if (timeEntryCustomer) timeEntryCustomer.value = "";
  timeEntryForm?.querySelectorAll(".field-row.invalid").forEach((row) => row.classList.remove("invalid"));
  populateTimeEntryActivitySelect();
  if (!(referenceData?.activities || []).length) {
    setStatus("Справочник видов деятельности ещё не загружен. Выполните синхронизацию.", "error");
  }
  timeEntryModal.classList.remove("hidden");
  requestAnimationFrame(() => autoGrowTextarea(timeEntryComments));
}

function openTimeEntryModalForEdit(entry) {
  if (!entry) return;
  applyTimeEntryFormFieldOrder();
  if (timeEntryEditId) timeEntryEditId.value = String(entry.id);
  if (timeEntryModalTitle) timeEntryModalTitle.textContent = "Изменить трудозатраты";
  timeEntryIssueId.value = entry.issue_id || "";
  timeEntryDate.value = entry.spent_on || todayIsoDate();
  if (timeEntryHours) timeEntryHours.value = entry.hours ?? "";
  if (timeEntryComments) timeEntryComments.value = entry.comments || "";
  if (timeEntryCustomer) timeEntryCustomer.value = entry.customer_name || "";
  timeEntryForm?.querySelectorAll(".field-row.invalid").forEach((row) => row.classList.remove("invalid"));
  populateTimeEntryActivitySelect();
  if (entry.activity_id && timeEntryActivity) {
    timeEntryActivity.value = String(entry.activity_id);
  }
  timeEntryModal.classList.remove("hidden");
  requestAnimationFrame(() => autoGrowTextarea(timeEntryComments));
}

function patchLoadedIssueSpentHours(issueId, spentHours) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || id <= 0) return;
  const idx = loadedIssues.findIndex((issue) => Number(issue.id) === id);
  if (idx >= 0) {
    loadedIssues[idx] = { ...loadedIssues[idx], spent_hours: spentHours };
  }
  if (currentIssue && Number(currentIssue.id) === id) {
    currentIssue = { ...currentIssue, spent_hours: spentHours };
  }
}

async function renderTimeEntries(overrideFilters = null) {
  const currentUser = getCurrentUserRef();
  let filters = overrideFilters;
  if (!filters) {
    const from = new Date();
    from.setDate(from.getDate() - 14);
    filters = { userId: currentUser?.id, from: from.toISOString().slice(0, 10) };
  }
  timeEntriesActiveFilters = filters;

  const titleEl = document.getElementById("time-entries-title");
  if (titleEl) {
    titleEl.textContent = filters.issueId
      ? `Трудозатраты по задаче #${filters.issueId}`
      : "Трудозатраты";
  }
  if (backFromTimeBtn) {
    backFromTimeBtn.innerHTML = filters.issueId
      ? "&larr; Назад к задаче"
      : "&larr; Назад к списку";
  }

  let entries = [];
  try {
    if (filters.issueId) {
      try {
        const syncResult = await window.desktopApi.syncIssueTimeEntries({ issueId: filters.issueId });
        if (syncResult && syncResult.spentHours !== undefined) {
          patchLoadedIssueSpentHours(filters.issueId, syncResult.spentHours);
        }
      } catch (syncError) {
        // Keep local cache visible; network errors shouldn't blank the screen.
        setStatus(`Не удалось обновить трудозатраты с сервера: ${syncError.message}`, "error");
      }
    }
    entries = await window.desktopApi.getTimeEntries({ filters });
  } catch (error) {
    timeEntriesList.classList.add("muted");
    timeEntriesList.textContent = "Не удалось загрузить трудозатраты.";
    setStatus(`Не удалось загрузить трудозатраты: ${error.message}`, "error");
    return;
  }

  if (!entries.length) {
    timeEntriesList.classList.add("muted");
    timeEntriesList.textContent = filters.issueId
      ? `Нет трудозатрат по задаче #${filters.issueId}.`
      : "Нет записей за последние 2 недели.";
    return;
  }

  timeEntriesList.classList.remove("muted");
  const totalHours = entries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
  timeEntriesList.innerHTML = `
    <div class="time-entries-toolbar">
      <span class="time-entries-sum">${totalHours.toFixed(2)} ч</span>
      <span class="muted">${entries.length} запис.</span>
    </div>
    <div class="time-entries-table-wrap">
      <table class="time-entries-table">
        <thead>
          <tr>
            <th class="te-col-date">Дата</th>
            <th class="te-col-hours">Часы</th>
            <th class="te-col-comment">Комментарий</th>
            <th class="te-col-meta">Детали</th>
            <th class="te-col-actions"></th>
          </tr>
        </thead>
        <tbody>
          ${entries
            .map((entry) => {
              const syncStatus = entry.sync_status || "synced";
              const canEdit = canEditTimeEntryLocally(entry);
              const statusBadge =
                syncStatus === "error"
                  ? `<span class="time-entry-status is-error" title="${escapeHtml(entry.sync_error || "Ошибка отправки")}">ошибка</span>`
                  : syncStatus === "pending"
                    ? `<span class="time-entry-status is-pending">ожидает</span>`
                    : "";
              const commentBits = [
                entry.customer_name ? escapeHtml(entry.customer_name) : "",
                escapeHtml(entry.comments || ""),
              ]
                .filter(Boolean)
                .join(" · ");
              const metaBits = [
                filters.issueId ? "" : `#${entry.issue_id || "-"}`,
                escapeHtml(entry.user_name || ""),
                escapeHtml(entry.activity_name || ""),
                escapeHtml(entry.project_name || ""),
              ]
                .filter(Boolean)
                .join(" · ");
              const actions = canEdit
                ? `<button type="button" class="link-btn" data-te-edit="${entry.id}">Изменить</button>
                   <button type="button" class="link-btn time-entry-delete" data-te-delete="${entry.id}">Удалить</button>`
                : "";
              return `<tr class="time-entry-row" data-te-id="${entry.id}">
                <td class="te-col-date">${escapeHtml(entry.spent_on || "—")}</td>
                <td class="te-col-hours">${Number(entry.hours).toFixed(2)}</td>
                <td class="te-col-comment">${commentBits || "—"}</td>
                <td class="te-col-meta">${metaBits} ${statusBadge}</td>
                <td class="te-col-actions">${actions}</td>
              </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;
}

async function saveTimeEntry(event) {
  event.preventDefault();
  const submitBtn = timeEntryForm?.querySelector('button[type="submit"]');
  const payload = getFormValues();
  const editId = timeEntryEditId?.value ? Number(timeEntryEditId.value) : null;

  timeEntryForm?.querySelectorAll(".field-row.invalid").forEach((row) => row.classList.remove("invalid"));
  const hours = timeEntryHours?.value;
  const activityId = timeEntryActivity?.value || "";
  const comments = String(timeEntryComments?.value || "").trim();
  const customerName = String(timeEntryCustomer?.value || "").trim();
  let hasError = false;
  if (!hours || Number(hours) <= 0) {
    timeEntryHours?.closest(".field-row")?.classList.add("invalid");
    hasError = true;
  }
  if (!activityId) {
    timeEntryActivity?.closest(".field-row")?.classList.add("invalid");
    hasError = true;
  }
  if (!comments) {
    timeEntryComments?.closest(".field-row")?.classList.add("invalid");
    hasError = true;
  }
  if (hasError) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Сохраняем…";
  }
  try {
    const patch = {
      issue_id: timeEntryIssueId.value,
      hours,
      spent_on: timeEntryDate.value,
      comments,
      customer_name: customerName,
      activity_id: activityId,
    };
    const result = editId
      ? await window.desktopApi.updateTimeEntry({ entryId: editId, patch })
      : await window.desktopApi.createTimeEntry({ ...payload, patch });
    timeEntryModal.classList.add("hidden");
    setStatus(
      result.offline
        ? "Трудозатраты записаны — отправятся в фоне."
        : editId
          ? "Трудозатраты обновлены."
          : "Трудозатраты сохранены.",
      "success",
    );
    await refreshCustomerNameSuggestions();
    if (!editId) {
      const issueId = Number(timeEntryIssueId.value);
      const idx = loadedIssues.findIndex((issue) => Number(issue.id) === issueId);
      if (idx >= 0) {
        const prev = Number(loadedIssues[idx].spent_hours) || 0;
        loadedIssues[idx] = { ...loadedIssues[idx], spent_hours: prev + Number(hours) };
        renderIssuesList();
      }
    } else {
      await loadIssues(false, { quiet: true }).catch(() => {});
    }
    await renderTimeEntries(
      timeEntriesActiveFilters?.issueId ? { issueId: timeEntriesActiveFilters.issueId } : null,
    );
  } catch (error) {
    setStatus(`Не удалось сохранить трудозатраты: ${error.message}`, "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Сохранить";
    }
  }
}

function syncConnectionFormFromSettings() {
  if (!currentSettings) return;
  if (urlInput) urlInput.value = currentSettings.redmineUrl || "";
  if (apiKeyInput) apiKeyInput.value = currentSettings.apiKey || "";
}

const SETTINGS_PANEL_TITLES = {
  connection: "Подключение",
  sync: "Синхронизация",
  tracker: "Трекер",
  "time-entry-form": "Форма трудозатрат",
  appearance: "Оформление",
  backup: "Резервные копии",
  data: "Файлы и папки",
  "whats-new": "Что нового",
  learning: "Обучение",
};

let cachedAppVersion = "";

async function ensureAppVersion() {
  if (cachedAppVersion) return cachedAppVersion;
  try {
    cachedAppVersion = (await window.desktopApi.getAppVersion?.()) || window.WhatsNew?.latestVersion?.() || "";
  } catch {
    cachedAppVersion = window.WhatsNew?.latestVersion?.() || "";
  }
  return cachedAppVersion;
}

function renderWhatsNewPanel() {
  const root = document.getElementById("whats-new-root");
  if (!root || !window.WhatsNew?.renderWhatsNew) return;
  window.WhatsNew.renderWhatsNew(root, { appVersion: cachedAppVersion || window.WhatsNew.latestVersion() });
}

function showSettingsPanel(panelId) {
  const id = SETTINGS_PANEL_TITLES[panelId] ? panelId : "connection";
  document.querySelectorAll("[data-settings-nav]").forEach((btn) => {
    const active = btn.getAttribute("data-settings-nav") === id;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
  document.querySelectorAll("[data-settings-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.getAttribute("data-settings-panel") !== id);
  });
  const titleEl = document.getElementById("settings-panel-title");
  if (titleEl) titleEl.textContent = SETTINGS_PANEL_TITLES[id] || "Настройки";
  const statusChip = document.getElementById("connection-status-chip");
  if (statusChip) statusChip.classList.toggle("hidden", id !== "connection");
  if (id === "whats-new") renderWhatsNewPanel();
}

function openConnectionSettings(options = {}) {
  syncConnectionFormFromSettings();
  document.getElementById("connection-card")?.classList.remove("hidden");
  document.querySelector(".page")?.classList.add("settings-mode");
  showSettingsPanel(options.panel || "connection");
  refreshConnectionStatusFromState();
  refreshCacheStats().catch(() => {});
  refreshDataPaths().catch(() => {});
}

document.getElementById("data-paths-list")?.addEventListener("click", async (event) => {
  const copyBtn = event.target.closest("[data-copy-path]");
  if (copyBtn) {
    const value = copyBtn.getAttribute("data-copy-path") || "";
    try {
      await navigator.clipboard.writeText(value);
      const prev = copyBtn.textContent;
      copyBtn.textContent = "Скопировано";
      setTimeout(() => {
        copyBtn.textContent = prev || "Копировать";
      }, 1200);
    } catch {
      setStatus("Не удалось скопировать путь.", "error");
    }
    return;
  }

  const openBtn = event.target.closest("[data-open-path]");
  if (openBtn) {
    const target = openBtn.getAttribute("data-open-path") || "";
    try {
      const result = await window.desktopApi.openPath({ path: target });
      if (!result?.ok) setStatus(result?.message || "Не удалось открыть папку.", "error");
    } catch (error) {
      setStatus(error.message || "Не удалось открыть папку.", "error");
    }
  }
});

function closeConnectionSettings() {
  const card = document.getElementById("connection-card");
  if (!card || card.classList.contains("hidden")) return;
  if (!document.querySelector(".page.settings-mode")) return;
  card.classList.add("hidden");
  document.querySelector(".page")?.classList.remove("settings-mode");
}

document.querySelector(".settings-nav")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-settings-nav]");
  if (!btn) return;
  showSettingsPanel(btn.getAttribute("data-settings-nav"));
});

document.getElementById("settings-modal-backdrop")?.addEventListener("click", () => {
  closeConnectionSettings();
});

function positionQuickIssueByIdPopover(anchorEl) {
  const menu = quickIssueByIdPopover;
  const anchor = anchorEl || quickIssuePopoverAnchor;
  if (!menu || !anchor) return;
  const rect = anchor.getBoundingClientRect();
  const width = menu.offsetWidth || 240;
  let left = rect.left + rect.width / 2 - width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
  const top = Math.min(rect.bottom + 10, window.innerHeight - (menu.offsetHeight || 120) - 8);
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.transform = "none";
}

async function handleGlobalNavAction(action, anchorEl, event) {
  if (!action) return;
  if (action === "issues-list") {
    goToIssuesList();
    return;
  }
  if (action === "deep-search") {
    showSearchView();
    return;
  }
  if (action === "time-report") {
    showReportView();
    applyReportPreset(reportActivePreset || "week");
    await loadTimeReport();
    return;
  }
  if (action === "tracker") {
    const agile = document.getElementById("agile-view");
    trackerCameFromAgile = Boolean(agile && !agile.classList.contains("hidden"));
    showTrackerView();
    return;
  }
  if (action === "quick-issue-by-id") {
    event?.preventDefault();
    event?.stopPropagation();
    toggleQuickIssueByIdPopover(anchorEl);
    return;
  }
  if (action === "open-link") {
    closeQuickIssueByIdPopover();
    quickOpenModal?.classList.remove("hidden");
    quickOpenInput?.focus();
    return;
  }
  if (action === "activity-feed") {
    showActivityView();
    return;
  }
  if (action === "notifications") {
    event?.stopPropagation();
    openNotificationsPopover(anchorEl);
    return;
  }
  if (action === "settings") {
    const card = document.getElementById("connection-card");
    if (card && !card.classList.contains("hidden")) closeConnectionSettings();
    else openConnectionSettings();
  }
}

function mountGlobalNavIconBars() {
  window.GlobalNavIcons?.mountAllGlobalNavIcons?.();
}

async function persistUiState() {
  if (!currentSettings) return;
  currentSettings.uiState = {
    searchQuery: searchInput.value.trim(),
    selectedProjectId: projectSelect.value,
    selectedStatusId: "all",
    selectedStatusIds: selectedStatusIds.slice(),
    selectedPriorityIds: selectedPriorityIds.slice(),
    selectedAssigneeId: assigneeSelect.value,
    selectedAuthorIds: selectedAuthorIds.slice(),
    issueScope: getIssueScope(),
    quickOpenValue: quickOpenInput?.value || "",
    dueFrom: dueFromInput?.value || "",
    dueTo: dueToInput?.value || "",
    dueEmptyOnly: Boolean(dueEmptyOnlyCheckbox?.checked),
    statusChipVisible: isFilterChipVisible("status-chip"),
    priorityChipVisible: isFilterChipVisible("priority-chip"),
    assigneeChipVisible: isFilterChipVisible("assignee-chip") && getIssueScope() !== "mine",
    authorChipVisible: isFilterChipVisible("author-chip"),
    dueChipVisible: isFilterChipVisible("due-chip"),
    estimateFilterMode,
    estimateChipVisible: isFilterChipVisible("estimate-chip"),
  };
  await window.desktopApi.saveSettings(currentSettings);
}

function applyDeadlineAlerts(alerts) {
  notifications = Array.isArray(alerts) ? alerts.slice() : [];
  renderNotifications();
}

function renderNotifications() {
  if (!notificationsList) return;
  const count = notifications.length + syncFailureCount;
  const applyCount = (el) => {
    if (!el) return;
    el.textContent = String(count);
    el.classList.toggle("hidden", count === 0);
  };
  document.querySelectorAll("[data-notifications-count]").forEach(applyCount);
  notificationsList.classList.toggle("has-sync-failures-above", syncFailureCount > 0);
  if (!notifications.length) {
    notificationsList.innerHTML = "";
    return;
  }
  notificationsList.innerHTML = notifications
    .map((item) => {
      const label = item.urgency === "overdue" ? "Просрочено" : "Срок скоро";
      const dueLabel = formatDateRu(item.dueDate);
      const urgencyClass = item.urgency === "overdue" ? "is-overdue" : "is-due-soon";
      return `
        <button type="button" class="notification-item ${urgencyClass}" data-issue-id="${Number(item.issueId)}">
          <div><strong>#${Number(item.issueId)}</strong> ${escapeHtml(item.subject || "")}</div>
          <div class="muted">${label} · до ${escapeHtml(dueLabel)}${item.projectName ? ` · ${escapeHtml(item.projectName)}` : ""}</div>
        </button>
      `;
    })
    .join("");
}

async function loadNotificationsPopoverContent() {
  const syncFailuresList = document.getElementById("sync-failures-list");
  if (!syncFailuresList) return;
  try {
    const failures = await window.desktopApi.getSyncFailures();
    syncFailureCount = Array.isArray(failures) ? failures.length : 0;
    if (failures.length) {
      syncFailuresList.classList.remove("hidden");
      syncFailuresList.innerHTML = failures
        .map(
          (f) =>
            `<div class="sync-failure-item"><strong>${escapeHtml(f.entity_label || "")}</strong> ${escapeHtml(f.message)}</div>`,
        )
        .join("");
    } else {
      syncFailuresList.classList.add("hidden");
      syncFailuresList.innerHTML = "";
    }
    renderNotifications();
    setTimeout(async () => {
      try {
        await window.desktopApi.markSyncFailuresRead();
        syncFailureCount = 0;
        renderNotifications();
      } catch (error) {
        console.error("markSyncFailuresRead failed:", error.message);
      }
    }, 1500);
  } catch (error) {
    setStatus(error.message || "Не удалось загрузить ошибки синхронизации", "error");
  }
}

function openNotificationsPopover(anchorEl) {
  if (!notificationsPopover || !anchorEl) return;
  const wasHidden = notificationsPopover.classList.contains("hidden");
  document.getElementById("columns-settings-popover")?.classList.add("hidden");
  if (!wasHidden && notificationsPopover.dataset.anchorId === String(anchorEl.id || "")) {
    notificationsPopover.classList.add("hidden");
    return;
  }
  const rect = anchorEl.getBoundingClientRect();
  const width = 380;
  const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8);
  const top = Math.min(rect.bottom + 8, window.innerHeight - 40);
  notificationsPopover.style.left = `${left}px`;
  notificationsPopover.style.top = `${top}px`;
  notificationsPopover.style.right = "auto";
  notificationsPopover.dataset.anchorId = String(anchorEl.id || "");
  notificationsPopover.classList.remove("hidden");
  loadNotificationsPopoverContent();
}

function todayIsoDateLocal() {
  return todayIsoDate();
}

function addDaysIso(isoDate, days) {
  const [y, m, d] = String(isoDate).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + Number(days || 0));
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function getIssueDueUrgency(issue) {
  const due = issue?.due_date;
  if (!due || !/^\d{4}-\d{2}-\d{2}$/.test(String(due))) return null;
  const statusName = String(issue?.status?.name || "").toLowerCase();
  if (issue?.status?.is_closed || /решен|закрыт|resolved|closed/.test(statusName)) return null;
  const today = todayIsoDateLocal();
  const soonDays = Math.max(0, Number(currentSettings?.deadlineAlertDays) || 3);
  if (due < today) return "overdue";
  if (due <= addDaysIso(today, soonDays)) return "soon";
  return null;
}

async function refreshDeadlineAlerts() {
  try {
    const result = await window.desktopApi.getDeadlineAlerts();
    applyDeadlineAlerts(result?.alerts || []);
  } catch (error) {
    console.error("getDeadlineAlerts failed:", error.message);
  }
  try {
    const failures = await window.desktopApi.getSyncFailures();
    syncFailureCount = Array.isArray(failures) ? failures.length : 0;
    renderNotifications();
  } catch (error) {
    console.error("getSyncFailures failed:", error.message);
  }
}

async function init() {
  currentSettings = await window.desktopApi.loadSettings();
  applySubjectColWidth();
  initSubjectColResize();
  if (urlInput) urlInput.value = currentSettings.redmineUrl || "";
  if (apiKeyInput) apiKeyInput.value = currentSettings.apiKey || "";
  if (settingsAutosyncToggle) settingsAutosyncToggle.checked = currentSettings.autosyncEnabled !== false;
  if (autosyncInterval) autosyncInterval.value = String(currentSettings.autosyncIntervalMinutes || 5);
  if (deadlineAlertDaysSelect) {
    deadlineAlertDaysSelect.value = String(currentSettings.deadlineAlertDays ?? 3);
  }
  if (settingsAutobackupToggle) {
    settingsAutobackupToggle.checked = currentSettings.autoBackupEnabled !== false;
  }
  if (backupFolderPathInput) {
    backupFolderPathInput.value = currentSettings.backupFolder || "";
    backupFolderPathInput.placeholder = "По умолчанию: папка backups в данных приложения";
  }
  if (idleThresholdSelect) {
    const idleVal = currentSettings.idleThresholdMinutes;
    idleThresholdSelect.value = String(idleVal === 0 || idleVal ? idleVal : 5);
  }
  applyTrackerSettingsFromCurrent();
  if (settingsTrackerMinFloor) {
    settingsTrackerMinFloor.checked = currentSettings.trackerMinFloorEnabled !== false;
  }
  if (settingsTrackerShowCustomer) {
    settingsTrackerShowCustomer.checked = Boolean(currentSettings.trackerShowCustomerName);
  }
  if (settingsTrackerShowAi) {
    settingsTrackerShowAi.checked = Boolean(currentSettings.trackerShowAiFields);
  }
  if (settingsProjectsHierarchy) {
    settingsProjectsHierarchy.checked = Boolean(currentSettings.projectsShowHierarchy);
  }
  if (cacheMaxSizeMbSelect) {
    cacheMaxSizeMbSelect.value = String(currentSettings.cacheMaxSizeMb ?? 2048);
  }
  if (cacheRetentionDaysSelect) {
    cacheRetentionDaysSelect.value = String(currentSettings.cacheRetentionDays ?? 90);
  }
  if (settingsCacheAttachments) {
    settingsCacheAttachments.checked = currentSettings.cacheAttachmentsEnabled !== false;
  }
  if (searchInput) {
    searchInput.placeholder = "Текст в теме, проекте, авторе";
  }
  renderTeFormOrderSettings();
  applyTimeEntryFormFieldOrder();
  syncTrackerModeCardsUi();

  // Fast start: paint list from local cache before any network work.
  try {
    const cachedRef = await window.desktopApi.getCachedReferenceData();
    if (cachedRef) {
      referenceData = normalizeReferencePayload(cachedRef);
      await applyReferenceDataToFilters();
    }
  } catch (error) {
    console.warn("cached reference preload failed:", error.message);
  }

  setIssueScope(currentSettings?.uiState?.issueScope || "mine", { persist: false });
  if (getIssueScope() === "favorites") {
    applyNeutralFiltersForFavorites();
  }
  syncFavoritesFilterUi();
  window.desktopApi?.setFavoriteIssueIds?.(getFavoriteIssueIds()).catch(() => {});
  initReportPeriodPicker();
  initTrackerPeriodPicker();
  mountGlobalNavIconBars();
  syncDueFilterUi();
  window.FilterChips?.updateAssigneeLock?.();
  window.FilterChips?.updateDueSummary?.();
  window.FilterChips?.updateStatusSummary?.();
  restoreDueSort();

  await loadIssues(false);

  // Enrich filters from ensureReference (usually cache; network only if incomplete).
  refreshReferenceData()
    .then(() => loadIssues(false, { quiet: true }))
    .catch((error) => console.warn("reference refresh failed:", error.message));
  refreshCacheStats().catch(() => {});

  const network = await window.desktopApi.getNetworkStatus();
  const syncStatus = await window.desktopApi.getSyncStatus();
  updateSyncStatusBar(syncStatus, network);

  window.desktopApi.onSyncProgress((status) => updateSyncStatusBar(status, { online: networkOnline }));
  window.desktopApi.onNetworkStatus((payload) => {
    updateSyncStatusBar(syncEngineSafeStatus(), payload);
    if (payload.online && payload.queueCount > 0) {
      window.desktopApi.flushOfflineQueue();
    }
  });

  window.desktopApi.onOfflineFlushed?.(async (payload) => {
    try {
      const network = await window.desktopApi.getNetworkStatus();
      updateSyncStatusBar(syncEngineSafeStatus(), network);
    } catch {}
    const issueIds = (payload?.issueIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
    const trackerVisible = !document.getElementById("tracker-view")?.classList.contains("hidden");
    const issuePageVisible = !issuePage?.classList.contains("hidden");
    const shouldRefresh = window.FlushRefresh?.shouldRefreshIssueCardOnFlush?.({
      trackerViewVisible: trackerVisible,
      issuePageVisible,
      selectedIssueId,
      flushedIssueIds: issueIds,
    });
    if (!shouldRefresh) return;
    // Quiet refresh: replace optimistic "отправка…" / pending comments with synced data.
    openIssueDetails(selectedIssueId, { forceRefresh: false, quiet: true }).catch(() => {});
  });

  window.desktopApi.onOpenIssueFromLink(({ issueId }) => {
    if (issueId) openIssueDetails(issueId);
  });

  window.desktopApi.onNavigateBack(() => {
    handleAppBack();
  });

  window.addEventListener(
    "mousedown",
    (event) => {
      if (event.button === 3 || event.button === 4) event.preventDefault();
    },
    true,
  );
  window.addEventListener(
    "mouseup",
    (event) => {
      if (event.button !== 3) return;
      event.preventDefault();
      handleAppBack();
    },
    true,
  );

  window.desktopApi.onDeadlineAlerts((payload) => {
    applyDeadlineAlerts(payload?.alerts || []);
  });
  await refreshDeadlineAlerts();

  if (window.desktopApi.onActivityUpdated) {
    window.desktopApi.onActivityUpdated((payload) => {
      applyActivityBadge(payload?.unseenCount);
      const activityView = document.getElementById("activity-view");
      if (activityView && !activityView.classList.contains("hidden")) {
        refreshActivityFeedView().catch(() => {});
      }
    });
  }
  await refreshActivityBadgeOnly();
  syncActivityFeedToolbar();
  renderActivityTypeOptions();

  if (window.desktopApi.onTrackerRecoveredTimer) {
    window.desktopApi.onTrackerRecoveredTimer((state) => {
      handleRecoveredTimer(state).catch((error) => {
        console.error("handleRecoveredTimer failed:", error.message);
      });
    });
  }

  if (window.desktopApi.onTrackerIdleDetected) {
    window.desktopApi.onTrackerIdleDetected((payload) => {
      showTrackerIdlePrompt(payload || {});
    });
  }

  window.__openIssueById = (id) => openIssueDetails(Number(id), { preview: false });
  window.__openIssuePreview = (id) => {
    openIssueDetails(Number(id), { preview: true, forceRefresh: false, quiet: false })
      .then(() => {
        if (!networkOnline) return;
        return openIssueDetails(Number(id), { preview: true, forceRefresh: true, quiet: true });
      })
      .catch((error) => setStatus(error.message, "error"));
  };
  window.__closeIssuePreview = () => {
    closeIssuePreviewDrawer();
  };
  window.__expandIssuePreview = () => {
    expandIssuePreviewToFull();
  };
  window.__getAllowedStatuses = async (issueId) => {
    try {
      return await window.desktopApi.getAllowedStatuses({ ...getFormValues(), issueId });
    } catch (error) {
      return { statuses: null, unavailable: true, error: error.message };
    }
  };
  window.__applyBoardStatusChange = async (issueId, statusId) => {
    try {
      const check = await checkOpenChildrenBeforeClose(issueId, statusId);
      if (!check.proceed) return { ok: false, cancelled: true };
      await patchIssueFields(issueId, { status_id: statusId }, { successMessage: "Статус изменён" });
      if (check.extraIds.length) {
        await applyBulkStatusChange(check.extraIds, statusId);
      }
      return { ok: true };
    } catch (error) {
      await refreshBoardData();
      return { ok: false, error: error.message };
    }
  };
  window.__showAppToast = showAppToast;
  window.__getSelectedProjectId = () => projectSelect?.value || "all";
  window.__getBoardIssues = () => boardIssuesCache.map(issueToBoardItem);
  window.__getBoardStatuses = () => boardStatusesCache;
  window.__getBoardSubtitle = () => {
    const projectId = projectSelect?.value;
    if (!projectId || projectId === "all") return "Выберите проект в фильтре сверху";
    const project = (referenceData?.projects || []).find((p) => String(p.id) === String(projectId));
    return project?.name || "Выбранный проект";
  };
  window.__getNetworkOnline = () => networkOnline;
  window.__runBoardSync = () => runManualSync();
  window.__refreshBoardData = refreshBoardData;
  window.__textileToHtml = textileToHtml;
  window.__getAttachmentPreviewDataUrl = async (contentUrl) => {
    if (!contentUrl || !networkOnline) return null;
    try {
      const preview = await window.desktopApi.getAttachmentPreview({
        ...getFormValues(),
        contentUrl,
      });
      return `data:${preview.mimeType};base64,${preview.dataBase64}`;
    } catch {
      return null;
    }
  };

  if (window.ProductTour) {
    window.ProductTour.configure({
      ensureIssuesListView: async () => {
        goToIssuesList();
        await new Promise((resolve) => setTimeout(resolve, 150));
      },
      showReportView: async () => {
        showReportView();
        await loadTimeReport().catch(() => {});
        await new Promise((resolve) => setTimeout(resolve, 200));
      },
      showTrackerView: async () => {
        showTrackerView();
        await new Promise((resolve) => setTimeout(resolve, 280));
      },
      showActivityView: async () => {
        showActivityView();
        await new Promise((resolve) => setTimeout(resolve, 200));
      },
    });
    var shouldAutoStartTour = false;
    try {
      shouldAutoStartTour = sessionStorage.getItem("redmine-client:start-product-tour") === "1";
      if (shouldAutoStartTour) sessionStorage.removeItem("redmine-client:start-product-tour");
    } catch (_) {
      /* ignore */
    }
    if (shouldAutoStartTour && !window.ProductTour.isTourComplete()) {
      setTimeout(() => {
        window.ProductTour.startTour().catch(() => {});
      }, 500);
    } else {
      maybeAutoShowWhatsNew();
    }
  } else {
    maybeAutoShowWhatsNew();
  }
}

async function maybeAutoShowWhatsNew() {
  try {
    if (window.ProductTour?.isActive?.()) return;
    if (window.ProductTour && !window.ProductTour.isTourComplete()) return;
    const version = await ensureAppVersion();
    if (!version || !window.WhatsNew?.shouldAutoShow?.(version)) return;
    openConnectionSettings({ panel: "whats-new" });
    // Mark seen when opened automatically so it won't loop if user closes via ✕.
    window.WhatsNew.markSeenVersion(version);
  } catch (error) {
    console.warn("whats-new auto-show failed:", error?.message || error);
  }
}

function syncEngineSafeStatus() {
  return { running: syncStatusDot?.classList.contains("syncing") };
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const redmineUrl = urlInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    if (!redmineUrl || !apiKey) {
      setConnectionFeedback("Укажите URL и API key перед сохранением.", false);
      return;
    }
    currentSettings.redmineUrl = redmineUrl;
    currentSettings.apiKey = apiKey;
    await window.desktopApi.saveSettings(currentSettings);
    setConnectionFeedback("Настройки подключения сохранены.", true);
    setStatus("Настройки подключения сохранены.", "success");
  });
}

checkButton?.addEventListener("click", async () => {
  const redmineUrl = urlInput.value.trim();
  const apiKey = apiKeyInput.value.trim();
  const result = await window.desktopApi.testConnection({ redmineUrl, apiKey });
  setConnectionFeedback(result.message, result.ok);
});

saveButton?.addEventListener("click", () => form.requestSubmit());

closeConnectionButton?.addEventListener("click", () => closeConnectionSettings());

document.getElementById("start-product-tour-btn")?.addEventListener("click", async () => {
  closeConnectionSettings();
  goToIssuesList();
  try {
    await window.ProductTour?.startTour({ force: true });
  } catch (error) {
    setStatus(error.message || "Не удалось запустить обучение", "error");
  }
});

document.getElementById("whats-new-root")?.addEventListener("click", async (event) => {
  if (!event.target.closest("#whats-new-ack-btn")) return;
  try {
    const version = (await ensureAppVersion()) || window.WhatsNew?.latestVersion?.() || "";
    window.WhatsNew?.markSeenVersion?.(version);
  } catch {}
  closeConnectionSettings();
});

syncReferenceButton?.addEventListener("click", async () => {
  const btn = syncReferenceButton;
  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Обновляем…";
  try {
    await refreshReferenceData({ forceFromServer: true });
    setStatus("Справочники обновлены.", "success");
  } catch (error) {
    setStatus(error?.message || "Не удалось обновить справочники", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

resetFiltersButton?.addEventListener("click", async () => {
  projectSelect.value = "all";
  applyStatusScopePreset("open");
  assigneeBeforeMineLock = "all";
  assigneeChipVisibleBeforeMineLock = false;
  if (Array.from(assigneeSelect.options).some((o) => o.value === "all")) {
    assigneeSelect.value = "all";
  }
  searchInput.value = "";
  if (dueFromInput) dueFromInput.value = "";
  if (dueToInput) dueToInput.value = "";
  if (dueEmptyOnlyCheckbox) dueEmptyOnlyCheckbox.checked = false;
  window.FilterChips?.setChipVisible?.("status-chip", false);
  window.FilterChips?.setChipVisible?.("priority-chip", false);
  window.FilterChips?.setChipVisible?.("due-chip", false);
  window.FilterChips?.setChipVisible?.("assignee-chip", false);
  window.FilterChips?.setChipVisible?.("author-chip", false);
  window.FilterChips?.setChipVisible?.("estimate-chip", false);
  window.FilterChips?.setDueMode?.("period", true);
  setSelectedPriorityIds([]);
  setSelectedAuthorIds([]);
  estimateFilterMode = "any";
  document.querySelectorAll('input[name="estimate-filter-mode"]').forEach((radio) => {
    radio.checked = radio.value === "any";
  });
  updateEstimateChipSummary();
  syncDueFilterUi();
  setIssueScope("mine", { persist: false });
  await updateFilterAssigneesForProject();
  await updateFilterAuthorsForProject();
  await persistUiState();
  await loadIssues(false);
});

issueScopeToggle?.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-issue-scope]");
  if (!btn) return;
  setIssueScope(btn.getAttribute("data-issue-scope"), { persist: true });
  await loadIssues(false);
});

document.querySelector(".issues-columns-head")?.addEventListener("click", (event) => {
  const priorityBtn = event.target.closest('[data-sort-key="priority"]');
  if (priorityBtn) {
    cyclePrioritySort();
    return;
  }
  const projectBtn = event.target.closest('[data-sort-key="project"]');
  if (projectBtn) {
    cycleProjectSort();
    return;
  }
  const assigneeBtn = event.target.closest('[data-sort-key="assignee"]');
  if (assigneeBtn) {
    cycleAssigneeSort();
    return;
  }
  const statusBtn = event.target.closest('[data-sort-key="status"]');
  if (statusBtn) {
    cycleStatusSort();
    return;
  }
  const updatedBtn = event.target.closest('[data-sort-key="updated_on"]');
  if (updatedBtn) {
    cycleUpdatedSort();
    return;
  }
  const dueBtn = event.target.closest('[data-sort-key="due"]');
  if (dueBtn) cycleDueSort();
});

[searchInput, assigneeSelect].forEach((element) => {
  element?.addEventListener("change", async () => {
    await persistUiState();
    await loadIssues(false);
  });
});

async function onDueFilterChanged() {
  syncDueFilterUi();
  if (dueEmptyOnlyCheckbox?.checked) {
    if (dueFromInput) dueFromInput.value = "";
    if (dueToInput) dueToInput.value = "";
  }
  if (dueEmptyOnlyCheckbox?.checked || dueFromInput?.value || dueToInput?.value) {
    window.FilterChips?.setChipVisible?.("due-chip", true);
  }
  await persistUiState();
  await loadIssues(false);
}

dueFromInput?.addEventListener("change", onDueFilterChanged);
dueToInput?.addEventListener("change", onDueFilterChanged);
dueEmptyOnlyCheckbox?.addEventListener("change", onDueFilterChanged);

document.addEventListener("rm-filters-changed", async () => {
  if (statusFilterList) {
    setSelectedStatusIds(getCheckedStatusIdsFromDom(), { syncScope: true });
  }
  if (priorityFilterList) {
    setSelectedPriorityIds(getCheckedPriorityIdsFromDom());
  }
  if (authorFilterList) {
    setSelectedAuthorIds(getCheckedAuthorIdsFromDom());
  }
  const estimateChecked = document.querySelector('input[name="estimate-filter-mode"]:checked');
  if (estimateChecked) {
    estimateFilterMode = estimateChecked.value || "any";
    updateEstimateChipSummary();
  }
  window.FilterChips?.updateStatusSummary?.();
  window.FilterChips?.updateDueSummary?.();
  window.FilterChips?.syncAssigneeChipLabel?.();
  await persistUiState();
  await loadIssues(false);
});

addWatcherBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  openWatcherPicker().catch(() => {});
});

watcherPickerSearch?.addEventListener("input", () => {
  renderWatcherPickerList(watcherPickerSearch.value);
});

watcherPickerList?.addEventListener("change", (event) => {
  if (!event.target.matches?.('input[type="checkbox"][data-watcher-id]')) return;
  syncWatcherPickerSelectionFromDom();
});

watcherPickerApply?.addEventListener("click", (event) => {
  event.stopPropagation();
  applySelectedWatchersFromPicker().catch(() => {});
});

watcherPickerCancel?.addEventListener("click", (event) => {
  event.stopPropagation();
  closeWatcherPicker();
});

watcherPicker?.addEventListener("click", (event) => {
  event.stopPropagation();
});

issueWatchers?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-watcher]");
  if (!btn) return;
  removeWatcherById(btn.getAttribute("data-remove-watcher"), btn.getAttribute("data-watcher-name") || "").catch(
    () => {},
  );
});

issuesList?.addEventListener("click", (event) => {
  const statusBtn = event.target.closest("[data-inline-status]");
  if (statusBtn) {
    event.preventDefault();
    event.stopPropagation();
    openInlineStatusPopover(
      statusBtn.getAttribute("data-inline-status"),
      statusBtn,
      statusBtn.getAttribute("data-status-id"),
    ).catch((error) => {
      setStatus(`Не удалось открыть список статусов: ${error.message}`, "error");
    });
    return;
  }
  const dueBtn = event.target.closest("[data-inline-due]");
  if (dueBtn) {
    event.preventDefault();
    event.stopPropagation();
    openInlineDuePopover(dueBtn.getAttribute("data-inline-due"), dueBtn, dueBtn.getAttribute("data-due") || "");
    return;
  }
  const timeBtn = event.target.closest("[data-inline-time]");
  if (timeBtn) {
    event.preventDefault();
    event.stopPropagation();
    openInlineTimePopover(timeBtn.getAttribute("data-inline-time"), timeBtn);
  }
});

issueMainMeta?.addEventListener("click", (event) => {
  const timeBtn = event.target.closest("[data-inline-time]");
  if (!timeBtn) return;
  event.preventDefault();
  event.stopPropagation();
  openInlineTimePopover(timeBtn.getAttribute("data-inline-time"), timeBtn);
});

function resetPendingBulkState() {
  pendingBulkStatusId = null;
  pendingBulkAllIds = [];
  pendingBulkSafeIds = [];
  bulkStatusSubtasksWarning?.classList.add("hidden");
  if (bulkStatusSubtasksWarning) bulkStatusSubtasksWarning.textContent = "";
  bulkStatusSkipBtn?.classList.add("hidden");
  if (bulkStatusConfirmBtn) bulkStatusConfirmBtn.textContent = "Подтвердить";
}

function prepareBulkStatusModalWithoutSubtasks(selectedIds, statusName) {
  pendingBulkAllIds = selectedIds;
  pendingBulkSafeIds = selectedIds;
  if (bulkStatusConfirmText) {
    bulkStatusConfirmText.textContent = `Сменить статус у ${selectedIds.length} задач на «${statusName}»?`;
  }
  bulkStatusSubtasksWarning?.classList.add("hidden");
  if (bulkStatusSubtasksWarning) bulkStatusSubtasksWarning.textContent = "";
  bulkStatusSkipBtn?.classList.add("hidden");
  if (bulkStatusConfirmBtn) bulkStatusConfirmBtn.textContent = "Подтвердить";
}

document.getElementById("issue-context-menu")?.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-set-bulk-status]");
  if (!btn) return;
  event.stopPropagation();
  const statusId = Number(btn.getAttribute("data-set-bulk-status"));
  const statusName = btn.textContent;
  closeIssueContextMenu();
  if (!Number.isFinite(statusId) || statusId <= 0) return;

  const statuses = referenceData?.issue_statuses || referenceData?.issueStatuses || [];
  const status = statuses.find((s) => Number(s.id) === statusId);
  const isClosedTarget = Boolean(status?.is_closed);
  const selectedIds = Array.from(selectedIssueIds);
  pendingBulkStatusId = statusId;

  if (!isClosedTarget) {
    prepareBulkStatusModalWithoutSubtasks(selectedIds, statusName);
    bulkStatusConfirmModal?.classList.remove("hidden");
    return;
  }

  let openChildren = [];
  try {
    openChildren = (await window.desktopApi.getOpenChildren(selectedIds)) || [];
  } catch (error) {
    openChildren = [];
    setStatus(`Не удалось проверить подзадачи: ${error.message}`, "error");
  }

  if (!openChildren.length) {
    prepareBulkStatusModalWithoutSubtasks(selectedIds, statusName);
    bulkStatusConfirmModal?.classList.remove("hidden");
    return;
  }

  const problemParentIds = new Set(openChildren.map((c) => Number(c.parent_id)));
  const childIds = openChildren.map((c) => Number(c.id));
  pendingBulkAllIds = Array.from(new Set([...selectedIds, ...childIds]));
  pendingBulkSafeIds = selectedIds.filter((id) => !problemParentIds.has(Number(id)));

  if (bulkStatusConfirmText) {
    bulkStatusConfirmText.textContent = `Сменить статус у ${selectedIds.length} задач на «${statusName}».`;
  }
  if (bulkStatusSubtasksWarning) {
    bulkStatusSubtasksWarning.classList.remove("hidden");
    bulkStatusSubtasksWarning.textContent = `У ${problemParentIds.size} из них есть незакрытые подзадачи (${childIds.length} шт.) — закрыть их тоже?`;
  }
  bulkStatusSkipBtn?.classList.remove("hidden");
  if (bulkStatusConfirmBtn) bulkStatusConfirmBtn.textContent = "Да, закрыть всё";
  bulkStatusConfirmModal?.classList.remove("hidden");
});

bulkStatusCancelBtn?.addEventListener("click", () => {
  resetPendingBulkState();
  bulkStatusConfirmModal?.classList.add("hidden");
});

bulkStatusSkipBtn?.addEventListener("click", async () => {
  const statusId = Number(pendingBulkStatusId);
  const ids = [...pendingBulkSafeIds];
  bulkStatusConfirmModal?.classList.add("hidden");
  if (!Number.isFinite(statusId) || statusId <= 0) {
    resetPendingBulkState();
    return;
  }
  const prevLabel = bulkStatusSkipBtn.textContent;
  bulkStatusSkipBtn.disabled = true;
  bulkStatusConfirmBtn && (bulkStatusConfirmBtn.disabled = true);
  bulkStatusSkipBtn.textContent = "Меняем…";
  try {
    await applyBulkStatusChange(ids, statusId);
  } finally {
    bulkStatusSkipBtn.disabled = false;
    if (bulkStatusConfirmBtn) bulkStatusConfirmBtn.disabled = false;
    bulkStatusSkipBtn.textContent = prevLabel || "Пропустить эти задачи";
    resetPendingBulkState();
  }
});

bulkStatusConfirmBtn?.addEventListener("click", async () => {
  const statusId = Number(pendingBulkStatusId);
  if (!pendingBulkAllIds.length || !Number.isFinite(statusId) || statusId <= 0) {
    resetPendingBulkState();
    bulkStatusConfirmModal?.classList.add("hidden");
    return;
  }
  const ids = [...pendingBulkAllIds];
  bulkStatusConfirmModal?.classList.add("hidden");
  const prevConfirmLabel = bulkStatusConfirmBtn.textContent;
  bulkStatusConfirmBtn.disabled = true;
  if (bulkStatusSkipBtn) bulkStatusSkipBtn.disabled = true;
  bulkStatusConfirmBtn.textContent = "Меняем…";
  try {
    await applyBulkStatusChange(ids, statusId);
  } finally {
    bulkStatusConfirmBtn.disabled = false;
    if (bulkStatusSkipBtn) bulkStatusSkipBtn.disabled = false;
    bulkStatusConfirmBtn.textContent = prevConfirmLabel || "Подтвердить";
    resetPendingBulkState();
  }
});

listInlinePopover?.addEventListener("click", async (event) => {
  event.stopPropagation();
  const statusItem = event.target.closest("[data-set-status]");
  if (statusItem && listInlinePopoverIssueId) {
    const issueId = listInlinePopoverIssueId;
    const statusId = statusItem.getAttribute("data-set-status");
    closeListInlinePopover();
    try {
      const check = await checkOpenChildrenBeforeClose(issueId, statusId);
      if (!check.proceed) return;
      await patchIssueFields(issueId, { status_id: statusId }, { successMessage: "Статус изменён" });
      if (check.extraIds.length) {
        await applyBulkStatusChange(check.extraIds, statusId);
      }
    } catch (error) {
      /* toast уже показан в patchIssueFields */
    }
    return;
  }

  if (event.target.id === "inline-due-cancel" || event.target.id === "inline-time-cancel") {
    closeListInlinePopover({ discardTimeDraft: event.target.id === "inline-time-cancel" });
    return;
  }

  if (event.target.id === "inline-time-clear-comment") {
    event.preventDefault();
    const commentEl = document.getElementById("inline-time-comment");
    if (commentEl) {
      commentEl.value = "";
      autoGrowTextarea(commentEl, { maxPx: 160 });
      commentEl.focus();
    }
    if (listInlinePopoverIssueId) clearInlineTimeDraft(listInlinePopoverIssueId);
    return;
  }

  if (event.target.id === "inline-time-not-today") {
    event.preventDefault();
    document.getElementById("inline-time-date-row")?.classList.remove("hidden");
    document.getElementById("inline-time-not-today")?.classList.add("hidden");
    document.getElementById("inline-time-date")?.focus();
    requestAnimationFrame(() => {
      const anchor = document.querySelector(`[data-inline-time="${listInlinePopoverIssueId}"]`);
      if (anchor) positionListInlinePopover(anchor);
    });
    return;
  }

  if (event.target.id === "inline-due-clear" && listInlinePopoverIssueId) {
    const issueId = listInlinePopoverIssueId;
    closeListInlinePopover();
    try {
      await patchIssueFields(issueId, { due_date: null }, { successMessage: "Срок очищен" });
    } catch (error) {
      /* toast уже показан */
    }
    return;
  }

  if (event.target.id === "inline-due-save" && listInlinePopoverIssueId) {
    const issueId = listInlinePopoverIssueId;
    const value = document.getElementById("inline-due-input")?.value || "";
    closeListInlinePopover();
    try {
      await patchIssueFields(issueId, { due_date: value || null }, { successMessage: "Срок изменён" });
    } catch (error) {
      /* toast уже показан */
    }
    return;
  }

  if (event.target.id === "inline-time-save" && listInlinePopoverIssueId) {
    const issueId = listInlinePopoverIssueId;
    const hoursInput = document.getElementById("inline-time-hours");
    const activitySelect = document.getElementById("inline-time-activity");
    const commentInput = document.getElementById("inline-time-comment");
    const hoursRow = hoursInput?.closest(".field-row");
    const activityRow = activitySelect?.closest(".field-row");
    const commentRow = commentInput?.closest(".field-row");
    hoursRow?.classList.remove("invalid");
    activityRow?.classList.remove("invalid");
    commentRow?.classList.remove("invalid");

    const hours = hoursInput?.value;
    const activityId = activitySelect?.value || "";
    const comments = String(commentInput?.value || "").trim();
    const customerName = String(document.getElementById("inline-time-customer")?.value || "").trim();
    let hasError = false;
    if (!comments) {
      commentRow?.classList.add("invalid");
      hasError = true;
    }
    if (!hours || Number(hours) <= 0) {
      hoursRow?.classList.add("invalid");
      hasError = true;
    }
    if (!activityId) {
      activityRow?.classList.add("invalid");
      hasError = true;
    }
    if (hasError) return;

    const spentOn = document.getElementById("inline-time-date")?.value || todayIsoDate();
    const saveBtn = event.target;
    const prevLabel = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Сохраняем…";
    try {
      const result = await window.desktopApi.createTimeEntry({
        patch: {
          issue_id: issueId,
          hours,
          comments,
          customer_name: customerName,
          activity_id: activityId,
          spent_on: spentOn,
        },
      });
      clearInlineTimeDraft(issueId);
      closeListInlinePopover({ discardTimeDraft: true });
      await refreshCustomerNameSuggestions();
      const idx = loadedIssues.findIndex((issue) => Number(issue.id) === Number(issueId));
      if (idx >= 0) {
        const prev = Number(loadedIssues[idx].spent_hours) || 0;
        loadedIssues[idx] = {
          ...loadedIssues[idx],
          spent_hours: prev + Number(hours),
        };
        renderIssuesList();
      }
      if (currentIssue && Number(currentIssue.id) === Number(issueId)) {
        const prev = Number(currentIssue.spent_hours) || 0;
        currentIssue = { ...currentIssue, spent_hours: prev + Number(hours) };
        const spentCell = issueMainMeta?.querySelector(".issue-spent-actions");
        if (spentCell) {
          const hoursLabel = spentCell.childNodes[0];
          if (hoursLabel && hoursLabel.nodeType === Node.TEXT_NODE) {
            hoursLabel.textContent = `${formatHours(currentIssue.spent_hours)} `;
          } else {
            spentCell.childNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE && String(node.textContent || "").trim()) {
                node.textContent = `${formatHours(currentIssue.spent_hours)} `;
              }
            });
          }
        }
      }
      showAppToast(
        result.offline
          ? "Трудозатраты записаны — отправятся в фоне"
          : "Трудозатраты сохранены",
        result.offline ? "info" : "success",
      );
    } catch (error) {
      saveBtn.disabled = false;
      saveBtn.textContent = prevLabel || "Сохранить";
      showAppToast(error.message || "Не удалось сохранить трудозатраты", "error");
      setStatus(`Не удалось сохранить трудозатраты: ${error.message}`, "error");
    }
  }
});

document.addEventListener(
  "mousedown",
  (event) => {
    listInlinePointerDownInside = Boolean(
      listInlinePopover &&
        !listInlinePopover.classList.contains("hidden") &&
        listInlinePopover.contains(event.target),
    );
    trackerSuggestPointerDownInside = Boolean(
      event.target.closest?.(".tracker-cell-suggest:not(.hidden)") ||
        event.target.closest?.(".tracker-suggest"),
    );
  },
  true,
);

document.addEventListener("click", (event) => {
  if (!event.target.closest("#issue-context-menu")) closeIssueContextMenu();
  if (!event.target.closest("#tracker-row-context-menu")) closeTrackerRowContextMenu();
  if (
    quickIssueByIdPopover &&
    !quickIssueByIdPopover.classList.contains("hidden") &&
    !event.target.closest('[data-global-nav="quick-issue-by-id"]') &&
    !event.target.closest("#quick-issue-by-id-popover")
  ) {
    closeQuickIssueByIdPopover();
  }

  if (
    !event.ctrlKey &&
    !event.metaKey &&
    selectedIssueIds.size > 0 &&
    !event.target.closest("#issue-context-menu") &&
    !event.target.closest("#bulk-status-confirm-modal")
  ) {
    selectedIssueIds.clear();
    syncSelectedRowsVisual();
  }

  if (!listInlinePopover || listInlinePopover.classList.contains("hidden")) return;
  if (listInlinePopover.contains(event.target)) return;
  if (event.target.closest("[data-inline-status], [data-inline-due], [data-inline-time]")) return;
  // Selection/drag started inside the popover (mouseup outside) must not close it.
  if (listInlinePointerDownInside) {
    listInlinePointerDownInside = false;
    return;
  }
  closeListInlinePopover();
});

document.addEventListener("keydown", handleEscapeKey);

// Chip label already opens/closes the status popover (FilterChips).
statusFilterPanel?.addEventListener("click", (event) => {
  event.stopPropagation();
});

statusFilterList?.addEventListener("change", async (event) => {
  if (!event.target.matches?.('input[type="checkbox"]')) return;
  setSelectedStatusIds(getCheckedStatusIdsFromDom());
  await persistUiState();
  await loadIssues(false);
});

statusFilterSelectAll?.addEventListener("click", async () => {
  const allIds = getAvailableStatusesForCurrentProject().map((s) => Number(s.id)).filter(Boolean);
  setSelectedStatusIds(allIds);
  await persistUiState();
  await loadIssues(false);
});

statusFilterClearAll?.addEventListener("click", async () => {
  setSelectedStatusIds([]);
  await persistUiState();
  await loadIssues(false);
});

statusScopeOpenBtn?.addEventListener("click", async () => {
  applyStatusScopePreset("open");
  await persistUiState();
  await loadIssues(false);
});

statusScopeAllBtn?.addEventListener("click", async () => {
  applyStatusScopePreset("all");
  await persistUiState();
  await loadIssues(false);
});

document.addEventListener("click", (event) => {
  const statusChip = document.getElementById("status-chip");
  if (statusChip?.contains(event.target)) return;
  if (statusFilterPanel?.contains(event.target)) return;
  closeStatusFilterPanel();
});

priorityFilterPanel?.addEventListener("click", (event) => {
  event.stopPropagation();
});

priorityFilterList?.addEventListener("change", async (event) => {
  if (!event.target.matches?.('input[type="checkbox"]')) return;
  setSelectedPriorityIds(getCheckedPriorityIdsFromDom());
  await persistUiState();
  await loadIssues(false);
});

priorityFilterSelectAll?.addEventListener("click", async () => {
  const allIds = getReferencePriorities().map((p) => Number(p.id)).filter(Boolean);
  setSelectedPriorityIds(allIds);
  await persistUiState();
  await loadIssues(false);
});

priorityFilterClearAll?.addEventListener("click", async () => {
  setSelectedPriorityIds([]);
  await persistUiState();
  await loadIssues(false);
});

document.addEventListener("click", (event) => {
  const priorityChip = document.getElementById("priority-chip");
  if (priorityChip?.contains(event.target)) return;
  if (priorityFilterPanel?.contains(event.target)) return;
  closePriorityFilterPanel();
});

authorFilterPanel?.addEventListener("click", (event) => {
  event.stopPropagation();
});

authorFilterList?.addEventListener("change", async (event) => {
  if (!event.target.matches?.('input[type="checkbox"]')) return;
  setSelectedAuthorIds(getCheckedAuthorIdsFromDom());
  await persistUiState();
  await loadIssues(false);
});

authorFilterSelectAll?.addEventListener("click", async () => {
  const allIds = filterAuthorsCache.map((a) => Number(a.id)).filter(Boolean);
  setSelectedAuthorIds(allIds);
  await persistUiState();
  await loadIssues(false);
});

authorFilterClearAll?.addEventListener("click", async () => {
  setSelectedAuthorIds([]);
  await persistUiState();
  await loadIssues(false);
});

document.addEventListener("click", (event) => {
  const authorChip = document.getElementById("author-chip");
  if (authorChip?.contains(event.target)) return;
  if (authorFilterPanel?.contains(event.target)) return;
  closeAuthorFilterPanel();
});

function updateEstimateChipSummary() {
  const summary = document.getElementById("estimate-chip-summary");
  if (!summary) return;
  const labels = { any: "Любая", has: "С оценкой", none: "Без оценки" };
  summary.textContent = labels[estimateFilterMode] || "Любая";
}

function closeEstimateFilterPanel() {
  document.getElementById("estimate-filter-panel")?.classList.add("hidden");
  document.getElementById("estimate-chip-trigger")?.setAttribute("aria-expanded", "false");
}

document.querySelectorAll('input[name="estimate-filter-mode"]').forEach((radio) => {
  radio.addEventListener("change", async () => {
    if (!radio.checked) return;
    estimateFilterMode = radio.value || "any";
    updateEstimateChipSummary();
    closeEstimateFilterPanel();
    await persistUiState();
    await loadIssues(false);
  });
});

document.addEventListener("click", (event) => {
  const estimateChip = document.getElementById("estimate-chip");
  const estimatePanel = document.getElementById("estimate-filter-panel");
  if (estimateChip?.contains(event.target)) return;
  if (estimatePanel?.contains(event.target)) return;
  closeEstimateFilterPanel();
});

projectSelect?.addEventListener("change", async () => {
  await refreshCurrentProjectStatusOptions();
  renderStatusFilterList();
  await updateFilterAssigneesForProject();
  await updateFilterAuthorsForProject();
  await persistUiState();
  await loadIssues(false);
});
searchInput?.addEventListener("input", async () => {
  await persistUiState();
  await loadIssues(false);
});

backToListButton?.addEventListener("click", handleAppBack);
document.getElementById("issue-preview-close-btn")?.addEventListener("click", () => {
  closeIssuePreviewDrawer();
});
document.getElementById("preview-backdrop")?.addEventListener("click", () => {
  if (issuePreviewMode) closeIssuePreviewDrawer();
});
document.getElementById("issue-preview-goto-btn")?.addEventListener("click", () => {
  expandIssuePreviewToFull();
});
issueEditForm?.addEventListener("submit", saveIssueChanges);

toggleEditButton?.addEventListener("click", () => setIssueEditingMode(true));
cancelEditButton?.addEventListener("click", () => {
  cancelIssueEditing().catch((error) => {
    setStatus(error.message || "Не удалось отменить правки", "error");
  });
});
editDescriptionBtn?.addEventListener("click", () => {
  openDescriptionEditor();
});
toggleDescriptionBtn?.addEventListener("click", toggleDescriptionCollapse);
document.getElementById("description-editor-save-btn")?.addEventListener("click", () => {
  if (descriptionEditorContext === "create") {
    applyCreateDescriptionFromEditor();
    return;
  }
  saveIssueDescription().catch((error) => setStatus(error.message, "error"));
});
(function wrapDescriptionEditorClose() {
  const api = window.DescriptionEditor;
  if (!api || typeof api.close !== "function" || api.__closeWrapped) return;
  const original = api.close.bind(api);
  api.close = function () {
    original();
    descriptionEditorContext = "issue";
  };
  api.__closeWrapped = true;
})();
issueCommentForm?.addEventListener("submit", saveComment);
issueCommentForm?.addEventListener("comment-insert-image", () => commentAttachInput?.click());
commentAttachInput?.addEventListener("change", async (event) => {
  await addCommentImageFiles(event.target.files, { insertTokens: true });
  event.target.value = "";
});
bindDropZone(issueCommentForm, async (files) => {
  await addCommentImageFiles(files, { insertTokens: true });
  setStatus(`Добавлено к комментарию: ${files.length}`, "success");
}, { expandComment: true });

issueAttachPickBtn?.addEventListener("click", () => issueAttachInput?.click());
issueAttachInput?.addEventListener("change", async (event) => {
  await attachFilesToCurrentIssue(event.target.files);
  event.target.value = "";
});
bindDropZone(issueAttachmentsDrop, attachFilesToCurrentIssue);

commentAttachmentsList?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-comment-attach]");
  if (!btn) return;
  const index = Number(btn.dataset.removeCommentAttach);
  if (!Number.isFinite(index)) return;
  const removed = commentPendingAttachments.splice(index, 1)[0];
  if (removed && editNotes) {
    const token = `!${removed.filename}!`;
    editNotes.value = editNotes.value.split(token).join("").replace(/\n{3,}/g, "\n\n");
  }
  renderCommentAttachmentsList();
});

editNotes?.addEventListener("paste", async (event) => {
  const files = await extractClipboardImageFiles(event.clipboardData);
  if (!files.length) return;
  event.preventDefault();
  issueCommentForm?.classList.add("expanded");
  await addCommentImageFiles(files, { insertTokens: true });
  setStatus(`Вставлено изображений: ${files.length}`, "success");
});

createIssueButton?.addEventListener("click", () => {
  openCreateIssueModal().catch((error) => {
    setStatus(error.message || "Не удалось открыть форму создания.", "error");
  });
});
createIssueCancelButton?.addEventListener("click", () => {
  createIssueModal?.classList.add("hidden");
  resetCreateIssueFormDefaults();
});
createIssueForm?.addEventListener("submit", createIssueSubmit);
createProject?.addEventListener("change", () => updateCreateAssigneesForProject());
createTracker?.addEventListener("change", () => {
  refreshCreateCustomFields().catch((error) => {
    setStatus(error.message || "Не удалось загрузить поля формы.", "error");
  });
});
createIssueFullBtn?.addEventListener("click", () => {
  setCreateIssueFullMode(true).catch((error) => {
    setStatus(error.message || "Не удалось открыть полную форму.", "error");
  });
});
createIssueQuickBtn?.addEventListener("click", () => {
  setCreateIssueFullMode(false).catch((error) => {
    setStatus(error.message || "Не удалось вернуться к быстрой форме.", "error");
  });
});
createEditDescriptionBtn?.addEventListener("click", () => openCreateDescriptionEditor());
createAddWatcherBtn?.addEventListener("click", () => {
  openCreateWatcherPicker().catch((error) => setStatus(error.message, "error"));
});
createWatcherPickerSearch?.addEventListener("input", () => renderCreateWatcherPickerList());
createWatcherPickerList?.addEventListener("change", (event) => {
  const el = event.target?.closest?.('input[type="checkbox"][data-create-watcher-pick]');
  if (!el) return;
  const id = Number(el.getAttribute("data-create-watcher-pick"));
  toggleCreateWatcherSelection(id, el.checked);
});
createWatchersChips?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-create-watcher]");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-remove-create-watcher"));
  createSelectedWatchers.delete(id);
  renderCreateWatcherChips();
  const box = createWatcherPickerList?.querySelector(
    `input[type="checkbox"][data-create-watcher-pick="${id}"]`,
  );
  if (box) box.checked = false;
});
createParentQuery?.addEventListener("input", () => {
  clearTimeout(createParentSuggestTimer);
  const q = createParentQuery.value.trim();
  if (!q) {
    createParentSuggestList?.classList.add("hidden");
    return;
  }
  createParentSuggestTimer = setTimeout(async () => {
    try {
      const items = await searchCreateParentIssues(q);
      renderCreateParentSuggest(items);
    } catch (error) {
      setStatus(error.message || "Не удалось найти задачу", "error");
    }
  }, 200);
});
createParentSuggestList?.addEventListener("mousedown", (event) => {
  const btn = event.target.closest(".create-parent-suggest-item[data-idx]");
  if (!btn) return;
  event.preventDefault();
  const idx = Number(btn.getAttribute("data-idx"));
  const item = createParentSuggestItems[idx];
  if (item?.issue || item?.id) {
    setCreateParentSelection(item.issue || { id: item.id, subject: item.title });
  }
});
createParentSelected?.addEventListener("click", (event) => {
  if (event.target.id === "create-parent-clear") clearCreateParentSelection();
});
document.addEventListener("click", (event) => {
  if (
    createParentSuggestList &&
    !createParentSuggestList.classList.contains("hidden") &&
    !event.target.closest(".create-parent-suggest")
  ) {
    createParentSuggestList.classList.add("hidden");
  }
});
createIssueForm?.addEventListener("input", (event) => {
  const row = event.target?.closest?.(".field-row.invalid");
  if (row) row.classList.remove("invalid");
});
createIssueForm?.addEventListener("change", (event) => {
  const row = event.target?.closest?.(".field-row.invalid");
  if (row) row.classList.remove("invalid");
  if (event.target === createNoDeadlineCheckbox && createNoDeadlineCheckbox?.checked) {
    createDueDate?.closest(".field-row")?.classList.remove("invalid");
  }
});

createAttachButton?.addEventListener("click", () => createAttachInput?.click());
createAttachInput?.addEventListener("change", async (event) => {
  await addCreateAttachments(event.target.files);
  event.target.value = "";
});
createAttachmentsList?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-remove-attach]");
  if (!btn) return;
  const index = Number(btn.dataset.removeAttach);
  if (!Number.isFinite(index)) return;
  createPendingAttachments.splice(index, 1);
  renderCreateAttachmentsList();
});

createSubtaskButton?.addEventListener("click", () => {
  if (!currentIssue?.id) return;
  openCreateIssueModal({ parentIssue: currentIssue }).catch((error) => {
    setStatus(error.message || "Не удалось открыть форму создания.", "error");
  });
});

if (createDropZone) {
  const prevent = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  ["dragenter", "dragover"].forEach((name) => createDropZone.addEventListener(name, prevent));
  createDropZone.addEventListener("dragover", () => createDropZone.classList.add("drag-over"));
  createDropZone.addEventListener("dragleave", () => createDropZone.classList.remove("drag-over"));
  createDropZone.addEventListener("drop", async (event) => {
    prevent(event);
    createDropZone.classList.remove("drag-over");
    await addCreateAttachments(event.dataTransfer?.files);
  });
}

createIssueModal?.addEventListener("paste", async (event) => {
  if (createIssueModal.classList.contains("hidden")) return;
  const files = await extractClipboardImageFiles(event.clipboardData);
  if (!files.length) return;
  event.preventDefault();
  const named = [];
  for (const file of files) {
    named.push(
      file.name && file.name !== "image.png"
        ? file
        : new File([file], clipboardImageFilename(file), { type: file.type || "image/png" }),
    );
  }
  await addCreateAttachments(named);
  setStatus(`Вставлено изображений: ${files.length}`, "success");
});

copyIssueLinkButton?.addEventListener("click", async () => {
  if (!selectedIssueId || !currentSettings?.redmineUrl) return;
  const base = currentSettings.redmineUrl.replace(/\/$/, "");
  const link = `${base}/issues/${selectedIssueId}`;
  try {
    await navigator.clipboard.writeText(link);
    setStatus("Ссылка скопирована.", "success");
    showAppToast("Ссылка скопирована", "success");
  } catch {
    setStatus(link, "info");
    showAppToast("Не удалось скопировать ссылку", "error");
  }
});

openIssueBrowserButton?.addEventListener("click", async () => {
  if (!selectedIssueId || !currentSettings?.redmineUrl) return;
  const base = currentSettings.redmineUrl.replace(/\/$/, "");
  const link = `${base}/issues/${selectedIssueId}`;
  openIssueBrowserButton.disabled = true;
  const prevTitle = openIssueBrowserButton.title;
  openIssueBrowserButton.title = "Открываем…";
  try {
    await window.desktopApi.openExternalUrl(link);
    setStatus("Задача открыта в браузере.", "success");
  } catch (error) {
    setStatus(error.message || "Не удалось открыть ссылку", "error");
  } finally {
    openIssueBrowserButton.disabled = false;
    openIssueBrowserButton.title = prevTitle;
  }
});

issueFavoriteButton?.addEventListener("click", async () => {
  if (!selectedIssueId) return;
  const nowFavorite = toggleFavoriteIssue(selectedIssueId);
  updateIssueFavoriteButton(selectedIssueId);
  showAppToast(nowFavorite ? "Добавлено в избранное" : "Убрано из избранного", "success");
  if (getIssueScope() === "favorites") {
    await loadIssues(false);
  }
});

closeQuickOpenButton?.addEventListener("click", () => quickOpenModal?.classList.add("hidden"));
quickOpenButton?.addEventListener("click", async () => {
  const { issueId } = await window.desktopApi.resolveIssueId({ value: quickOpenInput.value });
  if (!issueId) {
    setStatus("Не удалось распознать номер задачи.", "error");
    return;
  }
  quickOpenModal.classList.add("hidden");
  await openIssueDetails(issueId);
});

quickIssueByIdGoBtn?.addEventListener("click", () => {
  submitQuickIssueById().catch((error) => {
    setQuickIssueByIdError(error.message || "Не удалось открыть задачу");
    setStatus(error.message || "Не удалось открыть задачу", "error");
  });
});
quickIssueByIdInput?.addEventListener("input", () => setQuickIssueByIdError(""));
quickIssueByIdInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitQuickIssueById().catch((error) => {
      setQuickIssueByIdError(error.message || "Не удалось открыть задачу");
    });
  }
});

document.getElementById("search-back-btn")?.addEventListener("click", () => {
  goToIssuesList();
});

document.getElementById("deep-search-btn")?.addEventListener("click", () => {
  runDeepSearch().catch(() => {});
});

document.getElementById("deep-search-input")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    runDeepSearch().catch(() => {});
  }
});

document.getElementById("deep-search-results")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-deep-issue]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-deep-issue"));
  if (!issueId) return;
  openIssueDetails(issueId).catch((error) => {
    setStatus(error.message || "Не удалось открыть задачу", "error");
  });
});

document.getElementById("search-prefetch-btn")?.addEventListener("click", async () => {
  const btn = document.getElementById("search-prefetch-btn");
  if (!btn) return;
  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Загружаем…";
  try {
    const result = await window.desktopApi.prefetchProjectDetails();
    showAppToast(`Подгружено деталей: ${result?.done || 0}`, "success");
    await refreshCacheEstimateLabel();
  } catch (error) {
    setStatus(error.message || "Не удалось подгрузить детали", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

document.getElementById("search-rebuild-fts-btn")?.addEventListener("click", async () => {
  try {
    const result = await window.desktopApi.rebuildSearchIndex();
    showAppToast(`Индекс поиска: ${result?.count ?? 0} задач`, "success");
  } catch (error) {
    setStatus(error.message || "Не удалось обновить индекс", "error");
  }
});

document.getElementById("search-cache-maintenance-btn")?.addEventListener("click", async () => {
  try {
    const result = await window.desktopApi.runCacheMaintenance();
    showAppToast(
      `Удалено задач: ${result?.deletedIssues || 0}, вложений: ${result?.evictedAttachments || 0}`,
      "success",
    );
    await refreshCacheEstimateLabel();
  } catch (error) {
    setStatus(error.message || "Очистка не удалась", "error");
  }
});

document.addEventListener("click", (event) => {
  const navBtn = event.target.closest("[data-global-nav]");
  if (navBtn) {
    handleGlobalNavAction(navBtn.getAttribute("data-global-nav"), navBtn, event).catch((error) => {
      setStatus(error.message || "Не удалось выполнить действие", "error");
    });
  }
});

syncNowButton?.addEventListener("click", () => {
  if (fullSyncInProgress) {
    showSyncProgressOverlay({ kind: syncOperationKind });
    return;
  }
  runManualSync().catch(() => {});
});

document.getElementById("sync-compact")?.addEventListener("click", (event) => {
  if (event.target.closest("#sync-now-btn") && !fullSyncInProgress) return;
  if (fullSyncInProgress) showSyncProgressOverlay({ kind: syncOperationKind });
});

editSyncedProjectsButton?.addEventListener("click", () => {
  openEditSyncProjectsModal().catch((error) => {
    setStatus(`Не удалось открыть список проектов: ${error.message}`, "error");
  });
});

editSyncProjectsCancelBtn?.addEventListener("click", () => closeEditSyncProjectsModal());
editSyncProjectsModal?.addEventListener("mousedown", (event) => {
  if (event.target === editSyncProjectsModal) closeEditSyncProjectsModal();
});
editSyncSelectAllBtn?.addEventListener("click", () => {
  editSyncProjectsList?.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = true;
  });
  updateEditSyncSelectedCount();
  renderProjectStatusModelProjectSelect(getModalProjectRows().filter((p) => p.enabled));
  renderProjectStatusModelStatusList();
});
editSyncClearAllBtn?.addEventListener("click", () => {
  editSyncProjectsList?.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  updateEditSyncSelectedCount();
  renderProjectStatusModelProjectSelect(getModalProjectRows().filter((p) => p.enabled));
  renderProjectStatusModelStatusList();
});
editSyncProjectsList?.addEventListener("change", () => {
  updateEditSyncSelectedCount();
  renderProjectStatusModelProjectSelect(getModalProjectRows().filter((p) => p.enabled));
  renderProjectStatusModelStatusList();
});
editSyncProjectsSaveBtn?.addEventListener("click", () => {
  saveEditSyncProjects().catch((error) => {
    setStatus(`Не удалось сохранить проекты: ${error.message}`, "error");
  });
});

projectStatusModelProject?.addEventListener("change", () => {
  clearProjectStatusModelValidation();
  renderProjectStatusModelStatusList();
});

projectStatusModelList?.addEventListener("change", (event) => {
  if (!event.target.matches?.('input[type="checkbox"]')) return;
  persistProjectStatusModelFromList();
  if (String(projectSelect?.value || "") === String(projectStatusModelProject.value || "")) {
    refreshCurrentProjectStatusOptions().then(() => {
      renderStatusFilterList();
      setSelectedStatusIds(selectedStatusIds, { syncScope: true });
    });
  }
});

projectStatusModelDefaultBtn?.addEventListener("click", () => {
  const projectId = Number(projectStatusModelProject?.value);
  if (!Number.isFinite(projectId) || projectId <= 0) {
    projectStatusModelSettings?.classList.add("invalid");
    return;
  }
  clearProjectStatusModelValidation();
  window.ProjectStatusSettings?.resetProjectStatusConfig(projectId);
  renderProjectStatusModelStatusList();
  if (String(projectSelect?.value || "") === String(projectId)) {
    refreshCurrentProjectStatusOptions().then(() => {
      renderStatusFilterList();
      setSelectedStatusIds(selectedStatusIds, { syncScope: true });
    });
  }
});

projectStatusModelAllBtn?.addEventListener("click", () => {
  const projectId = Number(projectStatusModelProject?.value);
  if (!Number.isFinite(projectId) || projectId <= 0) {
    projectStatusModelSettings?.classList.add("invalid");
    return;
  }
  clearProjectStatusModelValidation();
  const allIds = getReferenceStatuses().map((status) => Number(status.id)).filter(Boolean);
  window.ProjectStatusSettings?.saveProjectStatusConfig(projectId, allIds);
  renderProjectStatusModelStatusList();
  if (String(projectSelect?.value || "") === String(projectId)) {
    refreshCurrentProjectStatusOptions().then(() => {
      renderStatusFilterList();
      setSelectedStatusIds(selectedStatusIds, { syncScope: true });
    });
  }
});

resyncAllButton?.addEventListener("click", async () => {
  if (fullSyncInProgress) {
    showSyncProgressOverlay({ kind: syncOperationKind, title: "Полная пересинхронизация" });
    return;
  }

  const confirmed = await confirmAction(
    "Запустить полную пересинхронизацию выбранных проектов?",
    {
      detail:
        "Операция может занять много времени: заново загружаются задачи и история по всем активным проектам.\n\n" +
        "Не закрывайте приложение во время синхронизации.\n" +
        "Если прервать процесс, кэш останется неполным — часть проектов обновится, часть нет.",
      type: "warning",
    },
  );
  if (!confirmed) return;

  const projects = await window.desktopApi.getSyncProjects();
  const projectIds = projects.filter((p) => p.enabled).map((p) => p.project_id);
  if (!projectIds.length) {
    setStatus("Нет активных проектов для синхронизации.", "error");
    return;
  }

  fullSyncInProgress = true;
  if (resyncAllButton) resyncAllButton.disabled = true;
  if (editSyncedProjectsButton) editSyncedProjectsButton.disabled = true;
  showSyncProgressOverlay({
    kind: "sync",
    title: "Полная пересинхронизация",
    phase: "reference",
    overallTotal: projectIds.length,
  });

  try {
    const result = await window.desktopApi.startFullSync({
      redmineUrl: currentSettings.redmineUrl,
      apiKey: currentSettings.apiKey,
      projectIds,
      cacheMode: currentSettings.cacheMode || "issues-history",
    });

    if (result?.cancelled) {
      setStatus(
        "Синхронизация прервана. Кэш может быть неполным — при необходимости запустите снова.",
        "error",
      );
    } else {
      updateSyncProgressOverlay({
        running: false,
        phase: "idle",
        percent: 100,
        projectName: "",
        projectDone: 0,
        projectTotal: 0,
        overallDone: projectIds.length,
        overallTotal: projectIds.length,
      });
      setStatus("Полная пересинхронизация завершена.", "success");
    }
    await refreshCacheStats();
    await refreshReferenceData();
    await loadIssues(true);
    await refreshDeadlineAlerts();
  } catch (error) {
    setStatus(`Пересинхронизация не удалась: ${error.message}`, "error");
  } finally {
    fullSyncInProgress = false;
    if (resyncAllButton) resyncAllButton.disabled = false;
    if (editSyncedProjectsButton) editSyncedProjectsButton.disabled = false;
    hideSyncProgressOverlay();
    const syncStatus = await window.desktopApi.getSyncStatus();
    const network = await window.desktopApi.getNetworkStatus();
    updateSyncStatusBar(syncStatus, network);
  }
});

syncMinimizeBtn?.addEventListener("click", () => {
  minimizeSyncProgressOverlay();
});

syncCancelBtn?.addEventListener("click", () => {
  cancelFullSyncFromOverlay().catch(() => {});
});

clearCacheButton?.addEventListener("click", async () => {
  if (!(await confirmAction("Очистить локальный кэш?", {
    detail: "Данные придётся загрузить заново.",
    type: "warning",
  }))) return;
  await window.desktopApi.clearCache();
  await refreshCacheStats();
  await loadIssues(false);
});

settingsAutosyncToggle?.addEventListener("change", async () => {
  currentSettings.autosyncEnabled = settingsAutosyncToggle.checked;
  await window.desktopApi.saveSettings(currentSettings);
});

autosyncInterval?.addEventListener("change", async () => {
  currentSettings.autosyncIntervalMinutes = Number(autosyncInterval.value);
  await window.desktopApi.saveSettings(currentSettings);
});

deadlineAlertDaysSelect?.addEventListener("change", async () => {
  currentSettings.deadlineAlertDays = Number(deadlineAlertDaysSelect.value);
  await window.desktopApi.saveSettings(currentSettings);
  await refreshDeadlineAlerts();
  renderIssuesList();
});

settingsAutobackupToggle?.addEventListener("change", async () => {
  currentSettings.autoBackupEnabled = settingsAutobackupToggle.checked;
  try {
    await window.desktopApi.saveSettings(currentSettings);
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить настройку автокопий", "error");
  }
});

async function saveCacheCloudSettingsFromUi() {
  if (!currentSettings) return;
  if (cacheMaxSizeMbSelect) currentSettings.cacheMaxSizeMb = Number(cacheMaxSizeMbSelect.value);
  if (cacheRetentionDaysSelect) {
    currentSettings.cacheRetentionDays = Number(cacheRetentionDaysSelect.value);
  }
  if (settingsCacheAttachments) {
    currentSettings.cacheAttachmentsEnabled = settingsCacheAttachments.checked;
  }
  if (settingsSearchDeep) currentSettings.searchDeepEnabled = settingsSearchDeep.checked;
  await window.desktopApi.saveSettings(currentSettings);
}

[
  cacheMaxSizeMbSelect,
  cacheRetentionDaysSelect,
  settingsCacheAttachments,
  settingsSearchDeep,
].forEach((el) => {
  el?.addEventListener("change", () => {
    saveCacheCloudSettingsFromUi().catch((error) => {
      setStatus(error.message || "Не удалось сохранить настройки кэша", "error");
    });
  });
});

prefetchCacheBtn?.addEventListener("click", async () => {
  prefetchCacheBtn.disabled = true;
  const prev = prefetchCacheBtn.textContent;
  prefetchCacheBtn.textContent = "Загружаем…";
  try {
    const result = await window.desktopApi.prefetchProjectDetails();
    showAppToast(`Подгружено деталей: ${result?.done || 0}`, "success");
    await refreshCacheStats();
  } catch (error) {
    setStatus(error.message || "Не удалось подгрузить детали", "error");
  } finally {
    prefetchCacheBtn.disabled = false;
    prefetchCacheBtn.textContent = prev;
  }
});

rebuildFtsBtn?.addEventListener("click", async () => {
  rebuildFtsBtn.disabled = true;
  try {
    const result = await window.desktopApi.rebuildSearchIndex();
    showAppToast(`Индекс поиска: ${result?.count ?? 0} задач`, "success");
  } catch (error) {
    setStatus(error.message || "Не удалось обновить индекс", "error");
  } finally {
    rebuildFtsBtn.disabled = false;
  }
});

cacheMaintenanceBtn?.addEventListener("click", async () => {
  cacheMaintenanceBtn.disabled = true;
  try {
    const result = await window.desktopApi.runCacheMaintenance();
    showAppToast(
      `Удалено задач: ${result?.deletedIssues || 0}, вложений: ${result?.evictedAttachments || 0}`,
      "success",
    );
    await refreshCacheStats();
    await loadIssues(false, { quiet: true });
  } catch (error) {
    setStatus(error.message || "Очистка не удалась", "error");
  } finally {
    cacheMaintenanceBtn.disabled = false;
  }
});

function cleanIpcErrorMessage(error) {
  let msg = String(error?.message || error || "").trim();
  msg = msg.replace(/^Error invoking remote method '[^']+':\s*/i, "");
  msg = msg.replace(/^Error:\s*/i, "");
  return msg.trim();
}

function notifyFileSaved(filePath) {
  const path = String(filePath || "").trim();
  if (!path) {
    setStatus("Файл сохранён.", "success");
    return;
  }
  const shortName = path.split(/[/\\]/).pop() || path;
  setStatus(`Файл сохранён: ${shortName}`, "success");
  showAppToast(`Файл сохранён: ${shortName}`, "success", {
    actionLabel: "Показать в папке",
    durationMs: 15000,
    onAction: async () => {
      try {
        const result = await window.desktopApi.showItemInFolder({ path });
        if (!result?.ok) {
          setStatus(result?.message || "Не удалось открыть папку", "error");
        }
      } catch (error) {
        setStatus(cleanIpcErrorMessage(error) || "Не удалось открыть папку", "error");
      }
    },
  });
}

chooseBackupFolderBtn?.addEventListener("click", async () => {
  chooseBackupFolderBtn.disabled = true;
  const prevLabel = chooseBackupFolderBtn.textContent;
  chooseBackupFolderBtn.textContent = "Выбор…";
  try {
    const result = await window.desktopApi.chooseBackupFolder();
    if (result?.ok && result.backupFolder) {
      currentSettings.backupFolder = result.backupFolder;
      if (backupFolderPathInput) backupFolderPathInput.value = result.backupFolder;
      showAppToast("Папка резервных копий сохранена", "success");
    }
  } catch (error) {
    setStatus(error.message || "Не удалось выбрать папку", "error");
  } finally {
    chooseBackupFolderBtn.disabled = false;
    chooseBackupFolderBtn.textContent = prevLabel;
  }
});

backupNowBtn?.addEventListener("click", async () => {
  backupNowBtn.disabled = true;
  const prevLabel = backupNowBtn.textContent;
  backupNowBtn.textContent = "Сохраняем…";
  try {
    const result = await window.desktopApi.backupNow();
    if (result?.ok) {
      showAppToast("Резервная копия сохранена", "success");
      setStatus(result.path ? `Копия: ${result.path}` : "Резервная копия сохранена", "success");
    } else {
      setStatus("Не удалось сохранить копию", "error");
    }
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить копию", "error");
    showAppToast(error.message || "Ошибка резервной копии", "error");
  } finally {
    backupNowBtn.disabled = false;
    backupNowBtn.textContent = prevLabel;
  }
});

idleThresholdSelect?.addEventListener("change", async () => {
  currentSettings.idleThresholdMinutes = Number(idleThresholdSelect.value);
  if (!Number.isFinite(currentSettings.idleThresholdMinutes)) {
    currentSettings.idleThresholdMinutes = 5;
  }
  try {
    await window.desktopApi.saveSettings(currentSettings);
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить порог простоя", "error");
  }
});

async function persistTrackerUiSettings() {
  applyTrackerSettingsFromCurrent();
  try {
    await window.desktopApi.saveSettings(currentSettings);
    if (!document.getElementById("tracker-view")?.classList.contains("hidden")) {
      await refreshTrackerSessionsTable();
    }
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить настройки трекера", "error");
  }
}

const TRACKER_MODE_NOTES = {
  timer:
    "В режиме «Таймер» в таблице появляются кнопки ▶ и ■. Пока таймер запущен и вы не трогаете мышь/клавиатуру дольше порога — спросим, что делать с простоем.",
  range:
    "В режиме «Начало и окончание» видны поля времени (зелёная полоска — начало, красная — окончание) и часы. Таймер и подсказки о простое отключены.",
  hours:
    "В режиме «Только часы» в колонке времени остаётся одно поле трудозатрат. Без интервалов, без ▶/■ и без простоя.",
};

async function stopRunningTimersForModeChange() {
  hideTrackerIdlePrompt();
  if (!window.desktopApi?.trackerStopAllRunning) return 0;
  try {
    const result = await window.desktopApi.trackerStopAllRunning();
    return Number(result?.stoppedCount) || 0;
  } catch (error) {
    console.error("trackerStopAllRunning failed:", error.message);
    return 0;
  }
}

function syncTrackerModeCardsUi() {
  const mode = trackerEntryMode === "range" || trackerEntryMode === "hours" ? trackerEntryMode : "timer";
  if (trackerEntryModeSelect) trackerEntryModeSelect.value = mode;
  document.querySelectorAll("[data-tracker-mode]").forEach((card) => {
    const active = card.getAttribute("data-tracker-mode") === mode;
    card.classList.toggle("active", active);
    card.setAttribute("aria-checked", active ? "true" : "false");
  });

  const display = trackerTimeInputMode === "plain" ? "plain" : "ticker";
  if (trackerTimeInputModeSelect) trackerTimeInputModeSelect.value = display;
  document.querySelectorAll("[data-tracker-display]").forEach((card) => {
    const active = card.getAttribute("data-tracker-display") === display;
    card.classList.toggle("active", active);
    card.setAttribute("aria-checked", active ? "true" : "false");
  });

  const note = document.getElementById("tracker-mode-note");
  if (note) note.textContent = TRACKER_MODE_NOTES[mode] || TRACKER_MODE_NOTES.timer;

  if (trackerTimeInputModeRow) {
    trackerTimeInputModeRow.classList.toggle("hidden", mode !== "timer");
  }
  const idleBlock = document.getElementById("tracker-idle-settings-block");
  if (idleBlock) idleBlock.classList.toggle("hidden", mode !== "timer");

  const newTimerBtn = document.getElementById("tracker-new-timer-btn");
  if (newTimerBtn) {
    newTimerBtn.classList.toggle("hidden", mode !== "timer");
  }
}

async function setTrackerEntryModeFromUi(nextMode) {
  const mode = nextMode === "range" || nextMode === "hours" ? nextMode : "timer";
  const prev = trackerEntryMode;
  if (mode === prev) {
    syncTrackerModeCardsUi();
    return;
  }

  const stopped = await stopRunningTimersForModeChange();
  currentSettings.trackerEntryMode = mode;
  await persistTrackerUiSettings();
  syncTrackerModeCardsUi();

  if (stopped > 0) {
    const msg =
      stopped === 1
        ? "Запущенный таймер остановлен — режим сменён без «простоя»."
        : `Остановлено таймеров: ${stopped}. Режим сменён без «простоя».`;
    showAppToast(msg, "info");
    setStatus(msg, "success");
  }
}

async function setTrackerDisplayModeFromUi(nextDisplay) {
  const display = nextDisplay === "plain" ? "plain" : "ticker";
  currentSettings.trackerTimeInputMode = display;
  await persistTrackerUiSettings();
  syncTrackerModeCardsUi();
}

document.querySelector(".tracker-mode-cards")?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-tracker-mode]");
  if (!card) return;
  setTrackerEntryModeFromUi(card.getAttribute("data-tracker-mode")).catch((error) => {
    setStatus(error.message || "Не удалось сменить режим трекера", "error");
  });
});

document.querySelector(".tracker-display-cards")?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-tracker-display]");
  if (!card) return;
  setTrackerDisplayModeFromUi(card.getAttribute("data-tracker-display")).catch((error) => {
    setStatus(error.message || "Не удалось сохранить отображение таймера", "error");
  });
});

settingsTrackerMinFloor?.addEventListener("change", async () => {
  currentSettings.trackerMinFloorEnabled = settingsTrackerMinFloor.checked;
  await persistTrackerUiSettings();
});

settingsTrackerShowCustomer?.addEventListener("change", async () => {
  currentSettings.trackerShowCustomerName = settingsTrackerShowCustomer.checked;
  await persistTrackerUiSettings();
});

settingsTrackerShowAi?.addEventListener("change", async () => {
  currentSettings.trackerShowAiFields = settingsTrackerShowAi.checked;
  await persistTrackerUiSettings();
});

settingsProjectsHierarchy?.addEventListener("change", async () => {
  if (!currentSettings) return;
  currentSettings.projectsShowHierarchy = Boolean(settingsProjectsHierarchy.checked);
  try {
    await window.desktopApi.saveSettings(currentSettings);
    await applyReferenceDataToFilters();
    setStatus(
      currentSettings.projectsShowHierarchy
        ? "Иерархия проектов включена."
        : "Иерархия проектов выключена.",
      "success",
    );
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить настройку иерархии.", "error");
  }
});

teFormOrderList?.addEventListener("click", async (event) => {
  const up = event.target.closest?.("[data-te-order-up]");
  const down = event.target.closest?.("[data-te-order-down]");
  const key = up?.getAttribute("data-te-order-up") || down?.getAttribute("data-te-order-down");
  if (!key || !window.TimeEntryFormOrder) return;
  const next = window.TimeEntryFormOrder.moveKey(getTimeEntryFormFieldOrder(), key, up ? -1 : 1);
  try {
    await persistTimeEntryFormFieldOrder(next);
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить порядок полей.", "error");
  }
});

teFormOrderRedmineBtn?.addEventListener("click", async () => {
  try {
    const order = window.TimeEntryFormOrder?.getRedmineDefaultOrder?.() || [];
    await persistTimeEntryFormFieldOrder(order);
    setStatus("Порядок полей как в Redmine.", "success");
  } catch (error) {
    setStatus(error.message || "Не удалось сбросить порядок полей.", "error");
  }
});

function syncTrackerModeChrome() {
  syncTrackerModeCardsUi();
}

/** --- Time report (local-only, current user) --- */
let reportEntriesCache = [];
let reportGroupMode = "project";
let reportActivePreset = "week";

function isoDateFromLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getReportPeriodRange(preset) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (preset === "day") {
    const iso = isoDateFromLocalDate(today);
    return { from: iso, to: iso };
  }
  if (preset === "month") {
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { from: isoDateFromLocalDate(from), to: isoDateFromLocalDate(to) };
  }
  if (preset === "quarter") {
    const q = Math.floor(today.getMonth() / 3);
    const from = new Date(today.getFullYear(), q * 3, 1);
    const to = new Date(today.getFullYear(), q * 3 + 3, 0);
    return { from: isoDateFromLocalDate(from), to: isoDateFromLocalDate(to) };
  }
  // ISO week Mon–Sun
  const day = today.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const from = new Date(today);
  from.setDate(today.getDate() + diffToMon);
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  return { from: isoDateFromLocalDate(from), to: isoDateFromLocalDate(to) };
}

function eachDateInclusive(fromIso, toIso) {
  const out = [];
  const [fy, fm, fd] = String(fromIso).split("-").map(Number);
  const [ty, tm, td] = String(toIso).split("-").map(Number);
  const cur = new Date(fy, fm - 1, fd);
  const end = new Date(ty, tm - 1, td);
  while (cur <= end) {
    out.push(isoDateFromLocalDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function formatReportHours(n) {
  return (Math.round(Number(n || 0) * 10) / 10).toFixed(1);
}

function showReportView() {
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  document.getElementById("report-view")?.classList.remove("hidden");
  setTopbarMode("is-report-mode");
}

function showTrackerView() {
  closeConnectionSettings();
  document.getElementById("connection-card")?.classList.add("hidden");
  document.querySelector(".page")?.classList.remove("settings-mode");
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  hideSecondaryViews();
  document.getElementById("tracker-view")?.classList.remove("hidden");
  setTopbarMode("is-tracker-mode");
  refreshTrackerSessionsTable().catch((error) => {
    setStatus(error.message || "Не удалось загрузить сессии трекера", "error");
  });
}

/** --- Tracker page (visual flow) --- */
let trackerProjectSuggestTimer = null;
let trackerIssueSuggestTimer = null;
let trackerSelectedProject = null;
let trackerSelectedIssue = null;
let trackerPeriodMode = "today";
let trackerCustomFrom = "";
let trackerCustomTo = "";
let trackerSessionsCache = [];
let trackerShowCustomerName = false;
let trackerTimeInputMode = "ticker";
let trackerEntryMode = "timer";
let trackerMinFloorEnabled = true;
let trackerShowAiFields = false;
let trackerTickTimer = null;
let trackerCameFromAgile = false;
let trackerIssuePickerState = {
  entryId: null,
  issues: [],
  selectedId: null,
  searchTimer: null,
  favoritesOnly: false,
};
let trackerContextEntryId = null;

function closeTrackerRowContextMenu() {
  document.getElementById("tracker-row-context-menu")?.classList.add("hidden");
  trackerContextEntryId = null;
}

function openTrackerRowContextMenu(entryId, clientX, clientY) {
  const row = (trackerSessionsCache || []).find((r) => Number(r.id) === Number(entryId));
  if (!row || !trackerRowIsEditable(row) || Number(row.is_running)) return;
  const menu = document.getElementById("tracker-row-context-menu");
  if (!menu) return;
  trackerContextEntryId = Number(entryId);
  menu.classList.remove("hidden");
  const pad = 8;
  const width = menu.offsetWidth || 180;
  const height = menu.offsetHeight || 44;
  const left = Math.min(clientX, window.innerWidth - width - pad);
  const top = Math.min(clientY, window.innerHeight - height - pad);
  menu.style.left = `${Math.max(pad, left)}px`;
  menu.style.top = `${Math.max(pad, top)}px`;
}

function applyTrackerSettingsFromCurrent() {
  const mode = currentSettings?.trackerEntryMode;
  trackerEntryMode = mode === "range" || mode === "hours" ? mode : "timer";
  trackerTimeInputMode = currentSettings?.trackerTimeInputMode === "plain" ? "plain" : "ticker";
  trackerMinFloorEnabled = currentSettings?.trackerMinFloorEnabled !== false;
  trackerShowCustomerName = Boolean(currentSettings?.trackerShowCustomerName);
  trackerShowAiFields = Boolean(currentSettings?.trackerShowAiFields);
  syncTrackerModeChrome();
}

let trackerIdlePromptPayload = null;

function hideTrackerIdlePrompt() {
  document.getElementById("tracker-idle-prompt")?.classList.add("hidden");
  trackerIdlePromptPayload = null;
}

function showTrackerIdlePrompt(payload = {}) {
  if (trackerEntryMode !== "timer") {
    hideTrackerIdlePrompt();
    return;
  }
  const host = document.getElementById("tracker-idle-prompt");
  const titleEl = document.getElementById("tracker-idle-prompt-title");
  const metaEl = document.getElementById("tracker-idle-prompt-meta");
  if (!host) return;
  const idleSeconds = Number(payload.idleSeconds) || 0;
  const minutes = Math.max(1, Math.round(idleSeconds / 60));
  const timers = Array.isArray(payload.timers) ? payload.timers : [];
  trackerIdlePromptPayload = {
    idleSeconds,
    entryIds: timers.map((t) => t.entryId).filter((id) => id != null),
  };
  if (titleEl) {
    titleEl.textContent =
      idleSeconds < 60
        ? `Похоже, вы отходили ${idleSeconds} сек.`
        : `Похоже, вы отходили ${minutes} мин.`;
  }
  if (metaEl) {
    if (!timers.length) {
      metaEl.textContent = "Активный таймер";
    } else if (timers.length === 1) {
      metaEl.textContent = `Таймер: ${timers[0].label || "без задачи"}`;
    } else {
      metaEl.textContent = `Таймеры (${timers.length}): ${timers.map((t) => t.label).join(" · ")}`;
    }
  }
  host.classList.remove("hidden");
}

async function handleTrackerIdleAction(action) {
  const payload = trackerIdlePromptPayload;
  if (!payload) {
    hideTrackerIdlePrompt();
    return;
  }
  hideTrackerIdlePrompt();
  if (action === "keep") {
    showAppToast("Простой оставлен в таймере", "info");
    return;
  }
  try {
    const result = await window.desktopApi.trackerResolveIdle({
      action,
      idleSeconds: payload.idleSeconds,
      entryIds: payload.entryIds,
    });
    if (!result?.ok) {
      setStatus(result?.reason || "Не удалось обработать простой", "error");
      return;
    }
    const messages = {
      discard: "Простой убран из таймера",
      discard_continue: "Простой убран, таймер продолжен новой строкой",
      split_idle: "Простой сохранён отдельной записью",
    };
    showAppToast(messages[action] || "Готово", "success");
    if (!document.getElementById("tracker-view")?.classList.contains("hidden")) {
      await refreshTrackerSessionsTable();
    }
  } catch (error) {
    setStatus(error.message || "Не удалось обработать простой", "error");
  }
}

document.getElementById("tracker-idle-prompt")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-idle-action]");
  if (!btn) return;
  handleTrackerIdleAction(btn.getAttribute("data-idle-action")).catch((error) => {
    setStatus(error.message || "Не удалось обработать простой", "error");
  });
});

function trackerTodayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function trackerNowTimeValue() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function projectAcronym(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toLowerCase();
}

function matchProjectQuery(project, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  const name = String(project?.name || project?.project_name || "").toLowerCase();
  if (name.includes(q)) return true;
  return projectAcronym(name).startsWith(q) || projectAcronym(name).includes(q);
}

function clearTrackerQuickValidation() {
  /* legacy no-op: quick form removed in bugfix #3 */
}

function trackerRowIsEditable(row) {
  return (
    Number(row.is_running) === 1 ||
    row.sync_status === "draft" ||
    row.sync_status === "error"
  );
}

function trackerHmFromIso(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function trackerIsoFromDateHm(dateIso, hm) {
  if (!dateIso || !hm) return null;
  const d = new Date(`${dateIso}T${hm}:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function getTimeEntryActivities() {
  const list = referenceData?.activities || referenceData?.time_entry_activities || [];
  return Array.isArray(list) ? list : [];
}

async function mergeReferenceDataFromCache() {
  try {
    const cached = await window.desktopApi.getCachedReferenceData();
    if (cached && typeof cached === "object") {
      referenceData = normalizeReferencePayload({ ...(referenceData || {}), ...cached });
    }
  } catch (error) {
    throw new Error(error?.message || "Не удалось загрузить виды деятельности");
  }
}

/** Ensure activity types exist in local cache before tracker draft IPC. */
async function ensureTimeEntryActivitiesReady() {
  if ((getTimeEntryActivities() || []).length) {
    const cached = await window.desktopApi.getCachedReferenceData();
    if ((cached?.activities || []).length) return true;
  }

  await mergeReferenceDataFromCache();
  if ((getTimeEntryActivities() || []).length) return true;

  const payload = getFormValues();
  if (!payload.redmineUrl || !payload.apiKey) {
    throw new Error(
      "Справочник видов деятельности не загружен. Откройте настройки и нажмите «Обновить справочники».",
    );
  }

  try {
    const loaded = await window.desktopApi.ensureReferenceData(payload);
    referenceData = normalizeReferencePayload(loaded);
  } catch (error) {
    throw new Error(error?.message || "Не удалось загрузить виды деятельности");
  }

  if (!(getTimeEntryActivities() || []).length) {
    throw new Error(
      "Не удалось загрузить виды деятельности. Проверьте подключение к Redmine и обновите справочники в настройках.",
    );
  }
  return true;
}

function trackerActivityOptionsHtml(selectedId, selectedName) {
  const activities = getTimeEntryActivities().slice();
  const sel =
    selectedId != null && String(selectedId).trim() !== ""
      ? String(selectedId)
      : String(getDefaultActivityId() || "");
  if (sel && !activities.some((a) => String(a.id) === sel)) {
    const label = String(selectedName || "").trim() || `Деятельность #${sel}`;
    activities.unshift({ id: sel, name: label });
  }
  if (!activities.length) return `<option value="">—</option>`;
  return activities
    .map((a) => {
      const id = String(a.id);
      return `<option value="${escapeHtml(id)}" ${id === sel ? "selected" : ""}>${escapeHtml(a.name || id)}</option>`;
    })
    .join("");
}

function hideTrackerSuggest(which) {
  document.querySelectorAll(`.tracker-cell-suggest[data-suggest="${which}"]`).forEach((el) => {
    el.classList.add("hidden");
    el._trackerSuggest = null;
    clearTrackerSuggestFixedPosition(el);
  });
}

function hideAllTrackerRowSuggests() {
  document.querySelectorAll(".tracker-cell-suggest").forEach((el) => {
    el.classList.add("hidden");
    el._trackerSuggest = null;
    clearTrackerSuggestFixedPosition(el);
  });
}

function clearTrackerSuggestFixedPosition(host) {
  if (!host) return;
  host.classList.remove("is-fixed-layer");
  host.style.left = "";
  host.style.top = "";
  host.style.width = "";
  host.style.minWidth = "";
}

function positionTrackerSuggestList(host) {
  if (!host || host.classList.contains("hidden")) return;
  const field = host.closest(".tracker-suggest, .tracker-issue-field");
  const input =
    field?.querySelector("input.tracker-cell-project, input.tracker-cell-issue") ||
    field?.querySelector("input[type='text']");
  if (!input) return;
  const rect = input.getBoundingClientRect();
  const width = Math.max(rect.width, 280);
  let left = rect.left;
  let top = rect.bottom + 2;
  const maxLeft = window.innerWidth - width - 8;
  if (left > maxLeft) left = Math.max(8, maxLeft);
  if (top + 160 > window.innerHeight) {
    top = Math.max(8, rect.top - 2 - Math.min(220, host.scrollHeight || 160));
  }
  host.classList.add("is-fixed-layer");
  host.style.left = `${Math.round(left)}px`;
  host.style.top = `${Math.round(top)}px`;
  host.style.width = `${Math.round(width)}px`;
  host.style.minWidth = `${Math.round(width)}px`;
}

function getTrackerSuggestHostForInput(input) {
  if (!(input instanceof HTMLInputElement)) return null;
  const which = input.classList.contains("tracker-cell-project")
    ? "project"
    : input.classList.contains("tracker-cell-issue")
      ? "issue"
      : null;
  if (!which) return null;
  const host = input.closest("tr")?.querySelector(`.tracker-cell-suggest[data-suggest="${which}"]`);
  if (!host || host.classList.contains("hidden")) return null;
  return host;
}

function setTrackerSuggestActive(host, idx) {
  const state = host?._trackerSuggest;
  if (!state?.items?.length) return;
  const next = Math.max(0, Math.min(state.items.length - 1, idx));
  state.activeIdx = next;
  host.querySelectorAll(".tracker-suggest-item[data-id]").forEach((btn) => {
    const itemIdx = Number(btn.getAttribute("data-idx"));
    btn.classList.toggle("is-active", itemIdx === next);
  });
  host.querySelector(`.tracker-suggest-item[data-idx="${next}"]`)?.scrollIntoView({ block: "nearest" });
}

function moveTrackerSuggestSelection(host, delta) {
  const state = host?._trackerSuggest;
  if (!state?.items?.length) return false;
  const base = state.activeIdx < 0 ? (delta > 0 ? -1 : state.items.length) : state.activeIdx;
  setTrackerSuggestActive(host, base + delta);
  return true;
}

function pickTrackerSuggestItem(host) {
  const state = host?._trackerSuggest;
  if (!state?.items?.length) return false;
  if (state.activeIdx < 0) setTrackerSuggestActive(host, 0);
  const item = state.items[state.activeIdx];
  if (!item) return false;
  state.onPick?.(item);
  host.classList.add("hidden");
  clearTrackerSuggestFixedPosition(host);
  host._trackerSuggest = null;
  return true;
}

function renderTrackerCellSuggest(host, items, onPick) {
  if (!host) return;
  if (!items.length) {
    host._trackerSuggest = null;
    host.innerHTML = `<div class="tracker-suggest-item muted">Ничего не найдено</div>`;
    host.classList.remove("hidden");
    positionTrackerSuggestList(host);
    return;
  }
  host.innerHTML = items
    .map((item, index) => {
      const id = Number(item.id);
      const title = escapeHtml(item.title || item.name || "");
      const sub = escapeHtml(item.subtitle || "");
      return `<button type="button" class="tracker-suggest-item" data-idx="${index}" data-id="${id}">
        <div>${title}</div>
        ${sub ? `<div class="muted">${sub}</div>` : ""}
      </button>`;
    })
    .join("");
  host._trackerSuggest = { items, onPick, activeIdx: -1 };
  host.classList.remove("hidden");
  positionTrackerSuggestList(host);
  host.querySelectorAll(".tracker-suggest-item[data-id]").forEach((btn) => {
    btn.addEventListener("mousedown", (event) => {
      event.preventDefault();
      const idx = Number(btn.getAttribute("data-idx"));
      onPick(items[idx]);
      host.classList.add("hidden");
      clearTrackerSuggestFixedPosition(host);
      host._trackerSuggest = null;
    });
    btn.addEventListener("mouseenter", () => {
      setTrackerSuggestActive(host, Number(btn.getAttribute("data-idx")));
    });
  });
}

async function searchTrackerProjects(query) {
  let projects = [];
  try {
    const syncProjects = await window.desktopApi.getSyncProjects();
    projects = (syncProjects || [])
      .filter((p) => p.enabled !== 0 && p.enabled !== false)
      .map((p) => ({
        id: p.project_id || p.id,
        name: p.project_name || p.name,
      }));
  } catch {
    projects = (referenceData?.projects || []).map((p) => ({ id: p.id, name: p.name }));
  }
  return projects
    .filter((p) => matchProjectQuery(p, query))
    .slice(0, 12)
    .map((p) => ({ id: p.id, title: p.name, name: p.name, subtitle: `#${p.id}` }));
}

async function searchTrackerIssues(query, projectId) {
  const q = String(query || "").trim();
  if (!q) return [];
  const filters = {
    issueScope: "mine",
    selectedAssigneeId: "me",
    selectedProjectId: projectId || "all",
    searchQuery: q,
    openOnly: true,
  };
  try {
    const rows = await window.desktopApi.loadIssues({ filters });
    const list = Array.isArray(rows) ? rows : rows?.issues || [];
    return list
      .filter((issue) => !isClosedForOpenScope(issue.status))
      .slice(0, 12)
      .map((issue) => {
        const assignee = issue.assigned_to?.name || "без исполнителя";
        const project = issue.project?.name || "";
        return {
          id: issue.id,
          title: `#${issue.id} ${issue.subject || ""}`,
          subtitle: [project, `исп.: ${assignee}`].filter(Boolean).join(" · "),
          issue,
        };
      });
  } catch (error) {
    setStatus(error.message || "Поиск задач не удался", "error");
    return [];
  }
}

function hoursFromTrackerTimeFields(dateIso, startHm, endHm) {
  const startNorm = normalizeTrackerHm(startHm);
  const endNorm = normalizeTrackerHm(endHm);
  if (!dateIso || !startNorm || !endNorm) return null;
  const start = new Date(`${dateIso}T${startNorm}:00`);
  let end = new Date(`${dateIso}T${endNorm}:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  const hours = (end.getTime() - start.getTime()) / 3600000;
  return Math.round(hours * 100) / 100;
}

/** Accept 1423 / 14:23 / 14.23 / 14 → HH:MM or null */
function normalizeTrackerHm(raw) {
  const s = String(raw || "").trim();
  if (!s) return null;
  const colon = s.match(/^(\d{1,2}):(\d{1,2})$/);
  if (colon) {
    const h = Number(colon[1]);
    const m = Number(colon[2]);
    if (h > 23 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const dotted = s.match(/^(\d{1,2})[.,](\d{1,2})$/);
  if (dotted) {
    const h = Number(dotted[1]);
    const m = Number(dotted[2]);
    if (h > 23 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const digits = s.replace(/\D/g, "");
  if (digits.length === 1 || digits.length === 2) {
    const h = Number(digits);
    if (h > 23) return null;
    return `${String(h).padStart(2, "0")}:00`;
  }
  if (digits.length === 3) {
    const h = Number(digits.slice(0, 1));
    const m = Number(digits.slice(1));
    if (h > 23 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  if (digits.length >= 4) {
    const h = Number(digits.slice(0, 2));
    const m = Number(digits.slice(2, 4));
    if (h > 23 || m > 59) return null;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return null;
}

function trackerStatusLabel(status) {
  if (status === "draft") return "Черновик";
  if (status === "pending") return "В очереди";
  if (status === "synced") return "Отправлено";
  if (status === "error") return "Ошибка";
  return status || "—";
}

const trackerRowSaveTimers = new Map();

function patchTrackerSessionsCache(entry) {
  if (!entry?.id || !Array.isArray(trackerSessionsCache)) return;
  const idx = trackerSessionsCache.findIndex((r) => Number(r.id) === Number(entry.id));
  if (idx >= 0) trackerSessionsCache[idx] = { ...trackerSessionsCache[idx], ...entry };
  else trackerSessionsCache.unshift(entry);
  const sumEl = document.getElementById("tracker-filter-sum");
  if (sumEl) {
    const rows = applyTrackerSessionFilters(trackerSessionsCache || []);
    const sum = rows.reduce((acc, row) => acc + (Number(row.hours) || 0), 0);
    sumEl.textContent = `${sum.toFixed(2)} ч`;
  }
}

/** Checkbox «выгрузить» только при draft + issue_id; обновляем без полной перерисовки строки. */
function syncTrackerRowPushChrome(entryId) {
  const tr = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${entryId}"]`);
  const row = trackerSessionsCache.find((r) => Number(r.id) === Number(entryId));
  if (!tr || !row) return;
  const running = Number(row.is_running);
  const isIdleKind = String(row.entry_kind || "") === "idle";
  const noIssue =
    (row.sync_status === "draft" || row.sync_status === "error") && !row.issue_id && !running;
  const checkHost = tr.querySelector(".tracker-date-check");
  if (checkHost) {
    const canCheck =
      row.sync_status === "draft" && row.issue_id && !running && !isIdleKind;
    if (canCheck) {
      if (!checkHost.querySelector(".tracker-session-cb")) {
        checkHost.innerHTML = `<input type="checkbox" class="tracker-session-cb" value="${row.id}" />`;
      }
    } else {
      checkHost.innerHTML = `<span class="tracker-date-check-spacer" aria-hidden="true"></span>`;
    }
  }
  const oldDot = tr.querySelector(".tracker-status-dot");
  if (oldDot) {
    const wrap = document.createElement("div");
    wrap.innerHTML = trackerStatusDot(row, { running, noIssue, isIdleKind });
    const next = wrap.firstElementChild;
    if (next) oldDot.replaceWith(next);
  }
}

async function saveTrackerRowPatch(entryId, patch, { refresh = false } = {}) {
  try {
    const result = await window.desktopApi.trackerUpdateDraft({ id: entryId, ...patch });
    if (result?.entry) {
      patchTrackerSessionsCache(result.entry);
      if (patch.issueId !== undefined || patch.projectId !== undefined) {
        syncTrackerRowPushChrome(entryId);
      }
    }
    if (refresh) await refreshTrackerSessionsTable();
    return result;
  } catch (error) {
    setStatus(error.message || "Не удалось сохранить строку", "error");
    throw error;
  }
}

const trackerRowSaveFactories = new Map();

function scheduleTrackerRowSave(entryId, patchFactory) {
  const key = String(entryId);
  if (trackerRowSaveTimers.has(key)) clearTimeout(trackerRowSaveTimers.get(key));
  trackerRowSaveFactories.set(key, patchFactory);
  trackerRowSaveTimers.set(
    key,
    setTimeout(() => {
      trackerRowSaveTimers.delete(key);
      const factory = trackerRowSaveFactories.get(key);
      trackerRowSaveFactories.delete(key);
      const patch = typeof factory === "function" ? factory() : null;
      if (!patch || !Object.keys(patch).length) return;
      saveTrackerRowPatch(entryId, patch).catch(() => {});
    }, 450),
  );
}

async function flushPendingTrackerRowSaves() {
  const keys = [...new Set([...trackerRowSaveTimers.keys(), ...trackerRowSaveFactories.keys()])];
  if (!keys.length) return;
  keys.forEach((key) => {
    if (trackerRowSaveTimers.has(key)) clearTimeout(trackerRowSaveTimers.get(key));
    trackerRowSaveTimers.delete(key);
  });
  await Promise.all(
    keys.map(async (key) => {
      const factory = trackerRowSaveFactories.get(key);
      trackerRowSaveFactories.delete(key);
      const patch = typeof factory === "function" ? factory() : null;
      if (!patch || !Object.keys(patch).length) return;
      await saveTrackerRowPatch(Number(key), patch).catch(() => {});
    }),
  );
}

function applyTrackerHoursRounding(hours) {
  trackerMinFloorEnabled = currentSettings?.trackerMinFloorEnabled !== false;
  const round =
    window.TrackerHours?.roundHoursToHalf ||
    ((h, enabled) => {
      const n = Number(h);
      if (!Number.isFinite(n) || n <= 0) return Number.isFinite(n) && n <= 0 ? 0 : n;
      if (!enabled) return Math.round(n * 100) / 100;
      const rounded = Math.round(n * 2) / 2;
      return rounded === 0 ? 0.5 : rounded;
    });
  return round(hours, trackerMinFloorEnabled);
}

function parseTrackerHoursInput(raw) {
  const s = String(raw || "").trim().replace(",", ".");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return applyTrackerHoursRounding(Math.round(n * 100) / 100);
}

function trackerHmAddHours(hm, hours) {
  if (!hm || hours == null || !Number.isFinite(Number(hours))) return null;
  const [hh, mm] = hm.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  let total = hh * 60 + mm + Math.round(Number(hours) * 60);
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function trackerHmSubHours(hm, hours) {
  if (!hm || hours == null || !Number.isFinite(Number(hours))) return null;
  return trackerHmAddHours(hm, -Number(hours));
}

function trackerHoursInputHtml(entryId, hours, { readonly = false } = {}) {
  const val = Number(hours || 0).toFixed(2);
  if (readonly) return `<span class="tracker-cell-hours">${val}</span>`;
  return `<input type="text" class="tracker-cell-hours-input" data-entry-id="${entryId}" value="${escapeHtml(val)}" inputmode="decimal" maxlength="8" autocomplete="off" title="Трудозатраты, ч" aria-label="Трудозатраты, ч" />`;
}

function formatTrackerTimerFace(entry) {
  if (Number(entry.is_running)) {
    const startedMs = Date.parse(entry.started_at);
    const elapsed = Number.isFinite(startedMs)
      ? Math.max(0, Math.floor((Date.now() - startedMs) / 1000))
      : Number(entry.elapsedSeconds) || 0;
    if (trackerTimeInputMode === "plain") {
      return Math.max(0, Math.round((elapsed / 3600) * 100) / 100).toFixed(2);
    }
    return formatTrackerElapsed(elapsed);
  }
  const secs = Math.max(0, Math.round((Number(entry.hours) || 0) * 3600));
  if (trackerTimeInputMode === "plain") {
    return Number(entry.hours || 0).toFixed(2);
  }
  return formatTrackerElapsed(secs);
}

function buildTrackerTimeColumnHeader() {
  if (trackerEntryMode === "range") {
    return `<th class="tracker-col-time tracker-col-time-range">
      <div class="tracker-time-head">
        <span class="tracker-time-head-spacer" aria-hidden="true"></span>
        <span class="tracker-time-head-part tracker-time-head-start">Начало</span>
        <span class="tracker-time-head-part tracker-time-head-end">Окончание</span>
        <span class="tracker-time-head-spacer" aria-hidden="true"></span>
        <span class="tracker-time-head-part tracker-time-head-hours">Часы</span>
      </div>
    </th>`;
  }
  if (trackerEntryMode === "hours") {
    return `<th class="tracker-col-time">Часы</th>`;
  }
  return `<th class="tracker-col-time">Таймер / часы</th>`;
}

function buildTrackerTableModeClass() {
  if (trackerEntryMode === "range") return "tracker-entry-mode-range";
  if (trackerEntryMode === "hours") return "tracker-entry-mode-hours";
  return "tracker-entry-mode-timer";
}

function renderTrackerTimeCell(row, { editable = false } = {}) {
  const running = Number(row.is_running);
  const hoursReadonly = !editable;
  const hoursHtml = trackerHoursInputHtml(row.id, row.hours, { readonly: hoursReadonly });

  if (trackerEntryMode === "hours") {
    return `<div class="tracker-time-cell mode-hours">${hoursHtml}</div>`;
  }

  if (trackerEntryMode === "range") {
    const startHm = trackerHmFromIso(row.started_at);
    const endHm = trackerHmFromIso(row.ended_at);
    if (!editable) {
      if (!startHm && !endHm) {
        return `<div class="tracker-time-cell mode-range is-readonly">${hoursHtml}</div>`;
      }
      const a = startHm || "—";
      const b = endHm || "—";
      return `<div class="tracker-time-cell mode-range is-readonly">
        <span class="tracker-range-plain">${escapeHtml(a)}</span>
        <span class="tracker-range-plain">${escapeHtml(b)}</span>
        ${hoursHtml}
      </div>`;
    }
    return `<div class="tracker-time-cell mode-range">
      <button type="button" class="tracker-icon-btn" data-range-start="${row.id}" title="Начало сейчас" aria-label="Начало сейчас"><span aria-hidden="true">▶</span></button>
      <input type="text" class="tracker-cell-start" data-entry-id="${row.id}" value="${escapeHtml(startHm)}" placeholder="00:00" inputmode="numeric" maxlength="5" autocomplete="off" aria-label="Начало" />
      <input type="text" class="tracker-cell-end" data-entry-id="${row.id}" value="${escapeHtml(endHm)}" placeholder="00:00" inputmode="numeric" maxlength="5" autocomplete="off" aria-label="Окончание" />
      <button type="button" class="tracker-icon-btn" data-range-stop="${row.id}" title="Окончание сейчас" aria-label="Окончание сейчас"><span aria-hidden="true">■</span></button>
      ${hoursHtml}
    </div>`;
  }

  /* timer mode */
  const face = formatTrackerTimerFace(row);
  if (running) {
    const clock =
      trackerTimeInputMode === "plain"
        ? face
        : `<span class="tracker-running-clock" data-running-id="${row.id}" data-started-at="${escapeHtml(row.started_at || "")}">${face}</span>`;
    return `<div class="tracker-time-cell mode-timer is-running">
      <button type="button" class="tracker-icon-btn" data-stop-entry="${row.id}" title="Стоп" aria-label="Стоп"><span aria-hidden="true">■</span></button>
      <span class="tracker-timer-face">${clock}</span>
      ${hoursHtml}
    </div>`;
  }
  if (!editable) {
    return `<div class="tracker-time-cell mode-timer is-readonly">
      <span class="tracker-timer-face">${face}</span>
      ${hoursHtml}
    </div>`;
  }
  return `<div class="tracker-time-cell mode-timer">
    <button type="button" class="tracker-icon-btn" data-row-start="${row.id}" title="Старт" aria-label="Старт"><span aria-hidden="true">▶</span></button>
    <span class="tracker-timer-face">${face}</span>
    ${hoursHtml}
  </div>`;
}

function startTrackerClockTicks() {
  stopTrackerClockTicks();
  if (trackerEntryMode !== "timer" || trackerTimeInputMode !== "ticker") return;
  trackerTickTimer = setInterval(() => {
    document.querySelectorAll(".tracker-running-clock[data-started-at]").forEach((el) => {
      const startedMs = Date.parse(el.getAttribute("data-started-at"));
      if (!Number.isFinite(startedMs)) return;
      const elapsed = Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
      el.textContent = formatTrackerElapsed(elapsed);
      const hoursInput = el.closest(".tracker-time-cell")?.querySelector(".tracker-cell-hours-input");
      if (hoursInput && document.activeElement !== hoursInput) {
        hoursInput.value = (Math.round((elapsed / 3600) * 100) / 100).toFixed(2);
      }
    });
  }, 1000);
}

function stopTrackerClockTicks() {
  if (trackerTickTimer) {
    clearInterval(trackerTickTimer);
    trackerTickTimer = null;
  }
}

function trackerOpenIssueIconBtn(issueId) {
  if (!issueId) return "";
  return `<button type="button" class="tracker-issue-open-btn" data-tracker-issue="${issueId}" title="Открыть задачу #${issueId}" aria-label="Открыть задачу #${issueId}">
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <rect x="1" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>
      <rect x="4" y="1" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>
    </svg>
  </button>`;
}

function trackerIssueBrowseBtn(entryId) {
  return `<button type="button" class="tracker-issue-browse-btn" data-tracker-browse="${entryId}" title="Показать все" aria-label="Показать все задачи">
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" focusable="false">
      <rect x="1.15" y="1.15" width="10.7" height="10.7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.15"/>
      <path d="M1.15 4.5h10.7M4.7 1.15v10.7" fill="none" stroke="currentColor" stroke-width="1.15"/>
    </svg>
  </button>`;
}

function trackerIssueFieldActionsHtml(entryId, issueId) {
  return `<div class="tracker-issue-field-actions">
    ${trackerOpenIssueIconBtn(issueId)}
    ${trackerIssueBrowseBtn(entryId)}
  </div>`;
}

function ensureTrackerIssueOpenBtn(tr, issueId) {
  const actions = tr?.querySelector(".tracker-issue-field-actions");
  if (!actions) return;
  let openBtn = actions.querySelector(".tracker-issue-open-btn");
  if (!issueId) {
    openBtn?.remove();
    return;
  }
  if (openBtn) {
    openBtn.setAttribute("data-tracker-issue", String(issueId));
    openBtn.setAttribute("title", `Открыть задачу #${issueId}`);
    openBtn.setAttribute("aria-label", `Открыть задачу #${issueId}`);
    openBtn.classList.remove("hidden");
    return;
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = trackerOpenIssueIconBtn(issueId);
  const btn = tmp.firstElementChild;
  const browse = actions.querySelector(".tracker-issue-browse-btn");
  if (btn) actions.insertBefore(btn, browse);
}

function applyTrackerIssueToRow(entryId, issue) {
  const tr = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${entryId}"]`);
  if (!tr || !issue?.id) return;
  const issueInput = tr.querySelector(".tracker-cell-issue");
  const idInput = tr.querySelector(".tracker-cell-issue-id");
  const projectInput = tr.querySelector(".tracker-cell-project");
  const projectIdInput = tr.querySelector(".tracker-cell-project-id");
  const projectName = issue.project?.name || issue.project_name || "";
  const projectIdVal = issue.project?.id || issue.project_id || null;
  if (issueInput) {
    const label = `#${issue.id} ${issue.subject || ""}`.trim();
    issueInput.value = label;
    issueInput.title = label;
  }
  if (idInput) idInput.value = String(issue.id);
  if (projectInput && projectName) {
    projectInput.value = projectName;
    projectInput.title = projectName;
  }
  if (projectIdInput && projectIdVal) projectIdInput.value = String(projectIdVal);
  ensureTrackerIssueOpenBtn(tr, issue.id);
  hideAllTrackerRowSuggests();
  saveTrackerRowPatch(
    entryId,
    {
      issueId: Number(issue.id),
      projectId: projectIdVal,
      projectName,
    },
    { refresh: true },
  ).catch((error) => {
    setStatus(error?.message || "Не удалось сохранить задачу", "error");
  });
}

function trackerIssuePickerEls() {
  return {
    modal: document.getElementById("tracker-issue-picker-modal"),
    search: document.getElementById("tracker-issue-picker-search"),
    project: document.getElementById("tracker-issue-picker-project"),
    assignee: document.getElementById("tracker-issue-picker-assignee"),
    author: document.getElementById("tracker-issue-picker-author"),
    status: document.getElementById("tracker-issue-picker-status"),
    favBtn: document.getElementById("tracker-issue-picker-fav-btn"),
    meta: document.getElementById("tracker-issue-picker-meta"),
    tbody: document.getElementById("tracker-issue-picker-tbody"),
    selectBtn: document.getElementById("tracker-issue-picker-select"),
  };
}

function syncTrackerPickerFavButton() {
  const btn = document.getElementById("tracker-issue-picker-fav-btn");
  if (!btn) return;
  const on = Boolean(trackerIssuePickerState.favoritesOnly);
  btn.classList.toggle("is-active", on);
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  const icon = btn.querySelector(".tracker-picker-fav-icon");
  if (icon) icon.textContent = on ? "★" : "☆";
}

function isTrackerIssuePickerOpen() {
  const modal = document.getElementById("tracker-issue-picker-modal");
  return Boolean(modal && !modal.classList.contains("hidden"));
}

function fillTrackerPickerSelect(select, items, { includeAll, allLabel, selected } = {}) {
  if (!select) return;
  const opts = [];
  if (includeAll) opts.push(`<option value="all">${escapeHtml(allLabel || "Все")}</option>`);
  (items || []).forEach((item) => {
    const id = String(item.id);
    opts.push(`<option value="${escapeHtml(id)}">${escapeHtml(item.name || id)}</option>`);
  });
  select.innerHTML = opts.join("");
  const wanted = selected == null || selected === "" ? (includeAll ? "all" : "") : String(selected);
  if ([...select.options].some((o) => o.value === wanted)) select.value = wanted;
  else if (includeAll) select.value = "all";
}

async function loadTrackerPickerProjects() {
  try {
    const syncProjects = await window.desktopApi.getSyncProjects();
    const raw = (syncProjects || [])
      .filter((p) => p.enabled !== 0 && p.enabled !== false)
      .map((p) => ({
        id: p.project_id || p.id,
        name: p.project_name || p.name,
      }));
    return formatProjectsForUi(raw);
  } catch (error) {
    setStatus(error?.message || "Не удалось загрузить проекты", "error");
    return formatProjectsForUi(referenceData?.projects || []);
  }
}

async function refreshTrackerPickerPeople(projectId) {
  const els = trackerIssuePickerEls();
  const projectIds = projectId ? [Number(projectId)] : null;
  const currentUser = getCurrentUserRef();
  const meName = currentUser?.name || `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim();
  let assignees = [];
  let authors = [];
  try {
    [assignees, authors] = await Promise.all([
      window.desktopApi.getAssignees({ projectIds }),
      window.desktopApi.getAuthors({ projectIds }),
    ]);
  } catch (error) {
    setStatus(error?.message || "Не удалось загрузить исполнителей", "error");
  }
  const prevAssignee = els.assignee?.value || "all";
  const prevAuthor = els.author?.value || "all";
  const assigneeItems = [];
  if (currentUser?.id) {
    assigneeItems.push({ id: "me", name: meName ? `Я (${meName})` : "Я" });
  }
  (assignees || []).forEach((u) => {
    if (currentUser?.id && Number(u.id) === Number(currentUser.id)) return;
    assigneeItems.push({ id: u.id, name: u.name });
  });
  fillTrackerPickerSelect(els.assignee, assigneeItems, {
    includeAll: true,
    allLabel: "Все исполнители",
    selected: prevAssignee,
  });
  fillTrackerPickerSelect(els.author, authors || [], {
    includeAll: true,
    allLabel: "Все авторы",
    selected: prevAuthor,
  });
}

function fillTrackerPickerStatuses() {
  const els = trackerIssuePickerEls();
  const statuses = getReferenceStatuses();
  const prev = els.status?.value || "open";
  const items = [
    { id: "open", name: "Открытые" },
    { id: "all", name: "Все статусы" },
    ...statuses.map((s) => ({ id: s.id, name: s.name })),
  ];
  if (!els.status) return;
  els.status.innerHTML = items
    .map((s) => `<option value="${escapeHtml(String(s.id))}">${escapeHtml(s.name)}</option>`)
    .join("");
  if ([...els.status.options].some((o) => o.value === prev)) els.status.value = prev;
  else els.status.value = "open";
}

function setTrackerPickerSelection(issueId) {
  const els = trackerIssuePickerEls();
  trackerIssuePickerState.selectedId = issueId ? Number(issueId) : null;
  els.tbody?.querySelectorAll("tr[data-issue-id]").forEach((row) => {
    row.classList.toggle("is-selected", Number(row.dataset.issueId) === Number(issueId));
  });
  if (els.selectBtn) els.selectBtn.disabled = !trackerIssuePickerState.selectedId;
}

function renderTrackerPickerRows(issues) {
  const els = trackerIssuePickerEls();
  if (!els.tbody) return;
  trackerIssuePickerState.issues = issues;
  if (!issues.length) {
    els.tbody.innerHTML = `<tr><td colspan="6" class="tracker-issue-picker-empty">Нет задач по текущим фильтрам.</td></tr>`;
    setTrackerPickerSelection(null);
    return;
  }
  els.tbody.innerHTML = issues
    .map((issue) => {
      const subject = escapeHtml(issue.subject || "(без темы)");
      const project = escapeHtml(issue.project?.name || "—");
      const author = escapeHtml(issue.author?.name || "—");
      const assignee = escapeHtml(issue.assigned_to?.name || "—");
      const status = escapeHtml(issue.status?.name || "—");
      return `<tr data-issue-id="${issue.id}" tabindex="0">
        <td class="tracker-picker-subject" title="${subject}">${subject}</td>
        <td class="tracker-picker-id">${issue.id}</td>
        <td title="${project}">${project}</td>
        <td title="${author}">${author}</td>
        <td title="${assignee}">${assignee}</td>
        <td>${status}</td>
      </tr>`;
    })
    .join("");
  const keepId = trackerIssuePickerState.selectedId;
  const keep = keepId && issues.some((i) => Number(i.id) === Number(keepId));
  setTrackerPickerSelection(keep ? keepId : issues[0].id);
}

async function refreshTrackerPickerList() {
  const els = trackerIssuePickerEls();
  if (els.meta) els.meta.textContent = "Загрузка…";
  if (els.selectBtn) els.selectBtn.disabled = true;
  const projectId = els.project?.value && els.project.value !== "all" ? Number(els.project.value) : null;
  const assigneeVal = els.assignee?.value || "all";
  const authorVal = els.author?.value || "all";
  const statusVal = els.status?.value || "open";
  const searchQuery = String(els.search?.value || "").trim();
  const favoritesOnly = Boolean(trackerIssuePickerState.favoritesOnly);
  const filters = {
    issueScope: favoritesOnly ? "favorites" : "all",
    favoriteIds: favoritesOnly ? getFavoriteIssueIds() : undefined,
    favoritesBare: favoritesOnly ? false : undefined,
    selectedProjectId: projectId || "all",
    selectedAssigneeId: assigneeVal === "all" ? "all" : assigneeVal,
    selectedAuthorIds: authorVal !== "all" && authorVal ? [Number(authorVal)] : [],
    searchQuery,
    openOnly: statusVal === "open",
  };
  if (statusVal !== "open" && statusVal !== "all") {
    filters.openOnly = false;
    filters.selectedStatusIds = [Number(statusVal)];
  }
  try {
    const rows = await window.desktopApi.loadIssues({ filters });
    const list = Array.isArray(rows) ? rows : rows?.issues || [];
    const limited = list.slice(0, 400);
    renderTrackerPickerRows(limited);
    if (els.meta) {
      const favNote = favoritesOnly ? " · избранные" : "";
      els.meta.textContent = list.length > limited.length
        ? `Показаны первые ${limited.length} из ${list.length}${favNote}`
        : `Найдено: ${limited.length}${favNote}`;
    }
  } catch (error) {
    renderTrackerPickerRows([]);
    if (els.meta) els.meta.textContent = "";
    setStatus(error?.message || "Не удалось загрузить список задач", "error");
  }
}

function closeTrackerIssuePicker() {
  const els = trackerIssuePickerEls();
  els.modal?.classList.add("hidden");
  trackerIssuePickerState.entryId = null;
  trackerIssuePickerState.issues = [];
  trackerIssuePickerState.selectedId = null;
  trackerIssuePickerState.favoritesOnly = false;
  syncTrackerPickerFavButton();
  if (trackerIssuePickerState.searchTimer) {
    clearTimeout(trackerIssuePickerState.searchTimer);
    trackerIssuePickerState.searchTimer = null;
  }
}

function confirmTrackerIssuePicker() {
  const issue = trackerIssuePickerState.issues.find(
    (item) => Number(item.id) === Number(trackerIssuePickerState.selectedId),
  );
  const entryId = trackerIssuePickerState.entryId;
  if (!issue || !entryId) {
    setStatus("Выберите задачу в списке", "error");
    return;
  }
  applyTrackerIssueToRow(entryId, issue);
  closeTrackerIssuePicker();
}

function moveTrackerPickerSelection(delta) {
  const issues = trackerIssuePickerState.issues;
  if (!issues.length) return;
  const idx = issues.findIndex((i) => Number(i.id) === Number(trackerIssuePickerState.selectedId));
  const next = Math.max(0, Math.min(issues.length - 1, (idx < 0 ? 0 : idx) + delta));
  setTrackerPickerSelection(issues[next].id);
  const row = document.querySelector(
    `#tracker-issue-picker-tbody tr[data-issue-id="${issues[next].id}"]`,
  );
  row?.scrollIntoView({ block: "nearest" });
}

async function openTrackerIssuePicker(entryId) {
  hideAllTrackerRowSuggests();
  const els = trackerIssuePickerEls();
  if (!els.modal) return;
  try {
    const tr = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${entryId}"]`);
    const rowProjectId = Number(tr?.querySelector(".tracker-cell-project-id")?.value) || null;
    const currentIssueId = Number(tr?.querySelector(".tracker-cell-issue-id")?.value) || null;
    const typed = String(tr?.querySelector(".tracker-cell-issue")?.value || "").trim();
    const typedIsSelected = currentIssueId && typed.startsWith(`#${currentIssueId}`);
    trackerIssuePickerState.entryId = entryId;
    trackerIssuePickerState.selectedId = currentIssueId || null;
    trackerIssuePickerState.favoritesOnly = false;
    syncTrackerPickerFavButton();

    const projects = await loadTrackerPickerProjects();
    fillTrackerPickerSelect(els.project, projects, {
      includeAll: true,
      allLabel: "Все проекты",
      selected: rowProjectId || "all",
    });
    fillTrackerPickerStatuses();
    if (els.assignee) els.assignee.innerHTML = `<option value="all">Все исполнители</option><option value="me">Я</option>`;
    if (els.author) els.author.innerHTML = `<option value="all">Все авторы</option>`;
    if (els.assignee) els.assignee.value = "all";
    if (els.search) els.search.value = typedIsSelected ? "" : typed;
    await refreshTrackerPickerPeople(rowProjectId);
    els.modal.classList.remove("hidden");
    await refreshTrackerPickerList();
    els.search?.focus();
    els.search?.select();
  } catch (error) {
    setStatus(error?.message || "Не удалось открыть список задач", "error");
    closeTrackerIssuePicker();
  }
}

function trackerStatusDot(row, { running, noIssue, isIdleKind } = {}) {
  if (noIssue) {
    return `<span class="tracker-status-dot is-danger" title="Нет задачи Redmine" aria-label="Нет задачи Redmine"></span>`;
  }
  if (running) {
    return `<span class="tracker-status-dot is-pending" title="Идёт" aria-label="Идёт"></span>`;
  }
  if (isIdleKind) {
    return `<span class="tracker-status-dot is-draft" title="Простой" aria-label="Простой"></span>`;
  }
  const status = row.sync_status || "draft";
  const title =
    status === "error"
      ? String(row.sync_error || "Ошибка").trim() || "Ошибка"
      : trackerStatusLabel(status);
  const cls =
    status === "pending"
      ? "is-pending"
      : status === "synced"
        ? "is-synced"
        : status === "error"
          ? "is-danger"
          : "is-draft";
  return `<span class="tracker-status-dot ${cls}" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}"></span>`;
}

function renderTrackerSessionRow(row) {
  const running = Number(row.is_running);
  const isIdleKind = String(row.entry_kind || "") === "idle";
  const editable = trackerRowIsEditable(row) && !isIdleKind;
  const noIssue = (row.sync_status === "draft" || row.sync_status === "error") && !row.issue_id && !running;
  const statusDot = trackerStatusDot(row, { running, noIssue, isIdleKind });
  const check =
    row.sync_status === "draft" && row.issue_id && !running && !isIdleKind
      ? `<input type="checkbox" class="tracker-session-cb" value="${row.id}" />`
      : "";
  const canDelete =
    !running && (row.sync_status === "draft" || row.sync_status === "error");
  const deleteCell = canDelete
    ? `<button type="button" class="tracker-row-delete" data-delete-entry="${row.id}" title="Удалить строку" aria-label="Удалить">×</button>`
    : "";

  const dateCellInner = editable
    ? `<input type="date" class="tracker-cell-date" data-entry-id="${row.id}" value="${escapeHtml(row.spent_on || trackerTodayIso())}" />`
    : `<span class="tracker-date-text">${escapeHtml(row.spent_on || "")}</span>`;
  const dateCell = `<div class="tracker-date-cell">
      ${statusDot}
      <span class="tracker-date-check">${check || `<span class="tracker-date-check-spacer" aria-hidden="true"></span>`}</span>
      ${dateCellInner}
    </div>`;

  if (!editable) {
    const issueCell = row.issue_id
      ? `<div class="tracker-issue-readonly">
           <button type="button" class="report-detail-issue" data-tracker-issue="${row.issue_id}" title="${escapeHtml(`#${row.issue_id} ${row.issue_subject || ""}`.trim())}">#${row.issue_id} ${escapeHtml(row.issue_subject || "")}</button>
           ${trackerOpenIssueIconBtn(row.issue_id)}
           <div class="muted">${escapeHtml(row.project_name || "")}</div>
         </div>`
      : `<span class="muted">${escapeHtml(row.project_name || "Без проекта / задачи")}</span>`;
    const commentBits = [escapeHtml(row.comments || "")];
    if (trackerShowCustomerName && String(row.customer_name || "").trim()) {
      commentBits.push(`<div class="muted">${escapeHtml(row.customer_name)}</div>`);
    }
    return `<tr data-entry-id="${row.id}" class="${running ? "is-running" : ""}">
      <td class="tracker-col-date">${dateCell}</td>
      <td class="tracker-col-project">${issueCell}</td>
      <td class="tracker-col-time">${renderTrackerTimeCell(row, { editable: false })}</td>
      <td class="tracker-col-activity">${escapeHtml(row.activity_name || "")}</td>
      <td class="tracker-col-comment">${commentBits.join("") || "—"}</td>
      <td class="tracker-delete-cell">${deleteCell}</td>
    </tr>`;
  }

  const projectText = escapeHtml(row.project_name || "");
  const issueText = row.issue_id
    ? escapeHtml(`#${row.issue_id} ${row.issue_subject || ""}`.trim())
    : "";

  const commentExtra =
    trackerShowCustomerName
      ? `<input type="text" class="tracker-cell-customer" data-entry-id="${row.id}" value="${escapeHtml(row.customer_name || "")}" placeholder="ФИО заказчика" />`
      : "";

  return `<tr data-entry-id="${row.id}" class="${running ? "is-running" : ""} is-editable">
    <td class="tracker-col-date">${dateCell}</td>
    <td class="tracker-col-project tracker-project-issue-cell">
      <div class="tracker-suggest">
        <input type="text" class="tracker-cell-project" data-entry-id="${row.id}" value="${projectText}" title="${projectText}" placeholder="Проект" autocomplete="off" />
        <input type="hidden" class="tracker-cell-project-id" data-entry-id="${row.id}" value="${row.project_id || ""}" />
        <div class="tracker-suggest-list tracker-cell-suggest hidden" data-suggest="project" data-entry-id="${row.id}" role="listbox"></div>
      </div>
      <div class="tracker-suggest tracker-issue-field">
        <input type="text" class="tracker-cell-issue" data-entry-id="${row.id}" value="${issueText}" title="${issueText}" placeholder="Задача" autocomplete="off" />
        <input type="hidden" class="tracker-cell-issue-id" data-entry-id="${row.id}" value="${row.issue_id || ""}" />
        ${trackerIssueFieldActionsHtml(row.id, row.issue_id)}
        <div class="tracker-suggest-list tracker-cell-suggest hidden" data-suggest="issue" data-entry-id="${row.id}" role="listbox"></div>
      </div>
    </td>
    <td class="tracker-col-time">${renderTrackerTimeCell(row, { editable: true })}</td>
    <td class="tracker-col-activity"><select class="tracker-cell-activity" data-entry-id="${row.id}">${trackerActivityOptionsHtml(row.activity_id, row.activity_name)}</select></td>
    <td class="tracker-col-comment tracker-comment-cell">
      <textarea class="tracker-cell-comment" data-entry-id="${row.id}" rows="1" placeholder="Комментарий *" spellcheck="true" lang="ru">${escapeHtml(row.comments || "")}</textarea>
      ${commentExtra}
    </td>
    <td class="tracker-delete-cell">${deleteCell}</td>
  </tr>`;
}

function trackerWeekRange(baseDate = new Date()) {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const day = (d.getDay() + 6) % 7; // Mon=0
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const iso = (x) => {
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const dd = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  return { from: iso(start), to: iso(end) };
}

function getTrackerPeriodBounds() {
  if (trackerPeriodMode === "week") return trackerWeekRange(new Date());
  if (trackerPeriodMode === "custom") {
    const today = trackerTodayIso();
    let from = trackerCustomFrom || today;
    let to = trackerCustomTo || from;
    if (from > to) {
      const tmp = from;
      from = to;
      to = tmp;
    }
    return { from, to };
  }
  const today = trackerTodayIso();
  return { from: today, to: today };
}

function trackerPeriodUsesDayGroups() {
  if (trackerPeriodMode === "week") return true;
  if (trackerPeriodMode === "custom") {
    const { from, to } = getTrackerPeriodBounds();
    return from !== to;
  }
  return false;
}

let trackerPeriodPickerRef = null;

function clearTrackerCustomPeriodErrors() {}

function applyTrackerCustomPeriodFromPanel() {
  const fromEl = document.getElementById("tracker-custom-from");
  const toEl = document.getElementById("tracker-custom-to");
  if (!fromEl || !toEl) return false;
  clearTrackerCustomPeriodErrors();
  if (!fromEl.value || !toEl.value) {
    setStatus("Укажите обе даты периода", "error");
    return false;
  }
  let from = fromEl.value;
  let to = toEl.value;
  if (from > to) {
    const tmp = from;
    from = to;
    to = tmp;
    fromEl.value = from;
    toEl.value = to;
  }
  trackerCustomFrom = from;
  trackerCustomTo = to;
  trackerPeriodMode = "custom";
  document.querySelectorAll("[data-tracker-period]").forEach((el) => {
    el.classList.toggle("active", el.getAttribute("data-tracker-period") === "custom");
  });
  return true;
}

function applyTrackerSessionFilters(rows) {
  const projectQ = String(document.getElementById("tracker-filter-project")?.value || "")
    .trim()
    .toLowerCase();
  const issueQ = String(document.getElementById("tracker-filter-issue")?.value || "")
    .trim()
    .toLowerCase();
  const unpushedOnly = Boolean(document.getElementById("tracker-filter-unpushed")?.checked);
  return rows.filter((row) => {
    if (unpushedOnly && row.sync_status !== "draft" && !Number(row.is_running)) return false;
    if (projectQ) {
      const name = String(row.project_name || "").toLowerCase();
      const acr = projectAcronym(row.project_name || "");
      if (!name.includes(projectQ) && !acr.includes(projectQ)) return false;
    }
    if (issueQ) {
      const hay = `#${row.issue_id || ""} ${row.issue_subject || ""}`.toLowerCase();
      if (!hay.includes(issueQ) && String(row.issue_id || "") !== issueQ.replace(/^#/, "")) return false;
    }
    return true;
  });
}

async function refreshTrackerSessionsTable() {
  const host = document.getElementById("tracker-sessions-host");
  const sumEl = document.getElementById("tracker-filter-sum");
  if (!host) return;
  const { from, to } = getTrackerPeriodBounds();
  const me = getCurrentUserRef();
  const userId = me?.id != null ? Number(me.id) : null;
  trackerSessionsCache = await window.desktopApi.getTrackerDrafts({
    from,
    to,
    ...(Number.isFinite(userId) && userId > 0 ? { userId } : {}),
  });
  trackerSessionsCache = (trackerSessionsCache || []).slice().sort((a, b) => {
    const dayCmp = String(a.spent_on || "").localeCompare(String(b.spent_on || ""));
    if (dayCmp !== 0) return dayCmp;
    const createdCmp = String(a.created_on || "").localeCompare(String(b.created_on || ""));
    if (createdCmp !== 0) return createdCmp;
    const aId = Number(a.id);
    const bId = Number(b.id);
    if (aId < 0 && bId < 0) return bId - aId;
    return aId - bId;
  });
  const rows = applyTrackerSessionFilters(trackerSessionsCache || []);
  const sum = rows.reduce((acc, row) => acc + (Number(row.hours) || 0), 0);
  if (sumEl) sumEl.textContent = `${sum.toFixed(2)} ч`;

  if (!rows.length) {
    host.innerHTML = `<div class="muted">Нет записей за выбранный период/фильтр.</div>`;
    stopTrackerClockTicks();
    return;
  }

  if (!(getTimeEntryActivities() || []).length) {
    try {
      await mergeReferenceDataFromCache();
    } catch (error) {
      setStatus(error?.message || "Не удалось загрузить виды деятельности", "error");
    }
  }

  const colGroup = `<colgroup>
      <col class="tracker-col-date" />
      <col class="tracker-col-project" />
      <col class="tracker-col-time" />
      <col class="tracker-col-activity" />
      <col class="tracker-col-comment" />
      <col class="tracker-col-actions" />
    </colgroup>`;
  const colHead = `<thead>
      <tr>
        <th class="tracker-col-date">Дата</th>
        <th class="tracker-col-project">Проект / Задача</th>
        ${buildTrackerTimeColumnHeader()}
        <th class="tracker-col-activity">Деятельность</th>
        <th class="tracker-col-comment">Комментарий</th>
        <th class="tracker-col-actions"></th>
      </tr>
    </thead>`;
  const tableClass = `tracker-sessions-table ${buildTrackerTableModeClass()}`;

  if (trackerPeriodUsesDayGroups()) {
    const byDay = new Map();
    rows.forEach((row) => {
      const key = row.spent_on || "—";
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(row);
    });
    const days = [...byDay.keys()].sort();
    const body = days
      .map((day) => {
        const dayRows = byDay.get(day);
        const daySum = dayRows.reduce((a, r) => a + (Number(r.hours) || 0), 0);
        const selectable = dayRows.filter(
          (r) => r.sync_status === "draft" && r.issue_id && String(r.entry_kind || "") !== "idle",
        );
        const head = `<tr class="tracker-day-header-row" data-day="${escapeHtml(day)}">
          <td colspan="6">
            <div class="tracker-day-head">
              <label class="tracker-day-select">
                <input type="checkbox" class="tracker-day-cb" data-day="${escapeHtml(day)}" ${selectable.length ? "" : "disabled"} />
                <strong>${escapeHtml(day)}</strong>
              </label>
              <span class="muted">${daySum.toFixed(2)} ч</span>
            </div>
          </td>
        </tr>`;
        return head + dayRows.map(renderTrackerSessionRow).join("");
      })
      .join("");
    host.innerHTML = `<table class="${tableClass}">${colGroup}${colHead}<tbody>${body}</tbody></table>`;
    startTrackerClockTicks();
    growTrackerCommentFields();
    return;
  }

  host.innerHTML = `<table class="${tableClass}">${colGroup}${colHead}
    <tbody>${rows.map(renderTrackerSessionRow).join("")}</tbody>
  </table>`;
  startTrackerClockTicks();
  growTrackerCommentFields();
}

function growTrackerCommentFields() {
  document.querySelectorAll("#tracker-sessions-host .tracker-cell-comment").forEach((el) => {
    autoGrowTextarea(el);
  });
}

function renderReportBreakdown(entries, totalHours) {
  const list = document.getElementById("report-breakdown-list");
  if (!list) return;
  const keyFn = {
    project: (e) => e.project_name || "Без проекта",
    customer: (e) => (String(e.customer_name || "").trim() ? e.customer_name : "Без ФИО"),
    issue: (e) =>
      e.issue_id
        ? window.ReportMatrix?.issueMatrixLabel?.(e) || `Задача #${e.issue_id}`
        : "Без задачи",
    activity: (e) => e.activity_name || "Без деятельности",
  }[reportGroupMode] || ((e) => e.project_name || "Без проекта");

  if (reportGroupMode === "days") {
    renderReportDaysMatrix(entries);
    return;
  }

  const map = new Map();
  entries.forEach((e) => {
    const key = keyFn(e);
    map.set(key, (map.get(key) || 0) + Number(e.hours || 0));
  });
  let rows = [...map.entries()].sort((a, b) => b[1] - a[1]);
  if (rows.length > 8) {
    const top = rows.slice(0, 8);
    const rest = rows.slice(8).reduce((s, [, h]) => s + h, 0);
    rows = [...top, ["Остальное", rest]];
  }
  const denom = totalHours > 0 ? totalHours : 1;
  list.innerHTML = rows.length
    ? rows
        .map(([name, hours]) => {
          const pct = Math.max(0, Math.min(100, (hours / denom) * 100));
          return `<div class="report-breakdown-row">
            <div title="${escapeHtml(name)}">${escapeHtml(name)}</div>
            <div class="report-breakdown-bar-track"><div class="report-breakdown-bar-fill" style="width:${pct}%"></div></div>
            <div>${formatReportHours(hours)}</div>
          </div>`;
        })
        .join("")
    : `<div class="muted">Нет данных за период.</div>`;
}

function renderReportDaysMatrix(entries) {
  const list = document.getElementById("report-breakdown-list");
  if (!list) return;
  const from = document.getElementById("report-from")?.value;
  const to = document.getElementById("report-to")?.value;
  const days = from && to ? eachDateInclusive(from, to) : [];
  const matrix = window.ReportMatrix?.buildIssueDayMatrix?.(entries, days) || {
    days,
    rows: [],
    colTotals: {},
    grandTotal: 0,
  };
  const fmt = window.ReportMatrix?.formatMatrixHours || ((n) => formatReportHours(n));
  if (!matrix.rows.length) {
    list.innerHTML = `<div class="muted">Нет данных за период.</div>`;
    return;
  }
  const headDays = matrix.days
    .map((d) => `<th>${escapeHtml(d)}</th>`)
    .join("");
  const body = matrix.rows
    .map((row) => {
      const cells = matrix.days
        .map((d) => `<td>${escapeHtml(fmt(row.hoursByDay[d] || 0))}</td>`)
        .join("");
      const title = escapeHtml(row.label);
      const issueLink =
        row.issueId
          ? `<button type="button" class="report-detail-issue" data-report-issue="${row.issueId}">${title}</button>`
          : title;
      return `<tr>
        <td class="report-days-task">${issueLink}</td>
        ${cells}
        <td>${escapeHtml(fmt(row.total))}</td>
      </tr>`;
    })
    .join("");
  const footDays = matrix.days
    .map((d) => `<td>${escapeHtml(fmt(matrix.colTotals[d] || 0))}</td>`)
    .join("");
  list.innerHTML = `<div class="report-days-scroll"><table class="report-days-table">
    <thead>
      <tr>
        <th class="report-days-task">Задача</th>
        ${headDays}
        <th>Общее время</th>
      </tr>
    </thead>
    <tbody>${body}</tbody>
    <tfoot>
      <tr>
        <td class="report-days-task">Общее время</td>
        ${footDays}
        <td>${escapeHtml(fmt(matrix.grandTotal))}</td>
      </tr>
    </tfoot>
  </table></div>`;
}

function renderReportDetails(entries) {
  const list = document.getElementById("report-detail-list");
  if (!list) return;
  const sorted = entries.slice().sort((a, b) => String(b.spent_on).localeCompare(String(a.spent_on)));
  list.innerHTML = sorted.length
    ? sorted
        .map((e) => {
          const customer = String(e.customer_name || "").trim();
          return `<div class="report-detail-row">
            <div>${escapeHtml(e.spent_on || "—")}</div>
            <div class="muted">${escapeHtml(e.project_name || "—")}</div>
            <div>
              <button type="button" class="report-detail-issue" data-report-issue="${Number(e.issue_id) || ""}">#${e.issue_id || "—"}</button>
              ${customer ? `<div class="muted">${escapeHtml(customer)}</div>` : ""}
              ${e.comments ? `<div class="muted">${escapeHtml(e.comments)}</div>` : ""}
            </div>
            <div>${formatReportHours(e.hours)}</div>
          </div>`;
        })
        .join("")
    : `<div class="muted">Нет записей за период.</div>`;
}

async function loadTimeReport() {
  const fromEl = document.getElementById("report-from");
  const toEl = document.getElementById("report-to");
  const from = fromEl?.value;
  const to = toEl?.value;
  if (!from || !to) return;

  const currentUser = getCurrentUserRef();
  const userId = currentUser?.id;
  if (!userId) {
    setStatus("Не определён текущий пользователь — обновите справочники.", "error");
    return;
  }

  let entries = [];
  try {
    entries = (await window.desktopApi.getTimeEntriesReport({ userId, from, to })) || [];
  } catch (error) {
    setStatus(`Не удалось загрузить отчёт: ${error.message}`, "error");
    return;
  }
  reportEntriesCache = entries;

  const totalHours = entries.reduce((s, e) => s + Number(e.hours || 0), 0);
  const daysWorked = new Set(entries.map((e) => e.spent_on).filter(Boolean)).size;
  const avgPerDay = daysWorked ? totalHours / daysWorked : 0;
  const projectsCount = new Set(entries.map((e) => e.project_name).filter(Boolean)).size;

  const kpi = document.getElementById("report-kpi-grid");
  if (kpi) {
    kpi.innerHTML = `
      <div class="report-kpi-card"><p class="label">Всего часов</p><p class="value">${formatReportHours(totalHours)}</p></div>
      <div class="report-kpi-card"><p class="label">Дней с записями</p><p class="value">${daysWorked}</p></div>
      <div class="report-kpi-card"><p class="label">Среднее в день</p><p class="value">${formatReportHours(avgPerDay)}</p></div>
      <div class="report-kpi-card"><p class="label">Проектов</p><p class="value">${projectsCount}</p></div>`;
  }

  const byDay = new Map();
  entries.forEach((e) => {
    if (!e.spent_on) return;
    byDay.set(e.spent_on, (byDay.get(e.spent_on) || 0) + Number(e.hours || 0));
  });
  const days = eachDateInclusive(from, to);
  const maxHours = Math.max(0, ...days.map((d) => byDay.get(d) || 0), 0.0001);
  const chart = document.getElementById("report-chart-bars");
  if (chart) {
    chart.innerHTML = days
      .map((d) => {
        const h = byDay.get(d) || 0;
        const barH = h > 0 ? Math.max(2, Math.round((h / maxHours) * 90)) : 2;
        const dayNum = d.slice(8, 10);
        return `<div class="report-chart-bar-col" title="${escapeHtml(d)}: ${formatReportHours(h)} ч">
          <div class="report-chart-bar" style="height:${barH}px"></div>
          <div class="report-chart-bar-label">${dayNum}</div>
        </div>`;
      })
      .join("");
  }

  renderReportBreakdown(entries, totalHours);
  renderReportDetails(entries);
}

function applyReportPreset(preset) {
  reportActivePreset = preset;
  document.querySelectorAll(".report-preset-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-report-preset") === preset);
  });
  const range = getReportPeriodRange(preset);
  const fromEl = document.getElementById("report-from");
  const toEl = document.getElementById("report-to");
  if (fromEl) fromEl.value = range.from;
  if (toEl) toEl.value = range.to;
}

function initReportPeriodPicker() {
  const host = document.getElementById("report-period-picker-host");
  const fromEl = document.getElementById("report-from");
  const toEl = document.getElementById("report-to");
  if (!host || !fromEl || !toEl || !window.PeriodPicker?.mountPeriodPicker) return;
  window.PeriodPicker.mountPeriodPicker({
    host,
    fromInput: fromEl,
    toInput: toEl,
    onChange: () => {
      reportActivePreset = null;
      document.querySelectorAll(".report-preset-btn").forEach((btn) => btn.classList.remove("active"));
    },
    onApply: async () => {
      reportActivePreset = null;
      document.querySelectorAll(".report-preset-btn").forEach((btn) => btn.classList.remove("active"));
      await loadTimeReport();
    },
  });
}

function initTrackerPeriodPicker() {
  const host = document.getElementById("tracker-period-picker-host");
  const fromEl = document.getElementById("tracker-custom-from");
  const toEl = document.getElementById("tracker-custom-to");
  if (!host || !fromEl || !toEl || !window.PeriodPicker?.mountPeriodPicker) return;
  trackerPeriodPickerRef = window.PeriodPicker.mountPeriodPicker({
    host,
    fromInput: fromEl,
    toInput: toEl,
    hideToggle: true,
    onApply: async () => {
      if (!applyTrackerCustomPeriodFromPanel()) return;
      await refreshTrackerSessionsTable();
    },
  });
}

function exportReportCsv() {
  const from = document.getElementById("report-from")?.value || "";
  const to = document.getElementById("report-to")?.value || "";
  const header = ["Дата", "Проект", "Задача", "Часы", "Вид деятельности", "ФИО заказчика", "Комментарий"];
  const lines = [header.join(";")];
  reportEntriesCache.forEach((e) => {
    const cells = [
      e.spent_on || "",
      e.project_name || "",
      e.issue_id != null ? String(e.issue_id) : "",
      String(e.hours ?? ""),
      e.activity_name || "",
      e.customer_name || "",
      e.comments || "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
    lines.push(cells.join(";"));
  });
  const csv = `\uFEFF${lines.join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `трудозатраты_${from}_${to}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("report-back-btn")?.addEventListener("click", () => {
  showIssuesView();
  renderIssuesList();
});

document.querySelectorAll(".report-preset-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const preset = btn.getAttribute("data-report-preset");
    if (!preset) return;
    applyReportPreset(preset);
    await loadTimeReport();
  });
});

document.getElementById("report-from")?.addEventListener("change", async () => {
  reportActivePreset = null;
  document.querySelectorAll(".report-preset-btn").forEach((b) => b.classList.remove("active"));
  await loadTimeReport();
});

document.getElementById("report-to")?.addEventListener("change", async () => {
  reportActivePreset = null;
  document.querySelectorAll(".report-preset-btn").forEach((b) => b.classList.remove("active"));
  await loadTimeReport();
});

document.getElementById("report-breakdown-tabs")?.addEventListener("click", (event) => {
  const tab = event.target.closest(".report-tab");
  if (!tab) return;
  reportGroupMode = tab.getAttribute("data-report-group") || "project";
  document.querySelectorAll(".report-tab").forEach((t) => t.classList.toggle("active", t === tab));
  const totalHours = reportEntriesCache.reduce((s, e) => s + Number(e.hours || 0), 0);
  renderReportBreakdown(reportEntriesCache, totalHours);
});

document.getElementById("report-breakdown-list")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-report-issue]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-report-issue"));
  if (!issueId) return;
  if (typeof window.__openIssueById === "function") {
    window.__openIssueById(issueId);
  } else {
    openIssueDetails(issueId).catch((error) => setStatus(error.message, "error"));
  }
});

document.getElementById("report-export-csv")?.addEventListener("click", () => {
  exportReportCsv();
});

document.getElementById("report-detail-list")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-report-issue]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-report-issue"));
  if (!issueId) return;
  if (typeof window.__openIssueById === "function") {
    window.__openIssueById(issueId);
  } else {
    openIssueDetails(issueId).catch((error) => setStatus(error.message, "error"));
  }
});

activityBackBtn?.addEventListener("click", () => {
  closeActivityTypePanel();
  document.getElementById("view-list-btn")?.classList.add("active");
  document.getElementById("view-agile-btn")?.classList.remove("active");
  showIssuesView();
  renderIssuesList();
});

activityFeedLimitSelect?.addEventListener("change", () => {
  activityFeedPrefs = window.ActivityFeedSettings?.saveSettings({
    ...activityFeedPrefs,
    limit: Number(activityFeedLimitSelect.value),
  }) || activityFeedPrefs;
  refreshActivityFeedView().catch((error) => {
    setStatus(error.message || "Не удалось обновить ленту", "error");
  });
});

activityTypeTrigger?.addEventListener("click", (event) => {
  event.stopPropagation();
  const willOpen = activityTypePanel?.classList.contains("hidden");
  closeActivityTypePanel();
  if (willOpen) {
    activityTypePanel?.classList.remove("hidden");
    activityTypeTrigger?.setAttribute("aria-expanded", "true");
  }
});

activityTypeList?.addEventListener("change", (event) => {
  const input = event.target.closest("[data-activity-group]");
  if (!input) return;
  const checked = Array.from(activityTypeList.querySelectorAll("[data-activity-group]:checked")).map((el) =>
    el.getAttribute("data-activity-group"),
  );
  activityFeedPrefs = window.ActivityFeedSettings?.saveSettings({
    ...activityFeedPrefs,
    groups: checked,
  }) || activityFeedPrefs;
  syncActivityFeedToolbar();
  refreshActivityFeedView().catch((error) => {
    setStatus(error.message || "Не удалось обновить ленту", "error");
  });
});

activityResetFiltersBtn?.addEventListener("click", () => {
  activityFeedPrefs = window.ActivityFeedSettings?.resetSettings?.() || activityFeedPrefs;
  syncActivityFeedToolbar();
  renderActivityTypeOptions();
  refreshActivityFeedView().catch((error) => {
    setStatus(error.message || "Не удалось обновить ленту", "error");
  });
});

activityMarkAllSeenBtn?.addEventListener("click", async () => {
  if (!activityMarkAllSeenBtn) return;
  const prevText = activityMarkAllSeenBtn.textContent;
  activityMarkAllSeenBtn.disabled = true;
  activityMarkAllSeenBtn.textContent = "Сохраняем…";
  try {
    const result = await window.desktopApi.markActivitySeen({ all: true });
    applyActivityBadge(result?.unseenCount);
    await refreshActivityFeedView();
  } catch (error) {
    setStatus(error.message || "Не удалось отметить ленту просмотренной", "error");
  } finally {
    activityMarkAllSeenBtn.disabled = false;
    activityMarkAllSeenBtn.textContent = prevText;
  }
});

activityFeedList?.addEventListener("click", async (event) => {
  const item = event.target.closest("[data-activity-id]");
  if (!item) return;
  const activityId = Number(item.getAttribute("data-activity-id"));
  const issueId = Number(item.getAttribute("data-issue-id"));
  if (!issueId) return;
  try {
    if (activityId) {
      await window.desktopApi.markActivitySeen({ ids: [activityId] });
    }
  } catch (error) {
    console.error("markActivitySeen failed:", error.message);
  }
  await refreshActivityBadgeOnly();
  openIssueDetails(issueId).catch((error) => setStatus(error.message, "error"));
});

document.addEventListener("click", (event) => {
  if (!activityTypePanel || activityTypePanel.classList.contains("hidden")) return;
  if (event.target.closest("#activity-type-chip")) return;
  closeActivityTypePanel();
});

document.getElementById("tracker-back-btn")?.addEventListener("click", () => {
  closeTrackerIssuePicker();
  if (trackerCameFromAgile && typeof window.__showAgileView === "function") {
    window.__showAgileView();
    return;
  }
  document.getElementById("view-list-btn")?.classList.add("active");
  document.getElementById("view-agile-btn")?.classList.remove("active");
  showIssuesView();
  renderIssuesList();
});

(function wireTrackerIssuePicker() {
  const modal = document.getElementById("tracker-issue-picker-modal");
  if (!modal) return;
  const els = trackerIssuePickerEls();

  const close = () => closeTrackerIssuePicker();
  document.getElementById("tracker-issue-picker-close")?.addEventListener("click", close);
  document.getElementById("tracker-issue-picker-cancel")?.addEventListener("click", close);
  modal.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    trackerIssuePickerBackdropDown = event.target === modal;
  });
  modal.addEventListener("mouseup", (event) => {
    if (event.button !== 0) {
      trackerIssuePickerBackdropDown = false;
      return;
    }
    if (trackerIssuePickerBackdropDown && event.target === modal) close();
    trackerIssuePickerBackdropDown = false;
  });
  document.getElementById("tracker-issue-picker-select")?.addEventListener("click", () => {
    confirmTrackerIssuePicker();
  });
  document.getElementById("tracker-issue-picker-fav-btn")?.addEventListener("click", () => {
    trackerIssuePickerState.favoritesOnly = !trackerIssuePickerState.favoritesOnly;
    syncTrackerPickerFavButton();
    refreshTrackerPickerList().catch((error) => {
      setStatus(error?.message || "Не удалось обновить список", "error");
    });
  });

  els.tbody?.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-issue-id]");
    if (!row) return;
    setTrackerPickerSelection(row.getAttribute("data-issue-id"));
  });
  els.tbody?.addEventListener("dblclick", (event) => {
    const row = event.target.closest("tr[data-issue-id]");
    if (!row) return;
    setTrackerPickerSelection(row.getAttribute("data-issue-id"));
    confirmTrackerIssuePicker();
  });

  els.search?.addEventListener("input", () => {
    clearTimeout(trackerIssuePickerState.searchTimer);
    trackerIssuePickerState.searchTimer = setTimeout(() => {
      refreshTrackerPickerList().catch((error) => {
        setStatus(error?.message || "Не удалось загрузить список задач", "error");
      });
    }, 180);
  });

  els.project?.addEventListener("change", async () => {
    const projectId = els.project.value !== "all" ? Number(els.project.value) : null;
    try {
      await refreshTrackerPickerPeople(projectId);
      await refreshTrackerPickerList();
    } catch (error) {
      setStatus(error?.message || "Не удалось обновить список задач", "error");
    }
  });

  ["assignee", "author", "status"].forEach((key) => {
    els[key]?.addEventListener("change", () => {
      refreshTrackerPickerList().catch((error) => {
        setStatus(error?.message || "Не удалось загрузить список задач", "error");
      });
    });
  });

  modal.addEventListener("keydown", (event) => {
    if (!isTrackerIssuePickerOpen()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeTrackerIssuePicker();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveTrackerPickerSelection(1);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveTrackerPickerSelection(-1);
      return;
    }
    if (event.key === "Enter" && !event.target.closest("select")) {
      event.preventDefault();
      confirmTrackerIssuePicker();
    }
  });
})();

async function trackerDuplicateRow(sourceEntryId) {
  const row = (trackerSessionsCache || []).find((r) => Number(r.id) === Number(sourceEntryId));
  if (!row || !trackerRowIsEditable(row) || Number(row.is_running)) {
    throw new Error("Эту строку нельзя скопировать");
  }
  await ensureTimeEntryActivitiesReady();
  const result = await window.desktopApi.trackerCreateDraft({
    spentOn: row.spent_on || trackerTodayIso(),
    issueId: row.issue_id || undefined,
    projectId: row.project_id || undefined,
    projectName: row.project_name || "",
    activityId: row.activity_id || getDefaultActivityId(),
    hours: Number(row.hours) || 0,
    comments: row.comments || "",
    customerName: row.customer_name || "",
    allowEmpty: !row.issue_id,
    entryKind: "work",
    entrySource: "manual",
    startedAt: row.started_at || undefined,
    endedAt: row.ended_at || undefined,
  });
  if (!result?.ok || !result.entry) throw new Error("Не удалось скопировать строку");
  await refreshTrackerSessionsTable();
  const newRow = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${result.entry.id}"]`);
  newRow?.scrollIntoView({ block: "nearest" });
  return result.entry;
}

async function trackerAddEmptyRow({ startTimer = false } = {}) {
  await ensureTimeEntryActivitiesReady();
  const activityId = getDefaultActivityId();
  const result = await window.desktopApi.trackerCreateDraft({
    spentOn: trackerTodayIso(),
    activityId,
    hours: 0,
    allowEmpty: true,
    comments: "",
    entryKind: "work",
    entrySource: startTimer ? "timer" : "manual",
  });
  if (!result?.ok || !result.entry) throw new Error("Не удалось создать строку");
  if (startTimer) {
    const started = await window.desktopApi.trackerStartEntry({ entryId: result.entry.id });
    if (!started?.ok) throw new Error(started?.reason || "Не удалось запустить таймер");
  }
  await refreshTrackerSessionsTable();
  const newRow = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${result.entry.id}"]`);
  newRow?.scrollIntoView({ block: "nearest" });
  return result.entry;
}

document.getElementById("tracker-add-row-btn")?.addEventListener("click", async () => {
  const btn = document.getElementById("tracker-add-row-btn");
  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Добавляем…";
  try {
    await trackerAddEmptyRow({ startTimer: false });
    showAppToast("Строка добавлена", "success");
  } catch (error) {
    setStatus(error.message || "Не удалось добавить строку", "error");
    showAppToast(error.message || "Ошибка", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

document.getElementById("tracker-new-timer-btn")?.addEventListener("click", async () => {
  const btn = document.getElementById("tracker-new-timer-btn");
  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Запуск…";
  try {
    await trackerAddEmptyRow({ startTimer: true });
    showAppToast("Таймер запущен", "success");
  } catch (error) {
    setStatus(error.message || "Не удалось запустить таймер", "error");
    showAppToast(error.message || "Ошибка", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

function trackerRowEls(entryId) {
  const tr = document.querySelector(`#tracker-sessions-host tr[data-entry-id="${entryId}"]`);
  if (!tr) return null;
  return {
    tr,
    date: tr.querySelector(".tracker-cell-date"),
    project: tr.querySelector(".tracker-cell-project"),
    projectId: tr.querySelector(".tracker-cell-project-id"),
    issue: tr.querySelector(".tracker-cell-issue"),
    issueId: tr.querySelector(".tracker-cell-issue-id"),
    start: tr.querySelector(".tracker-cell-start"),
    end: tr.querySelector(".tracker-cell-end"),
    hours: tr.querySelector(".tracker-cell-hours-input") || tr.querySelector(".tracker-cell-hours"),
    face: tr.querySelector(".tracker-timer-face"),
    activity: tr.querySelector(".tracker-cell-activity"),
    comment: tr.querySelector(".tracker-cell-comment"),
    customer: tr.querySelector(".tracker-cell-customer"),
  };
}

function applyBananaRangeSync({ startHm, endHm, hours, source }) {
  let start = startHm || null;
  let end = endHm || null;
  let h = hours;
  if (source === "hours") {
    if (h == null) return { start, end, hours: h };
    if (start && end) end = trackerHmAddHours(start, h);
    else if (start) end = trackerHmAddHours(start, h);
    else if (end) start = trackerHmSubHours(end, h);
    return { start, end, hours: h };
  }
  /* Правка начала/конца: если оба заданы — всегда пересчитываем трудозатраты */
  if (source === "start" || source === "end") {
    if (start && end) {
      const computed = hoursFromTrackerTimeFields(trackerTodayIso(), start, end);
      if (computed != null) h = computed;
      return { start, end, hours: h };
    }
    if (source === "start" && start && h != null && h > 0) {
      end = trackerHmAddHours(start, h);
    } else if (source === "end" && end && h != null && h > 0) {
      start = trackerHmSubHours(end, h);
    }
    return { start, end, hours: h };
  }
  return { start, end, hours: h };
}

async function persistTrackerRowTimes(entryId, { source = "range" } = {}) {
  const els = trackerRowEls(entryId);
  if (!els?.date) return;
  const dateIso = els.date.value || trackerTodayIso();
  const cached = trackerSessionsCache.find((r) => Number(r.id) === Number(entryId));
  const hasTimeInputs = Boolean(els.start || els.end);

  if (!hasTimeInputs && trackerEntryMode !== "range") {
    const patch = { spentOn: dateIso };
    if (els.hours && "value" in els.hours) {
      const hours = parseTrackerHoursInput(els.hours.value);
      if (hours != null) patch.hours = hours;
    } else if (cached && Number(cached.hours) >= 0) {
      /* keep hours */
    }
    await saveTrackerRowPatch(entryId, patch);
    return;
  }

  let startNorm = normalizeTrackerHm(els.start?.value || "");
  let endNorm = normalizeTrackerHm(els.end?.value || "");
  let hours = parseTrackerHoursInput(els.hours?.value ?? els.hours?.textContent);

  if (trackerEntryMode === "range") {
    const syncSource =
      source === "hours" || source === "end" || source === "start" ? source : "end";
    const synced = applyBananaRangeSync({
      startHm: startNorm,
      endHm: endNorm,
      hours,
      source: syncSource,
    });
    startNorm = synced.start;
    endNorm = synced.end;
    hours = synced.hours;
    if (startNorm && endNorm) {
      const computed = hoursFromTrackerTimeFields(dateIso, startNorm, endNorm);
      if (computed != null && syncSource !== "hours") hours = computed;
    }
    if (hours != null) hours = applyTrackerHoursRounding(hours);
    if (els.start) els.start.value = startNorm || "";
    if (els.end) els.end.value = endNorm || "";
    if (els.hours && "value" in els.hours && hours != null) {
      els.hours.value =
        window.TrackerHours?.formatTrackerHoursValue?.(hours) ?? Number(hours || 0).toFixed(2);
    }
  } else {
    if (els.start && startNorm) els.start.value = startNorm;
    if (els.end && endNorm) els.end.value = endNorm;
    if (hours == null) {
      hours = hoursFromTrackerTimeFields(dateIso, startNorm, endNorm);
    }
    if (hours != null) hours = applyTrackerHoursRounding(hours);
    if (els.hours && "value" in els.hours && hours != null) {
      els.hours.value =
        window.TrackerHours?.formatTrackerHoursValue?.(hours) ?? Number(hours || 0).toFixed(2);
    }
  }

  const patch = {
    spentOn: dateIso,
    startedAt: startNorm ? trackerIsoFromDateHm(dateIso, startNorm) : null,
    endedAt: endNorm ? trackerIsoFromDateHm(dateIso, endNorm) : null,
    hours: hours != null && hours > 0 ? hours : 0,
  };
  await saveTrackerRowPatch(entryId, patch);
}

async function persistTrackerHours(entryId) {
  const els = trackerRowEls(entryId);
  if (!els) return;
  const raw = String(els.hours?.value ?? els.hours?.textContent ?? "").trim();
  let hours = parseTrackerHoursInput(raw);
  if (hours == null && raw === "") hours = 0;
  if (hours == null) {
    setStatus("Укажите корректные трудозатраты (число часов)", "error");
    if (els.hours?.classList) els.hours.classList.add("is-invalid");
    return;
  }
  if (els.hours?.classList) els.hours.classList.remove("is-invalid");
  hours = applyTrackerHoursRounding(hours);
  const formatted = window.TrackerHours?.formatTrackerHoursValue?.(hours) ?? hours.toFixed(2);
  if (els.hours && "value" in els.hours) els.hours.value = formatted;

  if (trackerEntryMode === "range") {
    await persistTrackerRowTimes(entryId, { source: "hours" });
    return;
  }

  if (trackerEntryMode === "timer") {
    const row = trackerSessionsCache.find((r) => Number(r.id) === Number(entryId));
    const running = Number(row?.is_running);
    if (running) {
      const startedAt = new Date(Date.now() - hours * 3600000).toISOString();
      await saveTrackerRowPatch(entryId, { startedAt, hours }, { refresh: true });
      return;
    }
    const dateIso = els.date?.value || row?.spent_on || trackerTodayIso();
    const startHm = trackerHmFromIso(row?.started_at) || normalizeTrackerHm(els.start?.value || "");
    const patch = { hours, spentOn: dateIso };
    if (startHm) {
      patch.startedAt = trackerIsoFromDateHm(dateIso, startHm);
      patch.endedAt = trackerIsoFromDateHm(dateIso, trackerHmAddHours(startHm, hours));
    }
    await saveTrackerRowPatch(entryId, patch, { refresh: true });
    return;
  }

  /* hours-only */
  const dateIso = els.date?.value || trackerTodayIso();
  await saveTrackerRowPatch(entryId, { hours, spentOn: dateIso });
  if (els.hours && "value" in els.hours) {
    els.hours.value = window.TrackerHours?.formatTrackerHoursValue?.(hours) ?? hours.toFixed(2);
  }
}

document.getElementById("tracker-sessions-host")?.addEventListener("contextmenu", (event) => {
  const row = event.target.closest("tr[data-entry-id]");
  if (!row) return;
  const allowCopyRow = window.TrackerRowMenu?.shouldOpenTrackerCopyRowMenu
    ? window.TrackerRowMenu.shouldOpenTrackerCopyRowMenu(event.target, {
        clientX: event.clientX,
        clientY: event.clientY,
      })
    : !event.target.closest("input, textarea, select, button, a");
  if (!allowCopyRow) return;
  const entryId = Number(row.getAttribute("data-entry-id"));
  const cached = (trackerSessionsCache || []).find((r) => Number(r.id) === entryId);
  if (!cached || !trackerRowIsEditable(cached) || Number(cached.is_running)) return;
  event.preventDefault();
  openTrackerRowContextMenu(entryId, event.clientX, event.clientY);
});

document.getElementById("tracker-copy-row-btn")?.addEventListener("click", async () => {
  const entryId = trackerContextEntryId;
  closeTrackerRowContextMenu();
  if (!entryId) return;
  const btn = document.getElementById("tracker-copy-row-btn");
  if (btn) {
    btn.disabled = true;
    const prev = btn.textContent;
    btn.textContent = "Копируем…";
    try {
      await trackerDuplicateRow(entryId);
      showAppToast("Строка скопирована", "success");
    } catch (error) {
      setStatus(error.message || "Не удалось скопировать строку", "error");
      showAppToast(error.message || "Ошибка", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = prev;
    }
  }
});

document.getElementById("tracker-sessions-host")?.addEventListener("click", async (event) => {
  const stopBtn = event.target.closest("[data-stop-entry]");
  if (stopBtn) {
    const entryId = Number(stopBtn.getAttribute("data-stop-entry"));
    stopBtn.disabled = true;
    try {
      await window.desktopApi.trackerStop({ entryId });
      showAppToast("Таймер остановлен", "success");
      await refreshTrackerSessionsTable();
    } catch (error) {
      setStatus(error.message || "Стоп не удался", "error");
    } finally {
      stopBtn.disabled = false;
    }
    return;
  }

  const deleteBtn = event.target.closest("[data-delete-entry]");
  if (deleteBtn) {
    const entryId = Number(deleteBtn.getAttribute("data-delete-entry"));
    const ok = await confirmAction("Удалить эту строку трудозатрат? Она ещё не отправлена в Redmine.");
    if (!ok) return;
    deleteBtn.disabled = true;
    try {
      const result = await window.desktopApi.trackerDiscardEntry({ entryId });
      if (!result?.ok) throw new Error(result?.reason || "Не удалось удалить");
      showAppToast("Строка удалена", "success");
      await refreshTrackerSessionsTable();
    } catch (error) {
      setStatus(error.message || "Удаление не удалось", "error");
      showAppToast(error.message || "Удаление не удалось", "error");
    } finally {
      deleteBtn.disabled = false;
    }
    return;
  }

  const rowStart = event.target.closest("[data-row-start]");
  if (rowStart) {
    const entryId = Number(rowStart.getAttribute("data-row-start"));
    rowStart.disabled = true;
    try {
      const result = await window.desktopApi.trackerStartEntry({ entryId });
      if (!result?.ok) throw new Error(result?.reason || "Не удалось запустить");
      showAppToast("Таймер запущен", "success");
      await refreshTrackerSessionsTable();
    } catch (error) {
      setStatus(error.message || "Старт не удался", "error");
    } finally {
      rowStart.disabled = false;
    }
    return;
  }

  const rangeStart = event.target.closest("[data-range-start]");
  if (rangeStart) {
    const entryId = Number(rangeStart.getAttribute("data-range-start"));
    const els = trackerRowEls(entryId);
    const nowHm = typeof trackerNowTimeValue === "function" ? trackerNowTimeValue() : new Date().toTimeString().slice(0, 5);
    if (els?.start) els.start.value = nowHm;
    try {
      await persistTrackerRowTimes(entryId, { source: "start" });
      showAppToast("Начало записано", "success");
    } catch {
      /* status already set */
    }
    return;
  }

  const rangeStop = event.target.closest("[data-range-stop]");
  if (rangeStop) {
    const entryId = Number(rangeStop.getAttribute("data-range-stop"));
    const els = trackerRowEls(entryId);
    const nowHm = typeof trackerNowTimeValue === "function" ? trackerNowTimeValue() : new Date().toTimeString().slice(0, 5);
    if (els?.end) els.end.value = nowHm;
    if (els?.start && !String(els.start.value || "").trim()) els.start.value = nowHm;
    try {
      await persistTrackerRowTimes(entryId, { source: "end" });
      showAppToast("Окончание записано", "success");
    } catch {
      /* status already set */
    }
    return;
  }

  const rowEndNow = event.target.closest("[data-row-end-now]");
  if (rowEndNow) {
    const entryId = Number(rowEndNow.getAttribute("data-row-end-now"));
    const els = trackerRowEls(entryId);
    if (els?.end) els.end.value = trackerNowTimeValue();
    if (els?.start && !els.start.value) els.start.value = trackerNowTimeValue();
    try {
      await persistTrackerRowTimes(entryId, { source: "end" });
      showAppToast("Время записано", "success");
    } catch {
      /* status already set */
    }
    return;
  }

  const dayCb = event.target.closest(".tracker-day-cb");
  if (dayCb) {
    const day = dayCb.getAttribute("data-day");
    const checked = dayCb.checked;
    document
      .querySelectorAll(`#tracker-sessions-host tr[data-entry-id]`)
      .forEach((tr) => {
        const dateInput = tr.querySelector(".tracker-cell-date");
        const spent =
          dateInput?.value ||
          tr.querySelector(".tracker-date-text")?.textContent?.trim() ||
          "";
        if (spent !== day) return;
        const cb = tr.querySelector(".tracker-session-cb");
        if (cb) cb.checked = checked;
      });
    return;
  }

  const browseBtn = event.target.closest("[data-tracker-browse]");
  if (browseBtn) {
    const entryId = Number(browseBtn.getAttribute("data-tracker-browse"));
    if (entryId) {
      openTrackerIssuePicker(entryId).catch((error) => {
        setStatus(error?.message || "Не удалось открыть список задач", "error");
      });
    }
    return;
  }

  const btn = event.target.closest("[data-tracker-issue]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-tracker-issue"));
  if (!issueId) return;
  window.__returnToAgile = false;
  window.__returnToTracker = true;
  if (typeof window.__openIssueById === "function") window.__openIssueById(issueId);
  else openIssueDetails(issueId).catch((error) => setStatus(error.message, "error"));
});

document.getElementById("tracker-sessions-host")?.addEventListener("change", async (event) => {
  const target = event.target;
  const entryId = Number(target.getAttribute("data-entry-id"));
  if (!entryId) return;

  if (target.classList.contains("tracker-cell-date")) {
    try {
      await persistTrackerRowTimes(entryId);
      if (trackerPeriodUsesDayGroups()) await refreshTrackerSessionsTable();
    } catch {
      /* status set */
    }
    return;
  }

  if (target.classList.contains("tracker-cell-activity")) {
    saveTrackerRowPatch(entryId, { activityId: Number(target.value) || null }).catch(() => {});
    return;
  }

  if (target.classList.contains("tracker-cell-start") || target.classList.contains("tracker-cell-end")) {
    const source = target.classList.contains("tracker-cell-end") ? "end" : "start";
    persistTrackerRowTimes(entryId, { source }).catch(() => {});
  }

  if (target.classList.contains("tracker-cell-hours-input")) {
    persistTrackerHours(entryId).catch(() => {});
  }
});

document.getElementById("tracker-sessions-host")?.addEventListener("blur", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const entryId = Number(target.getAttribute("data-entry-id"));
  if (!entryId) return;

  if (target.classList.contains("tracker-cell-start") || target.classList.contains("tracker-cell-end")) {
    const norm = normalizeTrackerHm(target.value);
    if (norm) target.value = norm;
    const source = target.classList.contains("tracker-cell-end") ? "end" : "start";
    persistTrackerRowTimes(entryId, { source }).catch(() => {});
    return;
  }

  if (target.classList.contains("tracker-cell-hours-input")) {
    const hours = parseTrackerHoursInput(target.value);
    if (hours != null) {
      target.value = window.TrackerHours?.formatTrackerHoursValue?.(hours) ?? hours.toFixed(2);
    } else if (!String(target.value || "").trim()) {
      target.value = "0.00";
    }
    persistTrackerHours(entryId).catch(() => {});
  }
}, true);

document.getElementById("tracker-sessions-host")?.addEventListener("keydown", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  if (target.classList.contains("tracker-cell-hours-input")) {
    if (window.TrackerHours?.shouldBlockHoursDecimalDelete?.(target, event)) {
      event.preventDefault();
    }
    return;
  }

  if (!target.classList.contains("tracker-cell-project") && !target.classList.contains("tracker-cell-issue")) {
    return;
  }

  const host = getTrackerSuggestHostForInput(target);
  if (event.key === "ArrowDown") {
    if (host?._trackerSuggest?.items?.length) {
      event.preventDefault();
      moveTrackerSuggestSelection(host, 1);
    }
    return;
  }
  if (event.key === "ArrowUp") {
    if (host?._trackerSuggest?.items?.length) {
      event.preventDefault();
      moveTrackerSuggestSelection(host, -1);
    }
    return;
  }
  if (event.key === "Enter") {
    if (host?._trackerSuggest?.items?.length) {
      event.preventDefault();
      pickTrackerSuggestItem(host);
    }
    return;
  }
  if (event.key === "Escape") {
    if (host) {
      event.preventDefault();
      host.classList.add("hidden");
      clearTrackerSuggestFixedPosition(host);
      host._trackerSuggest = null;
    }
  }
});

document.getElementById("tracker-sessions-host")?.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement && target.classList.contains("tracker-cell-hours-input")) {
    const normalized = window.TrackerHours?.normalizeTrackerHoursTyping?.(target.value) ?? target.value;
    if (normalized !== target.value) {
      const pos = target.selectionStart;
      target.value = normalized;
      if (pos != null) target.setSelectionRange(pos, pos);
    }
  }
  const entryId = Number(target.getAttribute("data-entry-id"));
  if (!entryId) return;

  if (target.classList.contains("tracker-cell-comment")) {
    target.classList.remove("is-invalid");
    autoGrowTextarea(target);
    scheduleTrackerRowSave(entryId, () => ({ comments: target.value || "" }));
    return;
  }
  if (target.classList.contains("tracker-cell-customer")) {
    scheduleTrackerRowSave(entryId, () => ({ customerName: target.value || "" }));
    return;
  }

  if (target.classList.contains("tracker-cell-project")) {
    const tr = target.closest("tr");
    const idInput = tr?.querySelector(".tracker-cell-project-id");
    const suggest = tr?.querySelector('.tracker-cell-suggest[data-suggest="project"]');
    if (idInput) idInput.value = "";
    const issueInput = tr?.querySelector(".tracker-cell-issue");
    const issueIdInput = tr?.querySelector(".tracker-cell-issue-id");
    if (issueInput) {
      issueInput.value = "";
      issueInput.removeAttribute("title");
    }
    if (issueIdInput) issueIdInput.value = "";
    target.title = String(target.value || "").trim();
    tr?.querySelector(".tracker-issue-open-btn")?.remove();
    patchTrackerSessionsCache({ id: entryId, project_id: null, issue_id: null, issue_subject: "" });
    syncTrackerRowPushChrome(entryId);
    scheduleTrackerRowSave(entryId, () => ({
      projectId: null,
      projectName: target.value || "",
      issueId: null,
    }));
    clearTimeout(trackerProjectSuggestTimer);
    trackerProjectSuggestTimer = setTimeout(async () => {
      const items = await searchTrackerProjects(target.value);
      renderTrackerCellSuggest(suggest, items, (item) => {
        target.value = item.name || item.title || "";
        if (idInput) idInput.value = String(item.id);
        saveTrackerRowPatch(entryId, {
          projectId: Number(item.id),
          projectName: item.name || item.title || "",
        }).catch(() => {});
      });
    }, 180);
    return;
  }

  if (target.classList.contains("tracker-cell-issue")) {
    const tr = target.closest("tr");
    const idInput = tr?.querySelector(".tracker-cell-issue-id");
    const suggest = tr?.querySelector('.tracker-cell-suggest[data-suggest="issue"]');
    const projectId = Number(tr?.querySelector(".tracker-cell-project-id")?.value) || null;
    if (idInput) idInput.value = "";
    tr?.querySelector(".tracker-issue-open-btn")?.remove();
    target.title = String(target.value || "").trim();
    patchTrackerSessionsCache({ id: entryId, issue_id: null, issue_subject: "" });
    syncTrackerRowPushChrome(entryId);
    scheduleTrackerRowSave(entryId, () => ({ issueId: null }));
    clearTimeout(trackerIssueSuggestTimer);
    trackerIssueSuggestTimer = setTimeout(async () => {
      const items = await searchTrackerIssues(target.value, projectId);
      renderTrackerCellSuggest(suggest, items, (item) => {
        applyTrackerIssueToRow(entryId, item.issue || item);
      });
    }, 180);
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".tracker-suggest") || event.target.closest(".tracker-cell-suggest")) {
    return;
  }
  // Drag/selection started on suggest input or list — don't hide on mouseup outside.
  if (trackerSuggestPointerDownInside) {
    trackerSuggestPointerDownInside = false;
    return;
  }
  hideAllTrackerRowSuggests();
});

function repositionOpenTrackerSuggests() {
  document.querySelectorAll(".tracker-cell-suggest:not(.hidden)").forEach((el) => {
    positionTrackerSuggestList(el);
  });
}

window.addEventListener("resize", repositionOpenTrackerSuggests);
document.getElementById("tracker-sessions-host")?.addEventListener("scroll", hideAllTrackerRowSuggests, {
  passive: true,
});
document.getElementById("tracker-view-body")?.addEventListener("scroll", hideAllTrackerRowSuggests, {
  passive: true,
});

document.querySelectorAll("[data-tracker-period]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    const mode = btn.getAttribute("data-tracker-period") || "today";
    if (mode === "custom") {
      event.stopPropagation();
      const fromEl = document.getElementById("tracker-custom-from");
      const toEl = document.getElementById("tracker-custom-to");
      const today = trackerTodayIso();
      if (fromEl && !fromEl.value) fromEl.value = trackerCustomFrom || today;
      if (toEl && !toEl.value) toEl.value = trackerCustomTo || trackerCustomFrom || today;
      clearTrackerCustomPeriodErrors();
      trackerPeriodPickerRef?.openPanel?.();
      return;
    }
    trackerPeriodPickerRef?.closePanel?.();
    trackerPeriodMode = mode;
    document.querySelectorAll("[data-tracker-period]").forEach((el) => {
      el.classList.toggle("active", el === btn);
    });
    refreshTrackerSessionsTable().catch((error) => setStatus(error.message, "error"));
  });
});

["tracker-filter-project", "tracker-filter-issue", "tracker-filter-unpushed"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", () => {
    refreshTrackerSessionsTable().catch(() => {});
  });
  document.getElementById(id)?.addEventListener("change", () => {
    refreshTrackerSessionsTable().catch(() => {});
  });
});

document.getElementById("tracker-push-selected-btn")?.addEventListener("click", async () => {
  const btn = document.getElementById("tracker-push-selected-btn");
  const ids = [...document.querySelectorAll(".tracker-session-cb:checked")].map((el) => Number(el.value));
  if (!ids.length) {
    setStatus("Отметьте черновики для отправки", "error");
    showAppToast("Сначала отметьте черновики", "error");
    return;
  }

  await flushPendingTrackerRowSaves();

  document.querySelectorAll("#tracker-sessions-host .tracker-cell-comment.is-invalid").forEach((el) => {
    el.classList.remove("is-invalid");
  });

  const missingComments = [];
  for (const id of ids) {
    const els = trackerRowEls(id);
    const cached = trackerSessionsCache.find((r) => Number(r.id) === Number(id));
    const comments = els?.comment?.value ?? cached?.comments ?? "";
    if (!(window.IssueNav?.timeEntryCommentsReady?.(comments) ?? Boolean(String(comments || "").trim()))) {
      els?.comment?.classList.add("is-invalid");
      missingComments.push(id);
    }
  }
  if (missingComments.length) {
    const first = trackerRowEls(missingComments[0])?.comment;
    first?.focus();
    setStatus("Укажите комментарий в отмеченных строках — без него Redmine отклоняет трудозатраты.", "error");
    showAppToast("Укажите комментарий", "error");
    return;
  }

  btn.disabled = true;
  const prev = btn.textContent;
  btn.textContent = "Отправляем…";
  try {
    const results = await window.desktopApi.pushTrackerDrafts({ ids });
    const okCount = (results || []).filter((r) => r.ok).length;
    const fail = (results || []).filter((r) => !r.ok);
    if (fail.length) {
      fail.forEach((r) => {
        if (!String(r.reason || "").includes("комментар")) return;
        trackerRowEls(r.id)?.comment?.classList.add("is-invalid");
      });
    }
    if (fail.length && !okCount) {
      setStatus(`Не отправлено: ${fail.map((r) => r.reason).join("; ")}`, "error");
      showAppToast(fail[0].reason || "Не удалось отправить", "error");
    } else if (fail.length) {
      showAppToast(`Отправлено ${okCount}, ошибок ${fail.length}`, "info");
    } else {
      showAppToast(`Отправлено: ${okCount}`, "success");
    }
    await refreshTrackerSessionsTable();
  } catch (error) {
    setStatus(error.message || "Ошибка отправки", "error");
    showAppToast(error.message || "Ошибка отправки", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = prev;
  }
});

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-show-issue-time-entries]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-show-issue-time-entries"));
  if (!issueId) return;
  if (issuePreviewMode) reopenPreviewIssueId = issueId;
  closeIssuePreviewDrawer();
  showTimeEntriesView();
  renderTimeEntries({ issueId }).catch((error) => {
    setStatus(`Не удалось открыть трудозатраты: ${error.message}`, "error");
  });
});

backFromTimeBtn?.addEventListener("click", goBackFromTimeEntries);
addTimeEntryBtn?.addEventListener("click", () => {
  openTimeEntryModalForCreate(selectedIssueId || "");
});
timeEntryCancelBtn?.addEventListener("click", () => timeEntryModal.classList.add("hidden"));
timeEntryComments?.addEventListener("input", () => autoGrowTextarea(timeEntryComments));
timeEntryForm?.addEventListener("submit", saveTimeEntry);

timeEntriesList?.addEventListener("click", async (event) => {
  const editBtn = event.target.closest("[data-te-edit]");
  if (editBtn) {
    const entryId = Number(editBtn.getAttribute("data-te-edit"));
    try {
      const entries = await window.desktopApi.getTimeEntries({
        filters: timeEntriesActiveFilters || {},
      });
      const entry = (entries || []).find((e) => Number(e.id) === entryId);
      if (!entry) {
        setStatus("Запись не найдена.", "error");
        return;
      }
      if (!canEditTimeEntryLocally(entry)) {
        setStatus("Недостаточно прав для редактирования этой записи.", "error");
        return;
      }
      openTimeEntryModalForEdit(entry);
    } catch (error) {
      setStatus(`Не удалось открыть запись: ${error.message}`, "error");
    }
    return;
  }

  const deleteBtn = event.target.closest("[data-te-delete]");
  if (deleteBtn) {
    const entryId = Number(deleteBtn.getAttribute("data-te-delete"));
    const ok = await confirmAction("Удалить эту запись трудозатрат?");
    if (!ok) return;
    deleteBtn.disabled = true;
    try {
      const result = await window.desktopApi.deleteTimeEntry({ entryId });
      showAppToast(
        result.discarded
          ? "Ошибочная запись удалена"
          : result.offline
            ? "Удаление в очереди на отправку"
            : "Трудозатраты удалены",
        result.offline ? "info" : "success",
      );
      await loadIssues(false, { quiet: true }).catch(() => {});
      await renderTimeEntries(
        timeEntriesActiveFilters?.issueId ? { issueId: timeEntriesActiveFilters.issueId } : null,
      );
      const network = await window.desktopApi.getNetworkStatus().catch(() => null);
      if (network) updateSyncStatusBar(await window.desktopApi.getSyncStatus().catch(() => null), network);
    } catch (error) {
      showAppToast(error.message || "Не удалось удалить", "error");
      setStatus(`Не удалось удалить трудозатраты: ${error.message}`, "error");
    } finally {
      deleteBtn.disabled = false;
    }
  }
});

clearNotificationsButton?.addEventListener("click", async () => {
  notifications = [];
  syncFailureCount = 0;
  const syncFailuresList = document.getElementById("sync-failures-list");
  if (syncFailuresList) {
    syncFailuresList.classList.add("hidden");
    syncFailuresList.innerHTML = "";
  }
  try {
    await window.desktopApi.markSyncFailuresRead();
  } catch (error) {
    setStatus(error.message || "Не удалось отметить ошибки синхронизации", "error");
  }
  renderNotifications();
  notificationsPopover?.classList.add("hidden");
});

document.addEventListener("click", (event) => {
  if (!notificationsPopover || notificationsPopover.classList.contains("hidden")) return;
  if (event.target.closest("#notifications-popover")) return;
  if (event.target.closest('[data-global-nav="notifications"]')) return;
  notificationsPopover.classList.add("hidden");
});

notificationsList?.addEventListener("click", (event) => {
  const item = event.target.closest("[data-issue-id]");
  if (!item) return;
  const issueId = Number(item.getAttribute("data-issue-id"));
  if (!issueId) return;
  notificationsPopover?.classList.add("hidden");
  openIssueDetails(issueId);
});

document.getElementById("toggle-journal-sort-btn")?.addEventListener("click", (event) => {
  journalSortOrder = journalSortOrder === "desc" ? "asc" : "desc";
  event.target.textContent = journalSortOrder === "desc" ? "Сначала старые" : "Сначала новые";
  renderJournalsList(currentIssueJournals);
});

document.querySelector(".activity-tabs")?.addEventListener("click", (event) => {
  const tab = event.target.closest(".activity-tab");
  if (!tab) return;
  setActivityTab(tab.getAttribute("data-activity-tab"));
});

/** --- Tracker helpers / crash recovery --- */
function formatTrackerElapsed(totalSeconds) {
  const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

async function handleRecoveredTimer(state) {
  if (!state) return;
  const started = state.started_at ? new Date(state.started_at) : null;
  const hhmm = started && !Number.isNaN(started.getTime())
    ? `${String(started.getHours()).padStart(2, "0")}:${String(started.getMinutes()).padStart(2, "0")}`
    : "??:??";
  const issueId = state.issue_id || "?";
  const response = await window.desktopApi.confirm({
    title: "Восстановление таймера",
    message: `Похоже, таймер остался включён с прошлого раза (запущен ${hhmm}, задача #${issueId}).`,
    detail: "Продолжить — оставить таймер. Остановить сейчас — сохранить черновик. Отменить — сбросить без записи.",
    buttons: ["Отменить", "Остановить сейчас", "Продолжить"],
    cancelId: 0,
    confirmId: 2,
    defaultId: 2,
    returnIndex: true,
  });
  if (response === 2) {
    showAppToast("Таймер продолжен", "info");
    if (!document.getElementById("tracker-view")?.classList.contains("hidden")) {
      await refreshTrackerSessionsTable().catch(() => {});
    }
    return;
  }
  if (response === 1) {
    try {
      await window.desktopApi.trackerStop();
      showAppToast("Таймер остановлен, черновик сохранён", "success");
      if (!document.getElementById("tracker-view")?.classList.contains("hidden")) {
        await refreshTrackerSessionsTable().catch(() => {});
      }
    } catch (error) {
      setStatus(error.message || "Не удалось остановить таймер", "error");
    }
    return;
  }
  try {
    await window.desktopApi.trackerDiscard();
    showAppToast("Таймер отменён", "info");
  } catch (error) {
    setStatus(error.message || "Не удалось отменить таймер", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => setStatus(error.message, "error"));
});
