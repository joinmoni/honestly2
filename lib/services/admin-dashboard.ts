import { getCategories } from "@/lib/services/categories";
import { getClaims } from "@/lib/services/claims";
import { getReviews } from "@/lib/services/reviews";
import { getVendors } from "@/lib/services/vendors";
import type { AdminCategoryGroup, AdminClaimItem, AdminDashboardData, AdminDirectoryItem } from "@/lib/types/admin-dashboard";

const requesterEmailByUserId: Record<string, string> = {
  "usr-003": "maria@luxelinens.com"
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [vendors, claims, categories, reviews] = await Promise.all([
    getVendors(),
    getClaims(),
    getCategories(),
    getReviews()
  ]);

  const pendingReviewsCount = reviews.filter((review) => review.status === "pending").length;
  const pendingClaims = claims.filter((claim) => claim.status === "pending");

  const claimItems: AdminClaimItem[] = pendingClaims.map((claim) => {
    const vendor = vendors.find((item) => item.id === claim.vendorId);
    const vendorName = vendor?.name ?? "Unknown Vendor";

    return {
      id: claim.id,
      vendorName,
      requesterEmail: requesterEmailByUserId[claim.userId] ?? "unknown@vendor.com",
      initial: vendorName.charAt(0).toUpperCase()
    };
  });

  const categoryGroups: AdminCategoryGroup[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: category.subcategories.map((subcategory) => subcategory.name)
  }));

  const directoryItems: AdminDirectoryItem[] = vendors.map((vendor) => ({
    id: vendor.id,
    vendorName: vendor.name,
    statusLabel: vendor.status === "active" ? "Active" : "Suspended",
    statusTone: vendor.status,
    verificationLabel: vendor.verified ? "Vetted Creator" : "Standard"
  }));

  return {
    brandLabel: "honestly. admin",
    title: "Platform Management",
    statusLabel: "Operational",
    statusState: "operational",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin", active: true },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews", count: pendingReviewsCount },
      { id: "claims", label: "Claims", href: "/admin/claims", count: pendingClaims.length },
      { id: "taxonomy", label: "Categories", href: "/admin/categories" },
      { id: "rating-criteria", label: "Rating criteria", href: "/admin/rating-criteria" }
    ],
    claims: claimItems,
    categories: categoryGroups,
    directory: directoryItems
  };
}
