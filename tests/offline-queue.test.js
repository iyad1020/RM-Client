/**
 * Vitest vi.mock() не перехватывает Node require() для локальных CJS-модулей
 * (offline-queue тянет redmine-client через require). Эквивалент — stub в
 * require.cache до загрузки offline-queue: без реального HTTP.
 */
const updateIssueWithUploads = vi.fn();
const updateIssue = vi.fn();
const updateJournal = vi.fn();
const fetchIssueDetail = vi.fn();
const createIssueWithUploads = vi.fn();
const createTimeEntry = vi.fn();
const updateTimeEntry = vi.fn();
const deleteTimeEntry = vi.fn();
const ensureIssueDetail = vi.fn();
const refreshIssueDetail = vi.fn();

function stubModule(modulePath, exports) {
  const resolved = require.resolve(modulePath);
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
    children: [],
    paths: [],
  };
}

function loadOfflineQueue() {
  stubModule("../sync/redmine-client", {
    updateIssueWithUploads,
    updateIssue,
    updateJournal,
    fetchIssueDetail,
    createIssueWithUploads,
    createTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
  });
  stubModule("../sync/sync-engine", {
    ensureIssueDetail,
    refreshIssueDetail,
  });
  const queuePath = require.resolve("../sync/offline-queue");
  delete require.cache[queuePath];
  return require("../sync/offline-queue");
}

const db = require("../db/database");
const offlineQueue = loadOfflineQueue();

