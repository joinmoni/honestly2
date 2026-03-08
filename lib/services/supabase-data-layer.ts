import { getDataProvider, isSupabaseConfigured } from "@/lib/config/app-env";
import { mockDataLayer } from "@/lib/services/mock-data-layer";
import type { AppDataLayer } from "@/lib/services/contracts";

export function getSupabaseDataLayer(): AppDataLayer {
  if (getDataProvider() === "supabase" && !isSupabaseConfigured()) {
    throw new Error("Supabase data provider selected but NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing.");
  }

  // HON-100 wires environment selection and config validation.
  // Full Supabase-backed services land in HON-101 through HON-113.
  return mockDataLayer;
}
