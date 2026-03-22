import { getDataProvider, isSupabaseConfigured } from "@/lib/config/app-env";
import { mockDataLayer } from "@/lib/services/mock-data-layer";
import type { AppDataLayer } from "@/lib/services/contracts";
import { mockAnonymousSession } from "@/lib/mock-data/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, RatingCriterion, Review, Subcategory, Vendor } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type SupabaseCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  subcategories?: Array<{
    id: string;
    slug: string;
    name: string;
    category_id: string;
  }> | null;
};

type SupabaseVendorRow = {
  id: string;
  slug: string;
  name: string;
  headline?: string | null;
  description?: string | null;
  verified: boolean;
  claimed: boolean;
  status: "active" | "suspended";
  rating_avg: number | string;
  review_count: number;
  price_tier?: "$" | "$$" | "$$$" | null;
  travels: boolean;
  service_radius_km?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  primary_category?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  vendor_category_links?: Array<{
    category?: {
      id: string;
      slug: string;
      name: string;
    } | null;
  }> | null;
  vendor_subcategory_links?: Array<{
    subcategory?: {
      id: string;
      slug: string;
      name: string;
      category_id: string;
    } | null;
  }> | null;
  vendor_locations?: Array<{
    id: string;
    label?: string | null;
    city: string;
    region?: string | null;
    country?: string | null;
    is_primary: boolean;
  }> | null;
  vendor_images?: Array<{
    id: string;
    url: string;
    alt?: string | null;
    kind: "cover" | "gallery" | "logo";
    position?: number | null;
  }> | null;
  vendor_socials?: Array<{
    platform: "instagram" | "tiktok" | "facebook" | "website";
    url: string;
  }> | null;
};

type SupabaseCriterionRow = {
  id: string;
  name: string;
  description?: string | null;
  active: boolean;
  position: number;
};

type SupabaseReviewRow = {
  id: string;
  vendor_id: string;
  user_id: string | null;
  overall_rating: number | string;
  title?: string | null;
  body?: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  reviewer_name?: string | null;
  reviewer_email?: string | null;
  reviewer_avatar_url?: string | null;
  seeded_by_admin?: boolean | null;
  source?: string | null;
  user_profile?: {
    full_name: string;
    avatar_url?: string | null;
    email?: string | null;
  } | null;
  review_ratings?: Array<{
    score: number | string;
    criterion?: {
      id: string;
      name: string;
    } | null;
  }> | null;
  review_social_suggestions?: Array<{
    platform: "instagram" | "tiktok" | "facebook" | "website";
    url: string;
  }> | null;
};

type SupabaseSavedListRow = {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  is_public: boolean;
  share_slug?: string | null;
  saved_list_items?: Array<{
    vendor_id: string;
    note?: string | null;
    created_at: string;
  }> | null;
};

type SupabaseClaimRow = {
  id: string;
  vendor_id: string;
  user_id: string;
  claimant_name?: string | null;
  verification_email?: string | null;
  verification_instagram?: string | null;
  verification_tiktok?: string | null;
  status: "pending" | "approved" | "rejected";
  note?: string | null;
  created_at: string;
};

const VENDOR_SELECT = `
  id,
  slug,
  name,
  headline,
  description,
  verified,
  claimed,
  status,
  rating_avg,
  review_count,
  price_tier,
  travels,
  service_radius_km,
  contact_email,
  contact_phone,
  primary_category:honestly_categories!vendors_primary_category_id_fkey (
    id,
    slug,
    name
  ),
  vendor_category_links:honestly_vendor_category_links (
    category:honestly_categories (
      id,
      slug,
      name
    )
  ),
  vendor_subcategory_links:honestly_vendor_subcategory_links (
    subcategory:honestly_subcategories (
      id,
      slug,
      name,
      category_id
    )
  ),
  vendor_locations:honestly_vendor_locations (
    id,
    label,
    city,
    region,
    country,
    is_primary
  ),
  vendor_images:honestly_vendor_images (
    id,
    url,
    alt,
    kind,
    position
  ),
  vendor_socials:honestly_vendor_socials (
    platform,
    url
  )
`;

