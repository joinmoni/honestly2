import { getVendors } from "@/lib/services/vendors";
import { getCategories } from "@/lib/services/categories";
import { getRatingCriteria } from "@/lib/services/reviews";
import type { AdminVendorDirectoryData } from "@/lib/types/admin-dashboard";

export async function getAdminVendorDirectoryData(): Promise<AdminVendorDirectoryData> {
  const [vendors, categories, criteria] = await Promise.all([getVendors(), getCategories(), getRatingCriteria()]);

  return {
    brandLabel: "honestly. admin",
    title: "Vendor Directory",
    description: "Manage and moderate all vendor profiles on the platform.",
    searchPlaceholder: "Search by vendor name...",
    createVendorLabel: "Create Vendor",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors", active: true },
      { id: "reviews", label: "Reviews", href: "/admin/reviews" },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Categories", href: "/admin/categories" },
      { id: "rating-criteria", label: "Rating criteria", href: "/admin/rating-criteria" }
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
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug
      }))
    })),
    criteria: criteria.map((criterion) => ({
      id: criterion.id,
      name: criterion.name,
      description: criterion.description
    })),
    pagination: {
      currentPage: 1,
      totalPages: 24,
      pageNumbers: [1, 2, 3, 24]
    }
  };
}
