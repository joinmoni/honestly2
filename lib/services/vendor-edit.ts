import { getDataLayer } from "@/lib/services/data-layer";
import { getVendorProfileByVendorId } from "@/lib/services/vendor-profiles";
import { getVendorBySlug } from "@/lib/services/vendors";
import type { VendorEditPageData } from "@/lib/types/vendor-edit";

export async function getVendorEditPageDataBySlug(vendorSlug: string): Promise<VendorEditPageData | null> {
  const [vendor, copy] = await Promise.all([getVendorBySlug(vendorSlug), getDataLayer().getVendorEditCopy()]);
  if (!vendor) return null;

  const profile = await getVendorProfileByVendorId(vendor.id);
  if (!profile) return null;

  return {
    vendorId: vendor.id,
    vendorSlug: vendor.slug,
    vendorName: vendor.name,
    headline: vendor.headline ?? "",
    description: vendor.description ?? profile.aboutParagraphs.join("\n\n"),
    locations: vendor.locations,
    images: vendor.images,
    copy
  };
}
