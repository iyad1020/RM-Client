const { getPriorityColor } = require("../renderer/priority-color");

describe("priority-color", () => {
  it("maps Redmine priorities to heat-map colors", () => {
    expect(getPriorityColor("Немедленно")).toBe("#922B3E");
    expect(getPriorityColor("Срочный")).toBe("#E03131");
    expect(getPriorityColor("Высокий")).toBe("#E8590C");
    expect(getPriorityColor("Обычный")).toBeNull();
    expect(getPriorityColor("Низкий")).toBe("#2F9E44");
    expect(getPriorityColor("Отложено")).toBe("#868E96");
  });

  it("returns null for empty/placeholder values", () => {
    expect(getPriorityColor("")).toBeNull();
    expect(getPriorityColor("-")).toBeNull();
    expect(getPriorityColor("—")).toBeNull();
    expect(getPriorityColor("Unknown")).toBeNull();
  });
});
