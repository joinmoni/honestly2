import { getDataLayer } from "@/lib/services/data-layer";
import type { VendorClaim } from "@/lib/types/domain";

export async function getClaims(): Promise<VendorClaim[]> {
  return getDataLayer().getClaims();
}

export async function getClaimsByVendorId(vendorId: string): Promise<VendorClaim[]> {
  return getDataLayer().getClaimsByVendorId(vendorId);
}
