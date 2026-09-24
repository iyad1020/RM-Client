const { isClosedForOpenScope } = require("../renderer/issue-status-filter");

describe("issue-status-filter", () => {
  it("keeps resolved in open scope, excludes closed and rejected", () => {
    expect(isClosedForOpenScope({ name: "Решенный", is_closed: false })).toBe(false);
    expect(isClosedForOpenScope({ name: "Resolved", is_closed: false })).toBe(false);
    expect(isClosedForOpenScope({ name: "Закрыт", is_closed: false })).toBe(true);
    expect(isClosedForOpenScope({ name: "Closed", is_closed: true })).toBe(true);
    expect(isClosedForOpenScope({ name: "Rejected", is_closed: false })).toBe(true);
  });
});
