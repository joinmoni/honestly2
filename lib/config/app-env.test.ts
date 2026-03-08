import { getDataProvider, getSupabasePublicEnv, getSupabaseServerEnv, isSupabaseConfigured } from "@/lib/config/app-env";

const ORIGINAL_ENV = process.env;

describe("app env", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.HONESTLY_DATA_PROVIDER;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("defaults to the mock data provider", () => {
    expect(getDataProvider()).toBe("mock");
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("reads public Supabase env when present", () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    expect(getDataProvider()).toBe("supabase");
    expect(getSupabasePublicEnv()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "pk_test_123"
    });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("reads server Supabase env only when the service key exists", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    expect(getSupabaseServerEnv()).toBeNull();

    process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_123";

    expect(getSupabaseServerEnv()).toEqual({
      url: "https://example.supabase.co",
      publishableKey: "pk_test_123",
      serviceRoleKey: "service_role_123"
    });
  });
});
