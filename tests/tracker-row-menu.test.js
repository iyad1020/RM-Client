const { shouldOpenTrackerCopyRowMenu } = require("../renderer/tracker-row-menu");

function el(matches) {
  return {
    closest(sel) {
      return matches[sel] || null;
    },
  };
}

describe("shouldOpenTrackerCopyRowMenu", () => {
  it("opens on empty row/cell, not on controls", () => {
    const row = {};
    expect(shouldOpenTrackerCopyRowMenu(el({ "tr[data-entry-id]": row }))).toBe(true);
    expect(
      shouldOpenTrackerCopyRowMenu(
        el({
          "tr[data-entry-id]": row,
          "input, textarea, select, button, a, option, [contenteditable='true']": {},
        }),
      ),
    ).toBe(false);
  });

  it("stays closed when the pointer is on a text glyph", () => {
    const row = {};
    const textNode = { nodeType: 3, textContent: "Привет" };
    const range = {
      startContainer: textNode,
      startOffset: 0,
      cloneRange() {
        return {
          setStart() {},
          setEnd() {},
          getClientRects() {
            return [{ left: 10, right: 40, top: 10, bottom: 24 }];
          },
        };
      },
    };
    expect(
      shouldOpenTrackerCopyRowMenu(el({ "tr[data-entry-id]": row }), {
        clientX: 20,
        clientY: 16,
        caretRangeFromPoint: () => range,
      }),
    ).toBe(false);
  });
});
