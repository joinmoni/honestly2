import { getSearchProvider, isSupabaseConfigured } from "@/lib/config/app-env";
import {
  searchMeilisearchCategories,
  searchMeilisearchLocations,
  searchMeilisearchVendors
} from "@/lib/meilisearch";
import { getCategories } from "@/lib/services/categories";
import { getHomeCategoryShortcuts } from "@/lib/services/home";
import { getVendors } from "@/lib/services/vendors";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Vendor } from "@/lib/types/domain";
import type { HomepageSearchIndex, SearchSuggestions, VendorDirectorySearchInput } from "@/lib/types/search";

type SupabaseSearchCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type SupabaseSearchVendorRow = {
  id: string;
  name: string;
  slug: string;
  headline?: string | null;
  status: "active" | "suspended";
  primary_category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  vendor_category_links?: Array<{
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }> | null;
  vendor_subcategory_links?: Array<{
    subcategory?: {
      id: string;
      name: string;
      slug: string;
    } | null;
  }> | null;
  vendor_locations?: Array<{
    id: string;
    city: string;
    region?: string | null;
    country?: string | null;
    is_primary: boolean;
  }> | null;
  vendor_images?: Array<{
    id: string;
    url: string;
    kind: "cover" | "gallery" | "logo";
    position?: number | null;
  }> | null;
};

type SupabaseLocationRow = {
  id: string;
  city: string;
  region?: string | null;
  country?: string | null;
};

const SEARCH_VENDOR_SELECT = `
  id,
  name,
  slug,
  headline,
  status,
  primary_category:categories!vendors_primary_category_id_fkey (
    id,
    name,
    slug
  ),
  vendor_category_links (
    category:categories (
      id,
      name,
      slug
    )
  ),
  vendor_subcategory_links (
    subcategory:subcategories (
      id,
      name,
      slug
    )
  ),
  vendor_locations (
    id,
    city,
    region,
    country,
    is_primary
  ),
  vendor_images (
    id,
    url,
    kind,
    position
  )
`;

function mapSearchVendor(row: SupabaseSearchVendorRow): Vendor {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    headline: row.headline ?? undefined,
    description: undefined,
    verified: false,
    claimed: false,
    status: row.status,
    ratingAvg: 0,
    reviewCount: 0,
    primaryCategory: row.primary_category
      ? {
          id: row.primary_category.id,
          slug: row.primary_category.slug,
          name: row.primary_category.name
        }
      : undefined,
    categories: (row.vendor_category_links ?? [])
      .map((link) => link.category)
      .filter((category): category is NonNullable<typeof category> => Boolean(category))
      .map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.name
      })),
    subcategories: (row.vendor_subcategory_links ?? [])
      .map((link) => link.subcategory)
      .filter((subcategory): subcategory is NonNullable<typeof subcategory> => Boolean(subcategory))
      .map((subcategory) => ({
        id: subcategory.id,
        slug: subcategory.slug,
        name: subcategory.name
      })),
    locations: (row.vendor_locations ?? []).map((location) => ({
      id: location.id,
      city: location.city,
      region: location.region ?? undefined,
      country: location.country ?? undefined,
      isPrimary: location.is_primary
    })),
    images: [...(row.vendor_images ?? [])]
      .sort((left, right) => (left.position ?? 0) - (right.position ?? 0))
      .map((image) => ({
        id: image.id,
        url: image.url,
        kind: image.kind
      })),
    socials: [],
    travels: false,
    serviceRadiusKm: null
  };
}

async function getSearchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return getCategories();
  }

  const client = getSupabaseServerClient();
  const { data, error } = await client.from("categories").select("id, name, slug").order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load search categories from Supabase: ${error.message}`);
  }

  return ((data ?? []) as SupabaseSearchCategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    subcategories: []
  }));
}

async function getSearchVendors(): Promise<Vendor[]> {
  if (!isSupabaseConfigured()) {
    return getVendors();
  }

  const client = getSupabaseServerClient();
  const { data, error } = await client.from("vendors").select(SEARCH_VENDOR_SELECT).eq("status", "active").order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load search vendors from Supabase: ${error.message}`);
  }

  return ((data ?? []) as unknown as SupabaseSearchVendorRow[]).map(mapSearchVendor);
}

