import {
  buildOpportunityTableTemplate,
  clampOpportunityColumnWidth,
  getDefaultOpportunityTableWidths,
  resizeOpportunityTableColumn
} from "@/components/revenue-radar/opportunity-table-layout";

describe("opportunity table layout", () => {
  it("clamps a dragged column between its minimum and a readable maximum", () => {
    expect(clampOpportunityColumnWidth(40, 140)).toBe(140);
    expect(clampOpportunityColumnWidth(900, 140)).toBe(720);
    expect(clampOpportunityColumnWidth(320.8, 140)).toBe(321);
  });

  it("widens only the dragged column", () => {
    const input = getDefaultOpportunityTableWidths();
    const actual = resizeOpportunityTableColumn(input, "title", 420);

    expect(actual.title).toBe(420);
    expect(actual.buyer).toBe(input.buyer);
    expect(buildOpportunityTableTemplate(actual).startsWith("420px ")).toBe(true);
  });
});
