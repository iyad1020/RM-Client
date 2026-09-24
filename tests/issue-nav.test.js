const {
  shouldContinueIssueOpen,
  timeEntryCommentsReady,
  createIssueNavStack,
  mergeIssueStatusFromList,
} = require("../renderer/issue-nav");
const { roundHoursToHalf } = require("../renderer/tracker-hours");

describe("shouldContinueIssueOpen", () => {
  it("blocks when user navigated away (generation changed)", () => {
    expect(
      shouldContinueIssueOpen({
        navGeneration: 2,
        expectedGeneration: 1,
        selectedIssueId: 10,
        issueId: 10,
        issuePageVisible: true,
      }),
    ).toBe(false);
  });

  it("blocks when issue page is hidden (Back)", () => {
    expect(
      shouldContinueIssueOpen({
        navGeneration: 1,
        expectedGeneration: 1,
        selectedIssueId: 10,
        issueId: 10,
        issuePageVisible: false,
      }),
    ).toBe(false);
  });

  it("allows preview mode even if issue page flag is false", () => {
    expect(
      shouldContinueIssueOpen({
        navGeneration: 1,
        expectedGeneration: 1,
        selectedIssueId: 10,
        issueId: 10,
        issuePageVisible: false,
        previewMode: true,
      }),
    ).toBe(true);
  });

  it("allows matching open card", () => {
    expect(
      shouldContinueIssueOpen({
        navGeneration: 3,
        expectedGeneration: 3,
        selectedIssueId: 32737,
        issueId: 32737,
        issuePageVisible: true,
      }),
    ).toBe(true);
  });
});

describe("timeEntryCommentsReady", () => {
  it("rejects empty and whitespace", () => {
    expect(timeEntryCommentsReady("")).toBe(false);
    expect(timeEntryCommentsReady("   ")).toBe(false);
    expect(timeEntryCommentsReady(null)).toBe(false);
  });

  it("accepts non-empty comments", () => {
    expect(timeEntryCommentsReady("работа")).toBe(true);
  });
});

describe("createIssueNavStack", () => {
  it("pushes only when navigating from an open card to another issue", () => {
    const stack = createIssueNavStack();
    stack.pushIfNavigating(1, 2, { fromCard: false });
    expect(stack.length).toBe(0);
    stack.pushIfNavigating(1, 2, { fromCard: true });
    expect(stack.snapshot()).toEqual([1]);
    stack.pushIfNavigating(2, 3, { fromCard: true });
    expect(stack.snapshot()).toEqual([1, 2]);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBeNull();
  });

  it("clear empties the stack", () => {
    const stack = createIssueNavStack([10, 20]);
    stack.clear();
    expect(stack.length).toBe(0);
  });
});

describe("mergeIssueStatusFromList", () => {
  it("overlays list status onto issue detail", () => {
    const merged = mergeIssueStatusFromList(
      { id: 5, status: { id: 1, name: "New", is_closed: false }, subject: "A" },
      [{ id: 5, status: { id: 3, name: "In Progress", is_closed: false } }],
    );
    expect(merged.status).toEqual({ id: 3, name: "In Progress", is_closed: false });
    expect(merged.subject).toBe("A");
  });

  it("keeps issue status when list matches or missing", () => {
    const issue = { id: 5, status: { id: 2, name: "Done", is_closed: true } };
    expect(mergeIssueStatusFromList(issue, [{ id: 5, status: { id: 2, name: "Done" } }]).status.id).toBe(2);
    expect(mergeIssueStatusFromList(issue, []).status.id).toBe(2);
  });
});

describe("roundHoursToHalf", () => {
  it("rounds to nearest half when enabled", () => {
    expect(roundHoursToHalf(0.2, true)).toBe(0.5);
    expect(roundHoursToHalf(0.67, true)).toBe(0.5);
    expect(roundHoursToHalf(0.76, true)).toBe(1);
    expect(roundHoursToHalf(1.24, true)).toBe(1);
    expect(roundHoursToHalf(1.25, true)).toBe(1.5);
  });

  it("keeps zero and respects disabled flag", () => {
    expect(roundHoursToHalf(0, true)).toBe(0);
    expect(roundHoursToHalf(0.67, false)).toBe(0.67);
  });
});
