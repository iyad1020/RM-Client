const {
  parseFavoriteIds,
  closedIssuesEligibleForEviction,
  cacheMaxBytesFromMb,
} = require("../sync/cache-policy");

describe("cache-policy", () => {
  it("never evicts favorites", () => {
    const eligible = closedIssuesEligibleForEviction({
      issues: [
        { id: 1, status_is_closed: 1, updated_on: "2020-01-01T00:00:00Z" },
        { id: 2, status_is_closed: 1, updated_on: "2020-01-01T00:00:00Z" },
      ],
      favoriteIds: [1],
      retentionDays: 30,
      nowIso: "2026-01-01T00:00:00Z",
    });
    expect(eligible.map((i) => i.id)).toEqual([2]);
  });

  it("respects retentionDays=0 as never", () => {
    expect(
      closedIssuesEligibleForEviction({
        issues: [{ id: 1, status_is_closed: 1, updated_on: "2020-01-01T00:00:00Z" }],
        retentionDays: 0,
        nowIso: "2026-01-01T00:00:00Z",
      }),
    ).toEqual([]);
  });

  it("parseFavoriteIds and cacheMaxBytesFromMb", () => {
    expect(parseFavoriteIds("[1,2]")).toEqual([1, 2]);
    expect(cacheMaxBytesFromMb(0)).toBe(0);
    expect(cacheMaxBytesFromMb(1024)).toBe(1024 * 1024 * 1024);
  });
});
