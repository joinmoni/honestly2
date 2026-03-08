import { getAdminSession, getAnonymousSession, getCurrentSession } from "@/lib/services/session";

describe("session services", () => {
  it("returns the current signed-in session", async () => {
    const session = await getCurrentSession();

    expect(session.user?.email).toBe("avery@example.com");
    expect(session.user?.authProvider).toBe("google");
  });

  it("returns the anonymous session", async () => {
    const session = await getAnonymousSession();

    expect(session.user).toBeNull();
  });

  it("returns the admin session", async () => {
    const session = await getAdminSession();

    expect(session.user?.role).toBe("admin");
  });
});
