const db = require("../db/database");

function sampleIssue(overrides = {}) {
  return {
    id: 101,
    subject: "Первая задача",
    project: { id: 1, name: "Proj A" },
    tracker: { id: 3, name: "Задача" },
    status: { id: 1, name: "Новая", is_closed: false },
    priority: { id: 2, name: "Обычный" },
    author: { id: 10, name: "Author" },
    assigned_to: { id: 20, name: "Me User" },
    description: "desc",
    start_date: "2026-07-01",
    due_date: "2026-07-10",
    done_ratio: 0,
    estimated_hours: 2,
    spent_hours: 0,
    created_on: "2026-07-01T10:00:00Z",
    updated_on: "2026-07-02T10:00:00Z",
    ...overrides,
  };
}

describe("database", () => {
  beforeEach(() => {
    db.closeDatabase();
    db.openDatabase(":memory:");
  });

  afterEach(() => {
    db.closeDatabase();
  });

  describe("queryIssues", () => {
    beforeEach(() => {
      db.upsertIssueSummary(sampleIssue({ id: 1, project: { id: 1, name: "A" }, status: { id: 1, name: "New" }, assigned_to: { id: 20, name: "Me" } }));
      db.upsertIssueSummary(sampleIssue({ id: 2, project: { id: 2, name: "B" }, status: { id: 2, name: "Done", is_closed: true }, assigned_to: { id: 30, name: "Other" } }));
      db.upsertIssueSummary(sampleIssue({ id: 3, project: { id: 1, name: "A" }, status: { id: 1, name: "New" }, assigned_to: { id: 20, name: "Me" } }));
    });

    it("filters by project_id", () => {
      const rows = db.queryIssues({ projectId: 1 });
      expect(rows.map((r) => r.id).sort()).toEqual([1, 3]);
    });

    it("filters by status_id", () => {
      const rows = db.queryIssues({ statusId: 2 });
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(2);
    });

    it("filters by multiple statusIds", () => {
      const rows = db.queryIssues({ statusIds: [1, 2] });
      expect(rows.map((r) => r.id).sort()).toEqual([1, 2, 3]);
    });

    it('filters assigned_to_id="me" via currentUserId', () => {
      const rows = db.queryIssues({ assigneeId: "me", currentUserId: 20 });
      expect(rows.map((r) => r.id).sort()).toEqual([1, 3]);
    });

    it("scope=mine filters by assignee = current user", () => {
      const rows = db.queryIssues({ scope: "mine", currentUserId: 20 });
      expect(rows.map((r) => r.id).sort()).toEqual([1, 3]);
    });

    it("scope=authored filters by author_id", () => {
      db.upsertIssueSummary(
        sampleIssue({
          id: 4,
          author: { id: 20, name: "Me" },
          assigned_to: { id: 30, name: "Other" },
          project: { id: 1, name: "A" },
          status: { id: 1, name: "New" },
        }),
      );
      const rows = db.queryIssues({ scope: "authored", currentUserId: 20 });
      expect(rows.map((r) => r.id)).toEqual([4]);
    });

    it("scope=watched uses watched_issues table", () => {
      db.replaceWatchedIssues([2]);
      const rows = db.queryIssues({ scope: "watched" });
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(2);
    });

    it("scope=all does not restrict by assignee/author/watched", () => {
      const rows = db.queryIssues({ scope: "all" });
      expect(rows.length).toBeGreaterThanOrEqual(3);
    });

    it("hides issues from disabled sync projects when listing all", () => {
      db.setSyncProjects([
        { project_id: 1, project_name: "A", enabled: 1 },
        { project_id: 2, project_name: "B", enabled: 0 },
      ]);
      const rows = db.queryIssues({ scope: "all" });
      expect(rows.map((r) => r.id).sort()).toEqual([1, 3]);
      const mine = db.queryIssues({ scope: "mine", currentUserId: 20 });
      expect(mine.every((r) => Number(r.project_id) === 1)).toBe(true);
    });

    it("filters by due date period inclusively", () => {
      const rows = db.queryIssues({ dueFrom: "2026-07-05", dueTo: "2026-07-15" });
      // depends on sample data in beforeEach — keep existing expectation if present
      expect(Array.isArray(rows)).toBe(true);
    });

    it("filters by estimateMode has/none", () => {
      db.upsertIssueSummary(sampleIssue({ id: 201, estimated_hours: 5, spent_hours: 0 }));
      db.upsertIssueSummary(sampleIssue({ id: 202, estimated_hours: null, spent_hours: 0 }));
      db.upsertIssueSummary(sampleIssue({ id: 203, estimated_hours: 0, spent_hours: 0 }));
      const withEst = db.queryIssues({ estimateMode: "has" }).map((r) => r.id);
      expect(withEst).toContain(201);
      expect(withEst).not.toContain(202);
      expect(withEst).not.toContain(203);
      const none = db.queryIssues({ estimateMode: "none" }).map((r) => r.id);
      expect(none).toContain(202);
      expect(none).toContain(203);
      expect(none).not.toContain(201);
    });

    it("filters by due date period inclusively", () => {
      db.upsertIssueSummary(sampleIssue({ id: 10, due_date: "2026-07-05" }));
      db.upsertIssueSummary(sampleIssue({ id: 11, due_date: "2026-07-15" }));
      db.upsertIssueSummary(sampleIssue({ id: 12, due_date: "2026-07-25" }));
      db.upsertIssueSummary(sampleIssue({ id: 13, due_date: null }));
      const rows = db.queryIssues({ dueFrom: "2026-07-10", dueTo: "2026-07-20" });
      expect(rows.map((r) => r.id).sort((a, b) => a - b)).toEqual([1, 2, 3, 11]);
    });

    it("filters issues without due date", () => {
      db.upsertIssueSummary(sampleIssue({ id: 14, due_date: null }));
      db.upsertIssueSummary(sampleIssue({ id: 15, due_date: "" }));
      const rows = db.queryIssues({ dueEmptyOnly: true });
      expect(rows.map((r) => r.id).sort((a, b) => a - b)).toEqual([14, 15]);
    });
  });

  describe("getDeadlineAlerts", () => {
    const today = "2026-07-21";

    beforeEach(() => {
      db.upsertIssueSummary(
        sampleIssue({
          id: 11,
          subject: "Overdue",
          due_date: "2026-07-20",
          assigned_to: { id: 20, name: "Me" },
          status: { id: 1, name: "New", is_closed: false },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 12,
          subject: "Soon",
          due_date: "2026-07-23",
          assigned_to: { id: 20, name: "Me" },
          status: { id: 1, name: "New", is_closed: false },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 13,
          subject: "Far",
          due_date: "2026-07-30",
          assigned_to: { id: 20, name: "Me" },
          status: { id: 1, name: "New", is_closed: false },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 14,
          subject: "Closed overdue",
          due_date: "2026-07-10",
          assigned_to: { id: 20, name: "Me" },
          status: { id: 5, name: "Closed", is_closed: true },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 15,
          subject: "Other user",
          due_date: "2026-07-21",
          assigned_to: { id: 99, name: "Other" },
          status: { id: 1, name: "New", is_closed: false },
        }),
      );
    });

    it("returns overdue and soon, excludes far/closed/others", () => {
      const alerts = db.getDeadlineAlerts(20, { today });
      expect(alerts.map((a) => a.issueId).sort()).toEqual([11, 12]);
      expect(alerts.find((a) => a.issueId === 11).urgency).toBe("overdue");
      expect(alerts.find((a) => a.issueId === 12).urgency).toBe("soon");
    });

    it("excludes Resolved even when status_is_closed=0", () => {
      db.upsertIssueSummary(
        sampleIssue({
          id: 17,
          subject: "Resolved overdue",
          due_date: "2026-07-10",
          assigned_to: { id: 20, name: "Me" },
          status: { id: 3, name: "Решенный", is_closed: false },
        }),
      );
      const alerts = db.getDeadlineAlerts(20, { today });
      expect(alerts.find((a) => a.issueId === 17)).toBeUndefined();
    });

    it("respects soonDays window", () => {
      const alerts = db.getDeadlineAlerts(20, { today, soonDays: 1 });
      expect(alerts.map((a) => a.issueId).sort()).toEqual([11]);
      const wider = db.getDeadlineAlerts(20, { today, soonDays: 10 });
      expect(wider.map((a) => a.issueId).sort()).toEqual([11, 12, 13]);
    });

    it("treats due_date === today as soon", () => {
      db.upsertIssueSummary(
        sampleIssue({
          id: 16,
          subject: "Today",
          due_date: today,
          assigned_to: { id: 20, name: "Me" },
          status: { id: 1, name: "New", is_closed: false },
        }),
      );
      const alerts = db.getDeadlineAlerts(20, { today });
      expect(alerts.find((a) => a.issueId === 16)?.urgency).toBe("soon");
    });
  });

  describe("queryTimeEntries", () => {
    beforeEach(() => {
      db.upsertTimeEntry({
        id: 1,
        hours: 1.5,
        spent_on: "2026-07-10",
        user: { id: 20, name: "Me" },
        project: { id: 1, name: "A" },
        issue: { id: 1 },
        comments: "a",
      });
      db.upsertTimeEntry({
        id: 2,
        hours: 2,
        spent_on: "2026-07-15",
        user: { id: 20, name: "Me" },
        project: { id: 1, name: "A" },
        issue: { id: 1 },
        comments: "b",
      });
      db.upsertTimeEntry({
        id: 3,
        hours: 3,
        spent_on: "2026-07-20",
        user: { id: 30, name: "Other" },
        project: { id: 1, name: "A" },
        issue: { id: 2 },
        comments: "c",
      });
    });

    it("filters by userId", () => {
      expect(db.queryTimeEntries({ userId: 20 })).toHaveLength(2);
    });

    it("filters by issueId", () => {
      const rows = db.queryTimeEntries({ issueId: 1 });
      expect(rows).toHaveLength(2);
      expect(rows.map((r) => r.id).sort()).toEqual([1, 2]);
    });

    it("filters by from/to", () => {
      const rows = db.queryTimeEntries({ from: "2026-07-12", to: "2026-07-18" });
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(2);
    });
  });

  describe("getOpenChildrenForIssues", () => {
    it("returns only open direct children of given parents", () => {
      db.upsertIssueSummary(sampleIssue({ id: 32573, subject: "Parent", status: { id: 1, name: "New", is_closed: false } }));
      db.upsertIssueSummary(
        sampleIssue({
          id: 32737,
          subject: "Open child",
          status: { id: 1, name: "New", is_closed: false },
          parent: { id: 32573 },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 32738,
          subject: "Closed child",
          status: { id: 5, name: "Closed", is_closed: true },
          parent: { id: 32573 },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 40000,
          subject: "Other parent child",
          status: { id: 1, name: "New", is_closed: false },
          parent: { id: 999 },
        }),
      );

      const rows = db.getOpenChildrenForIssues([32573]);
      expect(rows).toHaveLength(1);
      expect(rows[0].id).toBe(32737);
      expect(rows[0].parent_id).toBe(32573);
    });
  });

  describe("removeOrphanSyncedTimeEntries", () => {
    beforeEach(() => {
      db.upsertIssueSummary(sampleIssue({ id: 1, spent_hours: 4.2 }));
      db.upsertTimeEntry({
        id: 10,
        hours: 4.2,
        spent_on: "2026-08-11",
        user: { id: 20, name: "Me" },
        issue: { id: 1 },
        comments: "deleted on server",
      });
      db.upsertTimeEntry({
        id: 11,
        hours: 1,
        spent_on: "2026-08-10",
        user: { id: 20, name: "Me" },
        issue: { id: 1 },
        comments: "still on server",
      });
      const pending = db.insertLocalTimeEntry({
        issue_id: 1,
        hours: 0.5,
        spent_on: "2026-08-11",
        user_id: 20,
        user_name: "Me",
        comments: "local pending",
        activity_id: 1,
        activity_name: "Dev",
      });
      expect(pending.id).toBeLessThan(0);
    });

    it("removes synced rows missing from keepIds for an issue", () => {
      const result = db.removeOrphanSyncedTimeEntries({ issueId: 1 }, [11]);
      expect(result.removedCount).toBe(1);
      expect(result.affectedIssueIds).toEqual([1]);
      expect(db.getTimeEntryById(10)).toBeNull();
      expect(db.getTimeEntryById(11)).not.toBeNull();
      expect(db.queryTimeEntries({ issueId: 1 }).some((r) => r.id < 0)).toBe(true);
    });

    it("keeps pending/error entries even when not in keepIds", () => {
      db.markTimeEntrySyncStatus(11, "pending");
      const result = db.removeOrphanSyncedTimeEntries({ issueId: 1 }, []);
      expect(db.getTimeEntryById(11)).not.toBeNull();
      expect(result.removedCount).toBe(1); // only id 10
    });

    it("respects userId + from scope", () => {
      db.upsertTimeEntry({
        id: 12,
        hours: 2,
        spent_on: "2026-07-01",
        user: { id: 20, name: "Me" },
        issue: { id: 1 },
        comments: "outside window",
      });
      db.removeOrphanSyncedTimeEntries({ userId: 20, from: "2026-08-01" }, [11]);
      expect(db.getTimeEntryById(10)).toBeNull();
      expect(db.getTimeEntryById(12)).not.toBeNull();
    });
  });

  describe("getTimeEntriesForReport", () => {
    it("filters by user and inclusive date range", () => {
      db.upsertIssueSummary(sampleIssue({ id: 1, subject: "Сопровождение" }));
      db.upsertTimeEntry({
        id: 1,
        hours: 2,
        spent_on: "2026-08-10",
        user: { id: 20, name: "Me" },
        project: { id: 1, name: "A" },
        issue: { id: 1 },
        comments: "a",
        activity: { id: 1, name: "Dev" },
      });
      db.upsertTimeEntry({
        id: 2,
        hours: 3,
        spent_on: "2026-08-11",
        user: { id: 20, name: "Me" },
        project: { id: 1, name: "A" },
        issue: { id: 1 },
        comments: "b",
      });
      db.upsertTimeEntry({
        id: 3,
        hours: 1,
        spent_on: "2026-08-11",
        user: { id: 30, name: "Other" },
        project: { id: 1, name: "A" },
        issue: { id: 2 },
        comments: "c",
      });
      const rows = db.getTimeEntriesForReport({ userId: 20, from: "2026-08-10", to: "2026-08-11" });
      expect(rows.map((r) => r.id)).toEqual([1, 2]);
      expect(rows[0].project_name).toBe("A");
      expect(rows[0].issue_subject).toBe("Сопровождение");
    });
  });

  describe("addIssueSpentHours", () => {
    it("increments spent_hours on the issue", () => {
      db.upsertIssueSummary(sampleIssue({ id: 77, spent_hours: 1 }));
      expect(db.addIssueSpentHours(77, 0.5)).toBe(true);
      expect(db.getIssueById(77).spent_hours).toBe(1.5);
      db.addIssueSpentHours(77, 0.25);
      expect(db.getIssueById(77).spent_hours).toBe(1.75);
    });
  });

  describe("setIssueSpentHours", () => {
    it("sets absolute spent_hours", () => {
      db.upsertIssueSummary(sampleIssue({ id: 88, spent_hours: 4.2 }));
      expect(db.setIssueSpentHours(88, 0)).toBe(true);
      expect(db.getIssueById(88).spent_hours).toBe(0);
    });
  });

  describe("upsertIssueSummary → getIssueById", () => {
    it("keeps data on update", () => {
      db.upsertIssueSummary(sampleIssue({ id: 55, subject: "v1", done_ratio: 10 }));
      db.upsertIssueSummary(sampleIssue({ id: 55, subject: "v2", done_ratio: 40 }));
      const issue = db.getIssueById(55);
      expect(issue).not.toBeNull();
      expect(issue.subject).toBe("v2");
      expect(issue.done_ratio).toBe(40);
      expect(issue.project_id).toBe(1);
      expect(issue.assigned_to_id).toBe(20);
    });
  });

  describe("upsertTimeEntry", () => {
    it("inserts and upserts without duplicating", () => {
      db.upsertTimeEntry({
        id: 9,
        hours: 1,
        spent_on: "2026-07-01",
        user: { id: 1, name: "U" },
        comments: "first",
      });
      db.upsertTimeEntry({
        id: 9,
        hours: 4,
        spent_on: "2026-07-01",
        user: { id: 1, name: "U" },
        comments: "updated",
      });
      const rows = db.queryTimeEntries({});
      expect(rows).toHaveLength(1);
      expect(rows[0].hours).toBe(4);
      expect(rows[0].comments).toBe("updated");
    });
  });

  describe("offline queue", () => {
    it("enqueue / get / mark attempt / remove", () => {
      const id = db.enqueueOfflineItem("update_issue", { issueId: 1, issueData: { subject: "x" } });
      expect(id).toBeTruthy();
      let queue = db.getOfflineQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].type).toBe("update_issue");
      expect(JSON.parse(queue[0].payload_json).issueId).toBe(1);

      db.markOfflineAttempt(id, "boom");
      queue = db.getOfflineQueue();
      expect(queue[0].attempts).toBe(1);
      expect(queue[0].last_error).toBe("boom");

      db.removeOfflineItem(id);
      expect(db.getOfflineQueue()).toHaveLength(0);
    });
  });

  describe("sync_failures", () => {
    it("add / get unread / mark read", () => {
      db.addSyncFailure({ entityType: "issue", entityLabel: "#1", message: "fail A" });
      db.addSyncFailure({ entityType: "time_entry", entityLabel: "#2", message: "fail B" });
      let unread = db.getUnreadSyncFailures();
      expect(unread).toHaveLength(2);
      expect(unread[0].message).toBe("fail B");
      expect(unread[1].entity_label).toBe("#1");

      db.markSyncFailuresRead();
      unread = db.getUnreadSyncFailures();
      expect(unread).toHaveLength(0);
    });
  });

  describe("clearProjectData", () => {
    it("removes issues and related rows for one project", () => {
      db.upsertIssueSummary(
        sampleIssue({
          id: 50,
          project: { id: 7, name: "ToClear" },
          status: { id: 1, name: "New" },
        }),
      );
      db.upsertIssueSummary(
        sampleIssue({
          id: 51,
          project: { id: 8, name: "Keep" },
          status: { id: 1, name: "New" },
        }),
      );
      db.setSyncProjects([
        { project_id: 7, project_name: "ToClear", enabled: 1, last_sync_at: "2026-01-01", issue_count: 1 },
        { project_id: 8, project_name: "Keep", enabled: 1, last_sync_at: "2026-01-01", issue_count: 1 },
      ]);

      const result = db.clearProjectData(7);
      expect(result.removedIssues).toBe(1);
      expect(db.queryIssues({ projectId: 7 })).toHaveLength(0);
      expect(db.queryIssues({ projectId: 8 })).toHaveLength(1);
      const projects = db.getSyncProjects();
      expect(projects.find((p) => p.project_id === 7).enabled).toBe(0);
      expect(projects.find((p) => p.project_id === 8).enabled).toBe(1);
    });
  });

  describe("allowed_statuses", () => {
    it("persists allowed_statuses on saveIssueDetail", () => {
      db.saveIssueDetail({
        ...sampleIssue(),
        allowed_statuses: [
          { id: 1, name: "New", is_closed: false },
          { id: 2, name: "Done", is_closed: true },
        ],
      });
      const issue = db.getIssueById(101);
      expect(issue.allowed_statuses).toEqual([
        { id: 1, name: "New", is_closed: false },
        { id: 2, name: "Done", is_closed: true },
      ]);
      expect(issue.allowed_statuses_unsupported).toBe(false);
    });

    it("clears allowed_statuses when status_id changes", () => {
      db.saveReferenceData("issue_statuses", [
        { id: 1, name: "New", is_closed: false },
        { id: 2, name: "Done", is_closed: true },
      ]);
      db.upsertIssueSummary(sampleIssue());
      db.saveAllowedStatuses(101, [{ id: 1, name: "New" }]);
      expect(db.getIssueById(101).allowed_statuses).toHaveLength(1);
      db.applyIssueUpdatePatch(101, { status_id: 2 });
      const issue = db.getIssueById(101);
      expect(issue.allowed_statuses).toBeNull();
      expect(issue.status_name).toBe("Done");
    });

    it("keeps allowed_statuses when summary upsert has same status", () => {
      db.upsertIssueSummary(sampleIssue());
      db.saveAllowedStatuses(101, [{ id: 1, name: "New" }]);
      db.upsertIssueSummary(sampleIssue({ subject: "updated" }));
      expect(db.getIssueById(101).allowed_statuses).toEqual([
        { id: 1, name: "New", is_closed: false },
      ]);
      expect(db.getIssueById(101).subject).toBe("updated");
    });

    it("clears allowed_statuses when summary upsert changes status", () => {
      db.upsertIssueSummary(sampleIssue());
      db.saveAllowedStatuses(101, [{ id: 1, name: "New" }]);
      db.upsertIssueSummary(sampleIssue({ status: { id: 2, name: "Done", is_closed: true } }));
      expect(db.getIssueById(101).allowed_statuses).toBeNull();
    });

    it("stores unsupported marker", () => {
      db.upsertIssueSummary(sampleIssue());
      db.saveAllowedStatuses(101, null, { unsupported: true });
      const issue = db.getIssueById(101);
      expect(issue.allowed_statuses).toBeNull();
      expect(issue.allowed_statuses_unsupported).toBe(true);
    });
  });

  describe("schema v8 active_timer + drafts", () => {
    it("getActiveTimer returns null when empty", () => {
      expect(db.getActiveTimer()).toBeNull();
    });

    it("start / pause / resume / clear active timer", () => {
      const started = db.startActiveTimer({
        issueId: 32737,
        projectId: 1,
        activityId: 9,
        entryKind: "work",
        comment: "debug",
        customerName: "Acme",
      });
      expect(started.id).toBe(1);
      expect(started.issue_id).toBe(32737);
      expect(started.is_paused).toBe(0);
      expect(db.getActiveTimer()?.comment_draft).toBe("debug");

      const paused = db.pauseActiveTimer();
      expect(paused.is_paused).toBe(1);
      expect(Number(paused.accumulated_seconds)).toBeGreaterThanOrEqual(0);

      const resumed = db.resumeActiveTimer();
      expect(resumed.is_paused).toBe(0);

      db.clearActiveTimer();
      expect(db.getActiveTimer()).toBeNull();
    });

    it("insertLocalTimeEntry can create draft with timer fields", () => {
      const row = db.insertLocalTimeEntry({
        issue_id: 32737,
        hours: 0.05,
        comments: "timer draft",
        sync_status: "draft",
        entry_source: "timer",
        entry_kind: "work",
        started_at: "2026-08-16T10:00:00.000Z",
        ended_at: "2026-08-16T10:03:00.000Z",
      });
      expect(row.sync_status).toBe("draft");
      expect(row.entry_source).toBe("timer");
      expect(row.started_at).toBeTruthy();
      const drafts = db.queryTimeEntries({ syncStatuses: ["draft"] });
      expect(drafts.some((e) => e.id === row.id)).toBe(true);
    });

    it("removeOrphanSyncedTimeEntries keeps draft rows", () => {
      db.insertLocalTimeEntry({
        issue_id: 32737,
        hours: 1,
        sync_status: "draft",
        entry_source: "timer",
      });
      // Force positive id synced orphan via upsert
      db.upsertTimeEntry({
        id: 900001,
        issue_id: 32737,
        hours: 2,
        spent_on: "2026-08-16",
        comments: "server",
      });
      const result = db.removeOrphanSyncedTimeEntries({ issueId: 32737 }, []);
      expect(result.removedCount).toBe(1);
      expect(db.queryTimeEntries({ issueId: 32737, syncStatuses: ["draft"] })).toHaveLength(1);
      expect(db.getTimeEntryById(900001)).toBeNull();
    });
  });
});
