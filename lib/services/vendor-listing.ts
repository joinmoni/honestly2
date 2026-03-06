import { getDataLayer } from "@/lib/services/data-layer";
import { searchVendorDirectory } from "@/lib/services/search";
import type { VendorListingFilterChip, VendorListingPageData } from "@/lib/types/vendor-listing";
import type { VendorDirectorySearchInput } from "@/lib/types/search";

export async function getVendorListingPageData(searchInput: VendorDirectorySearchInput = {}): Promise<VendorListingPageData> {
  const categorySlug = searchInput.categorySlug ?? "all";
  const [vendors, copy, baseFilterChips] = await Promise.all([
    searchVendorDirectory(searchInput),
    getDataLayer().getVendorListingCopy(),
    getDataLayer().getVendorListingFilterChips()
  ]);

  const filterChips: VendorListingFilterChip[] = baseFilterChips.map((chip) => ({
    ...chip,
    active: chip.id === categorySlug
  }));

  return {
    copy,
    resultCount: vendors.length,
    filterChips,
    vendors,
    searchState: {
      query: searchInput.query ?? "",
      where: searchInput.where ?? "",
      categorySlug
    }
  };
}
