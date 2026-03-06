import type { Vendor } from "@/lib/types/domain";

export type CategoryListingCopy = {
  brandLabel: string;
  navSearchLabel: string;
  navCollectionsLabel: string;
  breadcrumbHomeLabel: string;
  headlineTop: string;
  headlineAccent: string;
  description: string;
  allStylesLabel: string;
  exploreMoreLabel: string;
  footerBrandLabel: string;
  footerTagline: string;
};

export type CategoryListingPageData = {
  categorySlug: string;
  categoryName: string;
  copy: CategoryListingCopy;
  vendors: Vendor[];
  styleChips: Array<{ id: string; label: string; subcategorySlug?: string }>;
};
