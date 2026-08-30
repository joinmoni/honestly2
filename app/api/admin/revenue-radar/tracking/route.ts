import { NextResponse } from "next/server";

import { isTenderRadarConfigured } from "@/lib/config/app-env";
import { getAdminSession } from "@/lib/services/session";
import { saveRevenueOpportunityTracking } from "@/lib/tender-radar/save-tracking";
import { validateTrackingInput } from "@/lib/tender-radar/tracking";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "You must be an admin to update opportunity tracking." }, { status: 403 });
  }
  if (!isTenderRadarConfigured()) {
    return NextResponse.json({ error: "Tender Radar is not connected." }, { status: 500 });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A tracking payload is required." }, { status: 400 });
  }
  const parsed = validateTrackingInput(payload);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  try {
    const opportunity = await saveRevenueOpportunityTracking(parsed.value);
    return NextResponse.json({ ok: true, opportunity });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Opportunity tracking could not be saved.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
