export const ACTIONABLE_ROUTES = ["direct_bid", "engage_now", "partner", "watch"] as const;

export type ActionableRoute = (typeof ACTIONABLE_ROUTES)[number];

export type RouteFilter = "all" | ActionableRoute;

export type StageFilter = "all" | "live_bid" | "early_engagement";

export type RevenueOpportunity = {
  processKey: string;
  title: string | null;
  buyerName: string | null;
  commercialStage: string | null;
  recommendedRoute: string | null;
  relevanceScore: number | null;
  directFitScore: number | null;
  partnerFitScore: number | null;
  commercialAttractiveness: number | null;
  confidence: number | null;
  buyerNeed: string | null;
  supplierDeliverable: string | null;
  reason: string | null;
  nextAction: string | null;
  needPartner: boolean | null;
  recommendedPartnerSkill: string | null;
  valueAmount: number | null;
  currency: string | null;
  tenderDeadline: string | null;
  aiReviewVersion: string | null;
  aiReviewedAt: string | null;
  analysedAt: string | null;
  updatedAt: string | null;
};

export const CURRENT_AI_REVIEW_VERSION = "revenue-radar-v2.5-production";

export const ROUTE_LABELS: Record<ActionableRoute, string> = {
  direct_bid: "Bid Now",
  engage_now: "Engage Early",
  partner: "Partner",
  watch: "Watch"
};

export const ROUTE_SORT_ORDER: Record<ActionableRoute, number> = {
  direct_bid: 0,
  engage_now: 1,
  partner: 2,
  watch: 3
};
