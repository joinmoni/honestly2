import { getClaimPageDataByVendorSlug } from "@/lib/services/claim-page";

describe("getClaimPageDataByVendorSlug", () => {
  it("returns existing pending state for seeded claim data", async () => {
    const data = await getClaimPageDataByVendorSlug("golden-hour-stills", "usr-001");

    expect(data).toMatchObject({
      vendorName: "Golden Hour Stills",
      state: "pending"
    });
  });

  it("returns default form state when no claim exists", async () => {
    const data = await getClaimPageDataByVendorSlug("wildflower-archive", "usr-001");

    expect(data).toMatchObject({
      vendorName: "Wildflower Archive",
      state: "form"
    });
  });
});
