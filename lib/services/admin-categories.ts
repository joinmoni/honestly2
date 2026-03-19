import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getCategories } from "@/lib/services/categories";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminTaxonomyData } from "@/lib/types/admin-dashboard";

const categoryIconsBySlug: Record<string, string> = {
  photography: "📸",
  venues: "🏠",
  "floral-design": "🌿"
};

const homeMerchandisingBySlug: Record<
  string,
  {
    featuredOnHome: boolean;
    homeOrder: number | null;
    promotedSubcategories: string[];
  }
> = {
  photography: {
    featuredOnHome: true,
    homeOrder: 1,
    promotedSubcategories: ["Editorial", "Fine Art Film"]
  },
  "floral-design": {
    featuredOnHome: true,
    homeOrder: 2,
    promotedSubcategories: ["Wedding Florals"]
  },
  venues: {
    featuredOnHome: true,
    homeOrder: 3,
    promotedSubcategories: ["Garden Venues"]
  }
};

type SupabaseAdminCategoryRow = {
  id: string;
  slug: string;
  name: string;
  featured_on_home: boolean;
  home_order: number | null;
  promoted_subcategories: string[] | null;
  subcategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
};

async function getSupabaseAdminCategories() {
  const client = getSupabaseServerClient();
  const { data, error } = await client
    .from("categories")
    .select(
      `
        id,
        slug,
        name,
        featured_on_home,
        home_order,
        promoted_subcategories,
        subcategories (
          id,
          name,
          slug
        )
      `
    )
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load admin categories from Supabase: ${error.message}`);
  }

  return (data ?? []) as SupabaseAdminCategoryRow[];
}

export async function getAdminTaxonomyData(): Promise<AdminTaxonomyData> {
  if (isSupabaseConfigured()) {
    const categories = await getSupabaseAdminCategories();

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
        subcategories: (category.subcategories ?? []).map((subcategory) => subcategory.name),
        featuredOnHome: Boolean(category.featured_on_home),
        homeOrder: category.home_order ?? null,
        promotedSubcategories: (category.promoted_subcategories ?? []).slice(),
        muted: index > 0
      })),
      pagination: {
        currentPage: 1,
        totalPages: 2,
        pageNumbers: [1, 2]
      }
    };
  }

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
      featuredOnHome: homeMerchandisingBySlug[category.slug]?.featuredOnHome ?? false,
      homeOrder: homeMerchandisingBySlug[category.slug]?.homeOrder ?? null,
      promotedSubcategories: homeMerchandisingBySlug[category.slug]?.promotedSubcategories ?? [],
      muted: index > 0
    })),
    pagination: {
      currentPage: 1,
      totalPages: 2,
      pageNumbers: [1, 2]
    }
  };
}
