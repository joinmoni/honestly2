import { getSupabaseDataLayer } from "@/lib/services/supabase-data-layer";

const ORIGINAL_ENV = process.env;

describe("supabase data layer wiring", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.HONESTLY_DATA_PROVIDER;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws when supabase is selected without required public env", () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";

    expect(() => getSupabaseDataLayer()).toThrow(/Supabase data provider selected/i);
  });

  it("returns the current placeholder layer once env is present", () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    expect(getSupabaseDataLayer()).toBeDefined();
  });
});
