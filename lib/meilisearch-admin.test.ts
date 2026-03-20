import { beforeEach, describe, expect, it, vi } from "vitest";

import { syncMeilisearchIndexes } from "@/lib/meilisearch-admin";
import type { HomepageSearchIndex } from "@/lib/types/search";
import type { Vendor } from "@/lib/types/domain";

vi.mock("@/lib/services/search", () => ({
  getHomepageSearchIndex: vi.fn()
}));

vi.mock("@/lib/services/vendors", () => ({
  getVendors: vi.fn()
}));

const { getHomepageSearchIndex } = await import("@/lib/services/search");
const { getVendors } = await import("@/lib/services/vendors");

const ORIGINAL_ENV = process.env;

describe("meilisearch admin sync", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.MEILISEARCH_HOST = "http://localhost:7700";
    process.env.MEILISEARCH_ADMIN_API_KEY = "admin-key";
    vi.resetAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true
      })
    );
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
    vi.unstubAllGlobals();
  });

  it("syncs vendors, categories, and locations into Meilisearch", async () => {
    const searchIndex: HomepageSearchIndex = {
      categories: [{ id: "cat-1", name: "Floral Design", slug: "floral-design", emoji: "🌿", href: "/category/floral-design" }],
      locations: [{ id: "loc-1", city: "Hudson Valley", region: "NY", country: "USA", label: "Hudson Valley, NY" }],
      vendors: []
    };

    const vendors: Vendor[] = [
      {
        id: "ven-1",
        slug: "wildflower-archive",
        name: "Wildflower Archive",
        headline: "Fine art florals",
        description: undefined,
        verified: true,
        claimed: true,
        status: "active",
        ratingAvg: 4.9,
        reviewCount: 12,
        primaryCategory: { id: "cat-1", slug: "floral-design", name: "Floral Design" },
        categories: [{ id: "cat-1", slug: "floral-design", name: "Floral Design" }],
        subcategories: [{ id: "sub-1", slug: "wedding-florals", name: "Wedding Florals" }],
        locations: [{ id: "loc-1", city: "Hudson Valley", region: "NY", country: "USA", isPrimary: true }],
        images: [{ id: "img-1", url: "https://example.com/cover.jpg", kind: "cover" }],
        socials: [],
        travels: true,
        serviceRadiusKm: 100
      }
    ];

    vi.mocked(getHomepageSearchIndex).mockResolvedValue(searchIndex);
    vi.mocked(getVendors).mockResolvedValue(vendors);

    const summary = await syncMeilisearchIndexes();

    expect(summary).toEqual({
      vendors: 1,
      categories: 1,
      locations: 1
    });

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:7700/indexes/vendors/documents",
      expect.objectContaining({
        method: "PUT",
        body: expect.stringContaining('"searchCategories":["floral-design","floral-design","wedding-florals"]')
      })
    );
  });
});
