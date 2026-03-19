import { getSupabaseDataLayer } from "@/lib/services/supabase-data-layer";
import { getSupabaseServerSession } from "@/lib/supabase/server-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server-session", () => ({
  getSupabaseServerSession: vi.fn()
}));

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn()
}));

const ORIGINAL_ENV = process.env;

function createResolvedBuilder<T>(data: T, error: { message: string } | null = null) {
  return {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data, error }),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error })
  };
}

describe("supabase data layer wiring", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.HONESTLY_DATA_PROVIDER;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    vi.resetAllMocks();
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

  it("uses the Supabase-backed session methods when the provider is active", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    vi.mocked(getSupabaseServerSession).mockResolvedValue({
      user: {
        id: "usr-123",
        name: "Avery Johnson",
        email: "avery@example.com",
        role: "user",
        authProvider: "google"
      }
    });

    const dataLayer = getSupabaseDataLayer();

    await expect(dataLayer.getCurrentSession()).resolves.toEqual({
      user: {
        id: "usr-123",
        name: "Avery Johnson",
        email: "avery@example.com",
        role: "user",
        authProvider: "google"
      }
    });
  });

  it("maps vendor rows from Supabase into the shared vendor contract", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const vendorBuilder = createResolvedBuilder([
      {
        id: "ven-1",
        slug: "wildflower-archive",
        name: "Wildflower Archive",
        headline: "Ethereal arrangements for modern romantics.",
        description: "Fine-art floral studio.",
        verified: true,
        claimed: true,
        status: "active",
        rating_avg: "4.90",
        review_count: 124,
        price_tier: "$$$",
        travels: true,
        service_radius_km: 300,
        primary_category: {
          id: "cat-floral",
          slug: "floral-design",
          name: "Floral Design"
        },
        vendor_category_links: [
          {
            category: {
              id: "cat-floral",
              slug: "floral-design",
              name: "Floral Design"
            }
          }
        ],
        vendor_subcategory_links: [
          {
            subcategory: {
              id: "sub-fine-art-florals",
              slug: "fine-art-florals",
              name: "Fine Art Florals",
              category_id: "cat-floral"
            }
          }
        ],
        vendor_locations: [
          {
            id: "loc-1",
            label: "Studio",
            city: "Hudson Valley",
            region: "NY",
            country: "USA",
            is_primary: true
          }
        ],
        vendor_images: [
          {
            id: "img-2",
            url: "https://example.com/gallery.jpg",
            alt: "Gallery image",
            kind: "gallery",
            position: 2
          },
          {
            id: "img-1",
            url: "https://example.com/cover.jpg",
            alt: "Cover image",
            kind: "cover",
            position: 1
          }
        ],
        vendor_socials: [{ platform: "instagram", url: "https://instagram.com/wildflower" }]
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(vendorBuilder)
    } as never);

    const vendors = await getSupabaseDataLayer().getVendors();

    expect(vendors).toEqual([
      expect.objectContaining({
        id: "ven-1",
        slug: "wildflower-archive",
        ratingAvg: 4.9,
        priceTier: "$$$",
        primaryCategory: {
          id: "cat-floral",
          slug: "floral-design",
          name: "Floral Design"
        },
        categories: [{ id: "cat-floral", slug: "floral-design", name: "Floral Design" }],
        subcategories: [{ id: "sub-fine-art-florals", slug: "fine-art-florals", name: "Fine Art Florals" }],
        locations: [
          {
            id: "loc-1",
            label: "Studio",
            city: "Hudson Valley",
            region: "NY",
            country: "USA",
            isPrimary: true
          }
        ],
        images: [
          { id: "img-1", url: "https://example.com/cover.jpg", alt: "Cover image", kind: "cover" },
          { id: "img-2", url: "https://example.com/gallery.jpg", alt: "Gallery image", kind: "gallery" }
        ],
        socials: [{ platform: "instagram", url: "https://instagram.com/wildflower" }],
        travels: true,
        serviceRadiusKm: 300
      })
    ]);
  });

  it("derives a vendor profile from Supabase-backed vendor data", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const vendorBuilder = createResolvedBuilder([
      {
        id: "ven-1",
        slug: "golden-hour-stills",
        name: "Golden Hour Stills",
        headline: "Capturing the quiet moments in between.",
        description: "Golden Hour Stills documents celebrations with cinematic warmth and emotional framing.",
        verified: true,
        claimed: false,
        status: "active",
        rating_avg: "5.00",
        review_count: 29,
        price_tier: "$$",
        travels: true,
        service_radius_km: 250,
        primary_category: {
          id: "cat-photo",
          slug: "photography",
          name: "Photography"
        },
        vendor_category_links: [],
        vendor_subcategory_links: [],
        vendor_locations: [],
        vendor_images: [],
        vendor_socials: []
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(vendorBuilder)
    } as never);

    await expect(getSupabaseDataLayer().getVendorProfileByVendorId("ven-1")).resolves.toEqual({
      vendorId: "ven-1",
      aboutTitle: "About",
      aboutParagraphs: ["Golden Hour Stills documents celebrations with cinematic warmth and emotional framing."],
      serviceDetails: {
        categoryLabel: "Photography",
        priceRangeLabel: "$$ — $$$",
        availabilityLabel: "Now Booking"
      },
      ctas: {
        saveLabel: "Save",
        shareLabel: "Share",
        contactLabel: "Contact Vendor",
        leaveReviewLabel: "Leave a review",
        claimLabel: "Claim this page"
      }
    });
  });

  it("returns a single vendor by slug from Supabase", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const vendorBuilder = createResolvedBuilder({
      id: "ven-1",
      slug: "golden-hour-stills",
      name: "Golden Hour Stills",
      verified: true,
      claimed: false,
      status: "active",
      rating_avg: 5,
      review_count: 29,
      price_tier: "$$",
      travels: true,
      service_radius_km: 250,
      vendor_category_links: [],
      vendor_subcategory_links: [],
      vendor_locations: [],
      vendor_images: [],
      vendor_socials: []
    });

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(vendorBuilder)
    } as never);

    const vendor = await getSupabaseDataLayer().getVendorBySlug("golden-hour-stills");

    expect(vendor?.name).toBe("Golden Hour Stills");
    expect(vendorBuilder.eq).toHaveBeenCalledWith("slug", "golden-hour-stills");
  });

  it("maps categories and subcategories from Supabase", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const categoryBuilder = createResolvedBuilder([
      {
        id: "cat-photography",
        slug: "photography",
        name: "Photography",
        description: "Photographers for weddings and editorials.",
        subcategories: [
          {
            id: "sub-editorial",
            slug: "editorial",
            name: "Editorial",
            category_id: "cat-photography"
          }
        ]
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(categoryBuilder)
    } as never);

    const dataLayer = getSupabaseDataLayer();
    await expect(dataLayer.getCategories()).resolves.toEqual([
      {
        id: "cat-photography",
        slug: "photography",
        name: "Photography",
        description: "Photographers for weddings and editorials.",
        subcategories: [
          {
            id: "sub-editorial",
            slug: "editorial",
            name: "Editorial",
            categoryId: "cat-photography"
          }
        ]
      }
    ]);
    await expect(dataLayer.getCategoryBySlug("photography")).resolves.toEqual(
      expect.objectContaining({ slug: "photography" })
    );
    await expect(dataLayer.getSubcategoryBySlug("photography", "editorial")).resolves.toEqual({
      id: "sub-editorial",
      slug: "editorial",
      name: "Editorial",
      categoryId: "cat-photography"
    });
  });

  it("maps reviews from Supabase into the shared review contract", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const reviewBuilder = createResolvedBuilder([
      {
        id: "rev-001",
        vendor_id: "ven-wildflower-archive",
        user_id: "usr-001",
        overall_rating: "5.00",
        title: "The highlight of our wedding day",
        body: "Worth every penny.",
        status: "approved",
        created_at: "2025-10-12T10:22:00.000Z",
        updated_at: "2025-10-12T10:22:00.000Z",
        user_profile: {
          full_name: "Avery Johnson",
          avatar_url: "https://example.com/avatar.jpg"
        },
        review_ratings: [
          {
            score: "5.00",
            criterion: {
              id: "crit-quality",
              name: "Quality of Work"
            }
          },
          {
            score: "4.00",
            criterion: {
              id: "crit-communication",
              name: "Communication"
            }
          }
        ],
        review_social_suggestions: [{ platform: "instagram", url: "https://instagram.com/wildflower" }]
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(reviewBuilder)
    } as never);

    await expect(getSupabaseDataLayer().getReviews()).resolves.toEqual([
      {
        id: "rev-001",
        vendorId: "ven-wildflower-archive",
        userId: "usr-001",
        userName: "Avery Johnson",
        userAvatar: "https://example.com/avatar.jpg",
        overallRating: 5,
        title: "The highlight of our wedding day",
        body: "Worth every penny.",
        status: "approved",
        createdAt: "2025-10-12T10:22:00.000Z",
        updatedAt: "2025-10-12T10:22:00.000Z",
        ratings: [
          { criterionId: "crit-quality", criterionName: "Quality of Work", score: 5 },
          { criterionId: "crit-communication", criterionName: "Communication", score: 4 }
        ],
        socialsSuggested: [{ platform: "instagram", url: "https://instagram.com/wildflower" }]
      }
    ]);
  });

  it("maps rating criteria from Supabase in display order", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const criteriaBuilder = createResolvedBuilder([
      {
        id: "crit-communication",
        name: "Communication",
        description: "How responsive and clear was the vendor?",
        active: true,
        position: 1
      },
      {
        id: "crit-quality",
        name: "Quality of Work",
        description: "The aesthetic finish and craftsmanship.",
        active: true,
        position: 2
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(criteriaBuilder)
    } as never);

    await expect(getSupabaseDataLayer().getRatingCriteria()).resolves.toEqual([
      {
        id: "crit-communication",
        name: "Communication",
        description: "How responsive and clear was the vendor?",
        active: true,
        position: 1
      },
      {
        id: "crit-quality",
        name: "Quality of Work",
        description: "The aesthetic finish and craftsmanship.",
        active: true,
        position: 2
      }
    ]);
  });

  it("loads saved lists for a user by resolving auth user id to profile id", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const profileLookupById = createResolvedBuilder(null);
    const profileLookupByAuth = createResolvedBuilder({ id: "profile-001" });
    const listsBuilder = createResolvedBuilder([
      {
        id: "list-001",
        user_id: "profile-001",
        name: "Summer Wedding 2026",
        description: "Ceremony and reception vendor shortlist",
        is_public: false,
        share_slug: null,
        saved_list_items: [
          {
            vendor_id: "ven-wildflower-archive",
            note: "Top florist option",
            created_at: "2026-02-20T09:00:00.000Z"
          }
        ]
      }
    ]);

    const from = vi
      .fn()
      .mockReturnValueOnce(profileLookupById)
      .mockReturnValueOnce(profileLookupByAuth)
      .mockReturnValueOnce(listsBuilder);

    vi.mocked(getSupabaseServerClient).mockReturnValue({ from } as never);

    await expect(getSupabaseDataLayer().getListsByUserId("auth-user-123")).resolves.toEqual([
      {
        id: "list-001",
        userId: "profile-001",
        name: "Summer Wedding 2026",
        description: "Ceremony and reception vendor shortlist",
        isPublic: false,
        shareSlug: undefined,
        items: [
          {
            vendorId: "ven-wildflower-archive",
            note: "Top florist option",
            createdAt: "2026-02-20T09:00:00.000Z"
          }
        ]
      }
    ]);
    expect(profileLookupById.eq).toHaveBeenCalledWith("id", "auth-user-123");
    expect(profileLookupByAuth.eq).toHaveBeenCalledWith("auth_user_id", "auth-user-123");
    expect(listsBuilder.eq).toHaveBeenCalledWith("user_id", "profile-001");
  });

  it("loads a public list by share slug from Supabase", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const publicListBuilder = createResolvedBuilder({
      id: "list-002",
      user_id: "profile-001",
      name: "Living Room Refresh",
      description: "Styling references and interior vendors",
      is_public: true,
      share_slug: "living-room-refresh",
      saved_list_items: [
        {
          vendor_id: "ven-the-glass-house",
          note: null,
          created_at: "2026-02-20T09:00:00.000Z"
        }
      ]
    });

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(publicListBuilder)
    } as never);

    await expect(getSupabaseDataLayer().getPublicListByShareSlug("living-room-refresh")).resolves.toEqual({
      id: "list-002",
      userId: "profile-001",
      name: "Living Room Refresh",
      description: "Styling references and interior vendors",
      isPublic: true,
      shareSlug: "living-room-refresh",
      items: [
        {
          vendorId: "ven-the-glass-house",
          note: undefined,
          createdAt: "2026-02-20T09:00:00.000Z"
        }
      ]
    });
    expect(publicListBuilder.eq).toHaveBeenNthCalledWith(1, "share_slug", "living-room-refresh");
    expect(publicListBuilder.eq).toHaveBeenNthCalledWith(2, "is_public", true);
  });

  it("maps vendor claims from Supabase into the shared claim contract", async () => {
    process.env.HONESTLY_DATA_PROVIDER = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test_123";

    const claimsBuilder = createResolvedBuilder([
      {
        id: "claim-001",
        vendor_id: "ven-golden-hour-stills",
        user_id: "profile-001",
        claimant_name: "Elena Vance",
        verification_email: "elena@wildflowerarchive.com",
        verification_instagram: "@wildflower",
        verification_tiktok: "wildflower_stills",
        status: "pending",
        note: "Lead designer and co-founder.",
        created_at: "2026-02-28T09:45:00.000Z"
      }
    ]);

    vi.mocked(getSupabaseServerClient).mockReturnValue({
      from: vi.fn().mockReturnValue(claimsBuilder)
    } as never);

    await expect(getSupabaseDataLayer().getClaims()).resolves.toEqual([
      {
        id: "claim-001",
        vendorId: "ven-golden-hour-stills",
        userId: "profile-001",
        claimantName: "Elena Vance",
        verification: {
          email: "elena@wildflowerarchive.com",
          instagram: "@wildflower",
          tiktok: "wildflower_stills"
        },
        status: "pending",
        note: "Lead designer and co-founder.",
        createdAt: "2026-02-28T09:45:00.000Z"
      }
    ]);

    await expect(getSupabaseDataLayer().getClaimsByVendorId("ven-golden-hour-stills")).resolves.toEqual([
      expect.objectContaining({
        id: "claim-001",
        vendorId: "ven-golden-hour-stills"
      })
    ]);
  });
});
