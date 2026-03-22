import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminVendorDirectoryItem } from "@/lib/types/admin-dashboard";

export type AdminVendorInitialReviewPayload = {
  reviewerName: string;
  reviewerEmail?: string;
  title?: string;
  body?: string;
  status: "pending" | "approved";
  criterionScores: Record<string, number>;
  overallRating: number;
};

export type CreateAdminVendorInput = {
  name: string;
  slug?: string;
  headline?: string;
  description?: string;
  primaryCategoryId: string;
  subcategoryIds: string[];
  city: string;
  region?: string;
  country?: string;
  priceTier?: "$" | "$$" | "$$$";
  travels: boolean;
  serviceRadiusKm?: number | null;
  website?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  contactEmail?: string;
  contactPhone?: string;
  coverImage?: File | null;
  galleryImages?: File[];
  initialReviews?: AdminVendorInitialReviewPayload[];
};

export async function updateAdminVendorStatus(
  vendors: AdminVendorDirectoryItem[],
  vendorId: string,
  status: "active" | "suspended"
): Promise<AdminVendorDirectoryItem[]> {
  if (!isSupabaseConfigured()) {
    return vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("honestly_vendors").update({ status }).eq("id", vendorId);

  if (error) {
    throw error;
  }

  return vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor));
}

export async function createAdminVendor(input: CreateAdminVendorInput): Promise<AdminVendorDirectoryItem> {
  if (!isSupabaseConfigured()) {
    const vendorSlug =
      input.slug?.trim() ||
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return {
      id: `vendor-local-${vendorSlug}`,
      vendorName: input.name.trim(),
      vendorSlug,
      status: "active",
      claimed: false,
      verified: false,
      categoryLabel: "Vendor"
    };
  }

  const body = new FormData();
  body.set("name", input.name.trim());
  body.set("slug", input.slug?.trim() ?? "");
  body.set("headline", input.headline?.trim() ?? "");
  body.set("description", input.description?.trim() ?? "");
  body.set("primaryCategoryId", input.primaryCategoryId);
  body.set("city", input.city.trim());
  body.set("region", input.region?.trim() ?? "");
  body.set("country", input.country?.trim() ?? "");
  body.set("priceTier", input.priceTier ?? "");
  body.set("travels", input.travels ? "true" : "false");
  body.set("serviceRadiusKm", input.serviceRadiusKm ? String(input.serviceRadiusKm) : "");
  body.set("website", input.website?.trim() ?? "");
  body.set("instagram", input.instagram?.trim() ?? "");
  body.set("tiktok", input.tiktok?.trim() ?? "");
  body.set("facebook", input.facebook?.trim() ?? "");
  body.set("contactEmail", input.contactEmail?.trim() ?? "");
  body.set("contactPhone", input.contactPhone?.trim() ?? "");

  input.subcategoryIds.forEach((subcategoryId) => body.append("subcategoryIds", subcategoryId));

  if (input.coverImage) {
    body.set("coverImage", input.coverImage);
  }

  (input.galleryImages ?? []).forEach((file) => {
    if (file.size > 0) {
      body.append("galleryImages", file);
    }
  });

  if (input.initialReviews?.length) {
    body.set("initialReviewsJson", JSON.stringify(input.initialReviews));
  }

  const response = await fetch("/api/admin/vendors", {
    method: "POST",
    body
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: string;
        vendor?: AdminVendorDirectoryItem;
      }
    | null;

  if (!response.ok || !payload?.vendor) {
    throw new Error(payload?.error ?? "This vendor could not be created right now.");
  }

  return payload.vendor;
}
