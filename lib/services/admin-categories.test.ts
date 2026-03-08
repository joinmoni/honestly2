import { getAdminTaxonomyData } from "@/lib/services/admin-categories";

describe("getAdminTaxonomyData", () => {
  it("returns taxonomy rows with nav and pagination metadata", async () => {
    const data = await getAdminTaxonomyData();

    expect(data.title).toBe("Platform Taxonomy");
    expect(data.navLinks.some((link) => link.id === "taxonomy" && link.active)).toBe(true);
    expect(data.categories[0]).toMatchObject({
      name: "Photography",
      slug: "photography",
      featuredOnHome: true,
      homeOrder: 1
    });
  });
});
