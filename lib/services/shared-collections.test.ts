import { getSharedCollectionBySlug } from "@/lib/services/shared-collections";

describe("shared collections service", () => {
  it("returns editorial shared collections by slug", async () => {
    const data = await getSharedCollectionBySlug("hudson-valley-wedding");

    expect(data).not.toBeNull();
    expect(data?.title).toBe("Hudson Valley Wedding");
  });

  it("falls back to public saved lists by share slug", async () => {
    const data = await getSharedCollectionBySlug("living-room-refresh");

    expect(data).not.toBeNull();
    expect(data?.title).toBe("Living Room Refresh");
    expect(data?.items).toHaveLength(2);
  });
});
