import { mapTenderAccessFields, type TenderAccessRow } from "@/lib/tender-radar/tender-access";
import {
  EMPTY_TENDER_ACCESS,
  isBidRoute,
  isTrackingStatus,
  type BidRoute,
  type RevenueOpportunity,
  type TrackingStatus
} from "@/lib/tender-radar/types";

export type RevenueOpportunityRow = {
  process_key?: unknown;
  title?: unknown;
  buyer_name?: unknown;
  commercial_stage?: unknown;
  recommended_route?: unknown;
  commercial_route?: unknown;
  relevance_score?: unknown;
  ai_score?: unknown;
  direct_fit_score?: unknown;
  partner_fit_score?: unknown;
  commercial_attractiveness?: unknown;
  ai_confidence?: unknown;
  confidence?: unknown;
  buyer_need?: unknown;
  actual_service_required?: unknown;
  summary?: unknown;
  supplier_deliverable?: unknown;
  ai_reason?: unknown;
  reason?: unknown;
  why_we_can_deliver?: unknown;
  recommendation?: unknown;
  next_action?: unknown;
  need_partner?: unknown;
  recommended_partner_skill?: unknown;
  value_amount?: unknown;
  currency?: unknown;
  tender_deadline?: unknown;
  ai_review_version?: unknown;
  ai_reviewed_at?: unknown;
  analysed_at?: unknown;
  updated_at?: unknown;
  tracking_status?: unknown;
  submitted_at?: unknown;
  bid_value?: unknown;
  bid_currency?: unknown;
  bid_route?: unknown;
  partner_name?: unknown;
  notes?: unknown;
  outcome_at?: unknown;
  outcome_value?: unknown;
  tracking_updated_at?: unknown;
};

export const CORE_PIPELINE_VIEW_COLUMNS = [
  "process_key",
  "title",
  "buyer_name",
  "commercial_stage",
  "recommended_route",
  "relevance_score",
  "direct_fit_score",
  "partner_fit_score",
  "commercial_attractiveness",
  "ai_confidence",
  "buyer_need",
  "supplier_deliverable",
  "ai_reason",
  "next_action",
  "need_partner",
  "recommended_partner_skill",
  "value_amount",
  "currency",
  "tender_deadline",
  "ai_review_version",
  "ai_reviewed_at",
  "analysed_at",
  "updated_at",
  "tracking_status",
  "submitted_at",
  "bid_value",
  "bid_currency",
  "bid_route",
  "partner_name",
  "notes",
  "outcome_at",
  "outcome_value",
  "tracking_updated_at"
].join(", ");

export const PIPELINE_VIEW_COLUMNS = [
  "process_key",
  "title",
  "buyer_name",
  "commercial_stage",
  "recommended_route",
  "commercial_route",
  "relevance_score",
  "ai_score",
  "direct_fit_score",
  "partner_fit_score",
  "commercial_attractiveness",
  "ai_confidence",
  "buyer_need",
  "actual_service_required",
  "summary",
  "supplier_deliverable",
  "ai_reason",
  "why_we_can_deliver",
  "recommendation",
  "next_action",
  "need_partner",
  "recommended_partner_skill",
  "value_amount",
  "currency",
  "tender_deadline",
  "ai_review_version",
  "ai_reviewed_at",
  "analysed_at",
  "updated_at",
  "tracking_status",
  "submitted_at",
  "bid_value",
  "bid_currency",
  "bid_route",
  "partner_name",
  "notes",
  "outcome_at",
  "outcome_value",
  "tracking_updated_at"
].join(", ");

function toText(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBoolean(value: unknown): boolean | null {
  if (value == null || value === "") return null;
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;
  return null;
}

function toTrackingStatus(value: unknown): TrackingStatus | null {
  const text = toText(value);
  return isTrackingStatus(text) ? text : null;
}

function toBidRoute(value: unknown): BidRoute | null {
  const text = toText(value);
  return isBidRoute(text) ? text : null;
}

export function mapOpportunityRow(
  row: RevenueOpportunityRow,
  access?: TenderAccessRow | null
): RevenueOpportunity | null {
  const processKey = toText(row.process_key);
  if (!processKey) return null;
  return {
    processKey,
    title: toText(row.title),
    buyerName: toText(row.buyer_name),
    commercialStage: toText(row.commercial_stage),
    recommendedRoute: toText(row.recommended_route) ?? toText(row.commercial_route),
    relevanceScore: toNumber(row.relevance_score) ?? toNumber(row.ai_score),
    directFitScore: toNumber(row.direct_fit_score),
    partnerFitScore: toNumber(row.partner_fit_score),
    commercialAttractiveness: toNumber(row.commercial_attractiveness),
    confidence: toNumber(row.ai_confidence ?? row.confidence),
    buyerNeed: toText(row.buyer_need) ?? toText(row.actual_service_required) ?? toText(row.summary),
    supplierDeliverable: toText(row.supplier_deliverable),
    reason: toText(row.ai_reason ?? row.reason) ?? toText(row.why_we_can_deliver) ?? toText(row.recommendation),
    nextAction: toText(row.next_action),
    needPartner: toBoolean(row.need_partner),
    recommendedPartnerSkill: toText(row.recommended_partner_skill),
    valueAmount: toNumber(row.value_amount),
    currency: toText(row.currency),
    tenderDeadline: toText(row.tender_deadline),
    aiReviewVersion: toText(row.ai_review_version),
    aiReviewedAt: toText(row.ai_reviewed_at),
    analysedAt: toText(row.analysed_at),
    updatedAt: toText(row.updated_at),
    trackingStatus: toTrackingStatus(row.tracking_status),
    submittedAt: toText(row.submitted_at),
    bidValue: toNumber(row.bid_value),
    bidCurrency: toText(row.bid_currency),
    bidRoute: toBidRoute(row.bid_route),
    partnerName: toText(row.partner_name),
    notes: toText(row.notes),
    outcomeAt: toText(row.outcome_at),
    outcomeValue: toNumber(row.outcome_value),
    trackingUpdatedAt: toText(row.tracking_updated_at),
    ...(access ? mapTenderAccessFields(access) : { ...EMPTY_TENDER_ACCESS, tenderDocuments: [] })
  };
}

export function mapOpportunityRows(
  rows: RevenueOpportunityRow[],
  accessByKey: ReadonlyMap<string, TenderAccessRow> = new Map()
): RevenueOpportunity[] {
  return rows
    .map((row) => mapOpportunityRow(row, accessByKey.get(toText(row.process_key) ?? "") ?? null))
    .filter((row): row is RevenueOpportunity => row !== null);
}
