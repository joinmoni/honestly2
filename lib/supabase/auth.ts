import type { EmailOtpType, Session, User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { clearSupabaseAccessTokenCookie, persistSupabaseAccessTokenCookie } from "@/lib/supabase/session-cookie";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_AUTH_REDIRECT_PATH = "/vendors";
const EMAIL_OTP_TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];

function normalizeNextPath(nextPath?: string): string {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }

  return nextPath;
}

/**
 * Base URL for OAuth / magic-link return paths. Prefer `NEXT_PUBLIC_SITE_URL` on production so
 * Supabase receives the same origin you list under Authentication → URL Configuration (avoids
 * falling back to the project's Site URL when it is still localhost).
 */
function getAuthRedirectOrigin(): string {
  if (typeof window === "undefined") {
    throw new Error("Auth redirects can only be created in the browser.");
  }

  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // ignore invalid env; fall back to current page origin
    }
  }

  return window.location.origin;
}

function getAuthRedirectUrl(nextPath?: string): string {
  const url = new URL("/auth/callback", getAuthRedirectOrigin());
  url.searchParams.set("next", normalizeNextPath(nextPath));
  return url.toString();
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length ? value.trim() : undefined;
}

function getResolvedAvatarUrl(user: {
  user_metadata?: Record<string, unknown>;
} | null | undefined): string | undefined {
  if (!user) return undefined;

  return readString(user.user_metadata?.avatar_url) ?? readString(user.user_metadata?.picture);
}

function readGoogleStyleName(meta: Record<string, unknown> | undefined): string | undefined {
  if (!meta) return undefined;
  const given = readString(meta.given_name as string | undefined);
  const family = readString(meta.family_name as string | undefined);
  if (given && family) return `${given} ${family}`;
  return given ?? family;
}

/**
 * Ensures a row exists in honestly_user_profiles for the signed-in user (OAuth / magic link).
 * DB trigger 0003 also inserts on auth.users signup; this covers users who signed up before that migration.
 */
async function ensureHonestlyUserProfileRow(session: Session): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const user = session.user;

  const emailRaw = readString(user.email) ?? readString(user.user_metadata?.email as string | undefined);
  if (!emailRaw) {
    return;
  }

  const email = emailRaw.toLowerCase();

  const fullName =
    readString(user.user_metadata?.full_name as string | undefined) ??
    readString(user.user_metadata?.name as string | undefined) ??
    readGoogleStyleName(user.user_metadata as Record<string, unknown>) ??
    email.split("@")[0] ?? email;

  const avatarUrl = getResolvedAvatarUrl(user as User) ?? null;
  const appProvider = (user.app_metadata as { provider?: string } | undefined)?.provider;
  const authProvider = appProvider === "google" ? ("google" as const) : null;

  const { data: existing, error: selectError } = await supabase
    .from("honestly_user_profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return;
  }

  const { error: insertError } = await supabase.from("honestly_user_profiles").insert({
    auth_user_id: user.id,
    email,
    full_name: fullName,
    role: "user",
    auth_provider: authProvider,
    avatar_url: avatarUrl
  });

  if (insertError) {
    throw insertError;
  }
}

export async function signInWithGoogle(nextPath?: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(nextPath)
    }
  });

  if (error) {
    throw error;
  }

  if (typeof window !== "undefined" && data.url) {
    window.location.assign(data.url);
  }
}

export async function signInWithEmailOtp(email: string, nextPath?: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl(nextPath)
    }
  });

  if (error) {
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  clearSupabaseAccessTokenCookie();

  if (error) {
    throw error;
  }
}

export async function updatePassword(nextPassword: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.updateUser({
    password: nextPassword
  });

  if (error) {
    throw error;
  }
}

export async function updateProfileAvatar(input: {
  userId: string;
  email: string;
  name: string;
  role: "user" | "admin";
  authProvider?: "google" | "password";
  avatarUrl: string | null;
}): Promise<string | undefined> {
  const supabase = getSupabaseBrowserClient();

  const { data: authData, error: authError } = await supabase.auth.updateUser({
    data: {
      avatar_url: input.avatarUrl
    }
  });

  if (authError) {
    throw authError;
  }

  const { error: profileError } = await supabase.from("honestly_user_profiles").upsert(
    {
      auth_user_id: input.userId,
      email: input.email,
      full_name: input.name,
      role: input.role,
      auth_provider: input.authProvider ?? "password",
      avatar_url: input.avatarUrl
    },
    { onConflict: "email" }
  );

  if (profileError) {
    throw profileError;
  }

  return getResolvedAvatarUrl(authData.user);
}

export async function getSupabaseSession(): Promise<Session | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getBrowserSupabaseSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (data.session?.access_token) {
    persistSupabaseAccessTokenCookie(data.session.access_token);
  }

  return data.session;
}

export async function completeBrowserAuthCallback(searchParams: URLSearchParams): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const nextPath = normalizeNextPath(searchParams.get("next") ?? undefined);
  const errorDescription = searchParams.get("error_description") ?? searchParams.get("error");
  const authCode = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const emailOtpType = type && EMAIL_OTP_TYPES.includes(type as EmailOtpType) ? (type as EmailOtpType) : undefined;

  if (errorDescription) {
    throw new Error(errorDescription);
  }

  if (authCode) {
    const { error } = await supabase.auth.exchangeCodeForSession(authCode);

    if (error) {
      throw error;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (sessionData.session?.access_token) {
      persistSupabaseAccessTokenCookie(sessionData.session.access_token);
    }

    if (sessionData.session) {
      await ensureHonestlyUserProfileRow(sessionData.session);
    }

    return nextPath;
  }

  if (tokenHash && emailOtpType) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: emailOtpType
    });

    if (error) {
      throw error;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (sessionData.session?.access_token) {
      persistSupabaseAccessTokenCookie(sessionData.session.access_token);
    }

    if (sessionData.session) {
      await ensureHonestlyUserProfileRow(sessionData.session);
    }

    return nextPath;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (data.session) {
    if (data.session.access_token) {
      persistSupabaseAccessTokenCookie(data.session.access_token);
    }

    await ensureHonestlyUserProfileRow(data.session);

    return nextPath;
  }

  throw new Error("This sign-in link is incomplete or has expired.");
}
