export const OPPORTUNITY_TABLE_COLUMNS = [
  { id: "title", label: "Title", width: 280, minWidth: 140 },
  { id: "buyer", label: "Buyer", width: 180, minWidth: 110 },
  { id: "route", label: "Route", width: 104, minWidth: 80 },
  { id: "status", label: "Status", width: 104, minWidth: 80 },
  { id: "value", label: "Value", width: 88, minWidth: 64 },
  { id: "deadline", label: "Deadline", width: 116, minWidth: 88 },
  { id: "fit", label: "Fit", width: 56, minWidth: 44 },
  { id: "stage", label: "Stage", width: 104, minWidth: 72 }
] as const;

export type OpportunityTableColumnId = (typeof OPPORTUNITY_TABLE_COLUMNS)[number]["id"];

export type OpportunityTableWidths = Record<OpportunityTableColumnId, number>;

const COLUMN_GAP_PX = 12;
const MAX_COLUMN_WIDTH = 720;

export function getDefaultOpportunityTableWidths(): OpportunityTableWidths {
  return Object.fromEntries(OPPORTUNITY_TABLE_COLUMNS.map((column) => [column.id, column.width])) as OpportunityTableWidths;
}

export function clampOpportunityColumnWidth(width: number, minWidth: number): number {
  return Math.min(MAX_COLUMN_WIDTH, Math.max(minWidth, Math.round(width)));
}

export function resizeOpportunityTableColumn(
  widths: OpportunityTableWidths,
  columnId: OpportunityTableColumnId,
  nextWidth: number
): OpportunityTableWidths {
  const column = OPPORTUNITY_TABLE_COLUMNS.find((item) => item.id === columnId);
  if (!column) return widths;
  const width = clampOpportunityColumnWidth(nextWidth, column.minWidth);
  if (widths[columnId] === width) return widths;
  return { ...widths, [columnId]: width };
}

export function buildOpportunityTableTemplate(widths: OpportunityTableWidths): string {
  return OPPORTUNITY_TABLE_COLUMNS.map((column) => `${widths[column.id]}px`).join(" ");
}

export function getOpportunityTableMinWidth(widths: OpportunityTableWidths): number {
  const columns = OPPORTUNITY_TABLE_COLUMNS.reduce((total, column) => total + widths[column.id], 0);
  return columns + COLUMN_GAP_PX * (OPPORTUNITY_TABLE_COLUMNS.length - 1);
}

export function getOpportunityTableGridStyle(widths: OpportunityTableWidths): {
  gridTemplateColumns: string;
  minWidth: number;
} {
  return {
    gridTemplateColumns: buildOpportunityTableTemplate(widths),
    minWidth: getOpportunityTableMinWidth(widths)
  };
}
