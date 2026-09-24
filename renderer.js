const form = document.getElementById("connection-form");
const urlInput = document.getElementById("redmine-url");
const apiKeyInput = document.getElementById("api-key");
const checkButton = document.getElementById("check-btn");
const saveButton = document.getElementById("save-btn");
const statusText = document.getElementById("status");
const syncReferenceButton = document.getElementById("sync-reference-btn");
const loadIssuesButton = document.getElementById("load-issues-btn");
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
const bulkStatusCancelBtn = document.getElementById("bulk-status-cancel-btn");
const issuesView = document.getElementById("issues-view");
const issuePage = document.getElementById("issue-page");
const issueTitle = document.getElementById("issue-title");
const issueParentChip = document.getElementById("issue-parent-chip");
const issueLinkLabel = document.getElementById("issue-link-label");
const copyIssueLinkButton = document.getElementById("copy-issue-link-btn");
const createSubtaskButton = document.getElementById("create-subtask-btn");
const issueMainMeta = document.getElementById("issue-main-meta");
const issueDescription = document.getElementById("issue-description");
const issueAttachments = document.getElementById("issue-attachments");
const issueJournals = document.getElementById("issue-journals");
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
const createAttachButton = document.getElementById("create-attach-btn");
const createAttachInput = document.getElementById("create-attach-input");
const createAttachmentsList = document.getElementById("create-attachments-list");
const createDropZone = document.getElementById("create-drop-zone");
const createParentRow = document.getElementById("create-parent-row");
const createParentLabel = document.getElementById("create-parent-label");
const closeConnectionButton = document.getElementById("close-connection-btn");
const editSubject = document.getElementById("edit-subject");
const editDescription = document.getElementById("edit-description");
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
const openLinkButton = document.getElementById("open-link-btn");
const toggleConnectionButton = document.getElementById("toggle-connection-btn");
const notificationsButton = document.getElementById("notifications-btn");
const notificationsCount = document.getElementById("notifications-count");
const notificationsList = document.getElementById("notifications-list");
const clearNotificationsButton = document.getElementById("clear-notifications-btn");
const notificationsPopover = document.getElementById("notifications-popover");
const issueScopeToggle = document.getElementById("issue-scope-toggle");
const syncStatusText = document.getElementById("sync-status-text");
const syncStatusDot = document.getElementById("sync-status-dot");
const syncNowButton = document.getElementById("sync-now-btn");
const offlineQueueBadge = document.getElementById("offline-queue-badge");
const syncProjectsList = document.getElementById("sync-projects-list");
const cacheDbSize = document.getElementById("cache-db-size");
const cacheIssuesCount = document.getElementById("cache-issues-count");
const settingsAutosyncToggle = document.getElementById("settings-autosync-toggle");
const autosyncInterval = document.getElementById("autosync-interval");
const deadlineAlertDaysSelect = document.getElementById("deadline-alert-days");
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
const timeEntriesBtn = document.getElementById("time-entries-btn");
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
const timeEntryEditId = document.getElementById("time-entry-edit-id");
const timeEntryCancelBtn = document.getElementById("time-entry-cancel-btn");
const timeEntryModalTitle = document.querySelector("#time-entry-modal h3");

let currentSettings = null;
let referenceData = null;
let loadedIssues = [];
let selectedIssueId = null;
let currentIssue = null;
let currentIssueJournals = [];
let currentIssueJournalLookups = { statuses: {}, users: {}, priorities: {}, trackers: {} };
let currentIssueAttachmentsMap = {};
let journalSortOrder = "desc";
let notifications = [];
let syncFailureCount = 0;
let currentIssueScope = "mine";
let autosyncTimer = null;
let networkOnline = true;
let createPendingAttachments = [];
let commentPendingAttachments = [];
let createParentIssueId = null;
let boardIssuesCache = [];
let boardStatusesCache = [];
/** null | "asc" | "desc" — client-side sort by due_date */
let issuesDueSortDir = null;
let issuesPrioritySortDir = null;
let issuesProjectSortDir = null;
let issuesAssigneeSortDir = null;
let issuesStatusSortDir = null;
let selectedIssueIds = new Set();
let pendingBulkStatusId = null;
let watcherPickerUsers = [];
/** Checked user ids in the watcher picker (survives search re-render). */
let watcherPickerSelectedIds = new Set();
let listInlinePopoverIssueId = null;
let listInlinePopoverKind = null;
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

/** Selected status ids for the multi-select. Empty = all statuses (no filter). */
let selectedStatusIds = [];
/** Selected priority ids for the multi-select. Empty = all priorities (no filter). */
let selectedPriorityIds = [];
/** Selected author ids for the multi-select. Empty = all authors (no filter). */
let selectedAuthorIds = [];
/** Authors available for the current project filter (from distinct issue authors). */
let filterAuthorsCache = [];

function getReferenceStatuses() {
  return referenceData?.issue_statuses || referenceData?.issueStatuses || [];
}

function getReferencePriorities() {
  return referenceData?.priorities || [];
}

function isClosedStatus(status) {
  if (!status) return false;
  if (status.is_closed) return true;
  return /решен|закрыт|resolved|closed|отклон|reject|done/i.test(String(status.name || ""));
}

function getOpenReferenceStatusIds() {
  return getReferenceStatuses()
    .filter((s) => !isClosedStatus(s))
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
  const all = getReferenceStatuses().map((s) => Number(s.id)).filter(Boolean);
  const selected = selectedStatusIds.slice();
  if (!selected.length || (all.length && selected.length === all.length)) return null;
  return selected;
}

