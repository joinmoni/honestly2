import { getMyReviewsPageData } from "@/lib/services/my-reviews";

describe("getMyReviewsPageData", () => {
  it("returns seeded review history for the mock user with filter counts", async () => {
    const data = await getMyReviewsPageData("usr-001");

    expect(data.reviews).toHaveLength(3);
    expect(data.filters).toEqual([
      expect.objectContaining({ id: "all", count: 3 }),
      expect.objectContaining({ id: "published", count: 1 }),
      expect.objectContaining({ id: "under-review", count: 1 })
    ]);
    expect(data.reviews[0]).toMatchObject({
      vendorName: "Golden Hour Stills",
      review: expect.objectContaining({ status: "pending" })
    });
  });
});
