const {
  normalizeTrackerHoursTyping,
  formatTrackerHoursValue,
  roundHoursToHalf,
  shouldBlockHoursDecimalDelete,
} = require("../renderer/tracker-hours");

describe("tracker-hours", () => {
  it("formatTrackerHoursValue always two decimals", () => {
    expect(formatTrackerHoursValue(1)).toBe("1.00");
    expect(formatTrackerHoursValue(2.5)).toBe("2.50");
  });

  it("normalizeTrackerHoursTyping strips invalid chars", () => {
    expect(normalizeTrackerHoursTyping("1,5x")).toBe("1.5");
    expect(normalizeTrackerHoursTyping("1.2.3")).toBe("1.23");
  });

  it("shouldBlockHoursDecimalDelete blocks backspace on dot", () => {
    const input = { value: "1.00", selectionStart: 2, selectionEnd: 2 };
    expect(shouldBlockHoursDecimalDelete(input, { key: "Backspace" })).toBe(true);
  });

  it("roundHoursToHalf rounds to nearest 0.5", () => {
    expect(roundHoursToHalf(0.4)).toBe(0.5);
    expect(roundHoursToHalf(0.05)).toBe(0.5);
    expect(roundHoursToHalf(0.67)).toBe(0.5);
    expect(roundHoursToHalf(1.1)).toBe(1);
    expect(roundHoursToHalf(2.5)).toBe(2.5);
  });

  it("roundHoursToHalf can be disabled", () => {
    expect(roundHoursToHalf(0.05, false)).toBe(0.05);
    expect(roundHoursToHalf(0.67, false)).toBe(0.67);
  });
});
