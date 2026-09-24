const journalActivity = require("../sync/journal-activity");

describe("journal-activity", () => {
  it("maps journal details to kinds", () => {
    expect(journalActivity.kindFromDetail({ name: "status_id" }, 1)).toBe("status");
    expect(journalActivity.kindFromDetail({ name: "assigned_to_id", new_value: "5" }, 5)).toBe("assigned");
    expect(journalActivity.kindFromDetail({ property: "attachment", new_value: "a.png" }, 1)).toBe("attachment");
    expect(journalActivity.kindFromDetail({ property: "relation" }, 1)).toBeNull();
  });

  it("skips own journals and old journals", () => {
    const events = journalActivity.eventsFromJournal(
      {
        id: 10,
        user: { id: 5, name: "Me" },
        notes: "hello",
        created_on: "2026-08-10T10:00:00Z",
        details: [],
      },
      { issueId: 100, currentUserId: 5, sinceIso: "2026-08-01T00:00:00Z" },
    );
    expect(events).toHaveLength(0);

    const oldEvents = journalActivity.eventsFromJournal(
      {
        id: 11,
        user: { id: 2, name: "Other" },
        notes: "old",
        created_on: "2026-07-01T10:00:00Z",
        details: [],
      },
      { issueId: 100, currentUserId: 5, sinceIso: "2026-08-01T00:00:00Z" },
    );
    expect(oldEvents).toHaveLength(0);
  });

  it("splits comment and field changes", () => {
    const events = journalActivity.eventsFromJournal(
      {
        id: 12,
        user: { id: 2, name: "Anna" },
        notes: "Please check",
        created_on: "2026-08-10T12:00:00Z",
        details: [{ name: "status_id", old_value: "1", new_value: "2" }],
      },
      { issueId: 200, issueSubject: "Task", currentUserId: 5, sinceIso: "2026-08-01T00:00:00Z" },
    );
    expect(events.map((e) => e.kind).sort()).toEqual(["comment", "status"]);
  });

  it("maps UI groups to kinds", () => {
    const kinds = journalActivity.kindsForGroups(["comment", "attachment"]);
    expect(kinds).toEqual(expect.arrayContaining(["comment", "attachment"]));
    expect(kinds).not.toContain("status");
  });
});
