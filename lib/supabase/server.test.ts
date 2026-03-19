import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

const ORIGINAL_ENV = process.env;

describe("supabase server clients", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws if the shared server env is missing", () => {
    expect(() => getSupabaseServerClient()).toThrow(/Supabase server client requested/i);
  });

  it("throws if the admin service role key is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    expect(() => getSupabaseAdminClient()).toThrow(/Supabase admin client requested/i);
  });
});
