import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getTenderRadarEnv } from "@/lib/config/app-env";

export function getTenderRadarClient(): SupabaseClient {
  const env = getTenderRadarEnv();
  if (!env) {
    throw new Error(
      "Tender Radar is not configured. Set TENDER_RADAR_SUPABASE_URL and TENDER_RADAR_SUPABASE_SECRET_KEY (or PUBLISHABLE_KEY)."
    );
  }
  return createClient(env.url, env.apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
