import type { VendorListingCopy, VendorListingFilterChip } from "@/lib/types/vendor-listing";

export const mockVendorListingCopy: VendorListingCopy = {
  brandLabel: "honestly.",
  navLinks: [
    { label: "Browse Vendors", href: "/vendors" },
    { label: "How it works", href: "/" }
  ],
  becomeVendorLabel: "Become a Vendor",
  searchAnywhereLabel: "Anywhere",
  searchAnyCategoryLabel: "Any Category",
  searchGuestsLabel: "Add guests",
  filtersLabel: "Filters",
  allVendorsLabel: "All Vendors",
  showingPrefix: "Showing",
  showingSuffix: "results",
  showMapLabel: "Show Map"
};

export const mockVendorListingFilterChips: VendorListingFilterChip[] = [
  { id: "all", label: "All Vendors", active: true },
  { id: "photography", label: "Photography", emoji: "📸", categorySlug: "photography" },
  { id: "floral", label: "Floral Design", emoji: "🌿", categorySlug: "floral-design" },
  { id: "venues", label: "Venues", emoji: "🏰", categorySlug: "venues" },
  { id: "catering", label: "Catering", emoji: "🍽️" }
];
