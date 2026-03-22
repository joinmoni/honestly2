import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/config/app-env";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error(
      "Supabase browser client requested before NEXT_PUBLIC_SUPABASE_URL and a client key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY) were configured."
    );
  }

  if (!browserClient) {
    browserClient = createClient(env.url, env.publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  return browserClient;
}
