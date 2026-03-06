import { getAdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";

describe("getAdminRatingCriteriaData", () => {
  it("returns rubric data with the full admin nav including review rubric", async () => {
    const data = await getAdminRatingCriteriaData();

    expect(data.title).toBe("Review Rubric");
    expect(data.navLinks.some((link) => link.id === "rating-criteria" && link.active)).toBe(true);
    expect(data.criteria).toHaveLength(3);
  });
});
