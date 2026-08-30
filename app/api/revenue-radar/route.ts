import { NextResponse } from "next/server";

import { loadRevenueOpportunities } from "@/lib/tender-radar/opportunities";

export async function GET() {
  const result = await loadRevenueOpportunities();
  if (result.status === "ok") {
    return NextResponse.json({
      status: "ok",
      opportunities: result.opportunities
    });
  }
  const message =
    result.status === "not_configured"
      ? "Tender Radar is not connected."
      : "Opportunities could not be loaded.";
  return NextResponse.json(
    {
      status: result.status,
      opportunities: [],
      error: message
    },
    { status: result.status === "not_configured" ? 503 : 502 }
  );
}