const REVIEW_SELECT = `
  id,
  vendor_id,
  user_id,
  overall_rating,
  title,
  body,
  status,
  created_at,
  updated_at,
  reviewer_name,
  reviewer_email,
  reviewer_avatar_url,
  seeded_by_admin,
  source,
  user_profile:honestly_user_profiles!reviews_user_id_fkey (
    full_name,
    avatar_url,
    email
  ),
  review_ratings:honestly_review_ratings (
    score,
    criterion:honestly_rating_criteria (
      id,
      name
    )
  ),
  review_social_suggestions:honestly_review_social_suggestions (
    platform,
    url
  )
`;

function mapSubcategory(row: NonNullable<SupabaseCategoryRow["subcategories"]>[number]): Subcategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id
  };
}

function mapCategory(row: SupabaseCategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    ...(row.created_at ? { createdAt: row.created_at } : {}),
    subcategories: (row.subcategories ?? []).map(mapSubcategory)
  };
}

function mapVendor(row: SupabaseVendorRow): Vendor {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    headline: row.headline ?? undefined,
    description: row.description ?? undefined,
    verified: row.verified,
    claimed: row.claimed,
    status: row.status,
    ratingAvg: Number(row.rating_avg),
    reviewCount: row.review_count,
    priceTier: row.price_tier ?? undefined,
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
      label: location.label ?? undefined,
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
        alt: image.alt ?? undefined,
        kind: image.kind
      })),
    socials: (row.vendor_socials ?? []).map((social) => ({
      platform: social.platform,
      url: social.url
    })),
    contactEmail: row.contact_email?.trim() || undefined,
    contactPhone: row.contact_phone?.trim() || undefined,
    travels: row.travels,
    serviceRadiusKm: row.service_radius_km ?? null
  };
}

function mapRatingCriterion(row: SupabaseCriterionRow): RatingCriterion {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    active: row.active,
    position: row.position
  };
}

function mapReview(row: SupabaseReviewRow): Review {
  const displayName =
    row.user_id && row.user_profile?.full_name
      ? row.user_profile.full_name
      : (row.reviewer_name?.trim() || row.user_profile?.full_name || "Anonymous");

  const displayAvatar = row.user_id ? (row.user_profile?.avatar_url ?? undefined) : (row.reviewer_avatar_url?.trim() || undefined);

  const reviewerEmail =
    row.reviewer_email?.trim() || row.user_profile?.email?.trim() || undefined;

  return {
    id: row.id,
    vendorId: row.vendor_id,
    userId: row.user_id,
    userName: displayName,
    userAvatar: displayAvatar,
    reviewerEmail,
    seededByAdmin: Boolean(row.seeded_by_admin),
    source: row.source === "admin" || row.source === "import" || row.source === "user" ? row.source : undefined,
    overallRating: Number(row.overall_rating),
    title: row.title ?? undefined,
    body: row.body ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ratings: (row.review_ratings ?? [])
      .map((rating) => {
        if (!rating.criterion) return null;
        return {
          criterionId: rating.criterion.id,
          criterionName: rating.criterion.name,
          score: Number(rating.score)
        };
      })
      .filter((rating): rating is NonNullable<typeof rating> => rating !== null),
    socialsSuggested: (row.review_social_suggestions ?? []).map((social) => ({
      platform: social.platform,
      url: social.url
    }))
  };
}

function mapSavedList(row: SupabaseSavedListRow) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? undefined,
    isPublic: row.is_public,
    shareSlug: row.share_slug ?? undefined,
    items: (row.saved_list_items ?? []).map((item) => ({
      vendorId: item.vendor_id,
      note: item.note ?? undefined,
      createdAt: item.created_at
    }))
  };
}

function mapClaim(row: SupabaseClaimRow) {
  return {
    id: row.id,
    vendorId: row.vendor_id,
    userId: row.user_id,
    claimantName: row.claimant_name ?? undefined,
    verification: {
      email: row.verification_email ?? undefined,
      instagram: row.verification_instagram ?? undefined,
      tiktok: row.verification_tiktok ?? undefined
    },
    status: row.status,
    note: row.note ?? undefined,
    createdAt: row.created_at
  };
}