function updateStatusFilterSummary() {
  if (!statusFilterSummary) return;
  const all = getReferenceStatuses();
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
  const statuses = getReferenceStatuses();
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
  const all = getReferenceStatuses().map((s) => Number(s.id)).filter(Boolean);
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

function setStatus(message, type = "info") {
  if (!statusText) return;
  statusText.textContent = message;
  statusText.className = `status ${type}`;
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

function getIssueScope() {
  return currentIssueScope || "mine";
}

/** Remembers assignee while scope «Мои» locks the filter to «Я». */
let assigneeBeforeMineLock = null;

function isFilterChipVisible(chipId) {
  if (window.FilterChips?.isChipVisible) return window.FilterChips.isChipVisible(chipId);
  const chip = document.getElementById(chipId);
  return !!(chip && !chip.classList.contains("chip-hidden"));
}

function syncAssigneeFilterForScope() {
  if (!assigneeSelect) return;
  const mine = getIssueScope() === "mine";

  if (mine) {
    if (!assigneeSelect.disabled) {
      assigneeBeforeMineLock = assigneeSelect.value || "me";
    }
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
    if (assigneeBeforeMineLock != null) {
      if (Array.from(assigneeSelect.options).some((o) => o.value === assigneeBeforeMineLock)) {
        assigneeSelect.value = assigneeBeforeMineLock;
      }
      assigneeBeforeMineLock = null;
    }
  }

  window.FilterChips?.updateAssigneeLock?.();
  window.FilterChips?.syncAssigneeChipLabel?.();
}

function setIssueScope(scope, { persist = true } = {}) {
  const next = ["mine", "authored", "watched", "all"].includes(scope) ? scope : "mine";
  currentIssueScope = next;
  issueScopeToggle?.querySelectorAll("[data-issue-scope]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-issue-scope") === next);
  });
  syncAssigneeFilterForScope();
  if (persist) persistUiState().catch(() => {});
}

