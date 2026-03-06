import { getVendors } from "@/lib/services/vendors";
import type { AdminVendorDirectoryData } from "@/lib/types/admin-dashboard";

export async function getAdminVendorDirectoryData(): Promise<AdminVendorDirectoryData> {
  const vendors = await getVendors();

  return {
    brandLabel: "honestly. admin",
    title: "Vendor Directory",
    description: "Manage and moderate all vendor profiles on the platform.",
    searchPlaceholder: "Search by vendor name...",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors", active: true },
      { id: "reviews", label: "Reviews", href: "/admin/reviews" },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Taxonomy", href: "/admin/categories" },
      { id: "rating-criteria", label: "Review Rubric", href: "/admin/rating-criteria" }
    ],
    vendors: vendors.map((vendor) => ({
      id: vendor.id,
      vendorName: vendor.name,
      vendorSlug: vendor.slug,
      imageUrl: vendor.images.find((image) => image.kind === "cover")?.url ?? vendor.images[0]?.url,
      status: vendor.status,
      claimed: vendor.claimed,
      verified: vendor.verified,
      categoryLabel: vendor.primaryCategory?.name ?? "Vendor"
    })),
    pagination: {
      currentPage: 1,
      totalPages: 24,
      pageNumbers: [1, 2, 3, 24]
    }
  };
}
