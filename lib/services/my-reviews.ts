import { getDataLayer } from "@/lib/services/data-layer";
import { getReviewsByUserId } from "@/lib/services/reviews";
import { getVendors } from "@/lib/services/vendors";
import type { MyReviewItemView, MyReviewsPageData } from "@/lib/types/my-reviews";

function formatSubmittedDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function getModeratorNote(reviewStatus: MyReviewItemView["review"]["status"]): string | undefined {
  if (reviewStatus !== "rejected") return undefined;
  return "This review was flagged for containing personal contact information. Please edit to remove phone numbers.";
}

export async function getMyReviewsPageData(userId: string): Promise<MyReviewsPageData> {
  const [reviews, vendors, copy] = await Promise.all([
    getReviewsByUserId(userId),
    getVendors(),
    getDataLayer().getMyReviewsPageCopy()
  ]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  const itemsWithNulls: Array<MyReviewItemView | null> = reviews.map((review) => {
      const vendor = vendorById.get(review.vendorId);
      if (!vendor) return null;

      return {
        review,
        vendorName: vendor.name,
        vendorSlug: vendor.slug,
        submittedText: formatSubmittedDate(review.createdAt),
        moderatorNote: getModeratorNote(review.status)
      };
    });

  const items = itemsWithNulls
    .filter((item): item is MyReviewItemView => item !== null)
    .sort((a, b) => new Date(b.review.createdAt).getTime() - new Date(a.review.createdAt).getTime());

  const publishedCount = items.filter((item) => item.review.status === "approved").length;
  const underReviewCount = items.filter((item) => item.review.status === "pending").length;

  return {
    copy,
    filters: [
      { id: "all", label: copy.allFilterLabel, count: items.length },
      { id: "published", label: copy.publishedFilterLabel, count: publishedCount },
      { id: "under-review", label: copy.underReviewFilterLabel, count: underReviewCount }
    ],
    reviews: items
  };
}
