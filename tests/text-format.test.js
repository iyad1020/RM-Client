const {
  escapeHtml,
  normalizeRedmineText,
  textileToHtml,
  markupToRedmineHtml,
  sanitizeRedmineHtml,
} = require("../renderer/text-format");

describe("escapeHtml", () => {
  it("escapes &, <, >, \"", () => {
    expect(escapeHtml(`a & b <c> "d"`)).toBe("a &amp; b &lt;c&gt; &quot;d&quot;");
  });

  it("handles null/undefined as empty string", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("normalizeRedmineText", () => {
  it("strips simple HTML tags and keeps text", () => {
    expect(normalizeRedmineText("<p>hello</p>")).toBe("hello");
  });

  it("decodes entities", () => {
    expect(normalizeRedmineText("a &amp; b")).toBe("a & b");
  });
});

describe("textileToHtml", () => {
  it("renders Textile *bold* as <strong>", () => {
    expect(textileToHtml("*тест*")).toContain("<strong>тест</strong>");
  });

  it("renders Markdown **bold** as <strong> (local preview)", () => {
    expect(textileToHtml("**текст**")).toContain("<strong>текст</strong>");
  });

  it("passes through existing HTML strong tags", () => {
    expect(textileToHtml("<strong>уже html</strong>")).toContain("<strong>уже html</strong>");
  });

  it("strips script tags from HTML input", () => {
    const html = sanitizeRedmineHtml(`ok<script>alert(1)</script>`);
    expect(html).not.toContain("<script");
    expect(html).toContain("ok");
  });

  it("renders Textile pipe tables", () => {
    const html = textileToHtml("|_.Колонка|_.Содержимое|\n|A|B|");
    expect(html).toContain("<table");
    expect(html).toContain("<th>Колонка</th>");
    expect(html).toContain("<td>A</td>");
  });

  it("uses compact paragraphs instead of double line breaks", () => {
    const html = textileToHtml("Первая строка\n\nВторая строка");
    expect(html).toContain("<p>");
    expect(html).not.toMatch(/<br>\s*<br>/);
  });

  it("renders Markdown ## headings", () => {
    const html = textileToHtml("## 1. Зачем мы это делаем");
    expect(html).toContain("<h3>");
    expect(html).toContain("1. Зачем мы это делаем");
    expect(html).not.toContain("## ");
  });

  it("renders Markdown ### headings", () => {
    expect(textileToHtml("### Как это устроено")).toContain("<h4>");
  });

  it("renders Markdown dash lists", () => {
    const html = textileToHtml("- один\n- два");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>один</li>");
  });

  it("renders Markdown numbered lists", () => {
    const html = textileToHtml("1. Первый\n2. Второй");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>Первый</li>");
  });

  it("renders Markdown thematic breaks", () => {
    expect(textileToHtml("до\n\n---\n\nпосле")).toContain("<hr>");
  });

  it("renders GFM tables with separator row", () => {
    const html = textileToHtml("| Колонка | Содержимое |\n| --- | --- |\n| A | B |");
    expect(html).toContain("<table");
    expect(html).toContain("<th>Колонка</th>");
    expect(html).toContain("<td>A</td>");
  });
});

describe("markupToRedmineHtml — regression: Redmine CKEditor expects HTML", () => {
  it("converts **текст** to <strong>текст</strong> for the server", () => {
    // На инстансах с CKEditor Textile/Markdown на сервере не обрабатываются.
    // То, что в приложении выглядит жирным, должно уходить как HTML.
    expect(markupToRedmineHtml("**текст**")).toBe("<strong>текст</strong>");
  });

  it("converts Textile *текст* to <strong>текст</strong>", () => {
    expect(markupToRedmineHtml("*текст*")).toBe("<strong>текст</strong>");
  });

  it("leaves already-HTML notes unchanged", () => {
    expect(markupToRedmineHtml("<strong>текст</strong>")).toBe("<strong>текст</strong>");
  });

  it("returns empty string for blank input", () => {
    expect(markupToRedmineHtml("   ")).toBe("");
  });
});
