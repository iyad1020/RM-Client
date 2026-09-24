const {
  monthRangeToIso,
  normalizeRange,
  getPresetRange,
  isMonthInRange,
  rangeFromMonthPoints,
} = require("../renderer/period-picker");

describe("period-picker", () => {
  it("monthRangeToIso returns full month", () => {
    expect(monthRangeToIso(2026, 0)).toEqual({ from: "2026-01-01", to: "2026-01-31" });
    expect(monthRangeToIso(2026, 1)).toEqual({ from: "2026-02-01", to: "2026-02-28" });
  });

  it("normalizeRange swaps reversed dates", () => {
    expect(normalizeRange("2026-05-31", "2026-01-01")).toEqual({
      from: "2026-01-01",
      to: "2026-05-31",
    });
  });

  it("getPresetRange week returns mon-sun span", () => {
    const range = getPresetRange("week", new Date(2026, 7, 28));
    expect(range.from <= range.to).toBe(true);
    expect(range.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("isMonthInRange detects overlap", () => {
    expect(isMonthInRange(2026, 0, "2026-01-15", "2026-03-10")).toBe(true);
    expect(isMonthInRange(2026, 5, "2026-01-01", "2026-03-31")).toBe(false);
  });

  it("rangeFromMonthPoints spans multiple months", () => {
    expect(
      rangeFromMonthPoints({ year: 2026, month: 0 }, { year: 2026, month: 4 }),
    ).toEqual({ from: "2026-01-01", to: "2026-05-31" });
  });
});