function getFormValues() {
  const scope = getIssueScope();
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
      issueScope: scope,
      dueFrom: emptyOnly || !dueActive ? "" : dueFromInput?.value || "",
      dueTo: emptyOnly || !dueActive ? "" : dueToInput?.value || "",
      dueEmptyOnly: emptyOnly,
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

function closeListInlinePopover() {
  listInlinePopover?.classList.add("hidden");
  if (listInlinePopoverBody) listInlinePopoverBody.innerHTML = "";
  listInlinePopoverIssueId = null;
  listInlinePopoverKind = null;
}

function positionListInlinePopover(anchorEl) {
  if (!listInlinePopover || !anchorEl) return;
  listInlinePopover.classList.remove("hidden");
  const rect = anchorEl.getBoundingClientRect();
  const pad = 8;
  const width = listInlinePopover.offsetWidth || 220;
  const height = listInlinePopover.offsetHeight || 120;
  let left = rect.left;
  let top = rect.bottom + 6;
  if (left + width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - width - pad);
  if (top + height > window.innerHeight - pad) top = Math.max(pad, rect.top - height - 6);
  listInlinePopover.style.left = `${Math.max(pad, left)}px`;
  listInlinePopover.style.top = `${Math.max(pad, top)}px`;
}

async function patchIssueFields(issueId, patch, { successMessage } = {}) {
  const snapshot = applyOptimisticIssuePatch(issueId, patch);
  if (snapshot) renderIssuesList();

  try {
    const payload = getFormValues();
    const result = await window.desktopApi.updateIssue({ ...payload, issueId, patch });
    const toastText = result.offline
      ? "Сохранено локально — отправится при появлении сети"
      : successMessage || "Изменение сохранено";
    showAppToast(toastText, result.offline ? "info" : "success");

    // Подтянуть свежие данные из локальной БД (уже обновлена в main), без «Готово».
    await loadIssues(false, { quiet: true });

    if (selectedIssueId === issueId && issuePage && !issuePage.classList.contains("hidden")) {
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

let appToastTimer = null;

function showAppToast(message, type = "success") {
  const toast = document.getElementById("app-toast");
  if (!toast || !message) return;
  toast.textContent = message;
  toast.className = `app-toast is-visible is-${type === "error" ? "error" : type === "info" ? "success" : "success"}`;
  toast.classList.remove("hidden");
  if (appToastTimer) clearTimeout(appToastTimer);
  appToastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => {
      if (!toast.classList.contains("is-visible")) toast.classList.add("hidden");
    }, 200);
  }, 2200);
}

const {
  escapeHtml,
  textileToHtml,
  markupToRedmineHtml,
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
  const fieldLabels = {
    status_id: "Статус",
    assigned_to_id: "Исполнитель",
    priority_id: "Приоритет",
    tracker_id: "Трекер",
    done_ratio: "% готовности",
    start_date: "Дата начала",
    due_date: "Срок",
    estimated_hours: "Оценка",
    subject: "Тема",
    description: "Описание",
  };
  const name = fieldLabels[detail.name] || detail.name || detail.property || "Поле";
  let oldVal = detail.old_value;
  let newVal = detail.new_value;

  if (detail.name === "status_id") {
    oldVal = lookups.statuses[oldVal] || oldVal || "не задано";
    newVal = lookups.statuses[newVal] || newVal || "не задано";
  } else if (detail.name === "assigned_to_id") {
    oldVal = lookups.users[oldVal] || (oldVal === "" ? "не назначен" : oldVal || "не назначен");
    newVal = lookups.users[newVal] || (newVal === "" ? "не назначен" : newVal || "не назначен");
  } else if (detail.name === "priority_id") {
    oldVal = lookups.priorities[oldVal] || oldVal || "не задано";
    newVal = lookups.priorities[newVal] || newVal || "не задано";
  } else if (detail.name === "tracker_id") {
    oldVal = lookups.trackers[oldVal] || oldVal || "не задано";
    newVal = lookups.trackers[newVal] || newVal || "не задано";
  } else if (detail.name === "done_ratio") {
    oldVal = oldVal === "" || oldVal == null ? "0%" : `${oldVal}%`;
    newVal = newVal === "" || newVal == null ? "0%" : `${newVal}%`;
  } else if (detail.name === "start_date" || detail.name === "due_date") {
    oldVal = formatDateRu(oldVal);
    newVal = formatDateRu(newVal);
  }

  return `${name}: ${oldVal} → ${newVal}`;
}

function humanizeJournalBody(journal, lookups, attachmentsMap) {
  const details = (journal.details || [])
    .map((d) => humanizeJournalDetail(d, lookups))
    .filter(Boolean);
  if (journal.notes?.trim()) {
    let body = textileToHtml(journal.notes);
    if (window.renderTextileImages) body = window.renderTextileImages(body, attachmentsMap);
    return details.length ? `${body}<div class="journal-details muted">${details.join("; ")}</div>` : body;
  }
  if (details.length) return details.join("<br>");
  return '<span class="muted">Без комментария</span>';
}

function renderJournalsList(journals) {
  if (!issueJournals) return;
  const list = Array.isArray(journals) ? journals : [];
  const ordered = journalSortOrder === "desc" ? [...list].reverse() : list;
  issueJournals.innerHTML = ordered.length
    ? ordered
        .map((journal) => {
          const body = humanizeJournalBody(
            journal,
            currentIssueJournalLookups,
            currentIssueAttachmentsMap,
          );
          return `
          <div class="journal-item">
            <div class="journal-head"><strong>${escapeHtml(journal.user?.name || "Пользователь")}</strong> — ${new Date(journal.created_on).toLocaleString("ru-RU")}</div>
            <div class="journal-body">${body}</div>
          </div>
        `;
        })
        .join("")
    : `<span class="muted">История изменений отсутствует.</span>`;
  issueJournals.classList.toggle("muted", !ordered.length);
}

function setIssueEditingMode(on) {
  document.getElementById("issue-page")?.classList.toggle("editing", Boolean(on));
}

function rebindIssueEditFields() {
  editStatus = document.getElementById("edit-status");
  editAssignee = document.getElementById("edit-assignee");
  editPriority = document.getElementById("edit-priority");
  editDoneRatio = document.getElementById("edit-done-ratio");
  editDueDate = document.getElementById("edit-due-date");
  editEstimatedHours = document.getElementById("edit-estimated-hours");
}

function populateIssueEditSelects() {
  if (!referenceData) return;
  populateSelect(editStatus, referenceData.issue_statuses || referenceData.issueStatuses || []);
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

function showIssuesView() {
  issuesView?.classList.remove("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.add("hidden");
  document.getElementById("agile-view")?.classList.add("hidden");
  document.querySelector("header.topbar")?.classList.remove("is-issue-mode");
}

function showIssuePage() {
  issuesView?.classList.add("hidden");
  document.getElementById("agile-view")?.classList.add("hidden");
  issuePage?.classList.remove("hidden");
  timeEntriesView?.classList.add("hidden");
  document.querySelector("header.topbar")?.classList.add("is-issue-mode");
}

function handleAppBack() {
  if (window.__returnToAgile) {
    window.__returnToAgile = false;
    if (window.__showAgileView) window.__showAgileView();
    return;
  }
  showIssuesView();
}

function showTimeEntriesView() {
  issuesView?.classList.add("hidden");
  issuePage?.classList.add("hidden");
  timeEntriesView?.classList.remove("hidden");
  document.querySelector("header.topbar")?.classList.remove("is-issue-mode");
}

function goBackFromTimeEntries() {
  const issueId = Number(timeEntriesActiveFilters?.issueId);
  if (issueId) {
    openIssueDetails(issueId).catch((error) => {
      setStatus(`Не удалось открыть задачу: ${error.message}`, "error");
      showIssuesView();
    });
    return;
  }
  showIssuesView();
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
  const statuses = referenceData?.issue_statuses || referenceData?.issueStatuses || [];
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

async function refreshReferenceData() {
  const payload = getFormValues();
  if (payload.redmineUrl && payload.apiKey) {
    const loaded = await window.desktopApi.loadReferenceData(payload);
    referenceData = {
      ...loaded,
      current_user: loaded.current_user || loaded.currentUser,
      currentUser: loaded.currentUser || loaded.current_user,
      issue_statuses: loaded.issue_statuses || loaded.issueStatuses,
      issueStatuses: loaded.issueStatuses || loaded.issue_statuses,
    };
  } else {
    referenceData = await window.desktopApi.getCachedReferenceData();
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
  const projectsForFilter =
    enabledProjects.length > 0
      ? enabledProjects
      : (referenceData.projects || []).filter((p) => p.status !== 5);

  populateSelect(projectSelect, projectsForFilter, { allLabel: "Все активные проекты" });

  populateSelect(editStatus, referenceData.issue_statuses || referenceData.issueStatuses || []);
  populateSelect(editPriority, referenceData.priorities || []);
  populateSelect(createProject, projectsForFilter);
  populateSelect(createTracker, referenceData.trackers || []);
  populateSelect(createPriority, referenceData.priorities || []);
  selectDefaultCreatePriority();

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
  const prev = createAssignee.value;
  populateSelect(createAssignee, users, { labelKey: "name", allLabel: "Выберите исполнителя", allValue: "" });
  if (prev && Array.from(createAssignee.options).some((o) => o.value === prev)) {
    createAssignee.value = prev;
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
  const activities = referenceData?.activities || [];
  const byName = activities.find((a) => /разработ/i.test(String(a.name || "")));
  return byName?.id ?? activities[0]?.id ?? "";
}

function populateTimeEntryActivitySelect() {
  if (!timeEntryActivity) return;
  const activities = referenceData?.activities || [];
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
  createParentRow?.classList.add("hidden");
  if (createParentLabel) createParentLabel.textContent = "";
  renderCreateAttachmentsList();
  clearCreateIssueValidation();
  if (createStartDate) createStartDate.value = todayIsoDate();
  selectDefaultCreatePriority();
  if (createNoDeadlineCheckbox) createNoDeadlineCheckbox.checked = false;
  if (createProject?.value) updateCreateAssigneesForProject();
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
    if (insertTokens && editNotes) {
      insertTextAtCursor(editNotes, `!${payload.filename}!`);
    }
  }
  renderCommentAttachmentsList();
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
    updated: issue.updated_on ? new Date(issue.updated_on).toLocaleDateString("ru-RU") : "—",
    updatedOn: issue.updated_on ? new Date(issue.updated_on).getTime() : 0,
    doneRatio: issue.done_ratio ?? 0,
    project: issue.project?.name || "—",
    parentSubject: issue.parent?.subject || "",
    description: issue.description || "",
    subtasks: (issue.children || []).map((c) => ({
      id: c.id,
      subject: c.subject,
      status: c.status?.name || c.status || "—",
    })),
    attachments: (issue.attachments || []).map((a) => ({
      name: a.filename,
      size: a.filesize ? formatBytes(a.filesize) : "—",
      contentUrl: a.content_url || "",
    })),
    lastComment: (() => {
      const journals = issue.journals || [];
      for (let i = journals.length - 1; i >= 0; i -= 1) {
        if (journals[i].notes?.trim()) {
          return {
            author: journals[i].user?.name || "—",
            time: journals[i].created_on ? new Date(journals[i].created_on).toLocaleString("ru-RU") : "—",
            text: journals[i].notes,
          };
        }
      }
      return null;
    })(),
  };
}

function renderIssuesList() {
  if (!issuesList) return;
  const issues = getSortedIssuesForList();
  issuesList.innerHTML = issues.length
    ? issues
        .map((issue) => {
          const statusName = issue.status?.name || "-";
          const statusId = issue.status?.id ? String(issue.status.id) : "";
          const dueUrgency = getIssueDueUrgency(issue);
          const dueClass =
            dueUrgency === "overdue" ? " is-overdue" : dueUrgency === "soon" ? " is-due-soon" : "";
          const dueLabel = issue.due_date ? escapeHtml(formatDateRu(issue.due_date)) : "—";
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
            </div>
          `;
        })
        .join("")
    : `<div class="muted" style="padding:16px">Нет задач по текущим фильтрам.</div>`;

  issuesCount.textContent = `${loadedIssues.length} задач`;
  highlightSelectedIssue();
  updateDueSortHeader();
  updatePrioritySortHeader();
  updateProjectSortHeader();
  updateAssigneeSortHeader();
  updateStatusSortHeader();

  const visibleIds = new Set(loadedIssues.map((issue) => Number(issue.id)).filter(Boolean));
  selectedIssueIds.forEach((id) => {
    if (!visibleIds.has(Number(id))) selectedIssueIds.delete(Number(id));
  });
  syncSelectedRowsVisual();

  issuesList.querySelectorAll(".issue-item[data-issue-id]").forEach((row) => {
    row.addEventListener("click", (event) => {
      if (event.target.closest("[data-inline-status], [data-inline-due], [data-inline-time]")) return;
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
    !issuesStatusSortDir
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

    // Only one sort key may stay active (legacy could have due+priority together).
    const active = [
      ["due", issuesDueSortDir, DUE_SORT_KEY, (v) => { issuesDueSortDir = v; }],
      ["priority", issuesPrioritySortDir, PRIORITY_SORT_KEY, (v) => { issuesPrioritySortDir = v; }],
      ["project", issuesProjectSortDir, PROJECT_SORT_KEY, (v) => { issuesProjectSortDir = v; }],
      ["assignee", issuesAssigneeSortDir, ASSIGNEE_SORT_KEY, (v) => { issuesAssigneeSortDir = v; }],
      ["status", issuesStatusSortDir, STATUS_SORT_KEY, (v) => { issuesStatusSortDir = v; }],
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
  boardIssuesCache = issues;
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
    row.innerHTML += `<span class="linked-issue-id">#${item.id}</span><span class="linked-issue-subject">${escapeHtml(item.subject || "")}</span><span class="linked-issue-status">${escapeHtml(item.status?.name || item.status || "")}</span>`;
    container.appendChild(row);
  });
}

async function renderAttachments(attachments, payload) {
  if (!attachments.length) {
    issueAttachments.textContent = "Вложений нет.";
    issueAttachments.classList.add("muted");
    return;
  }

  issueAttachments.classList.remove("muted");
  issueAttachments.innerHTML = "";

  for (const attachment of attachments) {
    const row = document.createElement("div");
    row.className = "attachment-item";

    const isImage = /\.(png|jpe?g|gif|webp)$/i.test(attachment.filename || "");
    if (isImage && networkOnline) {
      try {
        const preview = await window.desktopApi.getAttachmentPreview({
          ...payload,
          contentUrl: attachment.content_url,
        });
        const img = document.createElement("img");
        img.className = "attachment-image";
        img.alt = attachment.filename;
        img.src = `data:${preview.mimeType};base64,${preview.dataBase64}`;
        row.appendChild(img);
      } catch {
        // preview optional
      }
    }

    const info = document.createElement("div");
    info.className = "attachment-info";
    info.innerHTML = `<div class="attachment-name">${escapeHtml(attachment.filename)}</div><div class="attachment-size">${attachment.filesize ? formatBytes(attachment.filesize) : ""}</div>`;
    row.appendChild(info);

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.className = "btn-secondary btn-sm";
    downloadBtn.textContent = "Скачать";
    downloadBtn.addEventListener("click", async () => {
      const result = await window.desktopApi.downloadAttachment({
        ...payload,
        filename: attachment.filename,
        contentUrl: attachment.content_url,
      });
      if (result.ok) setStatus(`Файл сохранён: ${result.filePath}`, "success");
    });
    row.appendChild(downloadBtn);
    issueAttachments.appendChild(row);
  }
}

async function openIssueDetails(issueId, { forceRefresh = networkOnline } = {}) {
  selectedIssueId = issueId;
  closeWatcherPicker();
  closeListInlinePopover();
  showIssuePage();
  issueTitle.textContent = `Задача #${issueId}`;
  issueDescription.textContent = "Загружаем...";
  issueAttachments.textContent = "Загружаем...";
  issueJournals.textContent = "Загружаем...";

  try {
    const payload = getFormValues();
    const issue = await window.desktopApi.getIssue({
      ...payload,
      issueId,
      forceRefresh,
    });
    if (!issue) throw new Error("Задача не найдена в локальном кэше.");

    currentIssue = issue;
    issueTitle.textContent = `#${issue.id} ${issue.subject || "(без темы)"}`;
    issueLinkLabel.textContent = `#${issue.id} (${issue.status?.name || "без статуса"})`;

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
      issueParentChip.textContent = `Родительская #${issue.parent.id}${issue.parent.subject ? ` ${issue.parent.subject}` : ""}`;
      issueParentChip.classList.remove("hidden");
      issueParentChip.onclick = (e) => {
        e.preventDefault();
        openIssueDetails(Number(issue.parent.id));
      };
    } else {
      issueParentChip?.classList.add("hidden");
    }

    const estimateCf = findEstimateCustomField(issue);
    const otherCustomFieldsHtml = (issue.custom_fields || [])
      .filter((field) => field.value && Number(field.id) !== Number(estimateCf?.id))
      .map((field) => `<div class="kv-key">${escapeHtml(field.name)}</div><div>${escapeHtml(field.value)}</div>`)
      .join("");
    const dueLabel = issue.due_date ? formatDateRu(issue.due_date) : "-";
    const estimateValue = resolveIssueEstimateHours(issue);

    issueMainMeta.innerHTML = `
      <div class="kv-key">Проект</div><div>${escapeHtml(issue.project?.name || "-")}</div>
      <div class="kv-key">Трудозатраты</div>
      <div>
        ${formatHours(issue.spent_hours)}
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
        <span class="field-view kv-value-status">${escapeHtml(issue.status?.name || "-")}</span>
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

    let descriptionHtml = textileToHtml(issue.description || "");
    if (window.renderTextileImages) {
      descriptionHtml = window.renderTextileImages(descriptionHtml, attachmentsMap);
    }
    issueDescription.innerHTML = descriptionHtml || '<span class="muted">Описание отсутствует</span>';
    issueDescription.classList.toggle("muted", !issue.description);

    await renderAttachments(issue.attachments || [], payload);

    if (issue.children?.length) {
      renderLinkedIssues(issueChildren, issue.children, false);
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
    currentIssueJournalLookups = {
      statuses: buildLookupMap(referenceData?.issue_statuses || referenceData?.issueStatuses),
      users: buildLookupMap(referenceData?.users),
      priorities: buildLookupMap(referenceData?.priorities),
      trackers: buildLookupMap(referenceData?.trackers),
    };
    const sortBtn = document.getElementById("toggle-journal-sort-btn");
    if (sortBtn) {
      sortBtn.textContent = journalSortOrder === "desc" ? "Сначала старые" : "Сначала новые";
    }
    renderJournalsList(currentIssueJournals);

    renderIssueWatchers(issue);
    syncEditWatchersSelection(issue);

    if (editSubject) editSubject.value = issue.subject || "";
    if (editDescription) editDescription.value = issue.description || "";
    if (editStartDate) editStartDate.value = issue.start_date || "";
    editNotes.value = "";
    commentPendingAttachments = [];
    renderCommentAttachmentsList();
    issueCommentForm?.classList.remove("expanded");
    setIssueEditingMode(false);
    if (window.applyStatusColors) window.applyStatusColors();
  } catch (error) {
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
  const ok = confirm(`Удалить наблюдателя «${userName || id}» из задачи?`);
  if (!ok) return;
  const nextIds = (currentIssue.watchers || [])
    .map((w) => Number(w.id))
    .filter((wid) => wid && wid !== id);
  await applyWatcherIds(nextIds, `Наблюдатель «${userName || id}» удалён.`);
}

function openInlineStatusPopover(issueId, anchorEl, currentStatusId) {
  const statuses = getReferenceStatuses();
  if (!listInlinePopover || !listInlinePopoverBody) return;
  if (!statuses.length) {
    setStatus("Справочник статусов ещё не загружен. Выполните синхронизацию.", "error");
    return;
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
  listInlinePopoverIssueId = Number(issueId);
  listInlinePopoverKind = "time";
  listInlinePopoverBody.innerHTML = `
    <div class="list-inline-popover-title">Трудозатраты</div>
    <div class="field-row">
      <label for="inline-time-comment">Комментарий <span class="req">*</span></label>
      <textarea id="inline-time-comment" rows="3" placeholder="Что сделано…"></textarea>
      <span class="field-error">Укажите комментарий</span>
    </div>
    <div class="field-row">
      <label for="inline-time-hours">Часы <span class="req">*</span></label>
      <input id="inline-time-hours" type="number" step="any" min="0.25" placeholder="1" />
      <span class="field-error">Укажите часы больше 0</span>
    </div>
    <div class="field-row">
      <label for="inline-time-activity">Вид деятельности <span class="req">*</span></label>
      <select id="inline-time-activity">
        ${activities
          .map((a) => {
            const id = String(a.id);
            const selected = id === defaultActivityId ? " selected" : "";
            return `<option value="${escapeHtml(id)}"${selected}>${escapeHtml(a.name || `#${id}`)}</option>`;
          })
          .join("")}
      </select>
      <span class="field-error">Выберите вид деятельности</span>
    </div>
    <a href="#" class="list-inline-date-toggle" id="inline-time-not-today">Не сегодня?</a>
    <div class="field-row hidden" id="inline-time-date-row">
      <label for="inline-time-date">Дата</label>
      <input id="inline-time-date" type="date" value="${escapeHtml(today)}" />
    </div>
    <div class="list-inline-due-actions">
      <button type="button" class="btn-primary btn-sm" id="inline-time-save">Сохранить</button>
      <button type="button" class="btn-secondary btn-sm" id="inline-time-cancel">Отмена</button>
    </div>
  `;
  requestAnimationFrame(() => {
    positionListInlinePopover(anchorEl);
    document.getElementById("inline-time-comment")?.focus();
  });
}

async function saveIssueChanges(event) {
  event.preventDefault();
  if (!selectedIssueId) return;
  rebindIssueEditFields();
  const payload = getFormValues();
  const estimateValue = editEstimatedHours?.value ?? "";
  const patch = {
    subject: editSubject?.value.trim() || "",
    description: editDescription?.value || "",
    status_id: editStatus?.value || "",
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
  patch.custom_fields = [{ id: estimateCfId, value: estimateValue }];
  if (!estimateCf) {
    // Запасной путь для инстансов, где используется стандартное поле.
    patch.estimated_hours = estimateValue;
  }

  if (saveIssueButton) {
    saveIssueButton.disabled = true;
    saveIssueButton.textContent = "Сохраняем…";
  }
  try {
    const result = await window.desktopApi.updateIssue({ ...payload, issueId: selectedIssueId, patch });
    setStatus(result.offline ? "Изменения сохранены локально и будут отправлены при появлении сети." : "Изменения сохранены.", "success");
    await loadIssues(false);
    await openIssueDetails(selectedIssueId, { forceRefresh: false });
  } catch (error) {
    setStatus(`Не удалось сохранить изменения: ${error.message}`, "error");
  } finally {
    if (saveIssueButton) {
      saveIssueButton.disabled = false;
      saveIssueButton.textContent = "Сохранить";
    }
  }
}

async function saveComment(event) {
  event.preventDefault();
  const notesRaw = (editNotes?.value || "").trim();
  if (!selectedIssueId || (!notesRaw && !commentPendingAttachments.length)) return;
  const notes = notesRaw ? markupToRedmineHtml(notesRaw) : "";
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
        notes: notes || "(вложение)",
        files: commentPendingAttachments.slice(),
      },
    });
    resetCommentComposer();
    setStatus(result.offline ? "Комментарий в очереди на отправку." : "Комментарий добавлен.", "success");
    if (!result.offline && networkOnline) {
      await window.desktopApi.runIncrementalSync();
    }
    await openIssueDetails(selectedIssueId);
  } catch (error) {
    setStatus(`Не удалось добавить комментарий: ${error.message}`, "error");
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
  const patch = {
    project_id: createProject.value,
    tracker_id: createTracker.value,
    subject: createSubject.value.trim(),
    description: createDescription.value.trim(),
    priority_id: createPriority.value,
    assigned_to_id: createAssignee.value,
    start_date: createStartDate.value,
    due_date: createDueDate.value,
    estimated_hours: createEstimatedHours?.value ?? "",
    noDeadline: Boolean(createNoDeadlineCheckbox?.checked),
    files: createPendingAttachments.slice(),
  };
  if (createParentIssueId) patch.parent_issue_id = createParentIssueId;
  // «Оценка трудозатрат» на части Redmine — custom field #5; дублируем и в core на случай другого сервера.
  if (patch.estimated_hours !== undefined && patch.estimated_hours !== "") {
    patch.custom_fields = [{ id: 5, value: patch.estimated_hours }];
  }

  clearCreateIssueValidation();
  let valid = true;
  const requireField = (field, condition, message) => {
    setCreateFieldInvalid(field, condition, message);
    if (condition) valid = false;
  };
  requireField(createProject, !patch.project_id, "Обязательное поле");
  requireField(createTracker, !patch.tracker_id, "Обязательное поле");
  requireField(createSubject, !patch.subject, "Обязательное поле");
  requireField(createDescription, !patch.description, "Обязательное поле");
  requireField(createPriority, !patch.priority_id, "Обязательное поле");
  requireField(createAssignee, !patch.assigned_to_id, "Обязательное поле");
  requireField(createStartDate, !patch.start_date, "Обязательное поле");
  requireField(
    createDueDate,
    !patch.due_date && !patch.noDeadline,
    "Укажите срок или отметьте «Без срока»",
  );

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
  const miniText = document.getElementById("issue-mini-sync-text");
  if (miniText) miniText.textContent = "Синхронизация...";
  if (syncStatusDot) {
    syncStatusDot.classList.add("syncing");
    syncStatusDot.classList.remove("offline");
  }
  const miniDot = document.getElementById("issue-mini-sync-dot");
  if (miniDot) {
    miniDot.classList.add("syncing");
    miniDot.classList.remove("offline");
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
  const ok = confirm(
    syncOperationKind === "cleanup"
      ? "Прервать очистку кэша?\n\nЧасть проектов уже могла быть удалена из локального кэша, часть — ещё нет."
      : "Прервать операцию?\n\n" +
          "Уже обработанные данные останутся в текущем состоянии, но результат будет неполным.\n\n" +
          "Рекомендуется дождаться окончания или запустить операцию позже снова.",
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

async function openEditSyncProjectsModal() {
  if (fullSyncInProgress) {
    showSyncProgressOverlay({ kind: syncOperationKind });
    return;
  }

  let projects = getEditSyncCandidateProjects();
  if (!projects.length && currentSettings?.redmineUrl && currentSettings?.apiKey) {
    try {
      referenceData = await window.desktopApi.loadReferenceData({
        redmineUrl: currentSettings.redmineUrl,
        apiKey: currentSettings.apiKey,
      });
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
  projects.sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));

  if (!editSyncProjectsList) return;
  editSyncProjectsList.innerHTML = projects.length
    ? projects
        .map((project) => {
          const checked = enabled.has(Number(project.id)) ? "checked" : "";
          return `<label class="checklist-item"><input type="checkbox" value="${Number(project.id)}" ${checked} /> ${escapeHtml(project.name)}</label>`;
        })
        .join("")
    : `<span class="muted">Нет проектов. Проверьте подключение к Redmine.</span>`;
  updateEditSyncSelectedCount();
  editSyncProjectsModal?.classList.remove("hidden");
}

function closeEditSyncProjectsModal() {
  editSyncProjectsModal?.classList.add("hidden");
}

async function saveEditSyncProjects() {
  if (!editSyncProjectsList) return;
  const projects = Array.from(editSyncProjectsList.querySelectorAll('input[type="checkbox"]')).map((input) => ({
    id: Number(input.value),
    name: input.parentElement?.textContent?.trim() || `Проект #${input.value}`,
    enabled: input.checked,
  }));
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
  if (!confirm(lines.join("\n"))) return;

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

    await refreshCacheStats();
    await refreshReferenceData();
    await loadIssues(true);
    await refreshDeadlineAlerts();
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
  applyDotState(document.getElementById("issue-mini-sync-dot"));
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
  const miniText = document.getElementById("issue-mini-sync-text");
  if (miniText) {
    miniText.textContent = label;
    const miniSync = document.getElementById("issue-mini-sync");
    if (miniSync) miniSync.title = title;
  }

  const queueCount = network?.queueCount || 0;
  if (offlineQueueBadge) {
    offlineQueueBadge.classList.toggle("hidden", !queueCount);
    offlineQueueBadge.textContent = queueCount ? `В очереди: ${queueCount}` : "";
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
  if (timeEntryEditId) timeEntryEditId.value = "";
  if (timeEntryModalTitle) timeEntryModalTitle.textContent = "Добавить трудозатраты";
  timeEntryIssueId.value = issueId || selectedIssueId || "";
  timeEntryDate.value = todayIsoDate();
  if (timeEntryHours) timeEntryHours.value = "";
  if (timeEntryComments) timeEntryComments.value = "";
  timeEntryForm?.querySelectorAll(".field-row.invalid").forEach((row) => row.classList.remove("invalid"));
  populateTimeEntryActivitySelect();
  if (!(referenceData?.activities || []).length) {
    setStatus("Справочник видов деятельности ещё не загружен. Выполните синхронизацию.", "error");
  }
  timeEntryModal.classList.remove("hidden");
}

function openTimeEntryModalForEdit(entry) {
  if (!entry) return;
  if (timeEntryEditId) timeEntryEditId.value = String(entry.id);
  if (timeEntryModalTitle) timeEntryModalTitle.textContent = "Изменить трудозатраты";
  timeEntryIssueId.value = entry.issue_id || "";
  timeEntryDate.value = entry.spent_on || todayIsoDate();
  if (timeEntryHours) timeEntryHours.value = entry.hours ?? "";
  if (timeEntryComments) timeEntryComments.value = entry.comments || "";
  timeEntryForm?.querySelectorAll(".field-row.invalid").forEach((row) => row.classList.remove("invalid"));
  populateTimeEntryActivitySelect();
  if (entry.activity_id && timeEntryActivity) {
    timeEntryActivity.value = String(entry.activity_id);
  }
  timeEntryModal.classList.remove("hidden");
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
        await window.desktopApi.syncIssueTimeEntries({ issueId: filters.issueId });
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
  timeEntriesList.innerHTML = entries
    .map((entry) => {
      const syncStatus = entry.sync_status || "synced";
      const canEdit = canEditTimeEntryLocally(entry);
      const statusBadge =
        syncStatus === "error"
          ? `<span class="time-entry-status is-error" title="${escapeHtml(entry.sync_error || "Ошибка отправки")}">ошибка</span>`
          : syncStatus === "pending"
            ? `<span class="time-entry-status is-pending">ожидает отправки</span>`
            : "";
      const actions = canEdit
        ? `<div class="time-entry-actions">
            <button type="button" class="link-btn" data-te-edit="${entry.id}">Изменить</button>
            <button type="button" class="link-btn time-entry-delete" data-te-delete="${entry.id}">Удалить</button>
          </div>`
        : "";
      return `
      <div class="time-entry-row" data-te-id="${entry.id}">
        <div>${escapeHtml(entry.spent_on || "-")}</div>
        <div class="time-entry-hours">${Number(entry.hours).toFixed(1)} ч</div>
        <div>#${entry.issue_id || "-"} ${escapeHtml(entry.comments || "")}</div>
        <div>${escapeHtml(entry.project_name || "")}</div>
        <div class="time-entry-meta">${escapeHtml(entry.user_name || "")} · ${escapeHtml(entry.activity_name || "")} ${statusBadge}</div>
        ${actions}
      </div>`;
    })
    .join("");
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

function openConnectionSettings() {
  syncConnectionFormFromSettings();
  document.getElementById("connection-card")?.classList.remove("hidden");
  document.querySelector(".page")?.classList.add("settings-mode");
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
  document.getElementById("connection-card")?.classList.add("hidden");
  document.querySelector(".page")?.classList.remove("settings-mode");
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
  applyCount(notificationsCount);
  applyCount(document.getElementById("issue-page-notifications-count"));
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
  if (urlInput) urlInput.value = currentSettings.redmineUrl || "";
  if (apiKeyInput) apiKeyInput.value = currentSettings.apiKey || "";
  if (settingsAutosyncToggle) settingsAutosyncToggle.checked = currentSettings.autosyncEnabled !== false;
  if (autosyncInterval) autosyncInterval.value = String(currentSettings.autosyncIntervalMinutes || 5);
  if (deadlineAlertDaysSelect) {
    deadlineAlertDaysSelect.value = String(currentSettings.deadlineAlertDays ?? 3);
  }

  await refreshReferenceData();
  await refreshCacheStats();

  setIssueScope(currentSettings?.uiState?.issueScope || "mine", { persist: false });
  syncDueFilterUi();
  window.FilterChips?.updateAssigneeLock?.();
  window.FilterChips?.updateDueSummary?.();
  window.FilterChips?.updateStatusSummary?.();
  restoreDueSort();

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

  window.desktopApi.onOpenIssueFromLink(({ issueId }) => {
    if (issueId) openIssueDetails(issueId);
  });

  window.desktopApi.onNavigateBack(() => {
    handleAppBack();
  });

  window.desktopApi.onDeadlineAlerts((payload) => {
    applyDeadlineAlerts(payload?.alerts || []);
  });
  await refreshDeadlineAlerts();

  await loadIssues(false);

  window.__openIssueById = (id) => openIssueDetails(Number(id));
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
  window.__fetchIssueForPreview = async (issueId) => {
    const payload = getFormValues();
    const issue = await window.desktopApi.getIssue({ ...payload, issueId, forceRefresh: networkOnline });
    return issue ? issueToBoardItem(issue) : null;
  };
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

closeConnectionButton?.addEventListener("click", closeConnectionSettings);

toggleConnectionButton?.addEventListener("click", () => {
  const card = document.getElementById("connection-card");
  if (!card) return;
  if (card.classList.contains("hidden")) openConnectionSettings();
  else closeConnectionSettings();
});

syncReferenceButton?.addEventListener("click", async () => {
  await refreshReferenceData();
  setStatus("Справочники обновлены.", "success");
});

loadIssuesButton?.addEventListener("click", () => loadIssues(true));
resetFiltersButton?.addEventListener("click", async () => {
  projectSelect.value = "all";
  applyStatusScopePreset("open");
  assigneeBeforeMineLock = null;
  assigneeSelect.value = "me";
  searchInput.value = "";
  if (dueFromInput) dueFromInput.value = "";
  if (dueToInput) dueToInput.value = "";
  if (dueEmptyOnlyCheckbox) dueEmptyOnlyCheckbox.checked = false;
  window.FilterChips?.setChipVisible?.("status-chip", false);
  window.FilterChips?.setChipVisible?.("priority-chip", false);
  window.FilterChips?.setChipVisible?.("due-chip", false);
  window.FilterChips?.setChipVisible?.("assignee-chip", false);
  window.FilterChips?.setChipVisible?.("author-chip", false);
  window.FilterChips?.setDueMode?.("period", true);
  setSelectedPriorityIds([]);
  setSelectedAuthorIds([]);
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
    );
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

document.getElementById("issue-context-menu")?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-set-bulk-status]");
  if (!btn) return;
  event.stopPropagation();
  const statusId = Number(btn.getAttribute("data-set-bulk-status"));
  const statusName = btn.textContent;
  closeIssueContextMenu();
  if (bulkStatusConfirmText) {
    bulkStatusConfirmText.textContent = `Сменить статус у ${selectedIssueIds.size} задач на «${statusName}»?`;
  }
  pendingBulkStatusId = statusId;
  bulkStatusConfirmModal?.classList.remove("hidden");
});

bulkStatusCancelBtn?.addEventListener("click", () => {
  pendingBulkStatusId = null;
  bulkStatusConfirmModal?.classList.add("hidden");
});

bulkStatusConfirmBtn?.addEventListener("click", async () => {
  const statusId = Number(pendingBulkStatusId);
  if (!selectedIssueIds.size || !Number.isFinite(statusId) || statusId <= 0) {
    pendingBulkStatusId = null;
    bulkStatusConfirmModal?.classList.add("hidden");
    return;
  }
  const ids = Array.from(selectedIssueIds);
  bulkStatusConfirmModal?.classList.add("hidden");
  const prevConfirmLabel = bulkStatusConfirmBtn.textContent;
  bulkStatusConfirmBtn.disabled = true;
  bulkStatusConfirmBtn.textContent = "Меняем…";
  try {
    await applyBulkStatusChange(ids, statusId);
  } finally {
    pendingBulkStatusId = null;
    bulkStatusConfirmBtn.disabled = false;
    bulkStatusConfirmBtn.textContent = prevConfirmLabel || "Подтвердить";
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
      await patchIssueFields(issueId, { status_id: statusId }, { successMessage: "Статус изменён" });
    } catch (error) {
      /* toast уже показан в patchIssueFields */
    }
    return;
  }

  if (event.target.id === "inline-due-cancel" || event.target.id === "inline-time-cancel") {
    closeListInlinePopover();
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
          activity_id: activityId,
          spent_on: spentOn,
        },
      });
      closeListInlinePopover();
      const idx = loadedIssues.findIndex((issue) => Number(issue.id) === Number(issueId));
      if (idx >= 0) {
        const prev = Number(loadedIssues[idx].spent_hours) || 0;
        loadedIssues[idx] = {
          ...loadedIssues[idx],
          spent_hours: prev + Number(hours),
        };
        renderIssuesList();
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

document.addEventListener("click", (event) => {
  if (!event.target.closest("#issue-context-menu")) closeIssueContextMenu();

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
  closeListInlinePopover();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeListInlinePopover();
    closeIssueContextMenu();
    if (selectedIssueIds.size > 0) {
      selectedIssueIds.clear();
      syncSelectedRowsVisual();
    }
  }
});

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
  const allIds = getReferenceStatuses().map((s) => Number(s.id)).filter(Boolean);
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

projectSelect?.addEventListener("change", async () => {
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
issueEditForm?.addEventListener("submit", saveIssueChanges);

toggleEditButton?.addEventListener("click", () => setIssueEditingMode(true));
cancelEditButton?.addEventListener("click", () => {
  setIssueEditingMode(false);
  if (selectedIssueId) {
    openIssueDetails(selectedIssueId).catch((error) => {
      setStatus(error.message || "Не удалось перечитать задачу", "error");
    });
  }
});
issueCommentForm?.addEventListener("submit", saveComment);
issueCommentForm?.addEventListener("comment-insert-image", () => commentAttachInput?.click());
commentAttachInput?.addEventListener("change", async (event) => {
  await addCommentImageFiles(event.target.files, { insertTokens: true });
  event.target.value = "";
});
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
  resetCreateIssueFormDefaults();
  createIssueModal?.classList.remove("hidden");
});
createIssueCancelButton?.addEventListener("click", () => {
  createIssueModal?.classList.add("hidden");
  resetCreateIssueFormDefaults();
});
createIssueForm?.addEventListener("submit", createIssueSubmit);
createProject?.addEventListener("change", () => updateCreateAssigneesForProject());
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

createSubtaskButton?.addEventListener("click", async () => {
  if (!currentIssue?.id) return;
  resetCreateIssueFormDefaults();
  createParentIssueId = currentIssue.id;
  createParentRow?.classList.remove("hidden");
  if (createParentLabel) createParentLabel.textContent = `#${currentIssue.id} ${currentIssue.subject || ""}`;
  createProject.value = String(currentIssue.project?.id || projectSelect.value || "");
  await updateCreateAssigneesForProject();
  createIssueModal?.classList.remove("hidden");
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
  } catch {
    setStatus(link, "info");
  }
});

