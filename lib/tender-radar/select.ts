import { isLiveBidStage } from "@/lib/tender-radar/format";
import {
  ACTIONABLE_ROUTES,
  ACTIVE_PIPELINE_STATUSES,
  PIPELINE_SUMMARY_STATUSES,
  RETAINED_PIPELINE_STATUSES,
  ROUTE_SORT_ORDER,
  getEffectiveTrackingStatus,
  type ActionableRoute,
  type QueueFilter,
  type RevenueOpportunity,
  type RouteFilter,
  type StageFilter,
  type TrackingStatus,
  type TrackingStatusFilter
} from "@/lib/tender-radar/types";

export const MAX_CURRENT_OPPORTUNITIES = 200;
export const MAX_MERGED_OPPORTUNITIES = 400;

export function isActionableOpportunity(opportunity: RevenueOpportunity): boolean {
  return ACTIONABLE_ROUTES.includes(opportunity.recommendedRoute as ActionableRoute);
}

export function isExpiredLiveBid(opportunity: RevenueOpportunity, now: Date = new Date()): boolean {
  if (!isLiveBidStage(opportunity) || !opportunity.tenderDeadline) return false;
  const deadline = new Date(opportunity.tenderDeadline);
  if (Number.isNaN(deadline.getTime())) return false;
  return deadline.getTime() < now.getTime();
}

export function isCurrentRadarOpportunity(opportunity: RevenueOpportunity, now: Date = new Date()): boolean {
  return isActionableOpportunity(opportunity) && !isExpiredLiveBid(opportunity, now);
}

export function isTrackedPipelineOpportunity(opportunity: RevenueOpportunity): boolean {
  const status = getEffectiveTrackingStatus(opportunity);
  return (RETAINED_PIPELINE_STATUSES as readonly TrackingStatus[]).includes(status);
}

export function isOnActiveQueue(opportunity: RevenueOpportunity, now: Date = new Date()): boolean {
  const status = getEffectiveTrackingStatus(opportunity);
  if (status === "won" || status === "lost" || status === "passed") return false;
  return isCurrentRadarOpportunity(opportunity, now) || (ACTIVE_PIPELINE_STATUSES as readonly TrackingStatus[]).includes(status);
}

export function selectCurrentOpportunities(
  opportunities: RevenueOpportunity[],
  now: Date = new Date()
): RevenueOpportunity[] {
  return opportunities.filter((opportunity) => isCurrentRadarOpportunity(opportunity, now));
}

export function dedupeOpportunities(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
  const byKey = new Map<string, RevenueOpportunity>();
  for (const opportunity of opportunities) {
    byKey.set(opportunity.processKey, opportunity);
  }
  return [...byKey.values()];
}

export function mergeRadarAndTracked(
  radar: RevenueOpportunity[],
  tracked: RevenueOpportunity[]
): RevenueOpportunity[] {
  return dedupeOpportunities([...radar, ...tracked]);
}

function routeRank(route: string | null): number {
  if (route && route in ROUTE_SORT_ORDER) return ROUTE_SORT_ORDER[route as ActionableRoute];
  return 99;
}

function deadlineRank(value: string | null): number {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
}

export function sortOpportunities(opportunities: RevenueOpportunity[]): RevenueOpportunity[] {
  return [...opportunities].sort((left, right) => {
    const routeDelta = routeRank(left.recommendedRoute) - routeRank(right.recommendedRoute);
    if (routeDelta !== 0) return routeDelta;
    const deadlineDelta = deadlineRank(left.tenderDeadline) - deadlineRank(right.tenderDeadline);
    if (deadlineDelta !== 0) return deadlineDelta;
    return (right.relevanceScore ?? -1) - (left.relevanceScore ?? -1);
  });
}

export function prepareOpportunityList(
  opportunities: RevenueOpportunity[],
  now: Date = new Date()
): RevenueOpportunity[] {
  return sortOpportunities(selectCurrentOpportunities(opportunities, now)).slice(0, MAX_CURRENT_OPPORTUNITIES);
}

