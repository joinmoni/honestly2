export const HONESTLY_SUPABASE_ACCESS_TOKEN_COOKIE = "honestly-sb-access-token";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function persistSupabaseAccessTokenCookie(accessToken: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${HONESTLY_SUPABASE_ACCESS_TOKEN_COOKIE}=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearSupabaseAccessTokenCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${HONESTLY_SUPABASE_ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
