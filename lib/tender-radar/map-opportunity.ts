import type { RevenueOpportunity } from "@/lib/tender-radar/types";

export type RevenueOpportunityRow = {
  process_key?: unknown;
  title?: unknown;
  buyer_name?: unknown;
  commercial_stage?: unknown;
  recommended_route?: unknown;
  relevance_score?: unknown;
  direct_fit_score?: unknown;
  partner_fit_score?: unknown;
  commercial_attractiveness?: unknown;
  ai_confidence?: unknown;
  confidence?: unknown;
  buyer_need?: unknown;
  supplier_deliverable?: unknown;
  ai_reason?: unknown;
  reason?: unknown;
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
};

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

export function mapOpportunityRow(row: RevenueOpportunityRow): RevenueOpportunity | null {
  const processKey = toText(row.process_key);
  if (!processKey) return null;
  return {
    processKey,
    title: toText(row.title),
    buyerName: toText(row.buyer_name),
    commercialStage: toText(row.commercial_stage),
    recommendedRoute: toText(row.recommended_route),
    relevanceScore: toNumber(row.relevance_score),
    directFitScore: toNumber(row.direct_fit_score),
    partnerFitScore: toNumber(row.partner_fit_score),
    commercialAttractiveness: toNumber(row.commercial_attractiveness),
    confidence: toNumber(row.ai_confidence ?? row.confidence),
    buyerNeed: toText(row.buyer_need),
    supplierDeliverable: toText(row.supplier_deliverable),
    reason: toText(row.ai_reason ?? row.reason),
    nextAction: toText(row.next_action),
    needPartner: toBoolean(row.need_partner),
    recommendedPartnerSkill: toText(row.recommended_partner_skill),
    valueAmount: toNumber(row.value_amount),
    currency: toText(row.currency),
    tenderDeadline: toText(row.tender_deadline),
    aiReviewVersion: toText(row.ai_review_version),
    aiReviewedAt: toText(row.ai_reviewed_at),
    analysedAt: toText(row.analysed_at),
    updatedAt: toText(row.updated_at)
  };
}
