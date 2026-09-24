const {
  normalizeOrder,
  moveKey,
  getRedmineDefaultOrder,
  applyOrderToForm,
} = require("../renderer/time-entry-form-order");
const {
  flattenProjectsTree,
  projectsForSelect,
  projectParentId,
} = require("../renderer/project-tree");

describe("time-entry-form-order", () => {
  it("defaults to Redmine order", () => {
    expect(getRedmineDefaultOrder()).toEqual([
      "spent_on",
      "hours",
      "comments",
      "activity_id",
      "customer_name",
    ]);
  });

  it("normalizes partial and unknown keys", () => {
    expect(normalizeOrder(["hours", "spent_on", "bogus", "hours"])).toEqual([
      "hours",
      "spent_on",
      "comments",
      "activity_id",
      "customer_name",
    ]);
  });

  it("moves keys up and down", () => {
    const order = getRedmineDefaultOrder();
    expect(moveKey(order, "hours", -1)[0]).toBe("hours");
    expect(moveKey(order, "spent_on", 1)[1]).toBe("spent_on");
  });

  it("applyOrderToForm is a no-op without form", () => {
    expect(() => applyOrderToForm(null, getRedmineDefaultOrder())).not.toThrow();
  });
});

describe("project-tree", () => {
  const projects = [
    { id: 1, name: "Root A" },
    { id: 2, name: "Child A1", parent: { id: 1 } },
    { id: 3, name: "Root B" },
    { id: 4, name: "Child A2", parent_id: 1 },
  ];

  it("reads parent id from parent object or parent_id", () => {
    expect(projectParentId(projects[1])).toBe(1);
    expect(projectParentId(projects[3])).toBe(1);
    expect(projectParentId(projects[0])).toBeNull();
  });

  it("flattens tree depth-first by name", () => {
    const rows = flattenProjectsTree(projects);
    expect(rows.map((r) => r.id)).toEqual([1, 2, 4, 3]);
    expect(rows.find((r) => r.id === 2)?.depth).toBe(1);
    expect(rows.find((r) => r.id === 3)?.depth).toBe(0);
  });

  it("projectsForSelect respects hierarchy flag", () => {
    const flat = projectsForSelect(projects, { hierarchy: false });
    expect(flat.map((p) => p.name)).toEqual(["Child A1", "Child A2", "Root A", "Root B"]);
    const tree = projectsForSelect(projects, { hierarchy: true });
    expect(tree[0].id).toBe(1);
    expect(tree[1].name).toContain("└");
  });
});
