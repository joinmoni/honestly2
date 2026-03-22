import type { SupabaseClient } from "@supabase/supabase-js";

export async function refreshVendorReviewAggregates(client: SupabaseClient, vendorId: string): Promise<void> {
  const { data: rows, error } = await client
    .from("honestly_reviews")
    .select("overall_rating")
    .eq("vendor_id", vendorId)
    .eq("status", "approved");

  if (error) {
    throw error;
  }

  const list = rows ?? [];
  const count = list.length;
  const avg = count === 0 ? 0 : list.reduce((sum, row) => sum + Number(row.overall_rating), 0) / count;
  const ratingAvg = Math.round(avg * 100) / 100;

  const { error: updateError } = await client.from("honestly_vendors").update({ review_count: count, rating_avg: ratingAvg }).eq("id", vendorId);

  if (updateError) {
    throw updateError;
  }
}
