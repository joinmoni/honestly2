import { completeBrowserAuthCallback, getBrowserSupabaseSession, signInWithEmailOtp, signInWithGoogle, updatePassword, updateProfileAvatar } from "@/lib/supabase/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: vi.fn()
}));

const ORIGINAL_ENV = process.env;

function createBrowserClientMock() {
  return {
    auth: {
      signInWithOAuth: vi.fn(),
      signInWithOtp: vi.fn(),
      updateUser: vi.fn(),
      getSession: vi.fn(),
      exchangeCodeForSession: vi.fn(),
      verifyOtp: vi.fn()
    },
    from: vi.fn()
  };
}

function createTableMock() {
  return {
    upsert: vi.fn().mockResolvedValue({ error: null })
  };
}

describe("supabase auth helpers", () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pk_test_123"
    };
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/login");
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("passes the callback URL into Google sign-in", async () => {
    const browserClient = createBrowserClientMock();
    browserClient.auth.signInWithOAuth.mockResolvedValue({ error: null });
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await signInWithGoogle("/lists");

    expect(browserClient.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=%2Flists`
      }
    });
  });

  it("passes the callback URL into email OTP sign-in", async () => {
    const browserClient = createBrowserClientMock();
    browserClient.auth.signInWithOtp.mockResolvedValue({ error: null });
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await signInWithEmailOtp("avery@example.com", "/vendor/golden-hour-stills");

    expect(browserClient.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "avery@example.com",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=%2Fvendor%2Fgolden-hour-stills`
      }
    });
  });

  it("returns null for browser session checks when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    await expect(getBrowserSupabaseSession()).resolves.toBeNull();
    expect(getSupabaseBrowserClient).not.toHaveBeenCalled();
  });

  it("exchanges an auth code and returns the next path", async () => {
    const browserClient = createBrowserClientMock();
    browserClient.auth.exchangeCodeForSession.mockResolvedValue({ error: null });
    browserClient.auth.getSession.mockResolvedValue({
      data: { session: { access_token: "token-123" } },
      error: null
    });
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await expect(completeBrowserAuthCallback(new URLSearchParams("code=abc123&next=/lists"))).resolves.toBe("/lists");
    expect(browserClient.auth.exchangeCodeForSession).toHaveBeenCalledWith("abc123");
  });

  it("verifies OTP callbacks when token hash links are used", async () => {
    const browserClient = createBrowserClientMock();
    browserClient.auth.verifyOtp.mockResolvedValue({ error: null });
    browserClient.auth.getSession.mockResolvedValue({
      data: { session: { access_token: "token-123" } },
      error: null
    });
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await expect(completeBrowserAuthCallback(new URLSearchParams("token_hash=tok123&type=magiclink&next=/vendors"))).resolves.toBe("/vendors");
    expect(browserClient.auth.verifyOtp).toHaveBeenCalledWith({
      token_hash: "tok123",
      type: "magiclink"
    });
  });

  it("updates the signed-in user's password", async () => {
    const browserClient = createBrowserClientMock();
    browserClient.auth.updateUser.mockResolvedValue({ error: null });
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await updatePassword("new-password-123");

    expect(browserClient.auth.updateUser).toHaveBeenCalledWith({
      password: "new-password-123"
    });
  });

  it("updates the profile avatar in auth metadata and user_profiles", async () => {
    const browserClient = createBrowserClientMock();
    const table = createTableMock();
    browserClient.auth.updateUser.mockResolvedValue({
      data: {
        user: {
          user_metadata: {
            avatar_url: "data:image/png;base64,abc123"
          }
        }
      },
      error: null
    });
    browserClient.from.mockReturnValue(table);
    vi.mocked(getSupabaseBrowserClient).mockReturnValue(browserClient as never);

    await expect(
      updateProfileAvatar({
        userId: "usr-123",
        email: "avery@example.com",
        name: "Avery Johnson",
        role: "user",
        authProvider: "google",
        avatarUrl: "data:image/png;base64,abc123"
      })
    ).resolves.toBe("data:image/png;base64,abc123");

    expect(browserClient.auth.updateUser).toHaveBeenCalledWith({
      data: {
        avatar_url: "data:image/png;base64,abc123"
      }
    });
    expect(table.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        auth_user_id: "usr-123",
        email: "avery@example.com",
        full_name: "Avery Johnson",
        avatar_url: "data:image/png;base64,abc123"
      }),
      { onConflict: "email" }
    );
  });
});
