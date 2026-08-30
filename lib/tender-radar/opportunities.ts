import "server-only";

import { isTenderRadarConfigured } from "@/lib/config/app-env";
import {
  CORE_PIPELINE_VIEW_COLUMNS,
  PIPELINE_VIEW_COLUMNS,
  mapOpportunityRows,
  type RevenueOpportunityRow
} from "@/lib/tender-radar/map-opportunity";
import { mergeRadarAndTracked, prepareMergedOpportunityList } from "@/lib/tender-radar/select";
import { getTenderRadarClient } from "@/lib/tender-radar/server";
import { ACTIONABLE_ROUTES, RETAINED_PIPELINE_STATUSES, type RevenueOpportunity } from "@/lib/tender-radar/types";

export type RevenueRadarLoadResult =
  | { status: "ok"; opportunities: RevenueOpportunity[] }
  | { status: "not_configured" }
  | { status: "query_failed" };

const FETCH_LIMIT = 400;

async function selectPipelineRows(input: {
  column: "recommended_route" | "tracking_status";
  values: string[];
}): Promise<RevenueOpportunityRow[] | null> {
  const client = getTenderRadarClient();
  const full = await client
    .from("revenue_pipeline_v1")
    .select(PIPELINE_VIEW_COLUMNS)
    .in(input.column, input.values)
    .limit(FETCH_LIMIT);
  if (!full.error) return (full.data ?? []) as RevenueOpportunityRow[];
  const core = await client
    .from("revenue_pipeline_v1")
    .select(CORE_PIPELINE_VIEW_COLUMNS)
    .in(input.column, input.values)
    .limit(FETCH_LIMIT);
  if (core.error) return null;
  return (core.data ?? []) as RevenueOpportunityRow[];
}

export async function loadRevenueOpportunities(): Promise<RevenueRadarLoadResult> {
  if (!isTenderRadarConfigured()) return { status: "not_configured" };
  try {
    const [radarRows, trackedRows] = await Promise.all([
      selectPipelineRows({ column: "recommended_route", values: [...ACTIONABLE_ROUTES] }),
      selectPipelineRows({ column: "tracking_status", values: [...RETAINED_PIPELINE_STATUSES] })
    ]);
    if (radarRows == null || trackedRows == null) return { status: "query_failed" };
    const merged = mergeRadarAndTracked(mapOpportunityRows(radarRows), mapOpportunityRows(trackedRows));
    return { status: "ok", opportunities: prepareMergedOpportunityList(merged) };
  } catch {
    return { status: "query_failed" };
  }
}

export async function loadRevenueOpportunityByKey(processKey: string): Promise<RevenueOpportunity | null> {
  const client = getTenderRadarClient();
  const full = await client.from("revenue_pipeline_v1").select(PIPELINE_VIEW_COLUMNS).eq("process_key", processKey).maybeSingle();
  const row = full.error
    ? await client.from("revenue_pipeline_v1").select(CORE_PIPELINE_VIEW_COLUMNS).eq("process_key", processKey).maybeSingle()
    : full;
  if (row.error || !row.data) return null;
  const mapped = mapOpportunityRows([row.data as RevenueOpportunityRow]);
  return mapped[0] ?? null;
}
