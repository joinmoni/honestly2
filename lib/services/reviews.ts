import { getDataLayer } from "@/lib/services/data-layer";
import type { RatingCriterion, Review } from "@/lib/types/domain";

export async function getReviews(): Promise<Review[]> {
  return getDataLayer().getReviews();
}

export async function getReviewsByVendorId(vendorId: string): Promise<Review[]> {
  const reviews = await getDataLayer().getReviews();
  return reviews.filter((review) => review.vendorId === vendorId);
}

export async function getReviewsByUserId(userId: string): Promise<Review[]> {
  const reviews = await getDataLayer().getReviews();
  return reviews.filter((review) => review.userId === userId);
}

export async function getRatingCriteria(): Promise<RatingCriterion[]> {
  return getDataLayer().getRatingCriteria();
}
