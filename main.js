const { app, BrowserWindow, ipcMain, dialog, net, safeStorage, Notification, nativeImage, shell, Menu, powerMonitor } = require("electron");
const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");

const db = require("./db/database");
const redmine = require("./sync/redmine-client");
const syncEngine = require("./sync/sync-engine");
const referenceData = require("./sync/reference-data");
const offlineQueue = require("./sync/offline-queue");
const backupEngine = require("./sync/backup-engine");
const { roundHoursToHalf } = require("./renderer/tracker-hours");
const attachmentCache = require("./sync/attachment-cache");
const cloudBackup = require("./sync/cloud-backup");
const cloudOAuth = require("./sync/cloud-oauth");
const { cloudOAuthConfig, assertConfigured, resolveCredentials } = require("./sync/cloud-oauth-config");
const cachePolicy = require("./sync/cache-policy");

// Windows taskbar groups by AppUserModelId — set before ready so the custom
// window/exe icon is used instead of the default Electron one.
if (process.platform === "win32") {
  app.setAppUserModelId("ru.grandproject.rmclient");
}

const APP_ICON_ICO = path.join(__dirname, "build", "icon.ico");
const APP_ICON_PNG = path.join(__dirname, "build", "icon.png");

function resolveAppIcon() {
  if (fsSync.existsSync(APP_ICON_ICO)) return APP_ICON_ICO;
  if (fsSync.existsSync(APP_ICON_PNG)) return APP_ICON_PNG;
  return undefined;
}

function loadAppIconImage() {
  const iconPath = resolveAppIcon();
  if (!iconPath) return null;
  const image = nativeImage.createFromPath(iconPath);
  return image.isEmpty() ? null : image;
}

const SETTINGS_FILE = "settings.json";
const API_KEY_ENC_PREFIX = "safeStorage:v1:";
const defaultSettings = {
  redmineUrl: "",
  apiKey: "",
  onboardingComplete: false,
  cacheMode: "issues-history",
  autosyncEnabled: true,
  autosyncIntervalMinutes: 5,
  deadlineAlertDays: 3,
  backupFolder: "",
  autoBackupEnabled: true,
  idleThresholdMinutes: 5,
  trackerTimeInputMode: "ticker",
  trackerEntryMode: "timer",
  trackerMinFloorEnabled: true,
  trackerShowCustomerName: false,
  trackerShowAiFields: false,
  projectsShowHierarchy: false,
  timeEntryFormFieldOrder: ["spent_on", "hours", "comments", "activity_id", "customer_name"],
  cacheMaxSizeMb: 2048,
  cacheRetentionDays: 90,
  cacheAttachmentsEnabled: true,
  searchDeepEnabled: true,
  cloudBackupProvider: "off",
  cloudBackupToken: "",
  cloudBackupGoogleAccessToken: "",
  cloudBackupGoogleRefreshToken: "",
  cloudBackupFolder: "app:/RM Client/backups",
  cloudBackupGoogleFolderId: "",
  cloudBackupIntervalHours: 24,
  cloudBackupKeepCount: 10,
  cloudBackupYandexClientId: "",
  cloudBackupYandexClientSecret: "",
  cloudBackupGoogleClientId: "",
  cloudBackupGoogleClientSecret: "",
  uiState: {
    searchQuery: "",
    selectedProjectId: "all",
    selectedStatusId: "all",
    selectedStatusIds: [],
    selectedPriorityIds: [],
    selectedAssigneeId: "me",
    selectedAuthorIds: [],
    issueScope: "mine",
    quickOpenValue: "",
    dueFrom: "",
    dueTo: "",
    dueEmptyOnly: false,
    statusChipVisible: false,
    priorityChipVisible: false,
    assigneeChipVisible: false,
    authorChipVisible: false,
    dueChipVisible: false,
  },
  windowState: {
    width: 1220,
    height: 780,
  },
};

let mainWindow = null;
let isQuitting = false;
let backupOnQuitDone = false;
let pendingOpenIssueId = null;
let autosyncTimer = null;
let autoBackupTimer = null;
let idleWatchTimer = null;
let idleNotifiedForStretch = false;
const SPELLCHECK_LANG_HINTS = ["ru", "en"];

function getDefaultBackupsDir() {
  return path.join(app.getPath("userData"), "backups");
}

function resolveBackupsDir(settings) {
  const custom = String(settings?.backupFolder || "").trim();
  return custom || getDefaultBackupsDir();
}

async function runConfiguredBackupSnapshot() {
  const settings = await readSettings();
  const backupsDir = resolveBackupsDir(settings);
  fsSync.mkdirSync(backupsDir, { recursive: true });
  const database = db.getDb();
  if (!database) throw new Error("База данных не открыта");
  const snapshotPath = await backupEngine.runBackupSnapshot(database, backupsDir);
  backupEngine.pruneOldBackups(backupsDir, 20);
  // Local copies always succeed first; cloud mirror is best-effort.
  try {
    await mirrorSnapshotToCloud(snapshotPath, settings);
  } catch (error) {
    console.error("Cloud backup mirror failed:", error.message);
  }
  return snapshotPath;
}

async function mirrorSnapshotToCloud(_snapshotPath, _settings) {
  // Cloud backup UI shelved for now (Yandex/Google OAuth). Local backups only.
  return null;
}

function scheduleAutoBackups() {
  if (autoBackupTimer) {
    clearInterval(autoBackupTimer);
    autoBackupTimer = null;
  }
  autoBackupTimer = backupEngine.scheduleAutoBackups(
    () => db.getDb(),
    () => {
      // Sync read of settings file would be heavy; use last-known via sync file read fallback.
      // Prefer in-memory defaults when auto-backup is off.
      try {
        const raw = fsSync.readFileSync(getSettingsPath(), "utf-8");
        const parsed = JSON.parse(raw);
        const enabled = parsed.autoBackupEnabled !== false;
        if (!enabled) return null;
        return resolveBackupsDir({ ...defaultSettings, ...parsed });
      } catch {
        if (defaultSettings.autoBackupEnabled === false) return null;
        return getDefaultBackupsDir();
      }
    },
    15,
  );
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createMainWindow();
    return;
  }
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function configureSpellcheckSession(session) {
  if (!session || typeof session.setSpellCheckerLanguages !== "function") return;
  try {
    const available = Array.isArray(session.availableSpellCheckerLanguages)
      ? session.availableSpellCheckerLanguages
      : [];
    const pickByHint = (hint) => {
      const normalizedHint = String(hint || "").toLowerCase();
      return available.find((lang) => String(lang || "").toLowerCase() === normalizedHint)
        || available.find((lang) => String(lang || "").toLowerCase().startsWith(`${normalizedHint}-`));
    };
    const selected = SPELLCHECK_LANG_HINTS
      .map((hint) => pickByHint(hint))
      .filter(Boolean);
    const deduped = Array.from(new Set(selected));
    if (deduped.length) {
      session.setSpellCheckerLanguages(deduped);
    } else {
      console.warn("Spellcheck: no matching dictionaries available", available);
    }
  } catch (error) {
    console.error("Spellcheck session setup failed:", error.message);
  }
}

function attachSpellcheckContextMenu(windowRef) {
  if (!windowRef?.webContents) return;
  windowRef.webContents.on("context-menu", (_event, params = {}) => {
    const template = [];
    const suggestions = Array.isArray(params.dictionarySuggestions)
      ? params.dictionarySuggestions.slice(0, 6)
      : [];
    const misspelledWord = String(params.misspelledWord || "").trim();

    if (misspelledWord && suggestions.length) {
      for (const suggestion of suggestions) {
        template.push({
          label: suggestion,
          click: () => windowRef.webContents.replaceMisspelling(suggestion),
        });
      }
      template.push({ type: "separator" });
    } else if (misspelledWord) {
      template.push({ label: `Нет подсказок для "${misspelledWord}"`, enabled: false });
      template.push({ type: "separator" });
    }

    if (misspelledWord) {
      template.push({
        label: "Добавить в словарь",
        click: () => {
          try {
            windowRef.webContents.session.addWordToSpellCheckerDictionary(misspelledWord);
          } catch (error) {
            console.error("Spellcheck add-word failed:", error.message);
          }
        },
      });
      template.push({ type: "separator" });
    }

    if (params.isEditable) {
      template.push(
        { role: "undo", label: "Отменить" },
        { role: "redo", label: "Повторить" },
        { type: "separator" },
        { role: "cut", label: "Вырезать" },
        { role: "copy", label: "Копировать" },
        { role: "paste", label: "Вставить" },
        { role: "selectAll", label: "Выделить всё" },
      );
    } else if (params.selectionText) {
      template.push({ role: "copy", label: "Копировать" });
    }

    // Fallback: keep menu visible even when Chromium gives no spell suggestions.
    if (!template.length) {
      template.push({ role: "copy", label: "Копировать" });
    }

    while (template.length && template[template.length - 1].type === "separator") {
      template.pop();
    }
    Menu.buildFromTemplate(template).popup({ window: windowRef });
  });
}

async function saveWindowState() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  try {
    const [width, height] = mainWindow.getSize();
    const current = await readSettings();
    await writeSettings({ ...current, windowState: { width, height } });
  } catch {
    /* ignore */
  }
}

function getSettingsPath() {
  return path.join(app.getPath("userData"), SETTINGS_FILE);
}

function encryptSecret(plain) {
  const value = String(plain || "");
  if (!value) return "";
  if (typeof safeStorage?.isEncryptionAvailable === "function" && safeStorage.isEncryptionAvailable()) {
    try {
      const encrypted = safeStorage.encryptString(value);
      return `${API_KEY_ENC_PREFIX}${encrypted.toString("base64")}`;
    } catch {
      // fall through to plaintext storage
    }
  }
  return value;
}

function decryptSecret(stored) {
  const value = String(stored || "");
  if (!value) return "";

  const tryDecrypt = (base64Payload) => {
    try {
      if (typeof safeStorage?.decryptString !== "function") return null;
      return safeStorage.decryptString(Buffer.from(base64Payload, "base64"));
    } catch {
      return null;
    }
  };

  if (value.startsWith(API_KEY_ENC_PREFIX)) {
    const decrypted = tryDecrypt(value.slice(API_KEY_ENC_PREFIX.length));
    return decrypted !== null ? decrypted : "";
  }

  // Legacy plaintext (or unexpected format): try decrypt, otherwise use as-is.
  const decrypted = tryDecrypt(value);
  return decrypted !== null ? decrypted : value;
}

function persistCredentials(redmineUrl, apiKey) {
  const url = String(redmineUrl || "").trim();
  const key = String(apiKey || "").trim();
  if (url) db.setMeta("redmine_url", url);
  if (key) db.setMeta("api_key", encryptSecret(key));
}

function readMetaApiKey() {
  return decryptSecret(db.getMeta("api_key", "") || "");
}

async function readSettings() {
  try {
    const raw = await fs.readFile(getSettingsPath(), "utf-8");
    const parsed = JSON.parse(raw);
    const settings = {
      ...defaultSettings,
      ...parsed,
      uiState: { ...defaultSettings.uiState, ...(parsed.uiState || {}) },
      windowState: { ...defaultSettings.windowState, ...(parsed.windowState || {}) },
    };
    settings.apiKey = decryptSecret(settings.apiKey);
    return settings;
  } catch {
    return structuredClone(defaultSettings);
  }
}

async function writeSettings(settings) {
  let existing = structuredClone(defaultSettings);
  try {
    const raw = await fs.readFile(getSettingsPath(), "utf-8");
    const parsed = JSON.parse(raw);
    existing = {
      ...defaultSettings,
      ...parsed,
      uiState: { ...defaultSettings.uiState, ...(parsed.uiState || {}) },
      windowState: { ...defaultSettings.windowState, ...(parsed.windowState || {}) },
    };
    existing.apiKey = decryptSecret(existing.apiKey);
  } catch {
    // first save
  }

  const incomingUrl = String(settings.redmineUrl ?? "").trim();
  const incomingKey = String(settings.apiKey ?? "").trim();
  const normalized = {
    ...defaultSettings,
    ...existing,
    ...settings,
    redmineUrl: incomingUrl || String(existing.redmineUrl || "").trim(),
    apiKey: incomingKey || String(existing.apiKey || "").trim(),
    uiState: { ...defaultSettings.uiState, ...(existing.uiState || {}), ...(settings.uiState || {}) },
    windowState: { ...defaultSettings.windowState, ...(existing.windowState || {}), ...(settings.windowState || {}) },
  };

  const toStore = {
    ...normalized,
    apiKey: encryptSecret(normalized.apiKey),
  };
  await fs.writeFile(getSettingsPath(), JSON.stringify(toStore, null, 2), "utf-8");
  return normalized;
}