export function prepareMergedOpportunityList(
  opportunities: RevenueOpportunity[],
  now: Date = new Date()
): RevenueOpportunity[] {
  const merged = dedupeOpportunities(opportunities).filter(
    (opportunity) => isCurrentRadarOpportunity(opportunity, now) || isTrackedPipelineOpportunity(opportunity)
  );
  return sortOpportunities(merged).slice(0, MAX_MERGED_OPPORTUNITIES);
}

export function matchesSearch(opportunity: RevenueOpportunity, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const title = opportunity.title?.toLowerCase() ?? "";
  const buyer = opportunity.buyerName?.toLowerCase() ?? "";
  return title.includes(needle) || buyer.includes(needle);
}

export function matchesRoute(opportunity: RevenueOpportunity, route: RouteFilter): boolean {
  if (route === "all") return true;
  return opportunity.recommendedRoute === route;
}

export function matchesStage(opportunity: RevenueOpportunity, stage: StageFilter): boolean {
  if (stage === "all") return true;
  if (stage === "live_bid") return isLiveBidStage(opportunity);
  return !isLiveBidStage(opportunity);
}

export function matchesTrackingStatus(
  opportunity: RevenueOpportunity,
  status: TrackingStatusFilter
): boolean {
  if (status === "all") return true;
  return getEffectiveTrackingStatus(opportunity) === status;
}

export function matchesQueue(
  opportunity: RevenueOpportunity,
  queue: QueueFilter,
  status: TrackingStatusFilter,
  now: Date = new Date()
): boolean {
  if (status !== "all") return true;
  if (queue === "all") return true;
  return isOnActiveQueue(opportunity, now);
}

export function filterOpportunities(
  opportunities: RevenueOpportunity[],
  input: {
    query: string;
    route: RouteFilter;
    stage: StageFilter;
    status?: TrackingStatusFilter;
    queue?: QueueFilter;
    now?: Date;
  }
): RevenueOpportunity[] {
  const status = input.status ?? "all";
  const queue = input.queue ?? "active";
  const now = input.now ?? new Date();
  return opportunities.filter(
    (opportunity) =>
      matchesSearch(opportunity, input.query) &&
      matchesRoute(opportunity, input.route) &&
      matchesStage(opportunity, input.stage) &&
      matchesTrackingStatus(opportunity, status) &&
      matchesQueue(opportunity, queue, status, now)
  );
}

export const OPPORTUNITY_PAGE_SIZE = 20;

export type PaginatedList<T> = {
  page: number;
  totalPages: number;
  items: T[];
  start: number;
  end: number;
};

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number = OPPORTUNITY_PAGE_SIZE
): PaginatedList<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);
  return {
    page: safePage,
    totalPages,
    items: pageItems,
    start: items.length === 0 ? 0 : startIndex + 1,
    end: startIndex + pageItems.length
  };
}

export function countByRoute(opportunities: RevenueOpportunity[]): Record<ActionableRoute, number> {
  return {
    direct_bid: opportunities.filter((item) => item.recommendedRoute === "direct_bid").length,
    engage_now: opportunities.filter((item) => item.recommendedRoute === "engage_now").length,
    partner: opportunities.filter((item) => item.recommendedRoute === "partner").length,
    watch: opportunities.filter((item) => item.recommendedRoute === "watch").length
  };
}

export function countByTrackingStatus(
  opportunities: RevenueOpportunity[]
): Record<(typeof PIPELINE_SUMMARY_STATUSES)[number], number> {
  const counts: Record<(typeof PIPELINE_SUMMARY_STATUSES)[number], number> = {
    reviewing: 0,
    pursuing: 0,
    submitted: 0,
    won: 0
  };
  for (const opportunity of opportunities) {
    const status = getEffectiveTrackingStatus(opportunity);
    if (status === "reviewing" || status === "pursuing" || status === "submitted" || status === "won") {
      counts[status] += 1;
    }
  }
  return counts;
}
