export const ACTIONABLE_ROUTES = ["direct_bid", "engage_now", "partner", "watch"] as const;

export type ActionableRoute = (typeof ACTIONABLE_ROUTES)[number];

export type RouteFilter = "all" | ActionableRoute;

export type StageFilter = "all" | "live_bid" | "early_engagement";

export const TRACKING_STATUSES = ["new", "reviewing", "pursuing", "submitted", "won", "lost", "passed"] as const;

export type TrackingStatus = (typeof TRACKING_STATUSES)[number];

export type TrackingStatusFilter = "all" | TrackingStatus;

export const BID_ROUTES = ["direct", "partner", "subcontractor"] as const;

export type BidRoute = (typeof BID_ROUTES)[number];

export type QueueFilter = "active" | "all";

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
  trackingStatus: TrackingStatus | null;
  submittedAt: string | null;
  bidValue: number | null;
  bidCurrency: string | null;
  bidRoute: BidRoute | null;
  partnerName: string | null;
  notes: string | null;
  outcomeAt: string | null;
  outcomeValue: number | null;
  trackingUpdatedAt: string | null;
};

export const EMPTY_TRACKING: Pick<
  RevenueOpportunity,
  | "trackingStatus"
  | "submittedAt"
  | "bidValue"
  | "bidCurrency"
  | "bidRoute"
  | "partnerName"
  | "notes"
  | "outcomeAt"
  | "outcomeValue"
  | "trackingUpdatedAt"
> = {
  trackingStatus: null,
  submittedAt: null,
  bidValue: null,
  bidCurrency: null,
  bidRoute: null,
  partnerName: null,
  notes: null,
  outcomeAt: null,
  outcomeValue: null,
  trackingUpdatedAt: null
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

export const TRACKING_STATUS_LABELS: Record<TrackingStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  pursuing: "Pursuing",
  submitted: "Submitted",
  won: "Won",
  lost: "Lost",
  passed: "Passed"
};

export const BID_ROUTE_LABELS: Record<BidRoute, string> = {
  direct: "Direct",
  partner: "Partner",
  subcontractor: "Subcontractor"
};

export const ACTIVE_PIPELINE_STATUSES = ["reviewing", "pursuing", "submitted"] as const;

export const RETAINED_PIPELINE_STATUSES = [
  "reviewing",
  "pursuing",
  "submitted",
  "won",
  "lost",
  "passed"
] as const;

export const PIPELINE_SUMMARY_STATUSES = ["reviewing", "pursuing", "submitted", "won"] as const;

export function isTrackingStatus(value: string | null | undefined): value is TrackingStatus {
  return TRACKING_STATUSES.includes(value as TrackingStatus);
}

export function isBidRoute(value: string | null | undefined): value is BidRoute {
  return BID_ROUTES.includes(value as BidRoute);
}

export function getEffectiveTrackingStatus(
  opportunity: Pick<RevenueOpportunity, "trackingStatus">
): TrackingStatus {
  return opportunity.trackingStatus ?? "new";
}
