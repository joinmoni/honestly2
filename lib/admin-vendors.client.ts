import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminVendorDirectoryItem } from "@/lib/types/admin-dashboard";

export async function updateAdminVendorStatus(
  vendors: AdminVendorDirectoryItem[],
  vendorId: string,
  status: "active" | "suspended"
): Promise<AdminVendorDirectoryItem[]> {
  if (!isSupabaseConfigured()) {
    return vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("vendors").update({ status }).eq("id", vendorId);

  if (error) {
    throw error;
  }

  return vendors.map((vendor) => (vendor.id === vendorId ? { ...vendor, status } : vendor));
}
