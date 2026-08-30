import { isLiveBidStage } from "@/lib/tender-radar/format";
import {
  ACTIONABLE_ROUTES,
  ROUTE_SORT_ORDER,
  type ActionableRoute,
  type RevenueOpportunity,
  type RouteFilter,
  type StageFilter
} from "@/lib/tender-radar/types";

export const MAX_CURRENT_OPPORTUNITIES = 200;

export function isActionableOpportunity(opportunity: RevenueOpportunity): boolean {
  return ACTIONABLE_ROUTES.includes(opportunity.recommendedRoute as ActionableRoute);
}

export function isExpiredLiveBid(opportunity: RevenueOpportunity, now: Date = new Date()): boolean {
  if (!isLiveBidStage(opportunity) || !opportunity.tenderDeadline) return false;
  const deadline = new Date(opportunity.tenderDeadline);
  if (Number.isNaN(deadline.getTime())) return false;
  return deadline.getTime() < now.getTime();
}

export function selectCurrentOpportunities(
  opportunities: RevenueOpportunity[],
  now: Date = new Date()
): RevenueOpportunity[] {
  return opportunities.filter((opportunity) => isActionableOpportunity(opportunity) && !isExpiredLiveBid(opportunity, now));
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

export function filterOpportunities(
  opportunities: RevenueOpportunity[],
  input: { query: string; route: RouteFilter; stage: StageFilter }
): RevenueOpportunity[] {
  return opportunities.filter(
    (opportunity) =>
      matchesSearch(opportunity, input.query) &&
      matchesRoute(opportunity, input.route) &&
      matchesStage(opportunity, input.stage)
  );
}

export function countByRoute(opportunities: RevenueOpportunity[]): Record<ActionableRoute, number> {
  return {
    direct_bid: opportunities.filter((item) => item.recommendedRoute === "direct_bid").length,
    engage_now: opportunities.filter((item) => item.recommendedRoute === "engage_now").length,
    partner: opportunities.filter((item) => item.recommendedRoute === "partner").length,
    watch: opportunities.filter((item) => item.recommendedRoute === "watch").length
  };
}
