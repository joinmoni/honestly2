import { describe, expect, it } from "vitest";

import {
  getHomepageLocationSuggestions,
  getHomepageSearchSuggestions,
  searchVendorDirectory
} from "@/lib/services/search";

describe("search service", () => {
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
});
