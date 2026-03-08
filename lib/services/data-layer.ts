import type { AppDataLayer } from "@/lib/services/contracts";
import { getDataProvider } from "@/lib/config/app-env";
import { mockDataLayer } from "@/lib/services/mock-data-layer";
import { getSupabaseDataLayer } from "@/lib/services/supabase-data-layer";

let activeDataLayer: AppDataLayer = mockDataLayer;
let cachedProvider: "mock" | "supabase" | null = null;
let hasManualOverride = false;

export function getDataLayer(): AppDataLayer {
  if (hasManualOverride) {
    return activeDataLayer;
  }

  const provider = getDataProvider();

  if (cachedProvider !== provider) {
    activeDataLayer = provider === "supabase" ? getSupabaseDataLayer() : mockDataLayer;
    cachedProvider = provider;
  }

  return activeDataLayer;
}

export function setDataLayer(dataLayer: AppDataLayer): void {
  activeDataLayer = dataLayer;
  hasManualOverride = true;
}

export function resetDataLayer(): void {
  activeDataLayer = mockDataLayer;
  cachedProvider = null;
  hasManualOverride = false;
}
