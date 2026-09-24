const { buildIssueDayMatrix, formatMatrixHours, issueMatrixLabel } = require("../renderer/report-matrix");

describe("report-matrix", () => {
  it("pivots hours by issue and day with totals", () => {
    const days = ["2026-08-24", "2026-08-25", "2026-08-26"];
    const matrix = buildIssueDayMatrix(
      [
        { issue_id: 1, issue_subject: "Сопровождение", spent_on: "2026-08-24", hours: 2 },
        { issue_id: 1, issue_subject: "Сопровождение", spent_on: "2026-08-24", hours: 0.5 },
        { issue_id: 2, issue_subject: "Встреча", spent_on: "2026-08-25", hours: 3 },
      ],
      days,
    );
    expect(matrix.rows).toHaveLength(2);
    expect(matrix.rows[0].issueId).toBe(2);
    expect(matrix.rows[0].hoursByDay["2026-08-25"]).toBe(3);
    expect(matrix.rows[0].total).toBe(3);
    expect(matrix.rows[1].issueId).toBe(1);
    expect(matrix.rows[1].hoursByDay["2026-08-24"]).toBe(2.5);
    expect(matrix.rows[1].total).toBe(2.5);
    expect(matrix.colTotals["2026-08-25"]).toBe(3);
    expect(matrix.grandTotal).toBe(5.5);
    expect(formatMatrixHours(2.5)).toBe("2.50");
    expect(formatMatrixHours(0)).toBe("");
    expect(issueMatrixLabel({ issue_id: 1, issue_subject: "Сопровождение" })).toBe(
      "Задача #1: Сопровождение",
    );
  });
});
