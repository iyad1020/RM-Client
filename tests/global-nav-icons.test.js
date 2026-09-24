const { globalNavIconsMarkup } = require("../renderer/global-nav-icons");

describe("global-nav-icons", () => {
  it("includes list, deep search, tracker and quick-issue actions", () => {
    const html = globalNavIconsMarkup();
    expect(html).toContain('data-global-nav="issues-list"');
    expect(html).toContain('data-global-nav="deep-search"');
    expect(html).toContain('data-global-nav="tracker"');
    expect(html).toContain('data-global-nav="quick-issue-by-id"');
  });
});
