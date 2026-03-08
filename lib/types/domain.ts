export type VendorLocation = {
  id: string;
  label?: string;
  city: string;
  region?: string;
  country?: string;
  isPrimary: boolean;
};

export type VendorImage = {
  id: string;
  url: string;
  alt?: string;
  kind: "cover" | "gallery" | "logo";
};

export type VendorSocial = {
  platform: "instagram" | "tiktok" | "facebook" | "website";
  url: string;
};

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  headline?: string;
  description?: string;
  verified: boolean;
  claimed: boolean;
  status: "active" | "suspended";
  ratingAvg: number;
  reviewCount: number;
  priceTier?: "$" | "$$" | "$$$";
  primaryCategory?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  locations: VendorLocation[];
  images: VendorImage[];
  socials: VendorSocial[];
  travels?: boolean;
  serviceRadiusKm?: number | null;
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  subcategories: Subcategory[];
};

export type ReviewCriterionRating = {
  criterionId: string;
  criterionName: string;
  score: number;
};

export type Review = {
  id: string;
  vendorId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  overallRating: number;
  title?: string;
  body?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  ratings: ReviewCriterionRating[];
  socialsSuggested?: VendorSocial[];
};

export type RatingCriterion = {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  position: number;
};

export type SavedListItem = {
  vendorId: string;
  note?: string;
  createdAt: string;
};

export type SavedList = {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareSlug?: string;
  items: SavedListItem[];
};

export type VendorClaim = {
  id: string;
  vendorId: string;
  userId: string;
  claimantName?: string;
  verification?: {
    email?: string;
    instagram?: string;
    tiktok?: string;
  };
  status: "pending" | "approved" | "rejected";
  note?: string;
  createdAt: string;
};

export type MockSession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    authProvider?: "google" | "password";
    avatarUrl?: string;
  } | null;
};
