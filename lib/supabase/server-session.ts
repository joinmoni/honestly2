import { cookies } from "next/headers";

import { mockAnonymousSession } from "@/lib/mock-data/session";
import { getSupabaseServerClient, getSupabaseServerClientForAccessToken } from "@/lib/supabase/server";
import { HONESTLY_SUPABASE_ACCESS_TOKEN_COOKIE } from "@/lib/supabase/session-cookie";
import type { MockSession } from "@/lib/types/domain";

type SupabaseUserLike = {
  id: string;
  email?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  identities?: Array<{
    provider?: string;
  }>;
};

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length ? value.trim() : undefined;
}

function getRoleFromJwt(user: SupabaseUserLike): "user" | "admin" {
  const appRole = readString(user.app_metadata?.role);
  const userRole = readString(user.user_metadata?.role);
  return appRole === "admin" || userRole === "admin" ? "admin" : "user";
}

function resolveSessionRole(user: SupabaseUserLike, profileRole: string | null | undefined): "user" | "admin" {
  if (readString(profileRole) === "admin") {
    return "admin";
  }

  return getRoleFromJwt(user);
}

function getAuthProvider(user: SupabaseUserLike): "google" | "password" {
  const appProvider = readString(user.app_metadata?.provider);
  const identityProvider = user.identities?.[0]?.provider;
  return appProvider === "google" || identityProvider === "google" ? "google" : "password";
}

function getDisplayName(user: SupabaseUserLike): string {
  return (
    readString(user.user_metadata?.full_name) ??
    readString(user.user_metadata?.name) ??
    readString(user.user_metadata?.user_name) ??
    readString(user.email)?.split("@")[0] ??
    "Honestly User"
  );
}

function getAvatarUrl(user: SupabaseUserLike): string | undefined {
  return readString(user.user_metadata?.avatar_url) ?? readString(user.user_metadata?.picture);
}

export function mapSupabaseUserToSession(
  user: SupabaseUserLike | null,
  profileRole?: string | null
): MockSession {
  if (!user || !user.email) {
    return mockAnonymousSession;
  }

  return {
    user: {
      id: user.id,
      name: getDisplayName(user),
      email: user.email,
      role: resolveSessionRole(user, profileRole),
      authProvider: getAuthProvider(user),
      avatarUrl: getAvatarUrl(user)
    }
  };
}

export async function getSupabaseServerSession(): Promise<MockSession> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(HONESTLY_SUPABASE_ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return mockAnonymousSession;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return mockAnonymousSession;
    }

    const user = data.user as SupabaseUserLike;
    const scoped = getSupabaseServerClientForAccessToken(accessToken);
    const { data: profile } = await scoped
      .from("honestly_user_profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    return mapSupabaseUserToSession(user, profile?.role as string | undefined);
  } catch {
    return mockAnonymousSession;
  }
}
