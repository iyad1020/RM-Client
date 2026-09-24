const db = require("../db/database");

describe("activity_feed db", () => {
  beforeEach(() => {
    db.closeDatabase();
    db.openDatabase(":memory:");
    db.ensureActivityFeedWatermark("2026-08-01T00:00:00Z");
  });

  afterEach(() => {
    db.closeDatabase();
  });

  it("inserts, filters, marks seen and dedupes", () => {
    db.insertActivityEvent({
      issue_id: 1,
      journal_id: 100,
      kind: "comment",
      actor_name: "Anna",
      actor_id: 2,
      issue_subject: "One",
      project_name: "P",
      summary: "comment",
      detail_text: "Hi",
      created_on: "2026-08-10T10:00:00Z",
    });
    db.insertActivityEvent({
      issue_id: 1,
      journal_id: 100,
      kind: "comment",
      actor_name: "Anna",
      actor_id: 2,
      issue_subject: "One",
      project_name: "P",
      summary: "comment",
      detail_text: "Hi",
      created_on: "2026-08-10T10:00:00Z",
    });
    db.insertActivityEvent({
      issue_id: 2,
      journal_id: 101,
      kind: "status",
      actor_name: "Bob",
      actor_id: 3,
      issue_subject: "Two",
      project_name: "P",
      summary: "status",
      detail_text: "A -> B",
      created_on: "2026-08-11T10:00:00Z",
    });

    expect(db.queryActivityFeed({ limit: 10 })).toHaveLength(2);
    expect(db.queryActivityFeed({ limit: 10, kinds: ["comment"] })).toHaveLength(1);
    expect(db.countUnseenActivity()).toBe(2);
    expect(db.markActivitySeen({ ids: [1] })).toBe(1);
    expect(db.countUnseenActivity()).toBe(1);
    expect(db.markActivitySeen({ all: true })).toBe(1);
    expect(db.countUnseenActivity()).toBe(0);
  });
});
