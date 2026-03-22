import { NextResponse } from "next/server";

import { isMeilisearchConfigured, isSupabaseConfigured } from "@/lib/config/app-env";
import { syncMeilisearchIndexes } from "@/lib/meilisearch-admin";
import { clampReviewRating, insertAdminSeededReview } from "@/lib/services/admin-seed-review";
import { getAdminSession } from "@/lib/services/session";
import { refreshVendorReviewAggregates } from "@/lib/services/vendor-review-aggregates";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const VENDOR_MEDIA_BUCKET = "vendor-media";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type InitialReviewJsonRow = {
  reviewerName?: unknown;
  reviewerEmail?: unknown;
  title?: unknown;
  body?: unknown;
  status?: unknown;
  criterionScores?: unknown;
  overallRating?: unknown;
};

function parseInitialReviewsFromForm(raw: string): { ok: true; items: InitialReviewJsonRow[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, items: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "initialReviewsJson is not valid JSON." };
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, error: "initialReviewsJson must be a JSON array." };
  }

  return { ok: true, items: parsed as InitialReviewJsonRow[] };
}

function normalizeUrl(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

async function ensureBucketExists() {
  const client = getSupabaseAdminClient();
  const { data: bucket } = await client.storage.getBucket(VENDOR_MEDIA_BUCKET);

  if (bucket) return;

  const { error } = await client.storage.createBucket(VENDOR_MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: "10MB"
  });

  if (error && !error.message.toLowerCase().includes("already")) {
    throw error;
  }
}

