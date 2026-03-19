import type { EmailOtpType, Session } from "@supabase/supabase-js";

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

function getAuthRedirectUrl(nextPath?: string): string {
  if (typeof window === "undefined") {
    throw new Error("Auth redirects can only be created in the browser.");
  }

  const url = new URL("/auth/callback", window.location.origin);
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

export async function signInWithGoogle(nextPath?: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthRedirectUrl(nextPath)
    }
  });

  if (error) {
    throw error;
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

  const { error: profileError } = await supabase.from("user_profiles").upsert(
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

    return nextPath;
  }

  throw new Error("This sign-in link is incomplete or has expired.");
}
