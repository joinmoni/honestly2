import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminReviewModerationItem } from "@/lib/types/admin-dashboard";

export async function updateAdminReviewStatus(
  reviews: AdminReviewModerationItem[],
  reviewId: string,
  status: "approved" | "rejected"
): Promise<AdminReviewModerationItem[]> {
  if (!isSupabaseConfigured()) {
    return reviews.map((review) => (review.id === reviewId ? { ...review, status } : review));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);

  if (error) {
    throw error;
  }

  return reviews.map((review) => (review.id === reviewId ? { ...review, status } : review));
}
