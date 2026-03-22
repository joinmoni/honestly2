import { getRatingCriteria, getReviews } from "@/lib/services/reviews";
import { getVendors } from "@/lib/services/vendors";
import type { AdminReviewModerationData, AdminReviewModerationItem } from "@/lib/types/admin-dashboard";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  });
}

function toModerationItem(review: {
  id: string;
  vendorId: string;
  vendorName: string;
  userName: string;
  reviewerEmail?: string;
  overallRating: number;
  title?: string;
  body?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  seededByAdmin?: boolean;
}): AdminReviewModerationItem {
  return {
    id: review.id,
    vendorId: review.vendorId,
    vendorName: review.vendorName,
    reviewerName: review.userName,
    reviewerEmail: review.reviewerEmail?.trim() || "—",
    submittedDate: formatDate(review.createdAt),
    submittedAtIso: review.createdAt,
    reviewTitle: review.title,
    reviewBody: review.body,
    overallRating: review.overallRating,
    status: review.status,
    seededByAdmin: review.seededByAdmin
  };
}

export async function getAdminReviewModerationData(): Promise<AdminReviewModerationData> {
  const [reviews, vendors, criteria] = await Promise.all([getReviews(), getVendors(), getRatingCriteria()]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  const moderationItems = reviews
    .map((review) => {
      const vendor = vendorById.get(review.vendorId);
      if (!vendor) return null;

      return toModerationItem({
        id: review.id,
        vendorId: vendor.id,
        vendorName: vendor.name,
        userName: review.userName,
        reviewerEmail: review.reviewerEmail,
        overallRating: review.overallRating,
        title: review.title,
        body: review.body,
        status: review.status,
        createdAt: review.createdAt,
        seededByAdmin: review.seededByAdmin
      });
    })
    .filter((item): item is AdminReviewModerationItem => item !== null);

  const pendingCount = moderationItems.filter((item) => item.status === "pending").length;
  const approvedCount = moderationItems.filter((item) => item.status === "approved").length;
  const rejectedCount = moderationItems.filter((item) => item.status === "rejected").length;

  return {
    brandLabel: "honestly. admin",
    title: "Review Moderation",
    description: "Ensuring quality and authenticity across the platform.",
    createReviewLabel: "Seed review",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews", active: true },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Categories", href: "/admin/categories" },
      { id: "rating-criteria", label: "Rating criteria", href: "/admin/rating-criteria" }
    ],
    filters: [
      { id: "pending", label: "Pending", count: pendingCount },
      { id: "approved", label: "Approved", count: approvedCount },
      { id: "rejected", label: "Rejected", count: rejectedCount }
    ],
    reviews: moderationItems,
    vendors: vendors.map((vendor) => ({ id: vendor.id, name: vendor.name, slug: vendor.slug })),
    criteria: criteria.map((criterion) => ({
      id: criterion.id,
      name: criterion.name,
      description: criterion.description
    })),
    pagination: {
      currentPage: 1,
      totalPages: 8,
      pageNumbers: [1, 2, 3, 8]
    }
  };
}
