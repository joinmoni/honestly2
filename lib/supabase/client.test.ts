import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const ORIGINAL_ENV = process.env;

describe("supabase browser client", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("throws if the public env is missing", () => {
    expect(() => getSupabaseBrowserClient()).toThrow(/Supabase browser client requested/i);
  });
});