function isOnline() {
  return net.isOnline();
}

function broadcast(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function broadcastSyncProgress() {
  broadcast("sync:progress", syncEngine.getSyncStatus());
}

function broadcastNetworkStatus() {
  broadcast("network:status", { online: isOnline(), queueCount: db.getOfflineQueue().length });
}

async function collectDeadlineAlerts() {
  const currentUser = db.getReferenceData("current_user");
  if (!currentUser?.id) return [];
  const settings = await readSettings();
  const soonDays = Number(settings.deadlineAlertDays);
  return db.getDeadlineAlerts(currentUser.id, {
    soonDays: Number.isFinite(soonDays) && soonDays >= 0 ? soonDays : 3,
  });
}

function pushNativeDeadlineNotifications(alerts) {
  if (!Notification.isSupported()) return;
  (alerts || []).forEach((alert) => {
    if (db.hasBeenPushed(alert.issueId, alert.urgency)) return;
    const title = alert.urgency === "overdue" ? "Просроченная задача" : "Срок задачи скоро";
    const dueLabel = formatAlertDueDate(alert.dueDate);
    const body = `#${alert.issueId} ${alert.subject}\nДо ${dueLabel}${alert.projectName ? ` · ${alert.projectName}` : ""}`;
    const notification = new Notification({ title, body });
    notification.on("click", () => deliverIssueOpenEvent(alert.issueId));
    notification.show();
    db.markPushed(alert.issueId, alert.urgency);
  });
}

function formatAlertDueDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    const [y, m, d] = String(value).split("-");
    return `${d}.${m}.${y}`;
  }
  return String(value);
}

async function publishDeadlineAlerts() {
  const alerts = await collectDeadlineAlerts();
  broadcast("notifications:deadlines", { alerts });
  pushNativeDeadlineNotifications(alerts);
  return alerts;
}

function publishActivityUpdated() {
  const unseenCount = db.countUnseenActivity();
  broadcast("activity:updated", { unseenCount });
  return unseenCount;
}

function issueIdFromText(text) {
  const value = String(text || "").trim();
  if (!value) return null;
  const directMatch = value.match(/^\d+$/);
  if (directMatch) return Number(directMatch[0]);
  const issuePathMatch = value.match(/\/issues\/(\d+)/i);
  if (issuePathMatch) return Number(issuePathMatch[1]);
  const hashMatch = value.match(/#(\d+)/);
  if (hashMatch) return Number(hashMatch[1]);
  return null;
}

function buildAuthorizedUrl(redmineUrl, apiKey, sourceUrl) {
  const key = String(apiKey || "").trim();
  if (!key) throw new Error("API key не задан.");
  const normalized = redmine.normalizeRedmineUrl(redmineUrl);
  const url = sourceUrl.startsWith("http://") || sourceUrl.startsWith("https://")
    ? new URL(sourceUrl)
    : new URL(`${normalized}${sourceUrl.startsWith("/") ? "" : "/"}${sourceUrl}`);
  if (!url.searchParams.has("key")) url.searchParams.set("key", key);
  return url;
}

async function fetchAttachmentBuffer(redmineUrl, apiKey, contentUrl) {
  const url = buildAuthorizedUrl(redmineUrl, apiKey, contentUrl);
  const response = await redmine.fetchWithTimeout(url.toString(), { headers: { Accept: "*/*" } });
  if (!response.ok) throw new Error(`Ошибка загрузки файла: ${response.status} ${response.statusText}`);
  const mimeType = response.headers.get("content-type") || "application/octet-stream";
  const data = Buffer.from(await response.arrayBuffer());
  return { data, mimeType };
}

async function resolveConnectionForPayload(payload) {
  const settings = await readSettings();
  const metaUrl = db.getMeta("redmine_url", "");
  const metaKey = readMetaApiKey();
  return {
    redmineUrl: payload?.redmineUrl || settings.redmineUrl || metaUrl || "",
    apiKey: payload?.apiKey || settings.apiKey || metaKey || "",
  };
}

function deliverIssueOpenEvent(issueId) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("issue:open-from-link", { issueId });
    showMainWindow();
  } else {
    pendingOpenIssueId = issueId;
  }
}

function processPotentialProtocolValue(value) {
  const issueId = issueIdFromText(value);
  if (issueId) deliverIssueOpenEvent(issueId);
}

function computeTimerElapsedSeconds(timer) {
  if (!timer) return 0;
  const accumulated = Number(timer.accumulated_seconds) || 0;
  if (Number(timer.is_paused)) return accumulated;
  const startedMs = Date.parse(timer.started_at);
  if (!Number.isFinite(startedMs)) return accumulated;
  return accumulated + Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
}

/** Only positive Redmine activity ids are valid; -1/0/NaN → fallback from reference. */
function resolveTimeEntryActivity(preferredId) {
  const activities = db.getReferenceData("activities") || [];
  const preferred = Number(preferredId);
  if (Number.isFinite(preferred) && preferred > 0) {
    const match = activities.find((a) => Number(a.id) === preferred);
    if (match) return match;
  }
  return activities.find((a) => a.is_default) || activities[0] || null;
}

function buildTimerState(timer) {
  if (!timer) return null;
  return {
    ...timer,
    elapsedSeconds: computeTimerElapsedSeconds(timer),
  };
}

async function stopActiveTimerToDraft() {
  const timer = db.getActiveTimer();
  if (!timer) throw new Error("Нет активного таймера");
  const endedAt = new Date().toISOString();
  const elapsedSeconds = computeTimerElapsedSeconds(timer);
  // Redmine rejects 0h; keep at least 0.01h if the timer actually ran.
  const hoursRaw = Math.round((elapsedSeconds / 3600) * 100) / 100;
  let hours = elapsedSeconds > 0 ? Math.max(0.01, hoursRaw) : 0;
  try {
    const settings = await readSettings();
    hours = roundHoursToHalf(hours, settings.trackerMinFloorEnabled !== false);
    if (elapsedSeconds > 0 && hours <= 0) hours = 0.01;
  } catch {
    /* keep computed hours */
  }
  const spentOn = endedAt.slice(0, 10);
  const currentUser = db.getReferenceData("current_user");
  const issue = timer.issue_id ? db.getIssueById(timer.issue_id) : null;
  const activity = resolveTimeEntryActivity(timer.activity_id);

  const entry = db.insertLocalTimeEntry({
    issue_id: timer.issue_id || null,
    project_id: timer.project_id || issue?.project_id || null,
    project_name: issue?.project_name || "",
    user_id: currentUser?.id || null,
    user_name:
      currentUser?.name ||
      `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() ||
      "",
    hours,
    spent_on: spentOn,
    comments: timer.comment_draft || "",
    customer_name: timer.customer_name || "",
    activity_id: activity?.id || null,
    activity_name: activity?.name || "",
    sync_status: "draft",
    entry_source: "timer",
    entry_kind: timer.entry_kind || "work",
    started_at: (() => {
      const endMs = Date.parse(endedAt);
      if (!Number.isFinite(endMs)) return timer.started_at;
      return new Date(endMs - elapsedSeconds * 1000).toISOString();
    })(),
    ended_at: endedAt,
  });

  db.clearActiveTimer();
  try {
    await runConfiguredBackupSnapshot();
  } catch (error) {
    console.error("Backup after timer-stop failed:", error.message);
  }
  return { ok: true, entry, elapsedSeconds, hours };
}

function buildRunningEntryState(entry) {
  if (!entry) return null;
  const startedMs = Date.parse(entry.started_at);
  const elapsedSeconds = Number.isFinite(startedMs)
    ? Math.max(0, Math.floor((Date.now() - startedMs) / 1000))
    : 0;
  return {
    ...entry,
    elapsedSeconds,
    is_running: 1,
  };
}

function buildAllRunningTimerState() {
  const timers = db.getRunningTimeEntries().map(buildRunningEntryState);
  const legacy = buildTimerState(db.getActiveTimer());
  return {
    timers,
    current: timers[0] || legacy,
    // Keep flat fields for older debug UI that reads get-state as a single timer.
    ...(timers[0] || legacy || {}),
  };
}

async function stopRunningEntryToDraft(entryId) {
  const entry = db.getTimeEntryById(entryId);
  if (!entry || !Number(entry.is_running)) throw new Error("Нет активного таймера");
  const endedAt = new Date().toISOString();
  const startedMs = Date.parse(entry.started_at);
  const elapsedSeconds = Number.isFinite(startedMs)
    ? Math.max(0, Math.floor((Date.now() - startedMs) / 1000))
    : 0;
  const hoursRaw = Math.round((elapsedSeconds / 3600) * 100) / 100;
  let hours = elapsedSeconds > 0 ? Math.max(0.01, hoursRaw) : 0;
  try {
    const settings = await readSettings();
    hours = roundHoursToHalf(hours, settings.trackerMinFloorEnabled !== false);
    if (elapsedSeconds > 0 && hours <= 0) hours = 0.01;
  } catch {
    /* keep computed hours */
  }
  const updated = db.updateLocalTimeEntry(entryId, {
    hours,
    ended_at: endedAt,
    is_running: 0,
    sync_status: "draft",
    spent_on: endedAt.slice(0, 10),
  });
  try {
    await runConfiguredBackupSnapshot();
  } catch (error) {
    console.error("Backup after timer-stop failed:", error.message);
  }
  return { ok: true, entry: updated, elapsedSeconds, hours };
}

function startRunningTimerEntry(payload = {}) {
  const issueId = Number(payload.issueId);
  if (!Number.isFinite(issueId) || issueId <= 0) {
    return { ok: false, reason: "invalid-issue" };
  }
  const issue = db.getIssueById(issueId);
  const activity = resolveTimeEntryActivity(payload.activityId);
  const currentUser = db.getReferenceData("current_user");
  const startedAt = new Date().toISOString();
  const entry = db.insertLocalTimeEntry({
    issue_id: issueId,
    project_id: payload.projectId != null ? Number(payload.projectId) : issue?.project_id || null,
    project_name: payload.projectName || issue?.project_name || "",
    user_id: currentUser?.id || null,
    user_name:
      currentUser?.name ||
      `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() ||
      "",
    hours: 0,
    spent_on: startedAt.slice(0, 10),
    comments: payload.comment || "",
    customer_name: payload.customerName || "",
    activity_id: activity?.id || null,
    activity_name: activity?.name || "",
    sync_status: "draft",
    entry_source: "timer",
    entry_kind: payload.entryKind || "work",
    started_at: startedAt,
    ended_at: null,
    is_running: 1,
  });
  // Keep legacy singleton for recovery/idle until step G fully migrates.
  db.startActiveTimer({
    issueId,
    projectId: entry.project_id,
    activityId: entry.activity_id,
    entryKind: entry.entry_kind,
    comment: entry.comments,
    customerName: entry.customer_name,
  });
  return { ok: true, entry: buildRunningEntryState(entry), state: buildRunningEntryState(entry) };
}

function maybeBroadcastRecoveredTimer() {
  const running = db.getRunningTimeEntries();
  if (running.length) {
    broadcast("tracker:recovered-timer", buildAllRunningTimerState());
    return;
  }
  const timer = db.getActiveTimer();
  if (!timer) return;
  broadcast("tracker:recovered-timer", buildTimerState(timer));
}

function discardIdleFromActiveTimer(idleSeconds) {
  const timer = db.getActiveTimer();
  if (!timer) return null;
  const idle = Math.max(0, Math.floor(Number(idleSeconds) || 0));
  const elapsed = computeTimerElapsedSeconds(timer);
  const nextAccumulated = Math.max(0, elapsed - idle);
  db.getDb()
    .prepare(
      `UPDATE active_timer SET
        accumulated_seconds = @accumulated,
        started_at = @started_at
       WHERE id = 1`,
    )
    .run({
      accumulated: nextAccumulated,
      started_at: new Date().toISOString(),
    });
  return buildTimerState(db.getActiveTimer());
}

