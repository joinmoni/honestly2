import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";

describe("getAdminVendorDirectoryData", () => {
  it("returns vendor moderation rows including suspended vendors", async () => {
    const data = await getAdminVendorDirectoryData();

    expect(data.navLinks.some((link) => link.id === "vendors" && link.active)).toBe(true);
    expect(data.vendors.some((vendor) => vendor.status === "suspended")).toBe(true);
    expect(data.vendors.find((vendor) => vendor.vendorSlug === "wildflower-archive")).toMatchObject({
      claimed: true,
      verified: true
    });
  });
});
