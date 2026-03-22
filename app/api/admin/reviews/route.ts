import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/config/app-env";
import { clampReviewRating, insertAdminSeededReview } from "@/lib/services/admin-seed-review";
import { getAdminSession } from "@/lib/services/session";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type CriterionScores = Record<string, number>;

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "You must be an admin to seed reviews." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase must be configured before admins can seed reviews." }, { status: 500 });
  }

  try {
    const payload = (await request.json()) as {
      vendorId?: string;
      reviewerName?: string;
      reviewerEmail?: string;
      title?: string;
      body?: string;
      overallRating?: number;
      status?: "pending" | "approved";
      criterionScores?: CriterionScores;
    };

    const vendorId = String(payload.vendorId ?? "").trim();
    const reviewerName = String(payload.reviewerName ?? "").trim();
    const reviewerEmail = String(payload.reviewerEmail ?? "").trim();
    const title = String(payload.title ?? "").trim();
    const bodyText = String(payload.body ?? "").trim();
    const overallRating = clampReviewRating(Number(payload.overallRating));
    const status = payload.status === "pending" ? "pending" : "approved";
    const criterionScores = payload.criterionScores && typeof payload.criterionScores === "object" ? payload.criterionScores : {};

    if (!vendorId || !reviewerName) {
      return NextResponse.json({ error: "Vendor and reviewer name are required." }, { status: 400 });
    }

    if (!overallRating || overallRating < 1) {
      return NextResponse.json({ error: "Overall rating must be between 1 and 5." }, { status: 400 });
    }

    const client = getSupabaseAdminClient();

    const { data: vendor, error: vendorError } = await client.from("honestly_vendors").select("id, name").eq("id", vendorId).maybeSingle();

    if (vendorError) {
      throw vendorError;
    }

    if (!vendor) {
      return NextResponse.json({ error: "That vendor could not be found." }, { status: 404 });
    }

    const { id: reviewId, createdAt } = await insertAdminSeededReview(client, {
      vendorId,
      reviewerName,
      reviewerEmail: reviewerEmail || null,
      title: title || null,
      body: bodyText || null,
      overallRating,
      status,
      criterionScores
    });

    return NextResponse.json({
      ok: true,
      review: {
        id: reviewId,
        vendorId,
        vendorName: vendor.name as string,
        reviewerName,
        reviewerEmail: reviewerEmail || "—",
        submittedAtIso: createdAt,
        reviewTitle: title || undefined,
        reviewBody: bodyText || undefined,
        overallRating,
        status,
        seededByAdmin: true
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review could not be created.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