function buildIdleTimerLabels() {
  const running = db.getRunningTimeEntries();
  if (running.length) {
    return running.map((entry) => {
      const issue = entry.issue_id ? db.getIssueById(entry.issue_id) : null;
      return {
        entryId: entry.id,
        issueId: entry.issue_id || null,
        issueSubject: issue?.subject || "",
        projectName: entry.project_name || issue?.project_name || "",
        label: entry.issue_id
          ? `#${entry.issue_id}${issue?.subject ? ` ${issue.subject}` : ""}`
          : entry.project_name || `запись ${entry.id}`,
      };
    });
  }
  const legacy = db.getActiveTimer();
  if (!legacy) return [];
  const issue = legacy.issue_id ? db.getIssueById(legacy.issue_id) : null;
  return [
    {
      entryId: null,
      issueId: legacy.issue_id || null,
      issueSubject: issue?.subject || "",
      projectName: issue?.project_name || "",
      label: legacy.issue_id
        ? `#${legacy.issue_id}${issue?.subject ? ` ${issue.subject}` : ""}`
        : "активный таймер",
    },
  ];
}

function discardIdleFromRunningEntry(entryId, idleSeconds) {
  const entry = db.getTimeEntryById(entryId);
  if (!entry || !Number(entry.is_running)) return null;
  const idle = Math.max(0, Math.floor(Number(idleSeconds) || 0));
  const startedMs = Date.parse(entry.started_at);
  if (!Number.isFinite(startedMs)) return null;
  const elapsed = Math.max(0, Math.floor((Date.now() - startedMs) / 1000));
  const keepSeconds = Math.max(0, elapsed - idle);
  const newStartedAt = new Date(Date.now() - keepSeconds * 1000).toISOString();
  return db.updateLocalTimeEntry(entryId, { started_at: newStartedAt, hours: 0, ended_at: null });
}

async function applyMinFloorHours(elapsedSeconds) {
  const hoursRaw = Math.round((elapsedSeconds / 3600) * 100) / 100;
  let hours = elapsedSeconds > 0 ? Math.max(0.01, hoursRaw) : 0;
  try {
    const settings = await readSettings();
    hours = roundHoursToHalf(hours, settings.trackerMinFloorEnabled !== false);
    if (elapsedSeconds > 0 && hours <= 0) hours = 0.01;
  } catch {
    /* keep computed hours */
  }
  return hours;
}