async function getSearchLocations(): Promise<HomepageSearchIndex["locations"]> {
  if (!isSupabaseConfigured()) {
    const vendors = await getSearchVendors();
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

    return Array.from(locationMap.values());
  }

  const client = getSupabaseServerClient();
  const { data, error } = await client.from("vendor_locations").select("id, city, region, country").order("city", { ascending: true });

  if (error) {
    throw new Error(`Failed to load search locations from Supabase: ${error.message}`);
  }

  const rows = (data ?? []) as SupabaseLocationRow[];
  const locationMap = new Map<string, HomepageSearchIndex["locations"][number]>();

  rows.forEach((location) => {
    const label = `${location.city}${location.region ? `, ${location.region}` : location.country ? `, ${location.country}` : ""}`;
    const key = `${location.city}-${location.region ?? ""}-${location.country ?? ""}`.toLowerCase();
    if (!locationMap.has(key)) {
      locationMap.set(key, {
        id: key,
        city: location.city,
        region: location.region ?? undefined,
        country: location.country ?? undefined,
        label
      });
    }
  });

  return Array.from(locationMap.values());
}

export async function getHomepageSearchIndex(): Promise<HomepageSearchIndex> {
  const [categories, vendors, shortcuts, locations] = await Promise.all([getSearchCategories(), getSearchVendors(), getHomeCategoryShortcuts(), getSearchLocations()]);
  const emojiBySlug = new Map(shortcuts.map((shortcut) => [shortcut.href.split("/").at(-1) ?? "", shortcut.emoji]));

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
    locations
  };
}

export async function getHomepageSearchSuggestions(query: string): Promise<SearchSuggestions> {
  if (getSearchProvider() === "meilisearch") {
    const term = query.trim();
    const [categories, vendors] = await Promise.all([
      searchMeilisearchCategories(term, 5),
      searchMeilisearchVendors(term, 5)
    ]);

    return {
      categories: categories.hits.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        emoji: category.emoji,
        href: category.href
      })),
      vendors: vendors.hits.map((vendor) => ({
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug
      })),
      locations: []
    };
  }

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
  if (getSearchProvider() === "meilisearch") {
    const results = await searchMeilisearchLocations(query.trim(), 6);
    return results.hits.map((location) => ({
      city: location.city,
      region: location.region,
      country: location.country,
      label: location.label
    }));
  }

  const index = await getHomepageSearchIndex();
  const term = query.trim().toLowerCase();

  return index.locations.filter((location) => (term ? location.label.toLowerCase().includes(term) : true)).slice(0, 6);
}

export async function searchVendorDirectory({
  query,
  where,
  categorySlug
}: VendorDirectorySearchInput): Promise<Vendor[]> {
  if (getSearchProvider() === "meilisearch") {
    const filters: string[] = [];
    if (categorySlug && categorySlug !== "all") {
      filters.push(`searchCategories = "${categorySlug}"`);
    }
    if (where?.trim()) {
      filters.push(`searchLocations = "${where.trim()}"`);
    }

    const results = await searchMeilisearchVendors(query?.trim() ?? "", 24, filters);

    return results.hits.map((vendor): Vendor => ({
      id: vendor.id,
      slug: vendor.slug,
      name: vendor.name,
      headline: undefined,
      description: undefined,
      verified: false,
      claimed: false,
      status: "active" as const,
      ratingAvg: 0,
      reviewCount: 0,
      primaryCategory: {
        id: vendor.categoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        slug: vendor.categoryLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: vendor.categoryLabel
      },
      categories: [],
      subcategories: [],
      locations: vendor.locationLabel
        ? [
            {
              id: `${vendor.id}-primary`,
              city: vendor.locationLabel.split(",")[0] ?? vendor.locationLabel,
              region: vendor.locationLabel.split(",").slice(1).join(",").trim() || undefined,
              isPrimary: true
            }
          ]
        : [],
      images: vendor.imageUrl
        ? [
            {
              id: `${vendor.id}-cover`,
              url: vendor.imageUrl,
              kind: "cover"
            }
          ]
        : [],
      socials: [],
      travels: false,
      serviceRadiusKm: null
    }));
  }

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
