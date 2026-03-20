import {
  getDataProvider,
  getMeilisearchAdminEnv,
  getMeilisearchEnv,
  getSearchProvider,
  getSupabasePublicEnv,
  getSupabaseServerEnv,
  isMeilisearchConfigured,
  isSupabaseConfigured
} from "@/lib/config/app-env";

const ORIGINAL_ENV = process.env;

describe("app env", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.HONESTLY_DATA_PROVIDER;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.HONESTLY_SEARCH_PROVIDER;
    delete process.env.MEILISEARCH_HOST;
    delete process.env.MEILISEARCH_API_KEY;
    delete process.env.MEILISEARCH_ADMIN_API_KEY;
    delete process.env.HONESTLY_SEARCH_SYNC_TOKEN;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("defaults to the mock data provider", () => {
    expect(getDataProvider()).toBe("mock");
    expect(getSearchProvider()).toBe("database");
    expect(isSupabaseConfigured()).toBe(false);
    expect(isMeilisearchConfigured()).toBe(false);
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

  it("reads Meilisearch env when present", () => {
    process.env.HONESTLY_SEARCH_PROVIDER = "meilisearch";
    process.env.MEILISEARCH_HOST = "http://localhost:7700";
    process.env.MEILISEARCH_API_KEY = "masterKey";

    expect(getSearchProvider()).toBe("meilisearch");
    expect(getMeilisearchEnv()).toEqual({
      host: "http://localhost:7700",
      apiKey: "masterKey"
    });
    expect(isMeilisearchConfigured()).toBe(true);
  });

  it("reads Meilisearch admin env for indexing operations", () => {
    process.env.MEILISEARCH_HOST = "http://localhost:7700";
    process.env.MEILISEARCH_ADMIN_API_KEY = "adminKey";
    process.env.HONESTLY_SEARCH_SYNC_TOKEN = "syncToken";

    expect(getMeilisearchAdminEnv()).toEqual({
      host: "http://localhost:7700",
      adminApiKey: "adminKey",
      syncToken: "syncToken"
    });
  });
});
