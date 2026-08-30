import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getTenderRadarEnv } from "@/lib/config/app-env";

export function getTenderRadarClient(): SupabaseClient {
  const env = getTenderRadarEnv();
  if (!env) {
    throw new Error("Tender Radar is not configured. Set TENDER_RADAR_SUPABASE_URL and TENDER_RADAR_SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
