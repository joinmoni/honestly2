import "server-only";

import { isTenderRadarConfigured } from "@/lib/config/app-env";
import { mapOpportunityRow, type RevenueOpportunityRow } from "@/lib/tender-radar/map-opportunity";
import { prepareOpportunityList } from "@/lib/tender-radar/select";
import { getTenderRadarClient } from "@/lib/tender-radar/server";
import { ACTIONABLE_ROUTES, type RevenueOpportunity } from "@/lib/tender-radar/types";

export type RevenueRadarLoadResult =
  | { status: "ok"; opportunities: RevenueOpportunity[] }
  | { status: "not_configured" }
  | { status: "query_failed" };

const OPPORTUNITY_COLUMNS = [
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
  "updated_at"
].join(", ");

const FETCH_LIMIT = 400;

export async function loadRevenueOpportunities(): Promise<RevenueRadarLoadResult> {
  if (!isTenderRadarConfigured()) return { status: "not_configured" };
  try {
    const client = getTenderRadarClient();
    const { data, error } = await client
      .from("revenue_opportunities")
      .select(OPPORTUNITY_COLUMNS)
      .in("recommended_route", [...ACTIONABLE_ROUTES])
      .limit(FETCH_LIMIT);
    if (error) return { status: "query_failed" };
    const mapped = (data ?? [])
      .map((row) => mapOpportunityRow(row as RevenueOpportunityRow))
      .filter((row): row is RevenueOpportunity => row !== null);
    return { status: "ok", opportunities: prepareOpportunityList(mapped) };
  } catch {
    return { status: "query_failed" };
  }
}