function formatPriceRangeLabel(priceTier?: Vendor["priceTier"]): string {
  if (!priceTier) return "Pricing on request";
  if (priceTier === "$") return "$ — $$";
  if (priceTier === "$$") return "$$ — $$$";
  return "$$$ — $$$$";
}

function formatAvailabilityLabel(vendor: Vendor): string {
  return vendor.status === "active" ? "Now Booking" : "Currently Unavailable";
}

function buildVendorProfile(vendor: Vendor): VendorProfile {
  return {
    vendorId: vendor.id,
    aboutTitle: vendor.primaryCategory?.name === "Floral Design" ? "About the Studio" : "About",
    aboutParagraphs: vendor.description
      ? [vendor.description]
      : [`${vendor.name} is featured on Honestly for refined, design-led work.`],
    serviceDetails: {
      categoryLabel: vendor.primaryCategory?.name ?? "Vendor",
      priceRangeLabel: formatPriceRangeLabel(vendor.priceTier),
      availabilityLabel: formatAvailabilityLabel(vendor)
    },
    ctas: {
      saveLabel: "Save",
      shareLabel: "Share",
      contactLabel: "Contact Vendor",
      leaveReviewLabel: "Leave a review",
      claimLabel: "Claim this page"
    }
  };
}

async function getSupabaseCategories(): Promise<Category[]> {
  const client = getSupabaseServerClient();
  const query = client
    .from("honestly_categories")
    .select(
      `
        id,
        slug,
        name,
        description,
        created_at,
        subcategories:honestly_subcategories (
          id,
          slug,
          name,
          category_id
        )
      `
    )
    .order("name", { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load categories from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapCategory(row as unknown as SupabaseCategoryRow));
}

async function getSupabaseVendors(): Promise<Vendor[]> {
  const client = getSupabaseServerClient();
  const query = client.from("honestly_vendors").select(VENDOR_SELECT).order("name", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load vendors from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapVendor(row as unknown as SupabaseVendorRow));
}

async function getSupabaseReviews(): Promise<Review[]> {
  const client = getSupabaseServerClient();
  const query = client.from("honestly_reviews").select(REVIEW_SELECT).order("created_at", { ascending: false });
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load reviews from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapReview(row as unknown as SupabaseReviewRow));
}

async function getSupabaseRatingCriteria(): Promise<RatingCriterion[]> {
  const client = getSupabaseServerClient();
  const query = client.from("honestly_rating_criteria").select("id, name, description, active, position").order("position", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load rating criteria from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRatingCriterion(row as unknown as SupabaseCriterionRow));
}

async function resolveSupabaseProfileId(userId: string): Promise<string | null> {
  const client = getSupabaseServerClient();
  const directQuery = client.from("honestly_user_profiles").select("id").eq("id", userId).maybeSingle();
  const directResult = await directQuery;

  if (directResult.error) {
    throw new Error(`Failed to resolve Supabase profile by id: ${directResult.error.message}`);
  }

  if (directResult.data?.id) {
    return directResult.data.id as string;
  }

  const authQuery = client.from("honestly_user_profiles").select("id").eq("auth_user_id", userId).maybeSingle();
  const authResult = await authQuery;

  if (authResult.error) {
    throw new Error(`Failed to resolve Supabase profile by auth user id: ${authResult.error.message}`);
  }

  return (authResult.data?.id as string | undefined) ?? null;
}

async function getSupabaseListsByUserId(userId: string) {
  const profileId = await resolveSupabaseProfileId(userId);
  if (!profileId) return [];

  const client = getSupabaseServerClient();
  const query = client
    .from("honestly_saved_lists")
    .select(
      `
        id,
        user_id,
        name,
        description,
        is_public,
        share_slug,
        saved_list_items:honestly_saved_list_items (
          vendor_id,
          note,
          created_at
        )
      `
    )
    .eq("user_id", profileId)
    .order("name", { ascending: true });
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load saved lists from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapSavedList(row as unknown as SupabaseSavedListRow));
}

