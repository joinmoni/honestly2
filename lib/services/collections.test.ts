import { getCollectionListCards, getListDetailPageData, getSavedVendorRows } from "@/lib/services/collections";

describe("collections services", () => {
  it("builds private list detail data for the owner", async () => {
    const data = await getListDetailPageData("usr-001", "list-summer-wedding-2026");

    expect(data).not.toBeNull();
    expect(data?.name).toBe("Summer Wedding 2026");
    expect(data?.visibility).toBe("private");
    expect(data?.vendorCount).toBe(3);
    expect(data?.vendors[0]?.vendorName).toBe("Wildflower Archive");
  });

  it("does not expose list detail data to another user", async () => {
    const data = await getListDetailPageData("usr-999", "list-summer-wedding-2026");

    expect(data).toBeNull();
  });

  it("builds list cards and saved rows from user lists", async () => {
    const [cards, rows] = await Promise.all([
      getCollectionListCards("usr-001"),
      getSavedVendorRows("usr-001")
    ]);

    expect(cards).toHaveLength(2);
    expect(cards[0]?.href).toBe("/lists/list-summer-wedding-2026");
    expect(rows.length).toBeGreaterThan(0);
  });
});
