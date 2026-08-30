import "server-only";

import { loadRevenueOpportunityByKey } from "@/lib/tender-radar/opportunities";
import { getTenderRadarClient } from "@/lib/tender-radar/server";
import { buildTrackingUpsert, type ExistingTrackingTimestamps, type TrackingInput } from "@/lib/tender-radar/tracking";
import type { RevenueOpportunity } from "@/lib/tender-radar/types";

type TrackingTimestampRow = {
  submitted_at?: unknown;
  outcome_at?: unknown;
};

function toTimestamp(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

export async function readExistingTrackingTimestamps(
  processKey: string
): Promise<ExistingTrackingTimestamps | null> {
  const client = getTenderRadarClient();
  const { data, error } = await client
    .from("revenue_opportunity_tracking")
    .select("submitted_at, outcome_at")
    .eq("process_key", processKey)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) return null;
  const row = data as TrackingTimestampRow;
  return {
    submittedAt: toTimestamp(row.submitted_at),
    outcomeAt: toTimestamp(row.outcome_at)
  };
}

export async function saveRevenueOpportunityTracking(input: TrackingInput): Promise<RevenueOpportunity> {
  const existing = await readExistingTrackingTimestamps(input.processKey);
  const row = buildTrackingUpsert(input, existing, new Date());
  const client = getTenderRadarClient();
  const { error } = await client.from("revenue_opportunity_tracking").upsert(row, { onConflict: "process_key" });
  if (error) {
    throw error;
  }
  const opportunity = await loadRevenueOpportunityByKey(input.processKey);
  if (!opportunity) {
    throw new Error("The opportunity could not be reloaded after saving.");
  }
  return opportunity;
}
