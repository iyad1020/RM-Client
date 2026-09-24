const { shouldRefreshIssueCardOnFlush } = require("../renderer/flush-refresh");

describe("shouldRefreshIssueCardOnFlush", () => {
  it("returns false when tracker is visible", () => {
    expect(
      shouldRefreshIssueCardOnFlush({
        trackerViewVisible: true,
        issuePageVisible: true,
        selectedIssueId: 1,
        flushedIssueIds: [1],
      }),
    ).toBe(false);
  });

  it("returns false when issue page is hidden", () => {
    expect(
      shouldRefreshIssueCardOnFlush({
        trackerViewVisible: false,
        issuePageVisible: false,
        selectedIssueId: 1,
        flushedIssueIds: [1],
      }),
    ).toBe(false);
  });

  it("returns true only when issue page visible and id matches", () => {
    expect(
      shouldRefreshIssueCardOnFlush({
        trackerViewVisible: false,
        issuePageVisible: true,
        selectedIssueId: 32747,
        flushedIssueIds: [32747, 99],
      }),
    ).toBe(true);
  });
});
