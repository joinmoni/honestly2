import { getReviews } from "@/lib/services/reviews";
import { getVendors } from "@/lib/services/vendors";
import type { AdminReviewModerationData } from "@/lib/types/admin-dashboard";

const reviewerEmailByUserId: Record<string, string> = {
  "usr-001": "avery@example.com",
  "usr-002": "jordan@example.com",
  "usr-003": "maria@luxelinens.com"
};

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  });
}

export async function getAdminReviewModerationData(): Promise<AdminReviewModerationData> {
  const [reviews, vendors] = await Promise.all([getReviews(), getVendors()]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  const moderationItems = reviews
    .map((review) => {
      const vendor = vendorById.get(review.vendorId);
      if (!vendor) return null;

      return {
        id: review.id,
        vendorId: vendor.id,
        vendorName: vendor.name,
        reviewerName: review.userName,
        reviewerEmail: reviewerEmailByUserId[review.userId] ?? `${review.userId}@example.com`,
        submittedDate: formatDate(review.createdAt),
        reviewTitle: review.title,
        reviewBody: review.body,
        overallRating: review.overallRating,
        status: review.status
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

  const pendingCount = moderationItems.filter((item) => item.status === "pending").length;
  const approvedCount = moderationItems.filter((item) => item.status === "approved").length;
  const rejectedCount = moderationItems.filter((item) => item.status === "rejected").length;

  return {
    brandLabel: "honestly. admin",
    title: "Review Moderation",
    description: "Ensuring quality and authenticity across the platform.",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews", active: true },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Taxonomy", href: "/admin/categories" },
      { id: "rating-criteria", label: "Review Rubric", href: "/admin/rating-criteria" }
    ],
    filters: [
      { id: "pending", label: "Pending", count: pendingCount },
      { id: "approved", label: "Approved", count: approvedCount },
      { id: "rejected", label: "Rejected", count: rejectedCount }
    ],
    reviews: moderationItems,
    pagination: {
      currentPage: 1,
      totalPages: 8,
      pageNumbers: [1, 2, 3, 8]
    }
  };
}
