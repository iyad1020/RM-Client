const db = require("../db/database");
const referenceData = require("../sync/reference-data");

describe("reference-data", () => {
  beforeEach(() => {
    db.closeDatabase();
    db.openDatabase(":memory:");
  });

  afterEach(() => {
    db.closeDatabase();
  });

  it("persistReferenceData keeps cached activities when fetch returns empty", () => {
    db.saveReferenceData("activities", [{ id: 9, name: "Разработка", is_default: true }]);

    referenceData.persistReferenceData(db, {
      projects: [],
      users: [],
      issueStatuses: [],
      trackers: [],
      priorities: [],
      activities: [],
      roles: [],
      currentUser: null,
    });

    expect(db.getReferenceData("activities")).toEqual([{ id: 9, name: "Разработка", is_default: true }]);
  });

  it("persistReferenceData replaces activities when fetch returns data", () => {
    db.saveReferenceData("activities", [{ id: 1, name: "Old" }]);

    referenceData.persistReferenceData(db, {
      projects: [{ id: 1, name: "Proj" }],
      users: [],
      issueStatuses: [{ id: 1, name: "New" }],
      trackers: [],
      priorities: [],
      activities: [{ id: 2, name: "Разработка" }],
      roles: [],
      currentUser: { id: 5, firstname: "A", lastname: "B" },
    });

    expect(db.getReferenceData("activities")).toEqual([{ id: 2, name: "Разработка" }]);
    expect(referenceData.referenceCacheHasEssentials(db)).toBe(true);
  });

  it("ensureReferenceData uses cache when essentials present", async () => {
    db.saveReferenceData("projects", [{ id: 1, name: "Proj" }]);
    db.saveReferenceData("issue_statuses", [{ id: 1, name: "New" }]);
    db.saveReferenceData("activities", [{ id: 9, name: "Разработка" }]);
    db.saveReferenceData("current_user", { id: 5, firstname: "A", lastname: "B" });

    const redmine = {
      loadReferenceData: async () => {
        throw new Error("Should not call Redmine when cache is complete");
      },
    };

    const ref = await referenceData.ensureReferenceData(db, redmine, "https://rm.test", "key");
    expect(ref.activities).toEqual([{ id: 9, name: "Разработка" }]);
  });
});
