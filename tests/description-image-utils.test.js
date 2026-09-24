const { filterPendingForHtml, normalizeDataImageSrc } = require("../renderer/description-image-utils");

describe("description-image-utils", () => {
  it("keeps only pending uploads still referenced in HTML", () => {
    const files = [
      { filename: "a.png", dataBase64: "AAA" },
      { filename: "b.png", dataBase64: "BBB" },
      { filename: "c.png", dataBase64: "CCC" },
    ];
    const html = '<p><img src="data:image/png;base64,AAA" alt="a.png"></p>';
    const kept = filterPendingForHtml(files, html);
    expect(kept.map((f) => f.filename)).toEqual(["a.png"]);
  });

  it("drops uploads removed from the editor", () => {
    const files = [{ filename: "gone.png", dataBase64: "ZZZ" }];
    expect(filterPendingForHtml(files, "<p>empty</p>")).toEqual([]);
  });

  it("strips TinyMCE cache-buster from data URLs", () => {
    const src = "data:image/png;base64,abc123?1710000000000";
    expect(normalizeDataImageSrc(src)).toBe("data:image/png;base64,abc123");
    expect(normalizeDataImageSrc("data:image/png;base64,abc")).toBe("data:image/png;base64,abc");
    expect(normalizeDataImageSrc("/attachments/download/1/x.png")).toBe("/attachments/download/1/x.png");
  });
});
