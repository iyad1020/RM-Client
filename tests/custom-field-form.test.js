const {
  mergeCustomFieldRows,
  isSimpleEditableField,
  isCreateEditableField,
  requiredCreateFieldRows,
  allCreateFieldRows,
} = require("../renderer/custom-field-form");

describe("custom-field-form", () => {
  it("mergeCustomFieldRows includes empty defs", () => {
    const rows = mergeCustomFieldRows(
      [{ id: 1, name: "A", field_format: "string" }],
      [{ id: 1, value: "x" }, { id: 2, name: "Orphan name", value: "orphan" }],
    );
    expect(rows.find((r) => r.id === 1)?.value).toBe("x");
    expect(rows.find((r) => r.id === 2)?.name).toBe("Orphan name");
    expect(rows.find((r) => r.id === 2)?.value).toBe("orphan");
  });

  it("isSimpleEditableField allows string and float", () => {
    expect(isSimpleEditableField({ field_format: "string" })).toBe(true);
    expect(isSimpleEditableField({ field_format: "list" })).toBe(false);
  });

  it("requiredCreateFieldRows keeps only required defs", () => {
    const rows = requiredCreateFieldRows([
      { id: 10, name: "ФИО заказчика", field_format: "string", is_required: true },
      { id: 11, name: "База", field_format: "string", is_required: false },
      { id: 12, name: "Компетенции", field_format: "list", is_required: true, multiple: true, possible_values: ["A", "B"] },
    ]);
    expect(rows.map((r) => r.id)).toEqual([12, 10]);
    expect(rows.find((r) => r.id === 12)?.multiple).toBe(true);
    expect(isCreateEditableField({ field_format: "list" })).toBe(true);
  });

  it("allCreateFieldRows includes optional fields after required", () => {
    const rows = allCreateFieldRows([
      { id: 11, name: "База", field_format: "string", is_required: false },
      { id: 10, name: "ФИО", field_format: "string", is_required: true },
    ]);
    expect(rows.map((r) => r.id)).toEqual([10, 11]);
  });
});
