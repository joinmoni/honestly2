import { getClaims } from "@/lib/services/claims";
import { getVendors } from "@/lib/services/vendors";
import type { AdminClaimsModerationData } from "@/lib/types/admin-dashboard";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric"
  });
}

export async function getAdminClaimsModerationData(): Promise<AdminClaimsModerationData> {
  const [claims, vendors] = await Promise.all([getClaims(), getVendors()]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  const items = claims
    .map((claim) => {
      const vendor = vendorById.get(claim.vendorId);
      if (!vendor) return null;

      const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];

      return {
        id: claim.id,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorCategoryLabel: vendor.primaryCategory?.name ?? "Vendor",
        vendorImageUrl: cover?.url,
        claimantName: claim.claimantName ?? "Unknown Claimant",
        claimantEmail: claim.verification?.email,
        claimantInstagram: claim.verification?.instagram,
        claimantTiktok: claim.verification?.tiktok,
        note: claim.note,
        submittedDate: formatDate(claim.createdAt),
        status: claim.status
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const pendingCount = items.filter((item) => item.status === "pending").length;
  const approvedCount = items.filter((item) => item.status === "approved").length;
  const rejectedCount = items.filter((item) => item.status === "rejected").length;

  return {
    brandLabel: "honestly. admin",
    title: "Vendor Claims",
    description: "Verify business ownership requests.",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews" },
      { id: "claims", label: "Claims", href: "/admin/claims", active: true },
      { id: "taxonomy", label: "Categories", href: "/admin/categories" },
      { id: "rating-criteria", label: "Rating criteria", href: "/admin/rating-criteria" }
    ],
    filters: [
      { id: "pending", label: "Pending", count: pendingCount },
      { id: "approved", label: "Approved", count: approvedCount },
      { id: "rejected", label: "Rejected", count: rejectedCount }
    ],
    claims: items,
    pagination: {
      currentPage: 1,
      totalPages: 12,
      pageNumbers: [1, 2, 3, 12]
    }
  };
}
