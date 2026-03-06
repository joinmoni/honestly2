import type { SavedList } from "@/lib/types/domain";

export const mockSavedLists: SavedList[] = [
  {
    id: "list-summer-wedding-2026",
    userId: "usr-001",
    name: "Summer Wedding 2026",
    description: "Ceremony and reception vendor shortlist",
    isPublic: false,
    items: [
      { vendorId: "ven-wildflower-archive", createdAt: "2026-02-20T09:00:00.000Z" },
      { vendorId: "ven-golden-hour-stills", createdAt: "2026-02-22T12:30:00.000Z" },
      { vendorId: "ven-the-glass-house", createdAt: "2026-02-23T14:30:00.000Z" }
    ]
  },
  {
    id: "list-living-room-refresh",
    userId: "usr-001",
    name: "Living Room Refresh",
    description: "Styling references and interior vendors",
    isPublic: true,
    shareSlug: "living-room-refresh",
    items: [
      { vendorId: "ven-the-glass-house", createdAt: "2026-02-20T09:00:00.000Z" },
      { vendorId: "ven-golden-hour-stills", createdAt: "2026-02-22T12:30:00.000Z" }
    ]
  }
];
