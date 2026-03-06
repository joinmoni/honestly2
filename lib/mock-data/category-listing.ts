import type { CategoryListingCopy } from "@/lib/types/category-listing";

export const mockCategoryListingCopyBySlug: Record<string, CategoryListingCopy> = {
  photography: {
    brandLabel: "honestly.",
    navSearchLabel: "Search",
    navCollectionsLabel: "Collections",
    breadcrumbHomeLabel: "Home",
    headlineTop: "Capturing the Quiet Moments.",
    headlineAccent: "Quiet Moments.",
    description:
      "From editorial film photography to intimate documentary styles, our curated list of photographers focus on authenticity and light. Vetted for their eye and their professionalism.",
    allStylesLabel: "All Styles",
    exploreMoreLabel: "Explore More Photographers",
    footerBrandLabel: "honestly.",
    footerTagline: "Helping you find the vendors that match your aesthetic, honestly."
  }
};

export function getFallbackCategoryListingCopy(categoryName: string): CategoryListingCopy {
  return {
    brandLabel: "honestly.",
    navSearchLabel: "Search",
    navCollectionsLabel: "Collections",
    breadcrumbHomeLabel: "Home",
    headlineTop: categoryName,
    headlineAccent: categoryName,
    description: `Explore top ${categoryName.toLowerCase()} vendors, curated and reviewed by the community.`,
    allStylesLabel: "All Styles",
    exploreMoreLabel: "Explore More",
    footerBrandLabel: "honestly.",
    footerTagline: "Helping you find the vendors that match your aesthetic, honestly."
  };
}
