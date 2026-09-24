const { resolveDescriptionAttachmentUrls, descriptionHasUploadPlaceholders } = require("../sync/description-html");

describe("description-html", () => {
  it("resolves upload placeholders by filename", () => {
    const html = '<p><img src="/attachments/download/0/shot.png" alt="shot.png"></p>';
    const out = resolveDescriptionAttachmentUrls(html, [
      { filename: "shot.png", content_url: "https://rm.example/attachments/download/9/shot.png" },
    ]);
    expect(out).toContain("https://rm.example/attachments/download/9/shot.png");
    expect(descriptionHasUploadPlaceholders(html)).toBe(true);
    expect(descriptionHasUploadPlaceholders(out)).toBe(false);
  });
});

const { notesHaveImageTokens, resolveNotesImageMarkup } = require("../sync/description-html");

describe("notes image markup", () => {
  it("turns textile !file.png! into markdown download urls", () => {
    const notes = "Сделали так !shot.png! и ещё !other.jpg!";
    const out = resolveNotesImageMarkup(notes, [
      { id: 9, filename: "shot.png", content_url: "https://rm.example/attachments/download/9/shot.png" },
      { id: 10, filename: "other.jpg", content_url: "https://rm.example/attachments/download/10/other.jpg" },
    ]);
    expect(out).toContain("![](/attachments/download/9/shot.png)");
    expect(out).toContain("![](/attachments/download/10/other.jpg)");
    expect(out).not.toContain("!shot.png!");
    expect(notesHaveImageTokens(notes)).toBe(true);
  });
});
