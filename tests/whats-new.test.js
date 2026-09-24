const {
  compareVersions,
  shouldAutoShow,
  latestVersion,
  RELEASES,
  SEEN_KEY,
} = require("../renderer/whats-new");

describe("whats-new", () => {
  beforeEach(() => {
    global.localStorage = {
      store: {},
      getItem(key) {
        return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
      },
      setItem(key, value) {
        this.store[key] = String(value);
      },
      removeItem(key) {
        delete this.store[key];
      },
    };
  });

  it("ships 1.1.4 as detailed text-only release notes", () => {
    expect(latestVersion()).toBe("1.1.4");
    expect(RELEASES[0].items.length).toBeGreaterThanOrEqual(10);
    expect(RELEASES[0].items.every((item) => !item.media)).toBe(true);
    expect(RELEASES[0].items.some((item) => /^Новое:/i.test(item.title))).toBe(true);
    expect(RELEASES[0].items.some((item) => /^Исправление:/i.test(item.title))).toBe(true);
    expect(RELEASES[0].items.some((item) => /^Удобство:/i.test(item.title))).toBe(true);
    expect(RELEASES[0].items.every((item) => String(item.body || "").length > 80)).toBe(true);
  });

  it("compares versions and decides auto-show", () => {
    expect(compareVersions("1.1.4", "1.1.3")).toBe(1);
    expect(compareVersions("1.1.3", "1.1.4")).toBe(-1);
    expect(shouldAutoShow("1.1.4")).toBe(true);
    global.localStorage.setItem(SEEN_KEY, "1.1.4");
    expect(shouldAutoShow("1.1.4")).toBe(false);
    expect(shouldAutoShow("1.1.5")).toBe(true);
  });
});
