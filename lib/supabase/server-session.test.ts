import { getSupabaseServerSession, mapSupabaseUserToSession } from "@/lib/supabase/server-session";
import { getSupabaseServerClient, getSupabaseServerClientForAccessToken } from "@/lib/supabase/server";

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn()
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn(),
  getSupabaseServerClientForAccessToken: vi.fn()
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

  it("treats the user as admin when honestly_user_profiles.role is admin (without JWT role)", () => {
    expect(
      mapSupabaseUserToSession(
        {
          id: "usr-123",
          email: "onedebos@gmail.com",
          app_metadata: { provider: "google", providers: ["google"] },
          user_metadata: { full_name: "Adebola Adeniran", name: "Adebola Adeniran" },
          identities: [{ provider: "google" }]
        },
        "admin"
      )
    ).toEqual({
      user: {
        id: "usr-123",
        name: "Adebola Adeniran",
        email: "onedebos@gmail.com",
        role: "admin",
        authProvider: "google",
        avatarUrl: undefined
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

    const profileScoped = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: { role: "user" }, error: null })
    };

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

    vi.mocked(getSupabaseServerClientForAccessToken).mockReturnValue({
      from: vi.fn().mockReturnValue(profileScoped)
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

    expect(getSupabaseServerClientForAccessToken).toHaveBeenCalledWith("token-123");
    expect(profileScoped.maybeSingle).toHaveBeenCalled();
  });
});
