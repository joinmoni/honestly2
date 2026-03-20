import { getMeilisearchAdminEnv } from "@/lib/config/app-env";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getVendors } from "@/lib/services/vendors";

type MeilisearchSyncSummary = {
  vendors: number;
  categories: number;
  locations: number;
};

function getAdminEnv() {
  const env = getMeilisearchAdminEnv();

  if (!env) {
    throw new Error("Meilisearch sync requested before host and admin API key were configured.");
  }

  return env;
}

async function meilisearchAdminRequest(path: string, init?: RequestInit) {
  const env = getAdminEnv();

  const response = await fetch(`${env.host.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.adminApiKey}`,
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Meilisearch admin request failed for ${path} with status ${response.status}.`);
  }

  return response;
}

async function upsertIndex(uid: string, primaryKey: string) {
  await meilisearchAdminRequest("/indexes", {
    method: "POST",
    body: JSON.stringify({ uid, primaryKey })
  }).catch(async (error) => {
    if (!(error instanceof Error) || !error.message.includes("400")) {
      throw error;
    }
  });
}

async function replaceDocuments(uid: string, documents: unknown[]) {
  await meilisearchAdminRequest(`/indexes/${uid}/documents`, {
    method: "PUT",
    body: JSON.stringify(documents)
  });
}

async function updateFilterableAttributes(uid: string, attributes: string[]) {
  await meilisearchAdminRequest(`/indexes/${uid}/settings/filterable-attributes`, {
    method: "PUT",
    body: JSON.stringify(attributes)
  });
}

async function updateSearchableAttributes(uid: string, attributes: string[]) {
  await meilisearchAdminRequest(`/indexes/${uid}/settings/searchable-attributes`, {
    method: "PUT",
    body: JSON.stringify(attributes)
  });
}

export async function syncMeilisearchIndexes(): Promise<MeilisearchSyncSummary> {
  const [index, vendors] = await Promise.all([getHomepageSearchIndex(), getVendors()]);

  const vendorDocuments = vendors
    .filter((vendor) => vendor.status === "active")
    .map((vendor) => {
      const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
      const primaryLocation = vendor.locations.find((location) => location.isPrimary) ?? vendor.locations[0];
      const locationLabel = primaryLocation ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}` : "Location TBD";

      return {
        id: vendor.id,
        name: vendor.name,
        slug: vendor.slug,
        imageUrl: cover?.url,
        categoryLabel: vendor.primaryCategory?.name ?? "Vendor",
        locationLabel,
        searchCategories: [
          vendor.primaryCategory?.slug,
          ...vendor.categories.map((category) => category.slug),
          ...vendor.subcategories.map((subcategory) => subcategory.slug)
        ].filter((value): value is string => Boolean(value)),
        searchLocations: [
          locationLabel,
          ...vendor.locations.map((location) =>
            `${location.city}${location.region ? `, ${location.region}` : location.country ? `, ${location.country}` : ""}`
          )
        ]
      };
    });

  await upsertIndex("vendors", "id");
  await upsertIndex("categories", "id");
  await upsertIndex("locations", "id");

  await Promise.all([
    updateFilterableAttributes("vendors", ["searchCategories", "searchLocations"]),
    updateSearchableAttributes("vendors", ["name", "categoryLabel", "locationLabel"])
  ]);

  await Promise.all([
    replaceDocuments("vendors", vendorDocuments),
    replaceDocuments("categories", index.categories),
    replaceDocuments("locations", index.locations)
  ]);

  return {
    vendors: vendorDocuments.length,
    categories: index.categories.length,
    locations: index.locations.length
  };
}