openLinkButton?.addEventListener("click", () => quickOpenModal?.classList.remove("hidden"));
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
});
editSyncClearAllBtn?.addEventListener("click", () => {
  editSyncProjectsList?.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  updateEditSyncSelectedCount();
});
editSyncProjectsList?.addEventListener("change", () => updateEditSyncSelectedCount());
editSyncProjectsSaveBtn?.addEventListener("click", () => {
  saveEditSyncProjects().catch((error) => {
    setStatus(`Не удалось сохранить проекты: ${error.message}`, "error");
  });
});

resyncAllButton?.addEventListener("click", async () => {
  if (fullSyncInProgress) {
    showSyncProgressOverlay({ kind: syncOperationKind, title: "Полная пересинхронизация" });
    return;
  }

  const confirmed = confirm(
    "Запустить полную пересинхронизацию выбранных проектов?\n\n" +
      "Операция может занять много времени: заново загружаются задачи и история по всем активным проектам.\n\n" +
      "Не закрывайте приложение во время синхронизации.\n" +
      "Если прервать процесс, кэш останется неполным — часть проектов обновится, часть нет.\n\n" +
      "Продолжить?",
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
  if (!confirm("Очистить локальный кэш? Данные придётся загрузить заново.")) return;
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

timeEntriesBtn?.addEventListener("click", async () => {
  showTimeEntriesView();
  await renderTimeEntries();
});

document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-show-issue-time-entries]");
  if (!btn) return;
  const issueId = Number(btn.getAttribute("data-show-issue-time-entries"));
  if (!issueId) return;
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
    const ok = confirm("Удалить эту запись трудозатрат?");
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

notificationsButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  openNotificationsPopover(notificationsButton);
});

document.getElementById("issue-page-notifications-btn")?.addEventListener("click", (event) => {
  event.stopPropagation();
  openNotificationsPopover(event.currentTarget);
});

document.addEventListener("click", (event) => {
  if (!notificationsPopover || notificationsPopover.classList.contains("hidden")) return;
  if (event.target.closest("#notifications-popover")) return;
  if (event.target.closest("#notifications-btn")) return;
  if (event.target.closest("#issue-page-notifications-btn")) return;
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

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => setStatus(error.message, "error"));
});
