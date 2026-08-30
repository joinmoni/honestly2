import { RevenueRadarScreen } from "@/components/revenue-radar/RevenueRadarScreen";
import { loadRevenueOpportunities } from "@/lib/tender-radar/opportunities";

export async function RevenueRadarPage() {
  const result = await loadRevenueOpportunities();
  if (result.status !== "ok") {
    return <RevenueRadarScreen status={result.status} opportunities={[]} />;
  }
  return <RevenueRadarScreen status="ok" opportunities={result.opportunities} />;
}