async function resolveIdleAction({ action, idleSeconds, entryIds } = {}) {
  const idle = Math.max(0, Math.floor(Number(idleSeconds) || 0));
  const normalized = String(action || "keep");
  const running = db.getRunningTimeEntries();
  const idFilter = Array.isArray(entryIds) && entryIds.length
    ? new Set(entryIds.map(Number).filter((id) => Number.isFinite(id)))
    : null;
  const targets = idFilter
    ? running.filter((row) => idFilter.has(Number(row.id)))
    : running;

  if (normalized === "keep") {
    return { ok: true, action: "keep", state: buildAllRunningTimerState() };
  }

  if (normalized === "discard") {
    if (targets.length) {
      for (const row of targets) discardIdleFromRunningEntry(row.id, idle);
    } else {
      discardIdleFromActiveTimer(idle);
    }
    idleNotifiedForStretch = false;
    return { ok: true, action: "discard", state: buildAllRunningTimerState() };
  }

  if (normalized === "discard_continue") {
    const snapshots = (targets.length ? targets : []).map((row) => ({ ...row }));
    if (!snapshots.length) {
      const legacy = db.getActiveTimer();
      if (!legacy) return { ok: false, reason: "no-timer" };
      const legacySnap = { ...legacy };
      discardIdleFromActiveTimer(idle);
      const stopped = await stopActiveTimerToDraft();
      const restarted = startRunningTimerEntry({
        issueId: legacySnap.issue_id,
        projectId: legacySnap.project_id,
        activityId: legacySnap.activity_id,
        comment: legacySnap.comment_draft || "",
        customerName: legacySnap.customer_name || "",
        entryKind: legacySnap.entry_kind || "work",
      });
      idleNotifiedForStretch = false;
      return {
        ok: true,
        action: "discard_continue",
        stopped,
        started: restarted,
        state: buildAllRunningTimerState(),
      };
    }

    const started = [];
    const stopped = [];
    for (const row of snapshots) {
      discardIdleFromRunningEntry(row.id, idle);
      const done = await stopRunningEntryToDraft(row.id);
      stopped.push(done);
      const next = startRunningTimerEntry({
        issueId: row.issue_id,
        projectId: row.project_id,
        projectName: row.project_name,
        activityId: row.activity_id,
        comment: row.comments || "",
        customerName: row.customer_name || "",
        entryKind: row.entry_kind || "work",
      });
      started.push(next);
    }
    idleNotifiedForStretch = false;
    return { ok: true, action: "discard_continue", stopped, started, state: buildAllRunningTimerState() };
  }

  if (normalized === "split_idle") {
    const now = new Date();
    const idleStart = new Date(now.getTime() - idle * 1000);
    const idleStartIso = idleStart.toISOString();
    const nowIso = now.toISOString();
    const results = [];

    if (!targets.length) {
      const legacy = db.getActiveTimer();
      if (!legacy) return { ok: false, reason: "no-timer" };
      const elapsed = computeTimerElapsedSeconds(legacy);
      const workSeconds = Math.max(0, elapsed - idle);
      const workHours = await applyMinFloorHours(workSeconds);
      const currentUser = db.getReferenceData("current_user");
      const issue = legacy.issue_id ? db.getIssueById(legacy.issue_id) : null;
      const activity = resolveTimeEntryActivity(legacy.activity_id);
      const userName =
        currentUser?.name ||
        `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() ||
        "";
      const workStartedAt = Number.isFinite(Date.parse(legacy.started_at))
        ? new Date(idleStart.getTime() - workSeconds * 1000).toISOString()
        : idleStartIso;
      const workEntry = db.insertLocalTimeEntry({
        issue_id: legacy.issue_id || null,
        project_id: legacy.project_id || issue?.project_id || null,
        project_name: issue?.project_name || "",
        user_id: currentUser?.id || null,
        user_name: userName,
        hours: workHours,
        spent_on: idleStartIso.slice(0, 10),
        comments: legacy.comment_draft || "",
        customer_name: legacy.customer_name || "",
        activity_id: activity?.id || null,
        activity_name: activity?.name || "",
        sync_status: "draft",
        entry_source: "timer",
        entry_kind: legacy.entry_kind || "work",
        started_at: workStartedAt,
        ended_at: idleStartIso,
      });
      const idleEntry = db.insertLocalTimeEntry({
        issue_id: legacy.issue_id || null,
        project_id: legacy.project_id || issue?.project_id || null,
        project_name: issue?.project_name || "",
        user_id: currentUser?.id || null,
        user_name: userName,
        hours: idle > 0 ? Math.max(0.01, Math.round((idle / 3600) * 100) / 100) : 0,
        spent_on: nowIso.slice(0, 10),
        comments: "Простой (авто)",
        customer_name: legacy.customer_name || "",
        activity_id: activity?.id || null,
        activity_name: activity?.name || "",
        sync_status: "draft",
        entry_source: "timer",
        entry_kind: "idle",
        started_at: idleStartIso,
        ended_at: nowIso,
      });
      db.clearActiveTimer();
      idleNotifiedForStretch = false;
      return {
        ok: true,
        action: "split_idle",
        results: [{ workEntry, idleEntry }],
        state: buildAllRunningTimerState(),
      };
    }

    for (const row of targets) {
      const startedMs = Date.parse(row.started_at);
      const workSeconds = Number.isFinite(startedMs)
        ? Math.max(0, Math.floor((idleStart.getTime() - startedMs) / 1000))
        : 0;
      const workHours = await applyMinFloorHours(workSeconds);
      const workEntry = db.updateLocalTimeEntry(row.id, {
        hours: workHours,
        ended_at: idleStartIso,
        is_running: 0,
        sync_status: "draft",
        spent_on: idleStartIso.slice(0, 10),
      });
      const idleEntry = db.insertLocalTimeEntry({
        issue_id: row.issue_id || null,
        project_id: row.project_id || null,
        project_name: row.project_name || "",
        user_id: row.user_id || null,
        user_name: row.user_name || "",
        hours: idle > 0 ? Math.max(0.01, Math.round((idle / 3600) * 100) / 100) : 0,
        spent_on: nowIso.slice(0, 10),
        comments: row.comments ? `${row.comments} · Простой (авто)` : "Простой (авто)",
        customer_name: row.customer_name || "",
        activity_id: row.activity_id || null,
        activity_name: row.activity_name || "",
        sync_status: "draft",
        entry_source: "timer",
        entry_kind: "idle",
        started_at: idleStartIso,
        ended_at: nowIso,
      });
      results.push({ workEntry, idleEntry });
    }
    db.clearActiveTimer();
    idleNotifiedForStretch = false;
    return { ok: true, action: "split_idle", results, state: buildAllRunningTimerState() };
  }

  return { ok: false, reason: "unknown-action" };
}

function scheduleIdleWatch() {
  if (idleWatchTimer) {
    clearInterval(idleWatchTimer);
    idleWatchTimer = null;
  }
  idleWatchTimer = setInterval(() => {
    try {
      let entryMode = defaultSettings.trackerEntryMode || "timer";
      let thresholdMinutes = defaultSettings.idleThresholdMinutes || 5;
      try {
        const raw = fsSync.readFileSync(getSettingsPath(), "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.trackerEntryMode) entryMode = String(parsed.trackerEntryMode);
        if (parsed.idleThresholdMinutes !== undefined && parsed.idleThresholdMinutes !== null) {
          thresholdMinutes = Number(parsed.idleThresholdMinutes);
        }
      } catch {
        /* keep defaults */
      }
      // Idle prompts only make sense in timer mode (▶/■ visible).
      if (entryMode !== "timer") {
        idleNotifiedForStretch = false;
        return;
      }

      const running = db.getRunningTimeEntries();
      const legacy = db.getActiveTimer();
      const hasRunning = running.length > 0 || (legacy && !Number(legacy.is_paused));
      if (!hasRunning) {
        idleNotifiedForStretch = false;
        return;
      }
      const idleSeconds = Number(powerMonitor.getSystemIdleTime()) || 0;
      // 0 = 20s test mode; otherwise minutes (min 20s floor for safety on fractional).
      const thresholdSeconds =
        thresholdMinutes === 0 ? 20 : Math.max(20, (Number(thresholdMinutes) || 5) * 60);
      if (idleSeconds >= thresholdSeconds) {
        if (!idleNotifiedForStretch) {
          idleNotifiedForStretch = true;
          broadcast("tracker:idle-detected", {
            idleSeconds,
            timers: buildIdleTimerLabels(),
          });
        }
      } else {
        idleNotifiedForStretch = false;
      }
    } catch (error) {
      console.error("Idle watch failed:", error.message);
    }
  }, 30000);
  if (typeof idleWatchTimer.unref === "function") idleWatchTimer.unref();
}

function scheduleAutosync() {
  if (autosyncTimer) {
    clearInterval(autosyncTimer);
    autosyncTimer = null;
  }

  readSettings().then((settings) => {
    if (!settings.autosyncEnabled || !settings.onboardingComplete) return;
    const minutes = Number(settings.autosyncIntervalMinutes) || 5;
    autosyncTimer = setInterval(
      () => {
        runIncrementalSyncSafe();
      },
      minutes * 60 * 1000,
    );
  });
}

async function runIncrementalSyncSafe() {
  if (!isOnline()) return;
  const settings = await readSettings();
  if (!settings.redmineUrl || !settings.apiKey) return;
  try {
    // Flush outbound edits first so a download cannot overwrite pending local changes.
    await offlineQueue.flushOfflineQueue(settings.redmineUrl, settings.apiKey);
    await syncEngine.runIncrementalSync({
      redmineUrl: settings.redmineUrl,
      apiKey: settings.apiKey,
      onProgress: broadcastSyncProgress,
    });
    broadcastNetworkStatus();
    publishDeadlineAlerts();
    publishActivityUpdated();
  } catch (error) {
    console.error("Incremental sync failed:", error.message);
  }
}

function mapDbIssueToUi(row) {
  return {
    id: row.id,
    subject: row.subject,
    project: { id: row.project_id, name: row.project_name },
    tracker: { id: row.tracker_id, name: row.tracker_name },
    status: { id: row.status_id, name: row.status_name, is_closed: Boolean(row.status_is_closed) },
    priority: { id: row.priority_id, name: row.priority_name },
    author: { id: row.author_id, name: row.author_name },
    assigned_to: row.assigned_to_id ? { id: row.assigned_to_id, name: row.assigned_to_name } : null,
    parent: row.parent_id ? { id: row.parent_id, subject: row.parent_subject || "" } : null,
    start_date: row.start_date,
    due_date: row.due_date,
    done_ratio: row.done_ratio,
    estimated_hours: row.estimated_hours,
    spent_hours: row.spent_hours,
    created_on: row.created_on,
    updated_on: row.updated_on,
    description: row.description,
    has_detail: Boolean(row.has_detail),
  };
}

function mapDbIssueDetailToUi(detail) {
  return {
    id: detail.id,
    subject: detail.subject,
    description: detail.description,
    project: { id: detail.project_id, name: detail.project_name },
    tracker: { id: detail.tracker_id, name: detail.tracker_name },
    status: { id: detail.status_id, name: detail.status_name, is_closed: Boolean(detail.status_is_closed) },
    priority: { id: detail.priority_id, name: detail.priority_name },
    author: { id: detail.author_id, name: detail.author_name },
    assigned_to: detail.assigned_to_id ? { id: detail.assigned_to_id, name: detail.assigned_to_name } : null,
    start_date: detail.start_date,
    due_date: detail.due_date,
    done_ratio: detail.done_ratio,
    estimated_hours: detail.estimated_hours,
    spent_hours: detail.spent_hours,
    created_on: detail.created_on,
    updated_on: detail.updated_on,
    custom_fields: (detail.custom_fields || []).map((field) => ({
      id: field.field_id,
      name: field.field_name,
      value: field.field_value,
    })),
    journals: detail.journals || [],
    attachments: (detail.attachments || []).map((att) => ({
      id: att.id,
      filename: att.filename,
      filesize: att.filesize,
      content_type: att.content_type,
      content_url: att.content_url,
      description: att.description,
      author: { name: att.author_name },
      created_on: att.created_on,
    })),
    parent: detail.parent || null,
    children: detail.children || [],
    relations: detail.relations || [],
    watchers: detail.watchers || [],
    allowed_statuses: Array.isArray(detail.allowed_statuses) ? detail.allowed_statuses : null,
    allowed_statuses_unsupported: Boolean(detail.allowed_statuses_unsupported),
  };
}

async function createMainWindow() {
  const settings = await readSettings();
  const savedWindow = settings.windowState || defaultSettings.windowState;
  const cacheStats = db.getCacheStats(db.getDbPath(app.getPath("userData")));
  const onboardingComplete =
    settings.onboardingComplete ||
    db.getMeta("onboarding_complete") === "1" ||
    (settings.redmineUrl && settings.apiKey && cacheStats.issuesCount > 0);

  const appIconPath = resolveAppIcon();
  const appIconImage = loadAppIconImage();

  mainWindow = new BrowserWindow({
    width: Math.max(savedWindow.width || 1100, 980),
    height: Math.max(savedWindow.height || 760, 680),
    minWidth: 980,
    minHeight: 680,
    icon: appIconImage || appIconPath,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true,
    },
    title: "RM Client",
    autoHideMenuBar: true,
  });
  mainWindow.setMenuBarVisibility(false);
  if (appIconImage) mainWindow.setIcon(appIconImage);
  else if (appIconPath) mainWindow.setIcon(appIconPath);
  configureSpellcheckSession(mainWindow.webContents.session);
  attachSpellcheckContextMenu(mainWindow);

  mainWindow.on("app-command", (event, cmd) => {
    if (cmd !== "browser-backward") return;
    event.preventDefault();
    if (!mainWindow.webContents.getURL().includes("onboarding.html")) {
      mainWindow.webContents.send("app:navigate-back");
    }
  });

  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown" || !input.alt || input.control || input.meta || input.shift) return;
    const key = String(input.key || "");
    if (key !== "ArrowLeft" && key !== "Left") return;
    event.preventDefault();
    if (!mainWindow.webContents.getURL().includes("onboarding.html")) {
      mainWindow.webContents.send("app:navigate-back");
    }
  });

  mainWindow.on("close", () => {
    saveWindowState();
  });

  mainWindow.webContents.on("did-finish-load", () => {
    configureSpellcheckSession(mainWindow.webContents.session);
    if (pendingOpenIssueId) {
      mainWindow.webContents.send("issue:open-from-link", { issueId: pendingOpenIssueId });
      pendingOpenIssueId = null;
    }
    if (!mainWindow.webContents.getURL().includes("onboarding.html")) {
      mainWindow.webContents.executeJavaScript(
        "history.replaceState({ appView: 'issues' }, '', 'index.html');",
        true,
      );
      maybeBroadcastRecoveredTimer();
    }
    broadcastNetworkStatus();
    broadcast("sync:progress", syncEngine.getSyncStatus());
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (url.includes("onboarding.html")) {
      event.preventDefault();
      mainWindow.webContents.send("app:navigate-back");
    }
  });

  const startPage = onboardingComplete ? "index.html" : "onboarding.html";
  mainWindow.loadFile(path.join(__dirname, "renderer", startPage));
}

function registerIpcHandlers() {
  ipcMain.handle("settings:load", async () => {
    const settings = await readSettings();
    if (!settings.redmineUrl) settings.redmineUrl = db.getMeta("redmine_url", "") || "";
    if (!settings.apiKey) settings.apiKey = readMetaApiKey() || "";
    return settings;
  });
  ipcMain.handle("settings:save", (_, settings) => {
    scheduleAutosync();
    scheduleAutoBackups();
    return writeSettings(settings).then((saved) => {
      persistCredentials(saved.redmineUrl, saved.apiKey);
      publishDeadlineAlerts();
      return saved;
    });
  });

  ipcMain.handle("app:get-backup-settings", async () => {
    const settings = await readSettings();
    return {
      backupFolder: settings.backupFolder || "",
      autoBackupEnabled: settings.autoBackupEnabled !== false,
      defaultBackupFolder: getDefaultBackupsDir(),
      idleThresholdMinutes: Number(settings.idleThresholdMinutes) || 5,
    };
  });

  ipcMain.handle("app:backup-now", async () => {
    const snapshotPath = await runConfiguredBackupSnapshot();
    return { ok: true, path: snapshotPath };
  });

  ipcMain.handle("app:choose-backup-folder", async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    const parent = win && !win.isDestroyed() ? win : undefined;
    const result = await dialog.showOpenDialog(parent, {
      title: "Папка для резервных копий",
      properties: ["openDirectory", "createDirectory"],
    });
    if (result.canceled || !result.filePaths?.length) {
      return { ok: false, canceled: true };
    }
    const folder = result.filePaths[0];
    const saved = await writeSettings({ backupFolder: folder });
    scheduleAutoBackups();
    return { ok: true, backupFolder: saved.backupFolder || folder };
  });

  ipcMain.handle("network:get-status", () => ({
    online: isOnline(),
    queueCount: db.getOfflineQueue().length,
  }));

  ipcMain.handle("app:get-version", () => app.getVersion());

  ipcMain.handle("app:open-external-url", async (_, payload) => {
    const settings = await readSettings();
    const url = String(payload?.url || "").trim();
    if (!url) throw new Error("Пустая ссылка");
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error("Некорректная ссылка");
    }
    if (!/^https?:$/i.test(parsed.protocol)) {
      throw new Error("Разрешены только http/https ссылки");
    }
    const baseRaw = redmine.normalizeRedmineUrl(settings.redmineUrl || "");
    if (baseRaw) {
      try {
        const baseUrl = new URL(baseRaw);
        if (parsed.host !== baseUrl.host) {
          throw new Error("Ссылка должна вести на ваш Redmine");
        }
      } catch (error) {
        if (String(error.message || "").includes("Redmine")) throw error;
      }
    }
    await shell.openExternal(url);
    return { ok: true };
  });

  ipcMain.handle("app:set-favorite-issue-ids", (_, payload) => {
    const ids = (Array.isArray(payload?.ids) ? payload.ids : [])
      .map(Number)
      .filter((id) => Number.isFinite(id) && id > 0);
    db.setMeta("favorite_issue_ids", JSON.stringify(ids));
    return { ok: true, ids };
  });

  ipcMain.handle("redmine:get-issue-form-fields", async (_, payload) => {
    const settings = await readSettings();
    const redmineUrl = payload?.redmineUrl || settings.redmineUrl;
    const apiKey = payload?.apiKey || settings.apiKey;
    const projectId = Number(payload?.projectId);
    const trackerId = Number(payload?.trackerId);
    if (!redmineUrl || !apiKey) throw new Error("Нет подключения к Redmine");
    const cacheKey = `cf_defs_v4_${projectId}_${trackerId}`;
    if (!payload?.forceRefresh) {
      const cached = db.getReferenceData(cacheKey);
      if (Array.isArray(cached) && cached.length) return cached;
    }
    try {
      const fields = await redmine.fetchIssueFormFields(redmineUrl, apiKey, projectId, trackerId);
      db.saveReferenceData(cacheKey, fields || []);
      return fields || [];
    } catch (error) {
      // /issues/new.json часто недоступен (403) без права «Добавлять задачи».
      const cached = db.getReferenceData(cacheKey);
      if (Array.isArray(cached) && cached.length) return cached;
      return [];
    }
  });

  ipcMain.handle("redmine:test-connection", async (_, payload) => {
    const result = await redmine.testConnection(payload?.redmineUrl, payload?.apiKey);
    if (result?.ok) {
      persistCredentials(payload?.redmineUrl, payload?.apiKey);
    }
    return result;
  });

  ipcMain.handle("redmine:load-reference-data", async (_, payload) => {
    const reference = await redmine.loadReferenceData(payload?.redmineUrl, payload?.apiKey);
    persistCredentials(payload?.redmineUrl, payload?.apiKey);
    const cached = referenceData.persistReferenceData(db, reference);
    return {
      projects: cached.projects,
      users: cached.users,
      issueStatuses: cached.issueStatuses,
      issue_statuses: cached.issueStatuses,
      trackers: cached.trackers,
      priorities: cached.priorities,
      activities: cached.activities,
      roles: cached.roles,
      currentUser: cached.currentUser,
      current_user: cached.currentUser,
    };
  });

  ipcMain.handle("redmine:ensure-reference-data", async (_, payload) => {
    const settings = await readSettings();
    const redmineUrl = payload?.redmineUrl || settings.redmineUrl;
    const apiKey = payload?.apiKey || settings.apiKey;
    if (!redmineUrl || !apiKey) {
      return referenceData.getCachedReference(db);
    }
    const cached = await referenceData.ensureReferenceData(db, redmine, redmineUrl, apiKey);
    return {
      projects: cached.projects,
      users: cached.users,
      issueStatuses: cached.issueStatuses,
      issue_statuses: cached.issueStatuses,
      trackers: cached.trackers,
      priorities: cached.priorities,
      activities: cached.activities,
      roles: cached.roles,
      currentUser: cached.currentUser,
      current_user: cached.currentUser,
    };
  });

  ipcMain.handle("db:get-reference-data", () => db.getAllReferenceData());

  ipcMain.handle("db:get-assignees", (_, payload) => {
    const projectIds = Array.isArray(payload?.projectIds)
      ? payload.projectIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
      : null;
    const fromIssues = db.getDistinctAssignees(projectIds);
    const currentUser = db.getReferenceData("current_user");
    const merged = new Map();
    fromIssues.forEach((user) => {
      if (user?.id) merged.set(Number(user.id), { id: user.id, name: user.name });
    });
    if (currentUser?.id && !merged.has(Number(currentUser.id))) {
      merged.set(Number(currentUser.id), {
        id: currentUser.id,
        name: currentUser.name || `${currentUser.firstname || ""} ${currentUser.lastname || ""}`.trim(),
      });
    }
    return Array.from(merged.values()).sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
  });

  ipcMain.handle("db:get-authors", (_, payload) => {
    const projectIds = Array.isArray(payload?.projectIds)
      ? payload.projectIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
      : null;
    return db.getDistinctAuthors(projectIds);
  });

  ipcMain.handle("db:get-open-children", (_, issueIds) => db.getOpenChildrenForIssues(issueIds));

  ipcMain.handle("db:get-customer-names", () => db.getDistinctCustomerNames());

  ipcMain.handle("db:get-time-entries-report", (_, payload) => db.getTimeEntriesForReport(payload || {}));

  ipcMain.handle("db:get-issues", async (_, payload) => {
    const currentUser = db.getReferenceData("current_user");
    const scope = payload?.filters?.issueScope || "all";
    const favoriteIds = Array.isArray(payload?.filters?.favoriteIds)
      ? payload.filters.favoriteIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
      : [];
    const favoritesBare =
      payload?.filters?.favoritesBare != null
        ? Boolean(payload.filters.favoritesBare)
        : scope === "favorites";
    const rows = db.queryIssues({
      // «Избранные» в списке задач — быстрый доступ из любых проектов.
      // В подборе трекера favoritesBare=false и фильтр проекта/поиска действует.
      projectId: scope === "favorites" && favoritesBare ? "all" : payload?.filters?.selectedProjectId,
      statusId: payload?.filters?.selectedStatusId,
      statusIds: payload?.filters?.selectedStatusIds,
      priorityIds: payload?.filters?.selectedPriorityIds,
      // Scope «Мои» always means assignee = current user on the backend.
      assigneeId: scope === "mine" ? "me" : payload?.filters?.selectedAssigneeId,
      authorIds: payload?.filters?.selectedAuthorIds,
      searchQuery: payload?.filters?.searchQuery,
      searchDeep: Boolean(payload?.filters?.searchDeep),
      openStatusIds: payload?.filters?.openStatusIds,
      openOnly: payload?.filters?.openOnly,
      scope,
      favoriteIds,
      currentUserId: currentUser?.id,
      dueFrom: payload?.filters?.dueFrom || null,
      dueTo: payload?.filters?.dueTo || null,
      dueEmptyOnly: Boolean(payload?.filters?.dueEmptyOnly),
      estimateMode: payload?.filters?.estimateMode,
      favoritesBare,
      restrictToEnabledProjects: !(scope === "favorites" && favoritesBare),
    });
    let mapped = rows.map(mapDbIssueToUi);
    if (scope === "favorites" && favoriteIds.length) {
      const order = new Map(favoriteIds.map((id, i) => [Number(id), i]));
      mapped = mapped.slice().sort(
        (a, b) => (order.get(Number(a.id)) ?? 1e9) - (order.get(Number(b.id)) ?? 1e9),
      );
    }
    return mapped;
  });

  ipcMain.handle("db:get-board-issues", async (_, payload) => {
    const projectId = payload?.filters?.selectedProjectId;
    if (!projectId || projectId === "all") return [];
    const rows = db.queryIssues({
      projectId,
    });
    return rows.map(mapDbIssueToUi);
  });

  ipcMain.handle("db:get-project-statuses", async (_, payload) => {
    const projectId = Number(payload?.projectId);
    if (!projectId) return [];
    const rows = db.queryProjectStatuses(projectId);
    const reference = db.getReferenceData("issue_statuses") || [];
    const orderMap = new Map(reference.map((status, index) => [Number(status.id), index]));
    return rows
      .slice()
      .sort((a, b) => {
        const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : Number(a.id);
        const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : Number(b.id);
        return orderA - orderB;
      })
      .map((row) => ({
        id: row.id,
        name: row.name,
        is_closed: row.is_closed,
        issue_count: row.issue_count,
      }));
  });

  ipcMain.handle("db:get-issue", async (_, payload) => {
    const connection = await resolveConnectionForPayload(payload);
    let detail = null;

    if (isOnline() && connection.redmineUrl && connection.apiKey) {
      detail = await syncEngine.getIssueDetail(connection.redmineUrl, connection.apiKey, payload?.issueId, {
        forceRefresh: Boolean(payload?.forceRefresh),
      });
    } else {
      detail = db.getIssueById(payload?.issueId);
    }

    if (!detail) return null;
    return mapDbIssueDetailToUi(detail);
  });

  ipcMain.handle("db:get-allowed-statuses", async (_, payload) => {
    const issueId = payload?.issueId;
    const cached = issueId ? db.getIssueById(issueId) : null;
    if (cached?.allowed_statuses_unsupported) {
      return { statuses: null, unsupported: true, source: "cache" };
    }
    if (Array.isArray(cached?.allowed_statuses) && !payload?.forceRefresh) {
      return { statuses: cached.allowed_statuses, unsupported: false, source: "cache" };
    }
    if (!isOnline()) {
      if (Array.isArray(cached?.allowed_statuses)) {
        return { statuses: cached.allowed_statuses, unsupported: false, source: "cache" };
      }
      return { statuses: null, unavailable: true, source: "offline" };
    }

    const connection = await resolveConnectionForPayload(payload);
    if (!connection.redmineUrl || !connection.apiKey) {
      return {
        statuses: Array.isArray(cached?.allowed_statuses) ? cached.allowed_statuses : null,
        unavailable: true,
        source: "offline",
      };
    }

    const detail = await syncEngine.getIssueDetail(connection.redmineUrl, connection.apiKey, issueId, {
      forceRefresh: true,
    });
    const mapped = detail ? mapDbIssueDetailToUi(detail) : null;
    if (Array.isArray(mapped?.allowed_statuses)) {
      return { statuses: mapped.allowed_statuses, unsupported: false, source: "network" };
    }
    if (mapped?.allowed_statuses_unsupported) {
      return { statuses: null, unsupported: true, source: "network" };
    }
    if (issueId) db.saveAllowedStatuses(issueId, null, { unsupported: true });
    return { statuses: null, unsupported: true, source: "network" };
  });

  ipcMain.handle("db:get-cache-stats", () => {
    const dbPath = db.getDbPath(app.getPath("userData"));
    return db.getCacheStats(dbPath);
  });

  ipcMain.handle("app:get-data-paths", () => {
    const userData = app.getPath("userData");
    const exePath = app.getPath("exe");
    return {
      userData,
      settingsFile: path.join(userData, SETTINGS_FILE),
      cacheDb: db.getDbPath(userData),
      logs: app.getPath("logs"),
      installDir: path.dirname(exePath),
      executable: exePath,
    };
  });

  // Prefer this over renderer window.confirm — on Windows Electron, TaskDialog
  // from confirm()/alert() can leave the window unable to open <select> menus
  // until the user Alt-Tabs away and back (electron#31917 / #41603).
  ipcMain.handle("app:confirm", async (event, payload = {}) => {
    const win = BrowserWindow.fromWebContents(event.sender) || mainWindow;
    const parent = win && !win.isDestroyed() ? win : undefined;
    const buttons = Array.isArray(payload.buttons) && payload.buttons.length
      ? payload.buttons
      : ["Отмена", "OK"];
    const confirmId = Number.isInteger(payload.confirmId) ? payload.confirmId : buttons.length - 1;
    const cancelId = Number.isInteger(payload.cancelId) ? payload.cancelId : 0;
    const result = await dialog.showMessageBox(parent, {
      type: payload.type || "question",
      title: payload.title || "RM Client",
      message: String(payload.message || ""),
      detail: payload.detail ? String(payload.detail) : undefined,
      buttons,
      defaultId: Number.isInteger(payload.defaultId) ? payload.defaultId : confirmId,
      cancelId,
      noLink: true,
    });
    if (parent) {
      parent.focus();
      parent.webContents?.focus();
    }
    if (payload.returnIndex) return result.response;
    return result.response === confirmId;
  });

  ipcMain.handle("app:open-path", async (_, payload) => {
    const target = String(payload?.path || "").trim();
    if (!target) return { ok: false, message: "Путь не указан" };
    try {
      if (!fsSync.existsSync(target)) {
        return { ok: false, message: "Путь не найден на диске" };
      }
      const result = await shell.openPath(target);
      if (result) return { ok: false, message: result };
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Не удалось открыть" };
    }
  });

  ipcMain.handle("app:show-item-in-folder", async (_, payload) => {
    const target = String(payload?.path || "").trim();
    if (!target) return { ok: false, message: "Путь не указан" };
    try {
      if (!fsSync.existsSync(target)) {
        return { ok: false, message: "Файл не найден на диске" };
      }
      shell.showItemInFolder(target);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Не удалось открыть папку" };
    }
  });

  ipcMain.handle("db:get-sync-projects", () => db.getSyncProjects());

  ipcMain.handle("db:clear-cache", () => {
    db.clearCacheData();
    return { ok: true };
  });

  ipcMain.handle("sync:get-status", () => syncEngine.getSyncStatus());

  ipcMain.handle("sync:start-full", async (_, payload) => {
    const settings = await readSettings();
    const redmineUrl = payload?.redmineUrl || settings.redmineUrl;
    const apiKey = payload?.apiKey || settings.apiKey;
    const projectIds = (payload?.projectIds || []).map(Number).filter(Boolean);
    const cacheMode = payload?.cacheMode || settings.cacheMode || "issues-history";

    await writeSettings({
      ...settings,
      redmineUrl,
      apiKey,
      cacheMode,
      autosyncEnabled: payload?.autosyncEnabled ?? settings.autosyncEnabled,
      autosyncIntervalMinutes: payload?.autosyncIntervalMinutes ?? settings.autosyncIntervalMinutes,
      onboardingComplete: true,
    });

    db.setMeta("onboarding_complete", "1");
    db.setMeta("cache_mode", cacheMode);
    persistCredentials(redmineUrl, apiKey);

    const result = await syncEngine.runFullSync({
      redmineUrl,
      apiKey,
      projectIds,
      cacheMode,
      onProgress: broadcastSyncProgress,
    });

    scheduleAutosync();
    broadcastNetworkStatus();
    publishDeadlineAlerts();
    publishActivityUpdated();
    return result || { ok: true };
  });

  ipcMain.handle("sync:update-projects", async (_, payload) => {
    const settings = await readSettings();
    const redmineUrl = payload?.redmineUrl || settings.redmineUrl;
    const apiKey = payload?.apiKey || settings.apiKey;
    const cacheMode = payload?.cacheMode || settings.cacheMode || "issues-history";
    const enabledProjectIds = (payload?.enabledProjectIds || []).map(Number).filter(Boolean);
    const projects = Array.isArray(payload?.projects) ? payload.projects : [];

    const result = await syncEngine.applySyncProjectsSelection({
      redmineUrl,
      apiKey,
      enabledProjectIds,
      projects,
      cacheMode,
      onProgress: broadcastSyncProgress,
    });

    scheduleAutosync();
    broadcastNetworkStatus();
    publishDeadlineAlerts();
    publishActivityUpdated();
    return result;
  });

  ipcMain.handle("sync:incremental", async () => {
    const settings = await readSettings();
    if (!settings.redmineUrl || !settings.apiKey) {
      return { ok: false, skipped: true, reason: "no_credentials" };
    }
    // Flush first: pending time-entry edits must reach Redmine before we pull.
    await offlineQueue.flushOfflineQueue(settings.redmineUrl, settings.apiKey);
    const result = await syncEngine.runIncrementalSync({
      redmineUrl: settings.redmineUrl,
      apiKey: settings.apiKey,
      onProgress: broadcastSyncProgress,
    });
    broadcastNetworkStatus();
    if (result?.ok) {
      publishDeadlineAlerts();
      publishActivityUpdated();
    }
    return result || { ok: false, skipped: true, reason: "unknown" };
  });

  ipcMain.handle("sync:cancel", () => {
    syncEngine.cancelSync();
    return { ok: true };
  });

  ipcMain.handle("onboarding:complete", async (_, payload) => {
    const settings = await readSettings();
    await writeSettings({
      ...settings,
      redmineUrl: payload?.redmineUrl || settings.redmineUrl,
      apiKey: payload?.apiKey || settings.apiKey,
      onboardingComplete: true,
      cacheMode: payload?.cacheMode || settings.cacheMode,
      autosyncEnabled: payload?.autosyncEnabled ?? true,
      autosyncIntervalMinutes: payload?.autosyncIntervalMinutes ?? 5,
    });
    db.setMeta("onboarding_complete", "1");
    persistCredentials(payload?.redmineUrl || settings.redmineUrl, payload?.apiKey || settings.apiKey);
    return { ok: true };
  });

  ipcMain.handle("app:open-main", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
    }
    return { ok: true };
  });

  ipcMain.handle("redmine:resolve-issue-id", (_, payload) => ({
    issueId: issueIdFromText(payload?.value),
  }));

  ipcMain.handle("redmine:update-issue", async (_, payload) => {
    const settings = await readSettings();
    const issueId = payload?.issueId;
    const patch = payload?.patch || {};
    const issueData = {};

    if (patch.subject !== undefined) issueData.subject = String(patch.subject || "").trim();
    if (patch.description !== undefined) issueData.description = String(patch.description || "");
    if (patch.status_id !== undefined && patch.status_id !== "") issueData.status_id = Number(patch.status_id);
    if (patch.assigned_to_id !== undefined && patch.assigned_to_id !== "") {
      issueData.assigned_to_id = Number(patch.assigned_to_id);
    }
    if (patch.priority_id !== undefined && patch.priority_id !== "") issueData.priority_id = Number(patch.priority_id);
    if (patch.start_date !== undefined) issueData.start_date = patch.start_date || null;
    if (patch.due_date !== undefined) issueData.due_date = patch.due_date || null;
    if (patch.done_ratio !== undefined && patch.done_ratio !== "") issueData.done_ratio = Number(patch.done_ratio);
    if (patch.estimated_hours !== undefined && patch.estimated_hours !== "") {
      issueData.estimated_hours = Number(patch.estimated_hours);
    }
    if (Array.isArray(patch.custom_fields)) {
      issueData.custom_fields = patch.custom_fields
        .map((field) => ({
          id: Number(field.id),
          value: field.value == null ? "" : String(field.value),
        }))
        .filter((field) => Number.isFinite(field.id));
    }
    if (patch.watcher_user_ids !== undefined) {
      issueData.watcher_user_ids = Array.isArray(patch.watcher_user_ids)
        ? patch.watcher_user_ids.map((id) => Number(id)).filter((id) => Number.isFinite(id))
        : [];
    }
    if (patch.notes !== undefined) issueData.notes = String(patch.notes || "");
    const files = Array.isArray(patch.files) ? patch.files : [];

    const options = {};
    if (patch.localDescription !== undefined) {
      options.localPatch = {
        ...issueData,
        description: String(patch.localDescription || ""),
      };
    }

    return offlineQueue.updateIssueWithOffline(
      settings.redmineUrl,
      settings.apiKey,
      issueId,
      issueData,
      files,
      options,
    );
  });

  ipcMain.handle("redmine:create-issue", async (_, payload) => {
    const connection = await resolveConnectionForPayload(payload);
    const patch = payload?.patch || {};
    const issueData = {};

    if (patch.project_id !== undefined && patch.project_id !== "") issueData.project_id = Number(patch.project_id);
    if (patch.tracker_id !== undefined && patch.tracker_id !== "") issueData.tracker_id = Number(patch.tracker_id);
    if (patch.subject !== undefined) issueData.subject = String(patch.subject || "").trim();
    if (patch.description !== undefined) issueData.description = String(patch.description || "").trim();
    if (patch.assigned_to_id !== undefined && patch.assigned_to_id !== "") {
      issueData.assigned_to_id = Number(patch.assigned_to_id);
    }
    if (patch.priority_id !== undefined && patch.priority_id !== "") issueData.priority_id = Number(patch.priority_id);
    if (patch.parent_issue_id !== undefined && patch.parent_issue_id !== "") {
      issueData.parent_issue_id = Number(patch.parent_issue_id);
    }
    if (patch.start_date !== undefined && patch.start_date !== "") issueData.start_date = String(patch.start_date);
    if (patch.due_date !== undefined && patch.due_date !== "") issueData.due_date = String(patch.due_date);
    if (patch.estimated_hours !== undefined && patch.estimated_hours !== "") {
      issueData.estimated_hours = Number(patch.estimated_hours);
    }
    if (Array.isArray(patch.custom_fields)) {
      issueData.custom_fields = patch.custom_fields
        .map((field) => {
          const id = Number(field.id);
          if (!Number.isFinite(id)) return null;
          if (Array.isArray(field.value)) {
            return { id, value: field.value.map((v) => String(v ?? "")) };
          }
          return { id, value: field.value == null ? "" : String(field.value) };
        })
        .filter(Boolean);
    }
    if (patch.status_id !== undefined && patch.status_id !== "") {
      issueData.status_id = Number(patch.status_id);
    }
    if (patch.done_ratio !== undefined && patch.done_ratio !== "") {
      issueData.done_ratio = Number(patch.done_ratio);
    }
    if (Array.isArray(patch.watcher_user_ids)) {
      issueData.watcher_user_ids = patch.watcher_user_ids
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0);
    }
    const files = Array.isArray(patch.files) ? patch.files : [];

    if (!issueData.project_id || !issueData.tracker_id || !issueData.subject) {
      throw new Error("Для создания задачи обязательны проект, трекер и тема.");
    }
    if (!issueData.description) {
      throw new Error("Укажите описание задачи.");
    }
    if (!issueData.priority_id) {
      throw new Error("Укажите приоритет.");
    }
    if (!issueData.assigned_to_id) {
      throw new Error("Укажите исполнителя.");
    }
    if (!issueData.start_date) {
      throw new Error("Укажите дату начала.");
    }
    if (!issueData.due_date && !patch.noDeadline) {
      throw new Error("Укажите срок выполнения или отметьте задачу как без срока.");
    }

    if (!connection.redmineUrl || !connection.apiKey) {
      throw new Error("Не заполнены URL Redmine или API-ключ. Проверьте настройки подключения.");
    }

    return offlineQueue.createIssueWithOffline(connection.redmineUrl, connection.apiKey, issueData, files);
  });

  ipcMain.handle("redmine:get-project-users", async (_, payload) => {
    const settings = await readSettings();
    const redmineUrl = payload?.redmineUrl || settings.redmineUrl;
    const apiKey = payload?.apiKey || settings.apiKey;
    const projectId = Number(payload?.projectId);
    if (!projectId) return [];
    try {
      return await redmine.fetchProjectMembers(redmineUrl, apiKey, projectId);
    } catch {
      return [];
    }
  });

  ipcMain.handle("redmine:create-time-entry", async (_, payload) => {
    const settings = await readSettings();
    const patch = payload?.patch || {};
    const entryData = {};
    if (patch.issue_id) entryData.issue_id = Number(patch.issue_id);
    if (patch.hours !== undefined && patch.hours !== "") entryData.hours = Number(patch.hours);
    if (patch.spent_on) entryData.spent_on = patch.spent_on;
    if (patch.comments !== undefined) entryData.comments = String(patch.comments || "").trim();
    if (patch.customer_name !== undefined) {
      entryData.customer_name = String(patch.customer_name || "").trim();
    }
    if (patch.activity_id !== undefined && patch.activity_id !== "") {
      entryData.activity_id = Number(patch.activity_id);
    } else {
      const activities = db.getReferenceData("activities") || [];
      const byName = activities.find((a) => /разработ/i.test(String(a.name || "")));
      const pick = byName || activities[0];
      if (pick?.id) entryData.activity_id = Number(pick.id);
    }
    if (entryData.activity_id) {
      const activities = db.getReferenceData("activities") || [];
      const activity = activities.find((a) => Number(a.id) === entryData.activity_id);
      if (activity?.name) entryData.activity_name = activity.name;
    }
    if (!entryData.issue_id || !entryData.hours || entryData.hours <= 0) {
      throw new Error("Укажите задачу и количество часов.");
    }
    if (!String(entryData.comments || "").trim()) {
      throw new Error("Укажите комментарий к трудозатратам.");
    }
    const issue = db.getIssueById(entryData.issue_id);
    if (issue) {
      entryData.project_id = issue.project_id;
      entryData.project_name = issue.project_name || "";
    }
    const currentUser = db.getReferenceData("current_user");
    if (currentUser?.id) {
      entryData.user_id = currentUser.id;
      entryData.user_name =
        currentUser.name ||
        `${currentUser.firstname || ""} ${currentUser.lastname || ""}`.trim() ||
        "";
    }
    return offlineQueue.createTimeEntryWithOffline(settings.redmineUrl, settings.apiKey, entryData);
  });

  ipcMain.handle("redmine:update-time-entry", async (_, payload) => {
    const settings = await readSettings();
    const entryId = Number(payload?.entryId);
    const patch = payload?.patch || {};
    if (!entryId) throw new Error("Не указана запись трудозатрат.");
    const entryData = {};
    if (patch.hours !== undefined && patch.hours !== "") entryData.hours = Number(patch.hours);
    if (patch.spent_on) entryData.spent_on = patch.spent_on;
    if (patch.comments !== undefined) entryData.comments = String(patch.comments || "").trim();
    if (patch.customer_name !== undefined) {
      entryData.customer_name = String(patch.customer_name || "").trim();
    }
    if (patch.activity_id !== undefined && patch.activity_id !== "") {
      entryData.activity_id = Number(patch.activity_id);
      const activities = db.getReferenceData("activities") || [];
      const activity = activities.find((a) => Number(a.id) === entryData.activity_id);
      if (activity?.name) entryData.activity_name = activity.name;
    }
    if (!entryData.hours || entryData.hours <= 0) {
      throw new Error("Укажите количество часов.");
    }
    if (!String(entryData.comments || "").trim()) {
      throw new Error("Укажите комментарий к трудозатратам.");
    }
    return offlineQueue.updateTimeEntryWithOffline(
      settings.redmineUrl,
      settings.apiKey,
      entryId,
      entryData,
    );
  });

  ipcMain.handle("redmine:delete-time-entry", async (_, payload) => {
    const settings = await readSettings();
    const entryId = Number(payload?.entryId);
    if (!entryId) throw new Error("Не указана запись трудозатрат.");
    return offlineQueue.deleteTimeEntryWithOffline(settings.redmineUrl, settings.apiKey, entryId);
  });

  ipcMain.handle("db:get-time-entries", (_, payload) => db.queryTimeEntries(payload?.filters || {}));

  ipcMain.handle("redmine:sync-issue-time-entries", async (_, payload) => {
    const settings = await readSettings();
    const issueId = Number(payload?.issueId);
    if (!issueId) throw new Error("Не указана задача.");
    if (!settings.redmineUrl || !settings.apiKey) {
      throw new Error("Нет подключения к Redmine.");
    }
    const count = await syncEngine.syncTimeEntriesForIssue(settings.redmineUrl, settings.apiKey, issueId);
    const issue = db.getIssueById(issueId);
    return {
      ok: true,
      count,
      spentHours: issue?.spent_hours ?? null,
    };
  });

  ipcMain.handle("db:can-edit-time-entry", (_, payload) => {
    const entry = db.getTimeEntryById(payload?.entryId);
    const currentUser = db.getReferenceData("current_user");
    const roles = db.getReferenceData("roles") || [];
    return redmine.canEditTimeEntry(entry, currentUser, roles);
  });

  ipcMain.handle("offline:flush", async () => {
    const settings = await readSettings();
    const result = await offlineQueue.flushOfflineQueue(settings.redmineUrl, settings.apiKey);
    broadcastNetworkStatus();
    return result;
  });

  ipcMain.handle("sync:get-failures", () => db.getUnreadSyncFailures());
  ipcMain.handle("sync:mark-failures-read", () => {
    db.markSyncFailuresRead();
    return { ok: true };
  });

  ipcMain.handle("notifications:get-deadlines", async () => ({
    alerts: await collectDeadlineAlerts(),
  }));

  ipcMain.handle("activity:get-feed", (_, payload = {}) => {
    const limit = Number(payload?.limit) || 10;
    const offset = Number(payload?.offset) || 0;
    const kinds = Array.isArray(payload?.kinds) ? payload.kinds.map(String) : null;
    const items = db.queryActivityFeed({ limit, offset, kinds });
    return {
      items,
      totalUnseen: db.countUnseenActivity(),
    };
  });

  ipcMain.handle("activity:mark-seen", (_, payload = {}) => {
    const changed = db.markActivitySeen({
      ids: payload?.ids,
      all: Boolean(payload?.all),
    });
    const unseenCount = db.countUnseenActivity();
    broadcast("activity:updated", { unseenCount });
    return { ok: true, changed, unseenCount };
  });

  ipcMain.handle("activity:get-unseen-count", () => ({
    unseenCount: db.countUnseenActivity(),
  }));

  ipcMain.handle("redmine:download-attachment", async (_, payload) => {
    const connection = await resolveConnectionForPayload(payload);
    const filename = String(payload?.filename || "attachment.bin");
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Сохранить вложение",
      defaultPath: filename,
    });
    if (canceled || !filePath) return { ok: false, cancelled: true };
    const { data } = await fetchAttachmentBuffer(connection.redmineUrl, connection.apiKey, payload?.contentUrl);
    await fs.writeFile(filePath, data);
    return { ok: true, filePath };
  });

  ipcMain.handle("redmine:get-attachment-preview", async (_, payload) => {
    const connection = await resolveConnectionForPayload(payload);
    let attachmentId = Number(payload?.attachmentId);
    const settings = await readSettings();
    if (!Number.isFinite(attachmentId) || attachmentId <= 0) {
      const url = String(payload?.contentUrl || "");
      const m = url.match(/\/attachments\/download\/(\d+)\//i) || url.match(/\/attachments\/(\d+)\//i);
      if (m) attachmentId = Number(m[1]);
    }
    try {
      if (settings.cacheAttachmentsEnabled !== false && Number.isFinite(attachmentId) && attachmentId > 0) {
        const meta = db.getAttachmentById(attachmentId);
        const cached = attachmentCache.readCachedAttachment(meta?.local_path);
        if (cached) {
          return {
            ok: true,
            mimeType: meta?.content_type || payload?.mimeType || "application/octet-stream",
            dataBase64: cached.toString("base64"),
            fromCache: true,
          };
        }
      }
      const { data, mimeType } = await fetchAttachmentBuffer(
        connection.redmineUrl,
        connection.apiKey,
        payload?.contentUrl,
      );
      if (settings.cacheAttachmentsEnabled !== false && Number.isFinite(attachmentId) && attachmentId > 0) {
        const filename = payload?.filename || db.getAttachmentById(attachmentId)?.filename || "file";
        const localPath = attachmentCache.writeCachedAttachment(
          app.getPath("userData"),
          attachmentId,
          filename,
          data,
        );
        db.setAttachmentLocalPath(attachmentId, localPath);
        runCacheMaintenance().catch(() => {});
      }
      return { ok: true, mimeType, dataBase64: data.toString("base64"), fromCache: false };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  });

  ipcMain.handle("cache:rebuild-fts", () => db.rebuildAllIssuesFts());

  ipcMain.handle("cache:run-maintenance", async () => runCacheMaintenance());

  ipcMain.handle("cache:estimate-download", () => db.estimateCacheDownload());

  ipcMain.handle("cache:prefetch-project-details", async () => {
    const settings = await readSettings();
    if (!settings.redmineUrl || !settings.apiKey) {
      throw new Error("Нет подключения к Redmine.");
    }
    const projectIds = db.getEnabledSyncProjectIds();
    const issues = db.queryIssues({ projectIds: projectIds.length ? projectIds : undefined });
    let done = 0;
    for (const issue of issues.slice(0, 500)) {
      try {
        await syncEngine.ensureIssueDetail(settings.redmineUrl, settings.apiKey, issue.id);
        done += 1;
      } catch {
        /* skip */
      }
    }
    db.rebuildAllIssuesFts();
    return { ok: true, done, total: issues.length };
  });

  ipcMain.handle("cloud-oauth:connect", async (_, payload = {}) => {
    const provider = String(payload.provider || "");
    const settings = await readSettings();
    // Allow one-time credentials from the connect payload (first-run setup).
    if (payload.clientId) {
      if (provider === "yandex") settings.cloudBackupYandexClientId = String(payload.clientId).trim();
      if (provider === "google") settings.cloudBackupGoogleClientId = String(payload.clientId).trim();
    }
    if (payload.clientSecret) {
      if (provider === "yandex") {
        settings.cloudBackupYandexClientSecret = String(payload.clientSecret).trim();
      }
      if (provider === "google") {
        settings.cloudBackupGoogleClientSecret = String(payload.clientSecret).trim();
      }
    }

    if (provider === "yandex") {
      let creds;
      try {
        creds = assertConfigured("yandex", settings);
      } catch (error) {
        if (error.code === "NEED_SETUP") {
          return { ok: false, needSetup: true, provider: "yandex" };
        }
        throw error;
      }
      const tokens = await cloudOAuth.connectYandexDisk(creds);
      const remoteDir = cloudOAuthConfig.yandexFolder;
      await cloudBackup.ensureYandexFolder({ token: tokens.accessToken, remoteDir });
      settings.cloudBackupProvider = "yandex";
      settings.cloudBackupToken = tokens.accessToken;
      settings.cloudBackupFolder = remoteDir;
      settings.cloudBackupGoogleAccessToken = "";
      settings.cloudBackupGoogleRefreshToken = "";
      settings.cloudBackupGoogleFolderId = "";
      await writeSettings(settings);
      return { ok: true, provider: "yandex", folder: remoteDir };
    }
    if (provider === "google") {
      let creds;
      try {
        creds = assertConfigured("google", settings);
      } catch (error) {
        if (error.code === "NEED_SETUP") {
          return { ok: false, needSetup: true, provider: "google" };
        }
        throw error;
      }
      const tokens = await cloudOAuth.connectGoogleDrive(creds);
      const folderId = await cloudBackup.ensureGoogleBackupFolder({
        accessToken: tokens.accessToken,
        folderName: cloudOAuthConfig.googleFolderName,
      });
      settings.cloudBackupProvider = "google";
      settings.cloudBackupGoogleAccessToken = tokens.accessToken;
      settings.cloudBackupGoogleRefreshToken = tokens.refreshToken || "";
      settings.cloudBackupGoogleFolderId = folderId;
      settings.cloudBackupToken = "";
      await writeSettings(settings);
      return { ok: true, provider: "google", folderId, folderName: cloudOAuthConfig.googleFolderName };
    }
    throw new Error("Неизвестный провайдер");
  });

  ipcMain.handle("cloud-oauth:disconnect", async () => {
    const settings = await readSettings();
    settings.cloudBackupProvider = "off";
    settings.cloudBackupToken = "";
    settings.cloudBackupGoogleAccessToken = "";
    settings.cloudBackupGoogleRefreshToken = "";
    settings.cloudBackupGoogleFolderId = "";
    await writeSettings(settings);
    return { ok: true };
  });

  ipcMain.handle("cloud-oauth:status", async () => {
    const settings = await readSettings();
    const provider = String(settings.cloudBackupProvider || "off");
    const connected =
      (provider === "yandex" && Boolean(settings.cloudBackupToken)) ||
      (provider === "google" && Boolean(settings.cloudBackupGoogleAccessToken));
    const yandex = resolveCredentials("yandex", settings);
    const google = resolveCredentials("google", settings);
    return {
      ok: true,
      provider: connected ? provider : "off",
      connected,
      folder:
        provider === "yandex"
          ? settings.cloudBackupFolder || cloudOAuthConfig.yandexFolder
          : provider === "google"
            ? cloudOAuthConfig.googleFolderName
            : "",
      yandexReady: yandex.ready,
      googleReady: google.ready,
    };
  });

  ipcMain.handle("cloud-backup:upload-now", async () => {
    const settings = await readSettings();
    const provider = String(settings.cloudBackupProvider || "off");
    if (provider === "off") throw new Error("Облако не подключено. Нажмите Яндекс или Google.");
    const snapshotPath = await runConfiguredBackupSnapshot();
    return { ok: true, provider, localPath: snapshotPath };
  });

  async function runCacheMaintenance() {
    const settings = await readSettings();
    const favoriteIds = cachePolicy.parseFavoriteIds(db.getMeta("favorite_issue_ids"));
    const closed = db.getClosedIssueRows();
    const eligible = cachePolicy.closedIssuesEligibleForEviction({
      issues: closed,
      favoriteIds,
      retentionDays: settings.cacheRetentionDays ?? 90,
    });
    const deleted = db.deleteIssuesByIds(
      eligible.map((i) => i.id),
      { preserveIssueIds: favoriteIds },
    );
    const maxBytes = cachePolicy.cacheMaxBytesFromMb(settings.cacheMaxSizeMb ?? 2048);
    const evicted = attachmentCache.evictAttachmentCache({
      userDataPath: app.getPath("userData"),
      maxBytes,
      listCachedAttachments: () => db.listCachedAttachments(),
      clearLocalPath: (id) => db.setAttachmentLocalPath(id, null),
      isProtected: (row) => favoriteIds.includes(Number(row.issue_id)),
    });
    return { ok: true, deletedIssues: deleted.deleted, evictedAttachments: evicted.removed };
  }

  ipcMain.handle("redmine:delete-attachment", async (_, payload) => {
    const settings = await readSettings();
    const attachmentId = Number(payload?.attachmentId);
    const issueId = Number(payload?.issueId) || null;
    if (!Number.isFinite(attachmentId) || attachmentId <= 0) {
      throw new Error("Некорректный id вложения.");
    }
    return offlineQueue.deleteAttachmentWithOffline(
      settings.redmineUrl,
      settings.apiKey,
      attachmentId,
      issueId,
    );
  });

  ipcMain.handle("tracker:timer-get-state", () => buildAllRunningTimerState());

  ipcMain.handle("tracker:timer-start", (_, payload = {}) => startRunningTimerEntry(payload || {}));

  ipcMain.handle("tracker:timer-pause", () => {
    const state = db.pauseActiveTimer();
    return { ok: Boolean(state), state: buildTimerState(state) };
  });

  ipcMain.handle("tracker:timer-resume", () => {
    const state = db.resumeActiveTimer();
    return { ok: Boolean(state), state: buildTimerState(state) };
  });

  ipcMain.handle("tracker:timer-discard", (_, payload = {}) => {
    const entryId = Number(payload?.entryId);
    if (Number.isFinite(entryId) && entryId !== 0) {
      const entry = db.getTimeEntryById(entryId);
      if (entry && Number(entry.is_running)) {
        db.deleteLocalTimeEntry(entryId);
      }
    }
    db.clearActiveTimer();
    return { ok: true };
  });

  ipcMain.handle("tracker:timer-stop", async (_, payload = {}) => {
    const entryId = Number(payload?.entryId);
    if (Number.isFinite(entryId) && entryId !== 0) {
      return stopRunningEntryToDraft(entryId);
    }
    // Prefer newest running row; fall back to legacy singleton timer.
    const running = db.getRunningTimeEntries();
    if (running.length) {
      return stopRunningEntryToDraft(running[running.length - 1].id);
    }
    return stopActiveTimerToDraft();
  });

  ipcMain.handle("tracker:stop-all-running", async () => {
    const running = db.getRunningTimeEntries();
    const stopped = [];
    for (const row of running) {
      try {
        const result = await stopRunningEntryToDraft(row.id);
        if (result?.entry) stopped.push(result.entry);
      } catch (error) {
        console.error("stop-all-running failed for", row?.id, error.message);
      }
    }
    if (!stopped.length) {
      // Legacy singleton only (no is_running rows) — convert it once.
      try {
        const legacy = db.getActiveTimer();
        if (legacy) {
          const result = await stopActiveTimerToDraft();
          if (result?.entry) stopped.push(result.entry);
        }
      } catch (error) {
        console.error("stop-all-running legacy failed:", error.message);
      }
    }
    db.clearActiveTimer();
    idleNotifiedForStretch = false;
    return { ok: true, stoppedCount: stopped.length, entries: stopped };
  });

  ipcMain.handle("tracker:create-draft", async (_, payload = {}) => {
    const issueId = payload.issueId != null && payload.issueId !== "" ? Number(payload.issueId) : null;
    const projectId = payload.projectId != null && payload.projectId !== "" ? Number(payload.projectId) : null;
    const activity = resolveTimeEntryActivity(payload.activityId);
    if (!activity?.id) {
      throw new Error("Не удалось определить деятельность. Обновите справочники.");
    }
    const allowEmpty = payload.allowEmpty === true;
    const hoursRaw = Number(payload.hours);
    let hours = Number.isFinite(hoursRaw) ? hoursRaw : 0;
    try {
      const settings = await readSettings();
      hours = roundHoursToHalf(hours, settings.trackerMinFloorEnabled !== false);
    } catch {
      /* keep */
    }
    if (!allowEmpty && (!(hours > 0))) {
      throw new Error("Укажите начало и конец так, чтобы длительность была больше 0.");
    }
    const spentOn = String(payload.spentOn || "").slice(0, 10) || db.isoDateLocal(new Date());
    const issue = issueId ? db.getIssueById(issueId) : null;
    const currentUser = db.getReferenceData("current_user");
    const entry = db.insertLocalTimeEntry({
      issue_id: issueId || null,
      project_id: projectId || issue?.project_id || null,
      project_name: payload.projectName || issue?.project_name || "",
      user_id: currentUser?.id || null,
      user_name:
        currentUser?.name ||
        `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() ||
        "",
      hours: hours > 0 ? hours : 0,
      spent_on: spentOn,
      comments: payload.comments || "",
      customer_name: payload.customerName || "",
      activity_id: activity.id,
      activity_name: activity.name || "",
      sync_status: "draft",
      entry_source: payload.entrySource || "manual",
      entry_kind: payload.entryKind || "work",
      started_at: payload.startedAt || null,
      ended_at: payload.endedAt || null,
      is_running: payload.isRunning ? 1 : 0,
    });
    return { ok: true, entry };
  });

  ipcMain.handle("tracker:update-draft", async (_, payload = {}) => {
    const id = Number(payload.id);
    if (!Number.isFinite(id)) throw new Error("Некорректный id записи");
    const entry = db.getTimeEntryById(id);
    if (!entry) throw new Error("Запись не найдена");
    const editable =
      Number(entry.is_running) === 1 ||
      entry.sync_status === "draft" ||
      entry.sync_status === "error";
    if (!editable) throw new Error("Можно править только черновики и ошибки");

    const patch = {};
    if (payload.spentOn !== undefined) patch.spent_on = String(payload.spentOn || "").slice(0, 10);
    if (payload.comments !== undefined) patch.comments = String(payload.comments || "");
    if (payload.customerName !== undefined) patch.customer_name = String(payload.customerName || "");
    if (payload.projectId !== undefined) {
      patch.project_id =
        payload.projectId != null && payload.projectId !== "" ? Number(payload.projectId) : null;
    }
    if (payload.projectName !== undefined) patch.project_name = String(payload.projectName || "");
    if (payload.issueId !== undefined) {
      patch.issue_id =
        payload.issueId != null && payload.issueId !== "" ? Number(payload.issueId) : null;
    }
    if (payload.activityId !== undefined) {
      const activity = resolveTimeEntryActivity(payload.activityId);
      if (!activity?.id) throw new Error("Не удалось определить деятельность");
      patch.activity_id = activity.id;
      patch.activity_name = activity.name || "";
    }
    if (payload.startedAt !== undefined) patch.started_at = payload.startedAt || null;
    if (payload.endedAt !== undefined) patch.ended_at = payload.endedAt || null;
    if (payload.hours !== undefined) {
      let hours = Number(payload.hours) || 0;
      try {
        const settings = await readSettings();
        hours = roundHoursToHalf(hours, settings.trackerMinFloorEnabled !== false);
      } catch {
        /* keep */
      }
      patch.hours = hours;
    }
    if (payload.syncStatus !== undefined) patch.sync_status = payload.syncStatus;
    if (payload.syncError !== undefined) patch.sync_error = payload.syncError;

    if (patch.sync_status === "error" && payload.clearError) {
      patch.sync_status = "draft";
      patch.sync_error = null;
    } else if (entry.sync_status === "error" && Object.keys(patch).length) {
      // Editing an error row turns it back into a draft.
      patch.sync_status = "draft";
      patch.sync_error = null;
    }

    const updated = db.updateLocalTimeEntry(id, patch);
    const issue = updated?.issue_id ? db.getIssueById(updated.issue_id) : null;
    return {
      ok: true,
      entry: {
        ...updated,
        issue_subject: issue?.subject || "",
      },
    };
  });

  ipcMain.handle("tracker:start-entry", (_, payload = {}) => {
    const id = Number(payload.entryId ?? payload.id);
    if (!Number.isFinite(id)) return { ok: false, reason: "invalid-id" };
    const entry = db.getTimeEntryById(id);
    if (!entry) return { ok: false, reason: "not-found" };
    if (Number(entry.is_running)) {
      return { ok: true, entry: buildRunningEntryState(entry) };
    }
    if (entry.sync_status !== "draft" && entry.sync_status !== "error") {
      return { ok: false, reason: "not-editable" };
    }
    const startedAt = new Date().toISOString();
    const updated = db.updateLocalTimeEntry(id, {
      is_running: 1,
      started_at: startedAt,
      ended_at: null,
      hours: 0,
      entry_source: entry.entry_source === "manual" ? "timer" : entry.entry_source,
      sync_status: "draft",
      sync_error: null,
      spent_on: startedAt.slice(0, 10),
    });
    if (updated?.issue_id) {
      db.startActiveTimer({
        issueId: updated.issue_id,
        projectId: updated.project_id,
        activityId: updated.activity_id,
        entryKind: updated.entry_kind,
        comment: updated.comments,
        customerName: updated.customer_name,
      });
    }
    return { ok: true, entry: buildRunningEntryState(updated) };
  });

  ipcMain.handle("tracker:discard-entry", (_, payload = {}) => {
    const id = Number(payload.entryId ?? payload.id);
    if (!Number.isFinite(id)) return { ok: false, reason: "invalid-id" };
    const entry = db.getTimeEntryById(id);
    if (!entry) return { ok: false, reason: "not-found" };
    if (Number(entry.is_running)) {
      return { ok: false, reason: "stop-timer-first" };
    }
    if (entry.sync_status !== "draft" && entry.sync_status !== "error") {
      return { ok: false, reason: "not-deletable" };
    }
    const removed = db.discardLocalTimeEntry(id);
    return { ok: Boolean(removed) };
  });

  ipcMain.handle("tracker:discard-idle", async (_, payload = {}) => {
    const result = await resolveIdleAction({
      action: "discard",
      idleSeconds: payload.idleSeconds,
      entryIds: payload.entryIds,
    });
    return { ok: Boolean(result?.ok), state: result?.state || null, ...result };
  });

  ipcMain.handle("tracker:resolve-idle", async (_, payload = {}) => {
    try {
      return await resolveIdleAction(payload || {});
    } catch (error) {
      return { ok: false, reason: error.message || "resolve-idle-failed" };
    }
  });

  ipcMain.handle("db:get-tracker-drafts", (_, payload = {}) => {
    const today = db.isoDateLocal(new Date());
    const from = payload.from || today;
    const to = payload.to || today;
    const currentUser = db.getReferenceData("current_user");
    const trackerUserId =
      payload.userId != null && payload.userId !== ""
        ? Number(payload.userId)
        : currentUser?.id != null
          ? Number(currentUser.id)
          : null;
    const rows = db.queryTimeEntries({
      from,
      to,
      syncStatuses: payload.syncStatuses || ["draft", "pending", "synced", "error"],
      issueId: payload.issueId || undefined,
      ...(Number.isFinite(trackerUserId) && trackerUserId > 0 ? { userId: trackerUserId } : {}),
    });
    return rows.map((row) => {
      const issue = row.issue_id ? db.getIssueById(row.issue_id) : null;
      return {
        ...row,
        issue_subject: issue?.subject || "",
      };
    });
  });

  ipcMain.handle("tracker:push-drafts", async (_, payload = {}) => {
    const ids = Array.isArray(payload.ids) ? payload.ids.map(Number).filter((id) => Number.isFinite(id)) : [];
    const settings = await readSettings();
    const results = [];

    for (const id of ids) {
      const entry = db.getTimeEntryById(id);
      if (!entry || entry.sync_status !== "draft") {
        results.push({ id, ok: false, reason: "not-a-draft" });
        continue;
      }
      const kind = String(entry.entry_kind || "work");
      if (!entry.issue_id) {
        results.push({ id, ok: false, reason: "нет задачи" });
        continue;
      }
      if (!(Number(entry.hours) > 0)) {
        results.push({ id, ok: false, reason: "0 часов — нельзя отправить" });
        continue;
      }
      if (!String(entry.comments || "").trim()) {
        results.push({ id, ok: false, reason: "нет комментария" });
        continue;
      }
      if (!["work", "external"].includes(kind)) {
        results.push({ id, ok: false, reason: `вид «${kind}» не пушится` });
        continue;
      }

      const activity = resolveTimeEntryActivity(entry.activity_id);
      if (!activity?.id) {
        results.push({
          id,
          ok: false,
          reason: "нет activity — обновите справочники или укажите Activity id (>0)",
        });
        continue;
      }

      const snapshot = {
        issue_id: entry.issue_id,
        project_id: entry.project_id,
        project_name: entry.project_name,
        user_id: entry.user_id,
        user_name: entry.user_name,
        hours: entry.hours,
        spent_on: entry.spent_on,
        comments: entry.comments,
        customer_name: entry.customer_name,
        activity_id: activity.id,
        activity_name: activity.name || entry.activity_name || "",
        started_at: entry.started_at,
        ended_at: entry.ended_at,
        entry_kind: entry.entry_kind || "work",
        entry_source: entry.entry_source || "timer",
        sync_status: "draft",
      };

      const failuresBefore = db.getUnreadSyncFailures().length;
      try {
        const created = await offlineQueue.createTimeEntryWithOffline(
          settings.redmineUrl,
          settings.apiKey,
          {
            issue_id: snapshot.issue_id,
            hours: snapshot.hours,
            spent_on: snapshot.spent_on,
            comments: snapshot.comments,
            activity_id: snapshot.activity_id,
            customer_name: snapshot.customer_name,
            project_id: snapshot.project_id,
            project_name: snapshot.project_name,
            user_id: snapshot.user_id,
            user_name: snapshot.user_name,
            activity_name: snapshot.activity_name,
            started_at: snapshot.started_at,
            ended_at: snapshot.ended_at,
            entry_kind: snapshot.entry_kind,
            entry_source: snapshot.entry_source,
          },
          { skipFlush: true },
        );
        // Drop draft only after a pending twin exists — restore if Redmine rejects.
        db.deleteLocalTimeEntry(id);

        let flushResult = { processed: 0, failed: 0 };
        if (settings.redmineUrl && settings.apiKey) {
          flushResult = await offlineQueue.flushOfflineQueue(settings.redmineUrl, settings.apiKey);
        }

        const failuresAfter = db.getUnreadSyncFailures();
        const newFailure = failuresAfter.length > failuresBefore ? failuresAfter[0] : null;
        if (flushResult?.failed > 0 || newFailure) {
          db.insertLocalTimeEntry(snapshot);
          results.push({
            id,
            ok: false,
            reason: newFailure?.message || "Redmine отклонил запись (422)",
          });
          continue;
        }

        results.push({
          id,
          ok: true,
          newLocalId: created?.timeEntry?.id ?? null,
        });
      } catch (error) {
        // Keep original draft if create itself threw.
        if (!db.getTimeEntryById(id)) {
          db.insertLocalTimeEntry(snapshot);
        }
        results.push({ id, ok: false, reason: error.message || String(error) });
      }
    }

    try {
      await runConfiguredBackupSnapshot();
    } catch (error) {
      console.error("Backup after push-drafts failed:", error.message);
    }

    return results;
  });
}

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) app.quit();

