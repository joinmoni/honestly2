import {
  CURRENT_AI_REVIEW_VERSION,
  ROUTE_LABELS,
  type ActionableRoute,
  type RevenueOpportunity
} from "@/lib/tender-radar/types";

const MISSING = "—";
const URGENT_DEADLINE_DAYS = 14;

export function displayValue(value: string | number | null | undefined): string {
  if (value == null) return MISSING;
  const text = String(value).trim();
  return text.length ? text : MISSING;
}

export function isActionableRoute(value: string | null | undefined): value is ActionableRoute {
  return value === "direct_bid" || value === "engage_now" || value === "partner" || value === "watch";
}

export function formatRouteLabel(route: string | null | undefined): string {
  if (!isActionableRoute(route)) return displayValue(route);
  return ROUTE_LABELS[route];
}

export function formatStageLabel(stage: string | null | undefined): string {
  if (stage === "live_bid") return "Live Bid";
  if (!stage) return MISSING;
  if (stage === "early_engagement") return "Early Engagement";
  return stage
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isLiveBidStage(opportunity: Pick<RevenueOpportunity, "commercialStage">): boolean {
  return opportunity.commercialStage === "live_bid";
}

function trimCompactNumber(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

export function formatCompactAmount(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${trimCompactNumber(amount / 1_000_000)}m`;
  if (abs >= 1_000) return `${trimCompactNumber(amount / 1_000)}k`;
  return trimCompactNumber(amount);
}

export function formatMoney(amount: number | null | undefined, currency: string | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return MISSING;
  const code = (currency ?? "GBP").trim().toUpperCase();
  if (code === "GBP" || code === "£") return `£${formatCompactAmount(amount)}`;
  if (code === "EUR" || code === "€") return `€${formatCompactAmount(amount)}`;
  if (code === "USD" || code === "$") return `$${formatCompactAmount(amount)}`;
  return `${code} ${formatCompactAmount(amount)}`;
}

export function formatUkDate(value: string | null | undefined): string {
  if (!value) return MISSING;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return MISSING;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function getCalendarDaysUntil(value: string, now: Date = new Date()): number | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const end = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.round((end - start) / 86_400_000);
}

export function formatDeadlineUrgency(value: string | null | undefined, now: Date = new Date()): string | null {
  if (!value) return null;
  const days = getCalendarDaysUntil(value, now);
  if (days == null || days < 0 || days > URGENT_DEADLINE_DAYS) return null;
  if (days === 0) return "Today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function formatScore(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return MISSING;
  return String(Math.round(value));
}

export function isCurrentAiReview(version: string | null | undefined): boolean {
  return version === CURRENT_AI_REVIEW_VERSION;
}

export function formatAiReviewLabel(version: string | null | undefined): "Current" | "Needs re-review" {
  return isCurrentAiReview(version) ? "Current" : "Needs re-review";
}
