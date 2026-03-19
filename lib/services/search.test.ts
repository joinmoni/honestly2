import { describe, expect, it } from "vitest";

import {
  getHomepageLocationSuggestions,
  getHomepageSearchSuggestions,
  searchVendorDirectory
} from "@/lib/services/search";
import { searchMeilisearchCategories, searchMeilisearchLocations, searchMeilisearchVendors } from "@/lib/meilisearch";
import { getSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn()
}));

vi.mock("@/lib/meilisearch", () => ({
  searchMeilisearchCategories: vi.fn(),
  searchMeilisearchVendors: vi.fn(),
  searchMeilisearchLocations: vi.fn()
}));

const ORIGINAL_ENV = process.env;

describe("search service", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    vi.resetAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns grouped homepage suggestions", async () => {
    const suggestions = await getHomepageSearchSuggestions("flo");

    expect(suggestions.categories.some((category) => category.name === "Floral Design")).toBe(true);
    expect(suggestions.vendors.some((vendor) => vendor.name === "Wildflower Archive")).toBe(true);
  });

  it("returns location suggestions", async () => {
    const suggestions = await getHomepageLocationSuggestions("lon");

    expect(suggestions.some((location) => location.label === "London, UK")).toBe(true);
  });

  it("filters the vendor directory by query, location, and category", async () => {
    const results = await searchVendorDirectory({
      query: "golden",
      where: "Austin",
      categorySlug: "photography"
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Golden Hour Stills");
  });

  it("reads homepage suggestions from Supabase when configured", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const categoriesBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: "cat-1", name: "Floral Design", slug: "floral-design" }],
        error: null
      })
    };

    const vendorsBuilder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          {
            id: "ven-1",
            name: "Wildflower Archive",
            slug: "wildflower-archive",
            headline: "Fine art florals",
            status: "active",
            primary_category: { id: "cat-1", name: "Floral Design", slug: "floral-design" },
            vendor_category_links: [{ category: { id: "cat-1", name: "Floral Design", slug: "floral-design" } }],
            vendor_subcategory_links: [],
            vendor_locations: [{ id: "loc-1", city: "Hudson Valley", region: "NY", country: "USA", is_primary: true }],
            vendor_images: [{ id: "img-1", url: "https://example.com/cover.jpg", kind: "cover", position: 1 }]
          }
        ],
        error: null
      })
    };

    const locationsBuilder = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: "loc-1", city: "Hudson Valley", region: "NY", country: "USA" }],
        error: null
      })
    };

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn((table: string) => {
        if (table === "categories") return categoriesBuilder;
        if (table === "vendors") return vendorsBuilder;
        if (table === "vendor_locations") return locationsBuilder;
        throw new Error(`Unexpected table ${table}`);
      })
    } as never);

    const suggestions = await getHomepageSearchSuggestions("flo");

    expect(suggestions.categories).toEqual([
      expect.objectContaining({ name: "Floral Design", slug: "floral-design" })
    ]);
    expect(suggestions.vendors).toEqual([
      expect.objectContaining({ name: "Wildflower Archive", slug: "wildflower-archive" })
    ]);
  });

  it("switches to Meilisearch when the search provider is set", async () => {
    process.env.HONESTLY_SEARCH_PROVIDER = "meilisearch";
    process.env.MEILISEARCH_HOST = "http://localhost:7700";

    vi.mocked(searchMeilisearchCategories).mockResolvedValue({
      hits: [{ id: "cat-1", name: "Floral Design", slug: "floral-design", href: "/category/floral-design", emoji: "🌿" }]
    });
    vi.mocked(searchMeilisearchVendors).mockResolvedValue({
      hits: [{ id: "ven-1", name: "Wildflower Archive", slug: "wildflower-archive", categoryLabel: "Floral Design", locationLabel: "Hudson Valley, NY" }]
    });
    vi.mocked(searchMeilisearchLocations).mockResolvedValue({
      hits: [{ city: "London", country: "UK", label: "London, UK" }]
    });

    await expect(getHomepageSearchSuggestions("flo")).resolves.toEqual({
      categories: [{ id: "cat-1", name: "Floral Design", slug: "floral-design", emoji: "🌿", href: "/category/floral-design" }],
      vendors: [{ id: "ven-1", name: "Wildflower Archive", slug: "wildflower-archive" }],
      locations: []
    });

    await expect(getHomepageLocationSuggestions("lon")).resolves.toEqual([
      { city: "London", country: "UK", label: "London, UK" }
    ]);

    await expect(searchVendorDirectory({ query: "wildflower" })).resolves.toEqual([
      expect.objectContaining({
        id: "ven-1",
        name: "Wildflower Archive",
        slug: "wildflower-archive"
      })
    ]);
  });
});
