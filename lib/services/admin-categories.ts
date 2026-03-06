import { getCategories } from "@/lib/services/categories";
import type { AdminTaxonomyData } from "@/lib/types/admin-dashboard";

const categoryIconsBySlug: Record<string, string> = {
  photography: "📸",
  venues: "🏠",
  "floral-design": "🌿"
};

export async function getAdminTaxonomyData(): Promise<AdminTaxonomyData> {
  const categories = await getCategories();

  return {
    brandLabel: "honestly. admin",
    title: "Platform Taxonomy",
    description: "Manage the categories and search tags that drive discovery.",
    createCategoryLabel: "New Primary Category",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews" },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Taxonomy", href: "/admin/categories", active: true },
      { id: "rating-criteria", label: "Review Rubric", href: "/admin/rating-criteria" }
    ],
    categories: categories.map((category, index) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: categoryIconsBySlug[category.slug] ?? "✨",
      subcategories: category.subcategories.map((subcategory) => subcategory.name),
      muted: index > 0
    })),
    pagination: {
      currentPage: 1,
      totalPages: 2,
      pageNumbers: [1, 2]
    }
  };
}
