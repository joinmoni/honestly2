import type { SupabaseClient } from "@supabase/supabase-js";

import { refreshVendorReviewAggregates } from "@/lib/services/vendor-review-aggregates";

export type AdminSeededReviewInsertInput = {
  vendorId: string;
  reviewerName: string;
  reviewerEmail?: string | null;
  title?: string | null;
  body?: string | null;
  overallRating: number;
  status: "pending" | "approved";
  criterionScores?: Record<string, number>;
};

export function clampReviewRating(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(5, Math.max(1, Math.round(value * 2) / 2));
}

type InsertOptions = {
  refreshVendorAggregates?: boolean;
};

export async function insertAdminSeededReview(
  client: SupabaseClient,
  input: AdminSeededReviewInsertInput,
  options: InsertOptions = {}
): Promise<{ id: string; createdAt: string }> {
  const { refreshVendorAggregates = true } = options;
  const overallRating = clampReviewRating(input.overallRating);
  const reviewerName = input.reviewerName.trim();
  const reviewerEmail = input.reviewerEmail?.trim() || null;
  const title = input.title?.trim() || null;
  const bodyText = input.body?.trim() || null;
  const criterionScores = input.criterionScores ?? {};

  const { data: reviewRow, error: reviewError } = await client
    .from("honestly_reviews")
    .insert({
      vendor_id: input.vendorId,
      user_id: null,
      overall_rating: overallRating,
      title,
      body: bodyText,
      status: input.status,
      reviewer_name: reviewerName,
      reviewer_email: reviewerEmail,
      seeded_by_admin: true,
      source: "admin"
    })
    .select("id, created_at")
    .single();

  if (reviewError) {
    throw reviewError;
  }

  const reviewId = reviewRow.id as string;
  const createdAt = reviewRow.created_at as string;

  const scoreEntries = Object.entries(criterionScores).filter(([, score]) => typeof score === "number" && !Number.isNaN(score));

  if (scoreEntries.length) {
    const criterionIds = scoreEntries.map(([id]) => id);
    const { data: criteriaRows, error: criteriaError } = await client.from("honestly_rating_criteria").select("id").in("id", criterionIds);

    if (criteriaError) {
      throw criteriaError;
    }

    const validIds = new Set((criteriaRows ?? []).map((row) => row.id as string));
    const ratingRows = scoreEntries
      .filter(([criterionId]) => validIds.has(criterionId))
      .map(([criterionId, score]) => ({
        review_id: reviewId,
        criterion_id: criterionId,
        score: clampReviewRating(score)
      }));

    if (ratingRows.length) {
      const { error: ratingsError } = await client.from("honestly_review_ratings").insert(ratingRows);
      if (ratingsError) {
        throw ratingsError;
      }
    }
  }

  if (refreshVendorAggregates && input.status === "approved") {
    await refreshVendorReviewAggregates(client, input.vendorId);
  }

  return { id: reviewId, createdAt };
}