async function getSupabaseListById(id: string) {
  const client = getSupabaseServerClient();
  const query = client
    .from("honestly_saved_lists")
    .select(
      `
        id,
        user_id,
        name,
        description,
        is_public,
        share_slug,
        saved_list_items:honestly_saved_list_items (
          vendor_id,
          note,
          created_at
        )
      `
    )
    .eq("id", id)
    .maybeSingle();
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load saved list "${id}" from Supabase: ${error.message}`);
  }

  return data ? mapSavedList(data as unknown as SupabaseSavedListRow) : null;
}

async function getSupabasePublicListByShareSlug(shareSlug: string) {
  const client = getSupabaseServerClient();
  const query = client
    .from("honestly_saved_lists")
    .select(
      `
        id,
        user_id,
        name,
        description,
        is_public,
        share_slug,
        saved_list_items:honestly_saved_list_items (
          vendor_id,
          note,
          created_at
        )
      `
    )
    .eq("share_slug", shareSlug)
    .eq("is_public", true)
    .maybeSingle();
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load public list "${shareSlug}" from Supabase: ${error.message}`);
  }

  return data ? mapSavedList(data as unknown as SupabaseSavedListRow) : null;
}

async function getSupabaseClaims() {
  const client = getSupabaseServerClient();
  const query = client
    .from("honestly_vendor_claims")
    .select(
      `
        id,
        vendor_id,
        user_id,
        claimant_name,
        verification_email,
        verification_instagram,
        verification_tiktok,
        status,
        note,
        created_at
      `
    )
    .order("created_at", { ascending: false });
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load vendor claims from Supabase: ${error.message}`);
  }

  return (data ?? []).map((row) => mapClaim(row as unknown as SupabaseClaimRow));
}

export function getSupabaseDataLayer(): AppDataLayer {
  if (getDataProvider() === "supabase" && !isSupabaseConfigured()) {
    throw new Error("Supabase data provider selected but NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing.");
  }

  return {
    ...mockDataLayer,
    async getVendors() {
      return getSupabaseVendors();
    },
    async getVendorBySlug(slug) {
      const client = getSupabaseServerClient();
      const query = client.from("honestly_vendors").select(VENDOR_SELECT).eq("slug", slug).maybeSingle();
      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to load vendor "${slug}" from Supabase: ${error.message}`);
      }

      return data ? mapVendor(data as unknown as SupabaseVendorRow) : null;
    },
    async getCategories() {
      return getSupabaseCategories();
    },
    async getCategoryBySlug(slug) {
      const categories = await getSupabaseCategories();
      return categories.find((category) => category.slug === slug) ?? null;
    },
    async getSubcategoryBySlug(categorySlug, subcategorySlug) {
      const category = await this.getCategoryBySlug(categorySlug);
      if (!category) return null;
      return category.subcategories.find((subcategory) => subcategory.slug === subcategorySlug) ?? null;
    },
    async getReviews() {
      return getSupabaseReviews();
    },
    async getRatingCriteria() {
      return getSupabaseRatingCriteria();
    },
    async getListsByUserId(userId) {
      return getSupabaseListsByUserId(userId);
    },
    async getListById(id) {
      return getSupabaseListById(id);
    },
    async getPublicListByShareSlug(shareSlug) {
      return getSupabasePublicListByShareSlug(shareSlug);
    },
    async getClaims() {
      return getSupabaseClaims();
    },
    async getClaimsByVendorId(vendorId) {
      const claims = await getSupabaseClaims();
      return claims.filter((claim) => claim.vendorId === vendorId);
    },
    async getVendorProfileByVendorId(vendorId) {
      const vendors = await getSupabaseVendors();
      const vendor = vendors.find((entry) => entry.id === vendorId);
      return vendor ? buildVendorProfile(vendor) : null;
    },
    async getCurrentSession() {
      const { getSupabaseServerSession } = await import("@/lib/supabase/server-session");
      return getSupabaseServerSession();
    },
    async getAnonymousSession() {
      return mockAnonymousSession;
    },
    async getAdminSession() {
      const { getSupabaseServerSession } = await import("@/lib/supabase/server-session");
      const session = await getSupabaseServerSession();
      if (session.user?.role === "admin") {
        return session;
      }
      return mockAnonymousSession;
    }
  };
}
