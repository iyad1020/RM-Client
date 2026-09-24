const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopApi", {
  loadSettings: () => ipcRenderer.invoke("settings:load"),
  saveSettings: (settings) => ipcRenderer.invoke("settings:save", settings),

  getNetworkStatus: () => ipcRenderer.invoke("network:get-status"),
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),

  testConnection: (payload) => ipcRenderer.invoke("redmine:test-connection", payload),
  loadReferenceData: (payload) => ipcRenderer.invoke("redmine:load-reference-data", payload),
  ensureReferenceData: (payload) => ipcRenderer.invoke("redmine:ensure-reference-data", payload || {}),
  getCachedReferenceData: () => ipcRenderer.invoke("db:get-reference-data"),
  getIssueFormFields: (payload) => ipcRenderer.invoke("redmine:get-issue-form-fields", payload),
  openExternalUrl: (url) => ipcRenderer.invoke("app:open-external-url", { url }),
  setFavoriteIssueIds: (ids) => ipcRenderer.invoke("app:set-favorite-issue-ids", { ids }),
  getAssignees: (payload) => ipcRenderer.invoke("db:get-assignees", payload),
  getAuthors: (payload) => ipcRenderer.invoke("db:get-authors", payload),
  getOpenChildren: (issueIds) => ipcRenderer.invoke("db:get-open-children", issueIds),
  getCustomerNames: () => ipcRenderer.invoke("db:get-customer-names"),
  getTimeEntriesReport: (payload) => ipcRenderer.invoke("db:get-time-entries-report", payload),

  loadIssues: (payload) => ipcRenderer.invoke("db:get-issues", payload),
  loadBoardIssues: (payload) => ipcRenderer.invoke("db:get-board-issues", payload),
  getProjectStatuses: (payload) => ipcRenderer.invoke("db:get-project-statuses", payload),
  getIssue: (payload) => ipcRenderer.invoke("db:get-issue", payload),
  getAllowedStatuses: (payload) => ipcRenderer.invoke("db:get-allowed-statuses", payload),
  getCacheStats: () => ipcRenderer.invoke("db:get-cache-stats"),
  getSyncProjects: () => ipcRenderer.invoke("db:get-sync-projects"),
  clearCache: () => ipcRenderer.invoke("db:clear-cache"),
  rebuildSearchIndex: () => ipcRenderer.invoke("cache:rebuild-fts"),
  runCacheMaintenance: () => ipcRenderer.invoke("cache:run-maintenance"),
  estimateCacheDownload: () => ipcRenderer.invoke("cache:estimate-download"),
  prefetchProjectDetails: () => ipcRenderer.invoke("cache:prefetch-project-details"),
  cloudBackupUploadNow: () => ipcRenderer.invoke("cloud-backup:upload-now"),
  cloudOAuthConnect: (payload) => ipcRenderer.invoke("cloud-oauth:connect", payload),
  cloudOAuthDisconnect: () => ipcRenderer.invoke("cloud-oauth:disconnect"),
  cloudOAuthStatus: () => ipcRenderer.invoke("cloud-oauth:status"),

  getSyncStatus: () => ipcRenderer.invoke("sync:get-status"),
  startFullSync: (payload) => ipcRenderer.invoke("sync:start-full", payload),
  updateSyncProjects: (payload) => ipcRenderer.invoke("sync:update-projects", payload),
  runIncrementalSync: () => ipcRenderer.invoke("sync:incremental"),
  cancelSync: () => ipcRenderer.invoke("sync:cancel"),

  completeOnboarding: (payload) => ipcRenderer.invoke("onboarding:complete", payload),
  openMainWindow: () => ipcRenderer.invoke("app:open-main"),
  getDataPaths: () => ipcRenderer.invoke("app:get-data-paths"),
  openPath: (payload) => ipcRenderer.invoke("app:open-path", payload),
  showItemInFolder: (payload) => ipcRenderer.invoke("app:show-item-in-folder", payload),
  confirm: (payload) => ipcRenderer.invoke("app:confirm", payload),
  getBackupSettings: () => ipcRenderer.invoke("app:get-backup-settings"),
  backupNow: () => ipcRenderer.invoke("app:backup-now"),
  chooseBackupFolder: () => ipcRenderer.invoke("app:choose-backup-folder"),

  trackerGetState: () => ipcRenderer.invoke("tracker:timer-get-state"),
  trackerStart: (payload) => ipcRenderer.invoke("tracker:timer-start", payload),
  trackerPause: () => ipcRenderer.invoke("tracker:timer-pause"),
  trackerResume: () => ipcRenderer.invoke("tracker:timer-resume"),
  trackerDiscard: () => ipcRenderer.invoke("tracker:timer-discard"),
  trackerStop: (payload) => ipcRenderer.invoke("tracker:timer-stop", payload || {}),
  trackerStopAllRunning: () => ipcRenderer.invoke("tracker:stop-all-running"),
  trackerDiscardIdle: (payload) => ipcRenderer.invoke("tracker:discard-idle", payload),
  trackerResolveIdle: (payload) => ipcRenderer.invoke("tracker:resolve-idle", payload),
  trackerCreateDraft: (payload) => ipcRenderer.invoke("tracker:create-draft", payload),
  trackerUpdateDraft: (payload) => ipcRenderer.invoke("tracker:update-draft", payload),
  trackerStartEntry: (payload) => ipcRenderer.invoke("tracker:start-entry", payload),
  trackerDiscardEntry: (payload) => ipcRenderer.invoke("tracker:discard-entry", payload),
  getTrackerDrafts: (payload) => ipcRenderer.invoke("db:get-tracker-drafts", payload),
  pushTrackerDrafts: (payload) => ipcRenderer.invoke("tracker:push-drafts", payload),
  onTrackerRecoveredTimer: (handler) => {
    const channel = "tracker:recovered-timer";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  onTrackerIdleDetected: (handler) => {
    const channel = "tracker:idle-detected";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },

  resolveIssueId: (payload) => ipcRenderer.invoke("redmine:resolve-issue-id", payload),
  updateIssue: (payload) => ipcRenderer.invoke("redmine:update-issue", payload),
  createIssue: (payload) => ipcRenderer.invoke("redmine:create-issue", payload),
  getProjectUsers: (payload) => ipcRenderer.invoke("redmine:get-project-users", payload),
  createTimeEntry: (payload) => ipcRenderer.invoke("redmine:create-time-entry", payload),
  updateTimeEntry: (payload) => ipcRenderer.invoke("redmine:update-time-entry", payload),
  deleteTimeEntry: (payload) => ipcRenderer.invoke("redmine:delete-time-entry", payload),
  canEditTimeEntry: (payload) => ipcRenderer.invoke("db:can-edit-time-entry", payload),
  getTimeEntries: (payload) => ipcRenderer.invoke("db:get-time-entries", payload),
  syncIssueTimeEntries: (payload) => ipcRenderer.invoke("redmine:sync-issue-time-entries", payload),
  flushOfflineQueue: () => ipcRenderer.invoke("offline:flush"),
  onOfflineFlushed: (handler) => {
    const channel = "offline:flushed";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  getSyncFailures: () => ipcRenderer.invoke("sync:get-failures"),
  markSyncFailuresRead: () => ipcRenderer.invoke("sync:mark-failures-read"),

  getDeadlineAlerts: () => ipcRenderer.invoke("notifications:get-deadlines"),
  onDeadlineAlerts: (handler) => {
    const channel = "notifications:deadlines";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },

  getActivityFeed: (payload) => ipcRenderer.invoke("activity:get-feed", payload || {}),
  markActivitySeen: (payload) => ipcRenderer.invoke("activity:mark-seen", payload || {}),
  getActivityUnseenCount: () => ipcRenderer.invoke("activity:get-unseen-count"),
  onActivityUpdated: (handler) => {
    const channel = "activity:updated";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },

  downloadAttachment: (payload) => ipcRenderer.invoke("redmine:download-attachment", payload),
  getAttachmentPreview: (payload) => ipcRenderer.invoke("redmine:get-attachment-preview", payload),
  deleteAttachment: (payload) => ipcRenderer.invoke("redmine:delete-attachment", payload),

  onOpenIssueFromLink: (handler) => {
    const channel = "issue:open-from-link";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  onSyncProgress: (handler) => {
    const channel = "sync:progress";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  onNetworkStatus: (handler) => {
    const channel = "network:status";
    const listener = (_event, payload) => handler(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
  onNavigateBack: (handler) => {
    const channel = "app:navigate-back";
    const listener = () => handler();
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  },
});
