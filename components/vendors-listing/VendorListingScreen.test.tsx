import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { VendorListingScreen } from "@/components/vendors-listing/VendorListingScreen";
import type { SavedList } from "@/lib/types/domain";
import type { HomepageSearchIndex } from "@/lib/types/search";
import type { VendorListingPageData } from "@/lib/types/vendor-listing";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace
  }),
  usePathname: () => "/vendors"
}));

const data: VendorListingPageData = {
  copy: {
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
  },
  resultCount: 2,
  filterChips: [
    { id: "all", label: "All Vendors", active: true },
    { id: "photography", label: "Photography", emoji: "📸", categorySlug: "photography" }
  ],
  vendors: [
    {
      id: "ven-1",
      slug: "wildflower-archive",
      name: "Wildflower Archive",
      headline: "Ethereal arrangements for modern romantics.",
      verified: true,
      claimed: true,
      status: "active",
      ratingAvg: 4.9,
      reviewCount: 124,
      priceTier: "$$$",
      primaryCategory: { id: "cat-floral", name: "Floral Design", slug: "floral-design" },
      subcategories: [],
      categories: [{ id: "cat-floral", name: "Floral Design", slug: "floral-design" }],
      locations: [{ id: "loc-1", city: "Hudson Valley", region: "NY", isPrimary: true }],
      images: [{ id: "img-1", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=100", kind: "cover" }],
      socials: []
    },
    {
      id: "ven-2",
      slug: "golden-hour-stills",
      name: "Golden Hour Stills",
      headline: "Capturing the quiet moments in between.",
      verified: true,
      claimed: false,
      status: "active",
      ratingAvg: 5,
      reviewCount: 29,
      priceTier: "$$",
      primaryCategory: { id: "cat-photo", name: "Photography", slug: "photography" },
      subcategories: [],
      categories: [{ id: "cat-photo", name: "Photography", slug: "photography" }],
      locations: [{ id: "loc-2", city: "Austin", region: "TX", isPrimary: true }],
      images: [{ id: "img-2", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=100", kind: "cover" }],
      socials: []
    }
  ],
  searchState: {
    query: "",
    where: "",
    categorySlug: "all"
  }
};

const lists: SavedList[] = [
  {
    id: "list-1",
    userId: "usr-1",
    name: "Saved",
    isPublic: false,
    items: []
  }
];

const searchIndex: HomepageSearchIndex = {
  categories: [
    { id: "cat-photo", name: "Photography", slug: "photography", emoji: "📸", href: "/category/photography" },
    { id: "cat-floral", name: "Floral Design", slug: "floral-design", emoji: "🌿", href: "/category/floral-design" }
  ],
  vendors: [
    {
      id: "ven-1",
      name: "Wildflower Archive",
      slug: "wildflower-archive",
      imageUrl: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=100",
      categoryLabel: "Floral Design",
      locationLabel: "Hudson Valley, NY"
    }
  ],
  locations: [{ id: "loc-london", city: "London", country: "UK", label: "London, UK" }]
};

describe("VendorListingScreen", () => {
  beforeEach(() => {
    replace.mockReset();
  });

  it("updates the URL when search inputs and category change", async () => {
    const user = userEvent.setup();

    render(<VendorListingScreen data={data} initialLists={lists} currentUserId="usr-1" searchIndex={searchIndex} />);

    await user.type(screen.getByLabelText("Who"), "photo");
    await user.type(screen.getByLabelText("Where"), "Austin");
    await user.click(screen.getByRole("button", { name: "Search vendors" }));

    expect(replace).toHaveBeenCalledWith("/vendors?q=photo&where=Austin", { scroll: false });

    await user.click(screen.getByRole("button", { name: "📸 Photography" }));

    await waitFor(() => {
      expect(replace).toHaveBeenLastCalledWith("/vendors?q=photo&where=Austin&category=photography", { scroll: false });
    });
  });

  it("renders editorial card proportions and serif vendor names", () => {
    const { container } = render(<VendorListingScreen data={data} initialLists={lists} currentUserId="usr-1" searchIndex={searchIndex} />);

    expect(screen.getByRole("heading", { name: "Wildflower Archive" })).toHaveClass("text-xl", "font-serif");
    expect(container.querySelector(".aspect-\\[4\\/5\\]")).not.toBeNull();
  });
});