describe("offline-queue", () => {
  beforeEach(() => {
    db.closeDatabase();
    db.openDatabase(":memory:");
    updateIssueWithUploads.mockReset();
    updateIssue.mockReset();
    updateJournal.mockReset();
    fetchIssueDetail.mockReset();
    createIssueWithUploads.mockReset();
    createTimeEntry.mockReset();
    updateTimeEntry.mockReset();
    deleteTimeEntry.mockReset();
    ensureIssueDetail.mockReset();
    refreshIssueDetail.mockReset();
    updateIssueWithUploads.mockResolvedValue({ ok: true });
    updateIssue.mockResolvedValue({ ok: true });
    updateJournal.mockResolvedValue({ ok: true });
    fetchIssueDetail.mockResolvedValue({ id: 1, description: "", attachments: [] });
    createIssueWithUploads.mockResolvedValue({ issueId: 42 });
    createTimeEntry.mockResolvedValue({ timeEntry: null });
    updateTimeEntry.mockResolvedValue({ timeEntry: null });
    deleteTimeEntry.mockResolvedValue({ ok: true });
    ensureIssueDetail.mockResolvedValue(null);
    refreshIssueDetail.mockResolvedValue(null);
  });

  afterEach(() => {
    db.closeDatabase();
  });

  it("flushOfflineQueue processes items and removes successful ones", async () => {
    db.enqueueOfflineItem("update_issue", { issueId: 7, issueData: { subject: "a" }, files: [] });
    db.enqueueOfflineItem("update_issue", { issueId: 8, issueData: { subject: "b" }, files: [] });

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result).toEqual({ processed: 2, failed: 0, issueIds: expect.any(Array) });
    expect(updateIssueWithUploads).toHaveBeenCalledTimes(2);
    expect(db.getOfflineQueue()).toHaveLength(0);
  });

  it("rewrites comment image tokens to markdown download urls after upload", async () => {
    fetchIssueDetail.mockResolvedValue({
      id: 7,
      attachments: [
        { id: 9, filename: "shot.png", content_url: "https://rm.example/attachments/download/9/shot.png" },
      ],
      journals: [{ id: 33, notes: "Смотри !shot.png!" }],
    });
    db.enqueueOfflineItem("update_issue", {
      issueId: 7,
      issueData: { notes: "Смотри !shot.png!" },
      files: [{ filename: "shot.png", dataBase64: "QQ==", contentType: "image/png" }],
    });

    await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(updateJournal).toHaveBeenCalledWith(
      "https://rm.example",
      "key",
      33,
      expect.stringContaining("![](/attachments/download/9/shot.png)"),
    );
  });

  it("removes non-network failures from queue, records sync failure, and continues", async () => {
    db.enqueueOfflineItem("update_issue", { issueId: 1, issueData: {}, files: [] });
    db.enqueueOfflineItem("update_issue", { issueId: 2, issueData: {}, files: [] });

    updateIssueWithUploads
      .mockRejectedValueOnce(new Error("validation failed"))
      .mockResolvedValueOnce({ ok: true });

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result.processed).toBe(1);
    expect(result.failed).toBe(1);
    expect(db.getOfflineQueue()).toHaveLength(0);
    const failures = db.getUnreadSyncFailures();
    expect(failures).toHaveLength(1);
    expect(failures[0].entity_type).toBe("issue");
    expect(failures[0].message).toContain("validation failed");
    expect(refreshIssueDetail).toHaveBeenCalledWith("https://rm.example", "key", 1);
  });

  it("rolls back create_time_entry on non-network failure", async () => {
    db.upsertIssueSummary({
      id: 10,
      subject: "T",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New", is_closed: false },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      spent_hours: 5,
    });
    const local = db.insertLocalTimeEntry({
      issue_id: 10,
      hours: 2,
      spent_on: "2026-08-01",
      comments: "x",
      activity_id: 1,
      activity_name: "Dev",
    });
    db.addIssueSpentHours(10, 2);
    db.enqueueOfflineItem("create_time_entry", {
      entryData: { issue_id: 10, hours: 2, spent_on: "2026-08-01", comments: "x", activity_id: 1 },
      localId: local.id,
    });

    createTimeEntry.mockRejectedValueOnce(new Error("422 Unprocessable Entity"));

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result.failed).toBe(1);
    expect(db.getOfflineQueue()).toHaveLength(0);
    expect(db.getTimeEntryById(local.id)).toBeNull();
    expect(db.getIssueById(10).spent_hours).toBe(5);
    expect(db.getUnreadSyncFailures()[0].message).toContain("трудозатрату");
  });

  it("rejects create_time_entry with empty comments without calling Redmine", async () => {
    db.upsertIssueSummary({
      id: 11,
      subject: "T",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New", is_closed: false },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      spent_hours: 1,
    });
    const local = db.insertLocalTimeEntry({
      issue_id: 11,
      hours: 1,
      spent_on: "2026-08-01",
      comments: "",
      activity_id: 1,
      activity_name: "Dev",
    });
    db.addIssueSpentHours(11, 1);
    db.enqueueOfflineItem("create_time_entry", {
      entryData: { issue_id: 11, hours: 1, spent_on: "2026-08-01", comments: "  ", activity_id: 1 },
      localId: local.id,
    });

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(createTimeEntry).not.toHaveBeenCalled();
    expect(result.failed).toBe(1);
    expect(db.getUnreadSyncFailures()[0].message).toContain("комментарий");
  });

  it("createTimeEntryWithOffline throws when comments empty", async () => {
    await expect(
      offlineQueue.createTimeEntryWithOffline("https://rm.example", "key", {
        issue_id: 1,
        hours: 1,
        spent_on: "2026-08-01",
        comments: "",
        activity_id: 1,
      }),
    ).rejects.toThrow(/комментарий/i);
    expect(db.getOfflineQueue()).toHaveLength(0);
  });

  it("rolls back update_time_entry using previousEntryData", async () => {
    db.upsertIssueSummary({
      id: 20,
      subject: "T",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New", is_closed: false },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      spent_hours: 3,
    });
    db.upsertTimeEntry({
      id: 100,
      issue_id: 20,
      hours: 1,
      spent_on: "2026-08-01",
      comments: "old",
      activity_id: 1,
      activity_name: "Dev",
      user: { id: 1, name: "U" },
    });
    db.updateLocalTimeEntry(100, { hours: 4, comments: "new", sync_status: "pending" });
    db.addIssueSpentHours(20, 3);
    db.enqueueOfflineItem("update_time_entry", {
      entryId: 100,
      entryData: { issue_id: 20, hours: 4, spent_on: "2026-08-01", comments: "new", activity_id: 1 },
      issueId: 20,
      previousEntryData: {
        hours: 1,
        spent_on: "2026-08-01",
        comments: "old",
        activity_id: 1,
        activity_name: "Dev",
      },
    });

    updateTimeEntry.mockRejectedValueOnce(new Error("403 Forbidden"));

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result.failed).toBe(1);
    expect(db.getOfflineQueue()).toHaveLength(0);
    const entry = db.getTimeEntryById(100);
    expect(entry.hours).toBe(1);
    expect(entry.comments).toBe("old");
    expect(entry.sync_status).toBe("synced");
    expect(db.getIssueById(20).spent_hours).toBe(3);
  });

  it("restores deleted time entry on non-network delete failure", async () => {
    db.upsertIssueSummary({
      id: 30,
      subject: "T",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New", is_closed: false },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      spent_hours: 0,
    });
    const restoreEntry = {
      id: 200,
      issue_id: 30,
      hours: 2.5,
      spent_on: "2026-08-01",
      comments: "keep",
      activity_id: 1,
      activity_name: "Dev",
      user_id: 1,
      user_name: "U",
    };
    db.enqueueOfflineItem("delete_time_entry", {
      entryId: 200,
      issueId: 30,
      restoreEntry,
    });

    deleteTimeEntry.mockRejectedValueOnce(new Error("404 Not Found"));

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result.failed).toBe(1);
    expect(db.getOfflineQueue()).toHaveLength(0);
    expect(db.getTimeEntryById(200)?.hours).toBe(2.5);
    expect(db.getIssueById(30).spent_hours).toBe(2.5);
  });

  it("stops the queue on a network error", async () => {
    db.enqueueOfflineItem("update_issue", { issueId: 1, issueData: {}, files: [] });
    db.enqueueOfflineItem("update_issue", { issueId: 2, issueData: {}, files: [] });

    updateIssueWithUploads.mockRejectedValueOnce(new Error("network down"));

    const result = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(result.processed).toBe(0);
    expect(result.failed).toBe(1);
    expect(updateIssueWithUploads).toHaveBeenCalledTimes(1);
    expect(db.getOfflineQueue()).toHaveLength(2);
  });

  it("regression: parallel flushOfflineQueue skips while first is running", async () => {
    db.enqueueOfflineItem("update_issue", { issueId: 1, issueData: {}, files: [] });

    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    updateIssueWithUploads.mockImplementationOnce(async () => {
      await gate;
      return { ok: true };
    });

    const first = offlineQueue.flushOfflineQueue("https://rm.example", "key");
    const second = await offlineQueue.flushOfflineQueue("https://rm.example", "key");

    expect(second).toEqual({ processed: 0, failed: 0, skipped: true, issueIds: [] });
    expect(db.getOfflineQueue()).toHaveLength(1);

    release();
    const firstResult = await first;
    expect(firstResult).toEqual({ processed: 1, failed: 0, issueIds: expect.any(Array) });
    expect(db.getOfflineQueue()).toHaveLength(0);
  });

  it("updateIssueWithOffline with files is local-first (does not await upload)", async () => {
    db.upsertIssueSummary({
      id: 55,
      subject: "T",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New" },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      description: "old",
    });

    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    updateIssueWithUploads.mockImplementationOnce(async () => {
      await gate;
      return { ok: true };
    });
    fetchIssueDetail.mockResolvedValue({
      id: 55,
      description: '<img src="/attachments/download/0/shot.png">',
      attachments: [{ filename: "shot.png", content_url: "https://rm.example/attachments/download/9/shot.png" }],
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New" },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
    });

    const resultPromise = offlineQueue.updateIssueWithOffline(
      "https://rm.example",
      "key",
      55,
      { description: '<img src="/attachments/download/0/shot.png" alt="shot.png">' },
      [{ filename: "shot.png", dataBase64: "abc", contentType: "image/png" }],
      { localPatch: { description: '<img src="data:image/png;base64,abc" alt="shot.png">' } },
    );

    const result = await resultPromise;
    expect(result).toEqual({ ok: true, offline: true, queued: true });
    expect(db.getIssueById(55).description).toContain("data:image/png");
    expect(db.getOfflineQueue()).toHaveLength(1);

    release();
    for (let i = 0; i < 80; i += 1) {
      if (db.getOfflineQueue().length === 0) break;
      await new Promise((r) => setTimeout(r, 25));
    }
    expect(db.getOfflineQueue()).toHaveLength(0);
    expect(updateIssue).toHaveBeenCalled();
    expect(db.getIssueById(55).description).toContain("/attachments/download/9/");
  });

  it("saveIssueDetail does not overwrite pending local description", () => {
    db.upsertIssueSummary({
      id: 77,
      subject: "Local",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 1, name: "New" },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      description: "LOCAL_DESC",
    });
    db.enqueueOfflineItem("update_issue", {
      issueId: 77,
      issueData: { description: "UPLOAD_DESC" },
      localIssueData: { description: "LOCAL_DESC" },
      files: [],
    });

    db.saveIssueDetail({
      id: 77,
      subject: "Remote",
      description: "REMOTE_SHOULD_NOT_WIN",
      project: { id: 1, name: "P" },
      tracker: { id: 1, name: "Bug" },
      status: { id: 2, name: "In Progress" },
      priority: { id: 1, name: "Normal" },
      author: { id: 1, name: "A" },
      attachments: [],
      journals: [],
      custom_fields: [],
    });

    expect(db.getIssueById(77).description).toBe("LOCAL_DESC");
    expect(db.getIssueById(77).status_name).toBe("In Progress");
  });
});
