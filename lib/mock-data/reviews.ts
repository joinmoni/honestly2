import type { RatingCriterion, Review } from "@/lib/types/domain";

export const mockRatingCriteria: RatingCriterion[] = [
  {
    id: "crit-communication",
    name: "Communication",
    description: "How responsive and clear was the vendor during the process?",
    active: true,
    position: 1
  },
  {
    id: "crit-quality",
    name: "Quality of Work",
    description: "The aesthetic finish, durability, and craftsmanship of the final result.",
    active: true,
    position: 2
  },
  {
    id: "crit-professionalism",
    name: "Professionalism",
    description: "General conduct and punctuality.",
    active: false,
    position: 3
  }
];

export const mockReviews: Review[] = [
  {
    id: "rev-001",
    vendorId: "ven-wildflower-archive",
    userId: "usr-001",
    userName: "Avery Johnson",
    userAvatar: "https://i.pravatar.cc/100?u=usr-001",
    overallRating: 5,
    title: "The highlight of our wedding day",
    body: "Elena brought our vision to life in a way I couldn't have imagined. The textures and the scent of the local peonies were breathtaking. Worth every penny.",
    status: "approved",
    createdAt: "2025-10-12T10:22:00.000Z",
    updatedAt: "2025-10-12T10:22:00.000Z",
    ratings: [
      { criterionId: "crit-quality", criterionName: "Quality", score: 5 },
      { criterionId: "crit-communication", criterionName: "Communication", score: 5 },
      { criterionId: "crit-value", criterionName: "Value", score: 5 }
    ]
  },
  {
    id: "rev-002",
    vendorId: "ven-golden-hour-stills",
    userId: "usr-001",
    userName: "Avery Johnson",
    overallRating: 4,
    title: "Sublime light and quiet professionalism",
    body: "Our photographer was a dream to work with. We are just waiting for the final gallery, but the sneak peeks are gorgeous.",
    status: "pending",
    createdAt: "2026-03-04T15:00:00.000Z",
    updatedAt: "2026-03-04T15:00:00.000Z",
    ratings: [
      { criterionId: "crit-quality", criterionName: "Quality", score: 5 },
      { criterionId: "crit-communication", criterionName: "Communication", score: 4 },
      { criterionId: "crit-value", criterionName: "Value", score: 4 }
    ]
  },
  {
    id: "rev-003",
    vendorId: "ven-the-glass-house",
    userId: "usr-001",
    userName: "Avery Johnson",
    overallRating: 3,
    title: "Needs one more edit",
    body: "This venue had beautiful light and a strong point of view, but I included contact details that need to be removed before resubmitting.",
    status: "rejected",
    createdAt: "2025-08-14T09:00:00.000Z",
    updatedAt: "2025-08-14T09:00:00.000Z",
    ratings: [
      { criterionId: "crit-quality", criterionName: "Quality", score: 4 },
      { criterionId: "crit-communication", criterionName: "Communication", score: 3 },
      { criterionId: "crit-value", criterionName: "Value", score: 3 }
    ]
  }
];
