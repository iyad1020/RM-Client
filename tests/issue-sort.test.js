const { getPriorityWeight, sortIssues, getStatusSortMeta, compareStatuses } = require("../renderer/issue-sort");

describe("issue-sort", () => {
  it("ranks Redmine priorities: Немедленно > … > Отложено", () => {
    expect(getPriorityWeight("Немедленно")).toBeGreaterThan(getPriorityWeight("Срочный"));
    expect(getPriorityWeight("Срочный")).toBeGreaterThan(getPriorityWeight("Высокий"));
    expect(getPriorityWeight("Высокий")).toBeGreaterThan(getPriorityWeight("Обычный"));
    expect(getPriorityWeight("Обычный")).toBeGreaterThan(getPriorityWeight("Низкий"));
    expect(getPriorityWeight("Низкий")).toBeGreaterThan(getPriorityWeight("Отложено"));
  });

  it("sorts by priority desc (most important first), then due asc", () => {
    const issues = [
      { id: 1, priority: { name: "Обычный" }, due_date: "2026-08-01" },
      { id: 2, priority: { name: "Немедленно" }, due_date: "2026-08-10" },
      { id: 3, priority: { name: "Немедленно" }, due_date: "2026-08-02" },
      { id: 4, priority: { name: "Отложено" }, due_date: "2026-07-01" },
    ];
    const sorted = sortIssues(issues, { priorityDir: "desc", dueDir: "asc" });
    expect(sorted.map((i) => i.id)).toEqual([3, 2, 1, 4]);
  });

  it("when only due sort is set, ignores priority", () => {
    const issues = [
      { id: 1, priority: { name: "Немедленно" }, due_date: "2026-08-10" },
      { id: 2, priority: { name: "Низкий" }, due_date: "2026-08-01" },
    ];
    const sorted = sortIssues(issues, { dueDir: "asc" });
    expect(sorted.map((i) => i.id)).toEqual([2, 1]);
  });

  it("priority primary still uses due as secondary when dueDir is null", () => {
    const issues = [
      { id: 1, priority: { name: "Высокий" }, due_date: "2026-08-05" },
      { id: 2, priority: { name: "Высокий" }, due_date: "2026-08-01" },
    ];
    const sorted = sortIssues(issues, { priorityDir: "desc" });
    expect(sorted.map((i) => i.id)).toEqual([2, 1]);
  });

  it("sorts Russian statuses by workflow order", () => {
    const issues = [
      { id: 1, status: { name: "Закрыт" } },
      { id: 2, status: { name: "Новый" } },
      { id: 3, status: { name: "В работе" } },
      { id: 4, status: { name: "Отклонен" } },
    ];
    const sorted = sortIssues(issues, { statusDir: "asc" });
    expect(sorted.map((i) => i.id)).toEqual([2, 3, 1, 4]);
  });

  it("keeps Russian statuses above English regardless of dir", () => {
    const issues = [
      { id: 1, status: { name: "Done" } },
      { id: 2, status: { name: "Отклонен" } },
      { id: 3, status: { name: "to do" } },
      { id: 4, status: { name: "Новый" } },
    ];
    const asc = sortIssues(issues, { statusDir: "asc" });
    expect(asc.map((i) => i.id)).toEqual([4, 2, 3, 1]);
    const desc = sortIssues(issues, { statusDir: "desc" });
    expect(desc.map((i) => i.id)).toEqual([2, 4, 1, 3]);
  });

  it("maps EN status typos to workflow ranks", () => {
    expect(getStatusSortMeta("under revie").rank).toBe(getStatusSortMeta("Under Review").rank);
    expect(getStatusSortMeta("Wating for estimation").rank).toBe(
      getStatusSortMeta("Waiting for estimation").rank,
    );
    expect(getStatusSortMeta("Estimeted").rank).toBe(getStatusSortMeta("Estimated").rank);
  });

  it("compareStatuses: unknown statuses after known lanes", () => {
    expect(compareStatuses("Новый", "Custom", "asc")).toBeLessThan(0);
    expect(compareStatuses("to do", "Custom", "asc")).toBeLessThan(0);
  });

  it("sorts by updated_on", () => {
    const issues = [
      { id: 1, updated_on: "2026-08-01T10:00:00Z" },
      { id: 2, updated_on: "2026-08-10T10:00:00Z" },
      { id: 3, updated_on: null },
    ];
    const desc = sortIssues(issues, { updatedDir: "desc" });
    expect(desc.map((i) => i.id)).toEqual([2, 1, 3]);
    const asc = sortIssues(issues, { updatedDir: "asc" });
    expect(asc.map((i) => i.id)).toEqual([1, 2, 3]);
  });
});
