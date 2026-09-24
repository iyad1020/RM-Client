const { getSteps, STORAGE_KEY, isTourComplete, findNav } = require("../renderer/product-tour");

describe("product-tour", () => {
  it("defines expanded tour with per-icon and screen steps", () => {
    const steps = getSteps();
    expect(steps.length).toBeGreaterThanOrEqual(18);
    expect(steps[0].id).toBe("welcome");
    expect(steps.some((s) => s.id === "view-agile")).toBe(true);
    expect(steps.some((s) => s.id === "status-scope")).toBe(true);
    expect(steps.some((s) => s.id === "nav-tracker")).toBe(true);
    expect(steps.some((s) => s.id === "tracker-time")).toBe(true);
    expect(steps.some((s) => s.id === "report-tabs")).toBe(true);
    expect(steps.some((s) => s.id === "quick-te")).toBe(true);
    expect(steps.some((s) => s.id === "create-issue")).toBe(true);
    expect(steps.some((s) => s.id === "nav-settings")).toBe(true);
    const settingsStep = steps.find((s) => s.id === "nav-settings");
    expect(settingsStep.title).toBe("Настройки программы");
    expect(String(settingsStep.body)).toMatch(/Что нового|Форма трудозатрат/);
    expect(steps.every((s) => s.title && s.body)).toBe(true);
  });

  it("uses stable storage key for first-run completion", () => {
    expect(STORAGE_KEY).toBe("redmine-client:product-tour-complete");
    expect(typeof isTourComplete()).toBe("boolean");
  });

  it("exports findNav helper", () => {
    expect(typeof findNav).toBe("function");
  });
});
