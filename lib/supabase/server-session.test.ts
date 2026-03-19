import { getSupabaseServerSession, mapSupabaseUserToSession } from "@/lib/supabase/server-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn()
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn()
}));

describe("supabase server session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps Supabase user metadata into the shared session shape", () => {
    expect(
      mapSupabaseUserToSession({
        id: "usr-123",
        email: "avery@example.com",
        app_metadata: { provider: "google", role: "admin" },
        user_metadata: {
          full_name: "Avery Johnson",
          avatar_url: "https://images.example.com/avery.jpg"
        },
        identities: [{ provider: "google" }]
      })
    ).toEqual({
      user: {
        id: "usr-123",
        name: "Avery Johnson",
        email: "avery@example.com",
        role: "admin",
        authProvider: "google",
        avatarUrl: "https://images.example.com/avery.jpg"
      }
    });
  });

  it("returns an anonymous session when the auth cookie is missing", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined)
    });

    await expect(getSupabaseServerSession()).resolves.toEqual({ user: null });
    expect(getSupabaseServerClient).not.toHaveBeenCalled();
  });

  it("reads the access token cookie and resolves the current user", async () => {
    cookiesMock.mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "token-123" })
    });

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "usr-123",
              email: "avery@example.com",
              app_metadata: { provider: "email" },
              user_metadata: { full_name: "Avery Johnson" }
            }
          },
          error: null
        })
      }
    } as never);

    await expect(getSupabaseServerSession()).resolves.toEqual({
      user: {
        id: "usr-123",
        name: "Avery Johnson",
        email: "avery@example.com",
        role: "user",
        authProvider: "password",
        avatarUrl: undefined
      }
    });
  });
});