async function uploadImage(vendorId: string, file: File, kind: "cover" | "gallery", position: number) {
  const client = getSupabaseAdminClient();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const fileName = `${Date.now()}-${position}.${extension}`;
  const storagePath = `${vendorId}/${kind}/${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await client.storage.from(VENDOR_MEDIA_BUCKET).upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = client.storage.from(VENDOR_MEDIA_BUCKET).getPublicUrl(storagePath);

  return {
    storage_path: storagePath,
    url: data.publicUrl,
    alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    kind,
    position
  };
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "You must be an admin to create vendors." }, { status: 403 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase must be configured before admins can create vendors." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const providedSlug = String(formData.get("slug") ?? "").trim();
    const slug = slugify(providedSlug || name);
    const headline = String(formData.get("headline") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const primaryCategoryId = String(formData.get("primaryCategoryId") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const region = String(formData.get("region") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const priceTier = String(formData.get("priceTier") ?? "").trim();
    const travels = String(formData.get("travels") ?? "false") === "true";
    const serviceRadiusKmRaw = String(formData.get("serviceRadiusKm") ?? "").trim();
    const serviceRadiusKm = serviceRadiusKmRaw ? Number(serviceRadiusKmRaw) : null;
    const subcategoryIds = formData.getAll("subcategoryIds").map((value) => String(value)).filter(Boolean);
    const contactEmail = String(formData.get("contactEmail") ?? "").trim();
    const contactPhone = String(formData.get("contactPhone") ?? "").trim();
    const coverImage = formData.get("coverImage");
    const galleryImages = formData
      .getAll("galleryImages")
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (!name || !slug || !primaryCategoryId || !city) {
      return NextResponse.json(
        { error: "Name, primary category, and a primary city are required to create a vendor." },
        { status: 400 }
      );
    }

    if (serviceRadiusKm !== null && Number.isNaN(serviceRadiusKm)) {
      return NextResponse.json({ error: "Service radius must be a valid number." }, { status: 400 });
    }

    const client = getSupabaseAdminClient();

    const { data: vendor, error: vendorError } = await client
      .from("honestly_vendors")
      .insert({
        slug,
        name,
        headline: headline || null,
        description: description || null,
        primary_category_id: primaryCategoryId,
        status: "active",
        verified: false,
        claimed: false,
        price_tier: priceTier || null,
        travels,
        service_radius_km: serviceRadiusKm,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null
      })
      .select("id, slug, name")
      .single();

    if (vendorError) {
      throw vendorError;
    }

    const vendorId = vendor.id as string;
    const { data: primaryCategory } = await client.from("honestly_categories").select("name").eq("id", primaryCategoryId).maybeSingle();

    const categoryLinkRows = [{ vendor_id: vendorId, category_id: primaryCategoryId }];
    const locationRows = [
      {
        vendor_id: vendorId,
        city,
        region: region || null,
        country: country || null,
        is_primary: true
      }
    ];
    const socialRows = [
      { platform: "website", url: normalizeUrl(formData.get("website")?.toString() ?? null) },
      { platform: "instagram", url: normalizeUrl(formData.get("instagram")?.toString() ?? null) },
      { platform: "tiktok", url: normalizeUrl(formData.get("tiktok")?.toString() ?? null) },
      { platform: "facebook", url: normalizeUrl(formData.get("facebook")?.toString() ?? null) }
    ]
      .filter((entry): entry is { platform: "website" | "instagram" | "tiktok" | "facebook"; url: string } => Boolean(entry.url))
      .map((entry) => ({ vendor_id: vendorId, ...entry }));

    const { error: categoryLinkError } = await client.from("honestly_vendor_category_links").insert(categoryLinkRows);
    if (categoryLinkError) {
      throw categoryLinkError;
    }

    if (subcategoryIds.length) {
      const { error: subcategoryLinkError } = await client.from("honestly_vendor_subcategory_links").insert(
        subcategoryIds.map((subcategoryId) => ({
          vendor_id: vendorId,
          subcategory_id: subcategoryId
        }))
      );

      if (subcategoryLinkError) {
        throw subcategoryLinkError;
      }
    }

    const { error: locationError } = await client.from("honestly_vendor_locations").insert(locationRows);
    if (locationError) {
      throw locationError;
    }

    if (socialRows.length) {
      const { error: socialError } = await client.from("honestly_vendor_socials").insert(socialRows);
      if (socialError) {
        throw socialError;
      }
    }

    const imageFiles = [
      ...(coverImage instanceof File && coverImage.size > 0 ? [{ file: coverImage, kind: "cover" as const }] : []),
      ...galleryImages.map((file) => ({ file, kind: "gallery" as const }))
    ];

    if (imageFiles.length) {
      await ensureBucketExists();

      const uploadedImages = [];
      for (const [index, image] of imageFiles.entries()) {
        uploadedImages.push(await uploadImage(vendorId, image.file, image.kind, index));
      }

      const { error: imageError } = await client
        .from("honestly_vendor_images")
        .insert(uploadedImages.map((image) => ({ vendor_id: vendorId, ...image })));

      if (imageError) {
        throw imageError;
      }
    }

    const initialReviewsResult = parseInitialReviewsFromForm(String(formData.get("initialReviewsJson") ?? ""));
    if (!initialReviewsResult.ok) {
      return NextResponse.json({ error: initialReviewsResult.error }, { status: 400 });
    }

    let anyApprovedInitialReview = false;
    for (const [index, row] of initialReviewsResult.items.entries()) {
      if (typeof row !== "object" || row === null) {
        return NextResponse.json({ error: `Initial review at index ${index} must be an object.` }, { status: 400 });
      }

      const reviewerName = String(row.reviewerName ?? "").trim();
      if (!reviewerName) {
        return NextResponse.json({ error: `Initial review at index ${index} must include reviewerName.` }, { status: 400 });
      }

      const criterionScoresRaw = row.criterionScores;
      const criterionScores: Record<string, number> = {};
      if (criterionScoresRaw && typeof criterionScoresRaw === "object" && !Array.isArray(criterionScoresRaw)) {
        for (const [key, value] of Object.entries(criterionScoresRaw as Record<string, unknown>)) {
          const n = Number(value);
          if (!Number.isNaN(n)) {
            criterionScores[key] = n;
          }
        }
      }

      const scoreValues = Object.values(criterionScores);
      let overallRating = Number(row.overallRating);
      if (Number.isNaN(overallRating)) {
        overallRating =
          scoreValues.length > 0 ? scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length : 4;
      }

      overallRating = clampReviewRating(overallRating);
      if (overallRating < 1) {
        return NextResponse.json(
          { error: `Initial review at index ${index} must have a valid overall rating (1–5).` },
          { status: 400 }
        );
      }

      const status = row.status === "pending" ? "pending" : "approved";
      if (status === "approved") {
        anyApprovedInitialReview = true;
      }

      await insertAdminSeededReview(
        client,
        {
          vendorId,
          reviewerName,
          reviewerEmail: String(row.reviewerEmail ?? "").trim() || null,
          title: String(row.title ?? "").trim() || null,
          body: String(row.body ?? "").trim() || null,
          overallRating,
          status,
          criterionScores
        },
        { refreshVendorAggregates: false }
      );
    }

    if (anyApprovedInitialReview) {
      await refreshVendorReviewAggregates(client, vendorId);
    }

    if (isMeilisearchConfigured()) {
      try {
        await syncMeilisearchIndexes();
      } catch {
        // Do not fail vendor creation if search sync is temporarily unavailable.
      }
    }

    return NextResponse.json({
      ok: true,
      vendor: {
        id: vendorId,
        vendorName: vendor.name as string,
        vendorSlug: vendor.slug as string,
        status: "active" as const,
        claimed: false,
        verified: false,
        categoryLabel: typeof primaryCategory?.name === "string" ? primaryCategory.name : "Vendor"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vendor creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
