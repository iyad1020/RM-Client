const {
  filterCustomFieldsForIssueForm,
  normalizeIssueFormField,
  parseRequiredCustomFieldIdsFromNewIssueHtml,
} = require("../sync/redmine-client");

describe("issue form custom fields", () => {
  it("filters catalog by project/tracker and issue type", () => {
    const catalog = [
      {
        id: 1,
        name: "ФИО заказчика",
        field_format: "string",
        is_required: true,
        customized_type: "issue",
        projects: [{ id: 10 }],
        trackers: [{ id: 2 }],
      },
      {
        id: 20,
        name: "ФИО TE",
        field_format: "string",
        is_required: true,
        customized_type: "timeentry",
        projects: [],
        trackers: [],
      },
      {
        id: 3,
        name: "Другой проект",
        field_format: "string",
        is_required: true,
        customized_type: "issue",
        projects: [{ id: 99 }],
        trackers: [],
      },
    ];
    const rows = filterCustomFieldsForIssueForm(catalog, 10, 2);
    expect(rows.map((r) => r.id)).toEqual([1]);
    expect(rows[0].is_required).toBe(true);
  });

  it("normalizeIssueFormField prefers catalog is_required", () => {
    const fromNew = { id: 1, name: "ФИО заказчика", value: null };
    const fromCatalog = {
      id: 1,
      name: "ФИО заказчика",
      field_format: "string",
      is_required: true,
      possible_values: [],
    };
    const out = normalizeIssueFormField(fromNew, fromCatalog);
    expect(out.is_required).toBe(true);
    expect(out.field_format).toBe("string");
  });

  it("normalizeIssueFormField accepts required alias", () => {
    const out = normalizeIssueFormField({ id: 7, name: "X", required: true }, null);
    expect(out.is_required).toBe(true);
  });

  it("parses required CF ids from Redmine new-issue HTML", () => {
    const html = `
      <p class="required">
        <label for="issue_custom_field_values_1">ФИО заказчика<span class="required"> *</span></label>
        <input type="text" name="issue[custom_field_values][1]" id="issue_custom_field_values_1" />
      </p>
      <p>
        <label for="issue_custom_field_values_2">Опциональное</label>
        <input type="text" name="issue[custom_field_values][2]" id="issue_custom_field_values_2" />
      </p>
      <label class="required" for="issue_custom_field_values_9">Ещё *</label>
    `;
    const ids = [...parseRequiredCustomFieldIdsFromNewIssueHtml(html)].sort((a, b) => a - b);
    expect(ids).toEqual([1, 9]);
  });

  it("infers form fields from issue sample and marks FIO required", () => {
    const {
      inferFormFieldsFromIssueCustomFields,
    } = require("../sync/redmine-client");
    const rows = inferFormFieldsFromIssueCustomFields([
      { id: 1, name: "ФИО заказчика", value: "А" },
      { id: 12, name: "Необходимые компетенции", multiple: true, value: [] },
      { id: 5, name: "Оценка трудозатрат", value: "" },
    ]);
    expect(rows.map((r) => r.id)).toEqual([1, 12, 5]);
    expect(rows.find((r) => r.id === 1)?.is_required).toBe(true);
    expect(rows.find((r) => r.id === 12)?.is_required).toBe(false);
    expect(rows.every((r) => r.field_format === "string")).toBe(true);
  });
});