app.on("second-instance", (_event, argv) => {
  const protocolArg = argv.find((arg) => arg.startsWith("rmclient://") || /\/issues\/\d+/i.test(arg));
  if (protocolArg) processPotentialProtocolValue(protocolArg);
  showMainWindow();
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  processPotentialProtocolValue(url);
});

app.whenReady().then(() => {
  db.openDatabase(db.getDbPath(app.getPath("userData")));
  offlineQueue.setQueueFlushedHandler((payload) => {
    broadcast("offline:flushed", payload || {});
    broadcastNetworkStatus();
  });
  readSettings()
    .then((settings) => {
      persistCredentials(settings.redmineUrl, settings.apiKey);
    })
    .catch(() => {});
  registerIpcHandlers();
  app.setAsDefaultProtocolClient("rmclient");
  createMainWindow();
  scheduleAutosync();
  scheduleAutoBackups();
  scheduleIdleWatch();
  publishDeadlineAlerts();
  publishActivityUpdated();
  setTimeout(() => {
    try {
      // Lazy: maintenance IPC is registered; invoke logic via require path.
      const settingsPromise = readSettings();
      settingsPromise
        .then(async (settings) => {
          const favoriteIds = cachePolicy.parseFavoriteIds(db.getMeta("favorite_issue_ids"));
          const closed = db.getClosedIssueRows();
          const eligible = cachePolicy.closedIssuesEligibleForEviction({
            issues: closed,
            favoriteIds,
            retentionDays: settings.cacheRetentionDays ?? 90,
          });
          db.deleteIssuesByIds(
            eligible.map((i) => i.id),
            { preserveIssueIds: favoriteIds },
          );
          attachmentCache.evictAttachmentCache({
            userDataPath: app.getPath("userData"),
            maxBytes: cachePolicy.cacheMaxBytesFromMb(settings.cacheMaxSizeMb ?? 2048),
            listCachedAttachments: () => db.listCachedAttachments(),
            clearLocalPath: (id) => db.setAttachmentLocalPath(id, null),
            isProtected: (row) => favoriteIds.includes(Number(row.issue_id)),
          });
        })
        .catch(() => {});
    } catch {
      /* ignore */
    }
  }, 15000);

  setInterval(() => {
    broadcastNetworkStatus();
    if (isOnline()) runIncrementalSyncSafe();
  }, 60000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    else showMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", (event) => {
  isQuitting = true;
  if (backupOnQuitDone) {
    db.closeDatabase();
    return;
  }
  event.preventDefault();
  runConfiguredBackupSnapshot()
    .catch((error) => {
      console.error("Quit backup failed:", error.message);
    })
    .finally(() => {
      if (autoBackupTimer) {
        clearInterval(autoBackupTimer);
        autoBackupTimer = null;
      }
      if (idleWatchTimer) {
        clearInterval(idleWatchTimer);
        idleWatchTimer = null;
      }
      db.closeDatabase();
      backupOnQuitDone = true;
      app.quit();
    });
});
