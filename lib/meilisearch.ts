import { getMeilisearchEnv } from "@/lib/config/app-env";

type MeilisearchSearchResponse<T> = {
  hits: T[];
};

async function meilisearchRequest<T>(indexUid: string, body: Record<string, unknown>): Promise<MeilisearchSearchResponse<T>> {
  const env = getMeilisearchEnv();

  if (!env) {
    throw new Error("Meilisearch requested before MEILISEARCH_HOST was configured.");
  }

  const response = await fetch(`${env.host.replace(/\/$/, "")}/indexes/${indexUid}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.apiKey ? { Authorization: `Bearer ${env.apiKey}` } : {})
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Meilisearch search failed for ${indexUid} with status ${response.status}.`);
  }

  return (await response.json()) as MeilisearchSearchResponse<T>;
}

export type MeilisearchCategoryDocument = {
  id: string;
  name: string;
  slug: string;
  href: string;
  emoji?: string;
};

export type MeilisearchVendorDocument = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  categoryLabel: string;
  locationLabel: string;
};

export type MeilisearchLocationDocument = {
  city: string;
  region?: string;
  country?: string;
  label: string;
};

export async function searchMeilisearchCategories(query: string, limit = 5) {
  return meilisearchRequest<MeilisearchCategoryDocument>("categories", {
    q: query,
    limit
  });
}

export async function searchMeilisearchVendors(query: string, limit = 24, filter?: string[]) {
  return meilisearchRequest<MeilisearchVendorDocument>("vendors", {
    q: query,
    limit,
    ...(filter?.length ? { filter } : {})
  });
}

export async function searchMeilisearchLocations(query: string, limit = 6) {
  return meilisearchRequest<MeilisearchLocationDocument>("locations", {
    q: query,
    limit
  });
}
