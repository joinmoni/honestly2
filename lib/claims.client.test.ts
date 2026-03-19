import { submitVendorClaim } from "@/lib/claims.client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: vi.fn()
}));

const ORIGINAL_ENV = process.env;

function createTableMock() {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn().mockReturnThis()
  };
}

describe("claim client persistence", () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pk_test_123"
    };
    vi.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("falls back to a local submitted timestamp when Supabase is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    await expect(
      submitVendorClaim({
        vendorId: "ven-1",
        userId: "usr-1",
        claimantName: "Avery Johnson",
        email: "avery@example.com"
      })
    ).resolves.toEqual({
      submittedAt: expect.any(String)
    });
    expect(getSupabaseBrowserClient).not.toHaveBeenCalled();
  });

  it("inserts a new claim after resolving the profile id", async () => {
    const profileById = createTableMock();
    profileById.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    const profileByAuth = createTableMock();
    profileByAuth.maybeSingle.mockResolvedValueOnce({ data: { id: "profile-001" }, error: null });
    const claimsTable = createTableMock();

    const from = vi
      .fn()
      .mockReturnValueOnce(profileById)
      .mockReturnValueOnce(profileByAuth)
      .mockReturnValueOnce(claimsTable)
      .mockReturnValueOnce(claimsTable);

    vi.mocked(getSupabaseBrowserClient).mockReturnValue({ from } as never);

    await submitVendorClaim({
      vendorId: "ven-1",
      userId: "auth-user-123",
      claimantName: "Avery Johnson",
      email: "avery@example.com",
      note: "I run the studio."
    });

    expect(claimsTable.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        vendor_id: "ven-1",
        user_id: "profile-001",
        claimant_name: "Avery Johnson",
        verification_email: "avery@example.com",
        status: "pending"
      })
    );
  });
});
