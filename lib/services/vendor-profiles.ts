import { getDataLayer } from "@/lib/services/data-layer";
import type { VendorProfile } from "@/lib/types/vendor-profile";

export async function getVendorProfileByVendorId(vendorId: string): Promise<VendorProfile | null> {
  return getDataLayer().getVendorProfileByVendorId(vendorId);
}
