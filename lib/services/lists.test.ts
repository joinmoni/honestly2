import {
  createListWithVendor,
  getSavedVendorIds,
  isVendorSaved,
  toggleVendorInList
} from "@/lib/services/lists";
import type { SavedList } from "@/lib/types/domain";

const sampleLists: SavedList[] = [
  {
    id: "list-1",
    userId: "usr-001",
    name: "List One",
    isPublic: false,
    items: [
      { vendorId: "ven-1", createdAt: "2026-03-01T10:00:00.000Z" },
      { vendorId: "ven-2", createdAt: "2026-03-01T10:00:00.000Z" }
    ]
  },
  {
    id: "list-2",
    userId: "usr-001",
    name: "List Two",
    isPublic: false,
    items: [{ vendorId: "ven-2", createdAt: "2026-03-01T10:00:00.000Z" }]
  }
];

describe("list service helpers", () => {
  it("deduplicates saved vendor ids across lists", () => {
    expect(getSavedVendorIds(sampleLists)).toEqual(["ven-1", "ven-2"]);
  });

  it("detects whether a vendor is saved", () => {
    expect(isVendorSaved(sampleLists, "ven-1")).toBe(true);
    expect(isVendorSaved(sampleLists, "ven-missing")).toBe(false);
  });

  it("adds and removes vendors from a selected list", () => {
    const added = toggleVendorInList(sampleLists, "list-2", "ven-3");
    expect(added[1]?.items.some((item) => item.vendorId === "ven-3")).toBe(true);

    const removed = toggleVendorInList(sampleLists, "list-1", "ven-1");
    expect(removed[0]?.items.some((item) => item.vendorId === "ven-1")).toBe(false);
  });

  it("creates a new list seeded with the active vendor", () => {
    const next = createListWithVendor(sampleLists, {
      userId: "usr-001",
      vendorId: "ven-9"
    });

    expect(next).toHaveLength(3);
    expect(next[2]).toMatchObject({
      id: "list-new-3",
      userId: "usr-001",
      name: "New Collection 3"
    });
    expect(next[2]?.items[0]?.vendorId).toBe("ven-9");
  });
});
