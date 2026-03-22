import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminReviewModerationItem } from "@/lib/types/admin-dashboard";

export type SeedAdminReviewInput = {
  vendorId: string;
  reviewerName: string;
  reviewerEmail?: string;
  title?: string;
  body?: string;
  overallRating: number;
  status: "pending" | "approved";
  criterionScores?: Record<string, number>;
};

function formatSubmittedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  });
}

export async function createAdminSeededReview(input: SeedAdminReviewInput): Promise<AdminReviewModerationItem> {
  if (!isSupabaseConfigured()) {
    const id = `rev-local-${Date.now()}`;
    const submittedAtIso = new Date().toISOString();
    return {
      id,
      vendorId: input.vendorId,
      vendorName: "Vendor",
      reviewerName: input.reviewerName.trim(),
      reviewerEmail: input.reviewerEmail?.trim() || "—",
      submittedDate: formatSubmittedDate(submittedAtIso),
      submittedAtIso,
      reviewTitle: input.title?.trim() || undefined,
      reviewBody: input.body?.trim() || undefined,
      overallRating: input.overallRating,
      status: input.status,
      seededByAdmin: true
    };
  }

  const response = await fetch("/api/admin/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vendorId: input.vendorId,
      reviewerName: input.reviewerName.trim(),
      reviewerEmail: input.reviewerEmail?.trim() || undefined,
      title: input.title?.trim() || undefined,
      body: input.body?.trim() || undefined,
      overallRating: input.overallRating,
      status: input.status,
      criterionScores: input.criterionScores
    })
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: string;
        review?: Omit<AdminReviewModerationItem, "submittedDate"> & { submittedAtIso: string };
      }
    | null;

  if (!response.ok || !payload?.review) {
    throw new Error(payload?.error ?? "This review could not be created right now.");
  }

  const { submittedAtIso, ...rest } = payload.review;

  return {
    ...rest,
    submittedAtIso,
    submittedDate: formatSubmittedDate(submittedAtIso)
  };
}

export async function updateAdminReviewStatus(
  reviews: AdminReviewModerationItem[],
  reviewId: string,
  status: "approved" | "rejected"
): Promise<AdminReviewModerationItem[]> {
  if (!isSupabaseConfigured()) {
    return reviews.map((review) => (review.id === reviewId ? { ...review, status } : review));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("honestly_reviews").update({ status }).eq("id", reviewId);

  if (error) {
    throw error;
  }

  return reviews.map((review) => (review.id === reviewId ? { ...review, status } : review));
}
