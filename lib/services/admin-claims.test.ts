import { getAdminClaimsModerationData } from "@/lib/services/admin-claims";

describe("getAdminClaimsModerationData", () => {
  it("builds pending, approved, and rejected claim moderation rows", async () => {
    const data = await getAdminClaimsModerationData();

    expect(data.filters).toEqual([
      expect.objectContaining({ id: "pending", count: 1 }),
      expect.objectContaining({ id: "approved", count: 1 }),
      expect.objectContaining({ id: "rejected", count: 1 })
    ]);
    expect(data.claims[0]).toMatchObject({
      claimantName: "Elena Vance"
    });
  });
});
