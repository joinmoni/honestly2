import { getDataLayer } from "@/lib/services/data-layer";
import { getClaimsByVendorId } from "@/lib/services/claims";
import { getVendorBySlug } from "@/lib/services/vendors";
import type { ClaimPageData } from "@/lib/types/claim-page";

function formatSubmittedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export async function getClaimPageDataByVendorSlug(
  vendorSlug: string,
  userId: string
): Promise<ClaimPageData | null> {
  const [vendor, copy] = await Promise.all([getVendorBySlug(vendorSlug), getDataLayer().getClaimPageCopy()]);
  if (!vendor) return null;

  const claims = await getClaimsByVendorId(vendor.id);
  const existingClaim = claims.find((claim) => claim.userId === userId) ?? null;
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];

  return {
    vendorId: vendor.id,
    vendorSlug: vendor.slug,
    vendorName: vendor.name,
    vendorImageUrl: cover?.url,
    vendorCategoryLabel: vendor.primaryCategory?.name ?? "Vendor",
    vendorLocationLabel: location ? `${location.city}${location.region ? `, ${location.region}` : ""}` : "Location TBD",
    state:
      existingClaim?.status === "pending"
        ? "pending"
        : existingClaim?.status === "approved"
          ? "approved"
          : existingClaim?.status === "rejected"
            ? "rejected"
            : "form",
    submittedAt: existingClaim ? formatSubmittedDate(existingClaim.createdAt) : undefined,
    rejectionReason:
      existingClaim?.status === "rejected"
        ? "We couldn't verify ownership from the original request. Add a business email or active social account that clearly matches the brand."
        : undefined,
    initialContact: {
      email: existingClaim?.note?.includes("@") ? existingClaim.note : "",
      instagram: "",
      tiktok: ""
    },
    initialNote: existingClaim?.note ?? "",
    copy
  };
}
