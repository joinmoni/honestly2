import type { TrackingInput } from "@/lib/tender-radar/tracking";
import type { RevenueOpportunity } from "@/lib/tender-radar/types";

export async function saveRevenueRadarTracking(input: TrackingInput): Promise<RevenueOpportunity> {
  const response = await fetch("/api/admin/revenue-radar/tracking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      processKey: input.processKey,
      status: input.status,
      bidValue: input.bidValue,
      bidCurrency: input.bidCurrency,
      bidRoute: input.bidRoute,
      partnerName: input.partnerName,
      notes: input.notes,
      outcomeValue: input.outcomeValue
    })
  });
  const payload = (await response.json().catch(() => null)) as
    | { error?: string; opportunity?: RevenueOpportunity }
    | null;
  if (!response.ok || !payload?.opportunity) {
    throw new Error(payload?.error ?? "This opportunity could not be saved right now.");
  }
  return payload.opportunity;
}
