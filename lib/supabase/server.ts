import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv, getSupabaseServerEnv } from "@/lib/config/app-env";

export function getSupabaseServerClient(): SupabaseClient {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error("Supabase server client requested before NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY were configured.");
  }

  return createClient(env.url, env.publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

/** Same anon key, but sends the user JWT so PostgREST/RLS see auth.uid() (e.g. read own profile row). */
export function getSupabaseServerClientForAccessToken(accessToken: string): SupabaseClient {
  const env = getSupabasePublicEnv();

  if (!env) {
    throw new Error("Supabase server client requested before NEXT_PUBLIC_SUPABASE_URL and a client key were configured.");
  }

  return createClient(env.url, env.publishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export function getSupabaseAdminClient(): SupabaseClient {
  const env = getSupabaseServerEnv();

  if (!env) {
    throw new Error("Supabase admin client requested before SUPABASE_SERVICE_ROLE_KEY was configured.");
  }

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
