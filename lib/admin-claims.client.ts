import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminClaimModerationItem } from "@/lib/types/admin-dashboard";

export async function updateAdminClaimStatus(
  claims: AdminClaimModerationItem[],
  claimId: string,
  status: "approved" | "rejected"
): Promise<AdminClaimModerationItem[]> {
  if (!isSupabaseConfigured()) {
    return claims.map((claim) => (claim.id === claimId ? { ...claim, status } : claim));
  }

  const supabase = getSupabaseBrowserClient();
  const targetClaim = claims.find((claim) => claim.id === claimId);

  const { error } = await supabase.from("vendor_claims").update({ status }).eq("id", claimId);

  if (error) {
    throw error;
  }

  if (status === "approved" && targetClaim) {
    const { error: vendorError } = await supabase
      .from("vendors")
      .update({ claimed: true })
      .eq("id", targetClaim.vendorId);

    if (vendorError) {
      throw vendorError;
    }
  }

  return claims.map((claim) => (claim.id === claimId ? { ...claim, status } : claim));
}
