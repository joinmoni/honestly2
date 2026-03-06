import { getCategories } from "@/lib/services/categories";
import { getHomeCategoryShortcuts } from "@/lib/services/home";
import { getVendors } from "@/lib/services/vendors";
import type { HomepageSearchIndex, SearchSuggestions, VendorDirectorySearchInput } from "@/lib/types/search";

export async function getHomepageSearchIndex(): Promise<HomepageSearchIndex> {
  const [categories, vendors, shortcuts] = await Promise.all([getCategories(), getVendors(), getHomeCategoryShortcuts()]);
  const emojiBySlug = new Map(shortcuts.map((shortcut) => [shortcut.href.split("/").at(-1) ?? "", shortcut.emoji]));

  const locationMap = new Map<string, HomepageSearchIndex["locations"][number]>();

  vendors.forEach((vendor) => {
    vendor.locations.forEach((location) => {
      const label = `${location.city}${location.region ? `, ${location.region}` : location.country ? `, ${location.country}` : ""}`;
      const key = `${location.city}-${location.region ?? ""}-${location.country ?? ""}`.toLowerCase();

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          id: key,
          city: location.city,
          region: location.region,
          country: location.country,
          label
        });
      }
    });
  });

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      emoji: emojiBySlug.get(category.slug) ?? "✨",
      href: `/category/${category.slug}`
    })),
    vendors: vendors
      .filter((vendor) => vendor.status === "active")
      .map((vendor) => {
        const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
        const primaryLocation = vendor.locations.find((location) => location.isPrimary) ?? vendor.locations[0];

        return {
          id: vendor.id,
          name: vendor.name,
          slug: vendor.slug,
          imageUrl: cover?.url,
          categoryLabel: vendor.primaryCategory?.name ?? "Vendor",
          locationLabel: primaryLocation ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}` : "Location TBD"
        };
      }),
    locations: Array.from(locationMap.values())
  };
}

export async function getHomepageSearchSuggestions(query: string): Promise<SearchSuggestions> {
  const index = await getHomepageSearchIndex();
  const term = query.trim().toLowerCase();

  return {
    categories: index.categories
      .filter((category) => (term ? category.name.toLowerCase().includes(term) : true))
      .slice(0, 5)
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        emoji: category.emoji,
        href: category.href
      })),
    vendors: index.vendors
      .filter((vendor) => {
        if (!term) return true;
        return (
          vendor.name.toLowerCase().includes(term) ||
          vendor.categoryLabel.toLowerCase().includes(term) ||
          vendor.locationLabel.toLowerCase().includes(term)
        );
      })
      .slice(0, 5)
      .map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug
      })),
    locations: []
  };
}

export async function getHomepageLocationSuggestions(query: string): Promise<SearchSuggestions["locations"]> {
  const index = await getHomepageSearchIndex();
  const term = query.trim().toLowerCase();

  return index.locations.filter((location) => (term ? location.label.toLowerCase().includes(term) : true)).slice(0, 6);
}

export async function searchVendorDirectory({
  query,
  where,
  categorySlug
}: VendorDirectorySearchInput) {
  const vendors = await getVendors();
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const normalizedWhere = where?.trim().toLowerCase() ?? "";

  return vendors.filter((vendor) => {
    if (vendor.status !== "active") return false;

    const matchesCategory =
      !categorySlug || categorySlug === "all" || vendor.categories.some((category) => category.slug === categorySlug);

    const matchesQuery =
      !normalizedQuery ||
      vendor.name.toLowerCase().includes(normalizedQuery) ||
      vendor.headline?.toLowerCase().includes(normalizedQuery) ||
      vendor.primaryCategory?.name.toLowerCase().includes(normalizedQuery) ||
      vendor.categories.some((category) => category.name.toLowerCase().includes(normalizedQuery)) ||
      vendor.subcategories.some((subcategory) => subcategory.name.toLowerCase().includes(normalizedQuery));

    const matchesWhere =
      !normalizedWhere ||
      vendor.locations.some((location) =>
        [location.city, location.region, location.country].filter(Boolean).some((value) => value?.toLowerCase().includes(normalizedWhere))
      );

    return matchesCategory && matchesQuery && matchesWhere;
  });
}
