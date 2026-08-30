import { RevenueRadarScreen } from "@/components/revenue-radar/RevenueRadarScreen";
import { getAdminSession } from "@/lib/services/session";
import { loadRevenueOpportunities } from "@/lib/tender-radar/opportunities";

export async function RevenueRadarPage() {
  const [result, session] = await Promise.all([loadRevenueOpportunities(), getAdminSession()]);
  const canEdit = session.user?.role === "admin";
  if (result.status !== "ok") {
    return <RevenueRadarScreen status={result.status} opportunities={[]} canEdit={canEdit} />;
  }
  return <RevenueRadarScreen status="ok" opportunities={result.opportunities} canEdit={canEdit} />;
}
