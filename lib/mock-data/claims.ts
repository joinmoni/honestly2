import type { VendorClaim } from "@/lib/types/domain";

export const mockVendorClaims: VendorClaim[] = [
  {
    id: "claim-001",
    vendorId: "ven-golden-hour-stills",
    userId: "usr-001",
    claimantName: "Elena Vance",
    verification: {
      email: "elena@wildflowerarchive.com",
      instagram: "@wildflower",
      tiktok: "wildflower_stills"
    },
    status: "pending",
    note: "I am the lead designer and co-founder. You can verify my work via our website portfolio and the business email provided above.",
    createdAt: "2026-02-28T09:45:00.000Z"
  },
  {
    id: "claim-002",
    vendorId: "ven-the-glass-house",
    userId: "usr-001",
    claimantName: "Avery Johnson",
    verification: {
      instagram: "@glasshouseevents"
    },
    status: "rejected",
    note: "Previous request sent from a personal inbox without brand verification.",
    createdAt: "2025-08-14T09:45:00.000Z"
  },
  {
    id: "claim-003",
    vendorId: "ven-estate-silver-lake",
    userId: "usr-001",
    claimantName: "Morgan Lee",
    verification: {
      email: "team@silverlakedomain.com"
    },
    status: "approved",
    note: "Verified through business email and Instagram.",
    createdAt: "2025-11-02T11:15:00.000Z"
  }
];
