import type { Vendor } from "@/lib/types/domain";

export type VendorListingFilterChip = {
  id: string;
  label: string;
  emoji?: string;
  categorySlug?: string;
  active?: boolean;
};

export type VendorListingCopy = {
  brandLabel: string;
  navLinks: Array<{
    label: string;
    href: string;
  }>;
  becomeVendorLabel: string;
  searchAnywhereLabel: string;
  searchAnyCategoryLabel: string;
  searchGuestsLabel: string;
  filtersLabel: string;
  allVendorsLabel: string;
  showingPrefix: string;
  showingSuffix: string;
  showMapLabel: string;
};

export type VendorListingPageData = {
  copy: VendorListingCopy;
  resultCount: number;
  filterChips: VendorListingFilterChip[];
  vendors: Vendor[];
  searchState: {
    query: string;
    where: string;
    categorySlug: string;
  };
};
