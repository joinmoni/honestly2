export type AdminNavLink = {
  id: string;
  label: string;
  href: string;
  count?: number;
  active?: boolean;
};

export type AdminClaimItem = {
  id: string;
  vendorName: string;
  requesterEmail: string;
  initial: string;
};

export type AdminCategoryGroup = {
  id: string;
  name: string;
  subcategories: string[];
};

export type AdminDirectoryItem = {
  id: string;
  vendorName: string;
  statusLabel: string;
  statusTone: "active" | "suspended";
  verificationLabel: string;
};

export type AdminDashboardData = {
  brandLabel: string;
  title: string;
  statusLabel: string;
  statusState: "operational" | "degraded";
  navLinks: AdminNavLink[];
  claims: AdminClaimItem[];
  categories: AdminCategoryGroup[];
  directory: AdminDirectoryItem[];
};

export type AdminReviewFilter = "pending" | "approved" | "rejected";

export type AdminReviewModerationItem = {
  id: string;
  vendorId: string;
  vendorName: string;
  reviewerName: string;
  reviewerEmail: string;
  submittedDate: string;
  reviewTitle?: string;
  reviewBody?: string;
  overallRating: number;
  status: "pending" | "approved" | "rejected";
};

export type AdminReviewModerationData = {
  brandLabel: string;
  title: string;
  description: string;
  navLinks: AdminNavLink[];
  filters: Array<{
    id: AdminReviewFilter;
    label: string;
    count: number;
  }>;
  reviews: AdminReviewModerationItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  };
};

export type AdminClaimFilter = "pending" | "approved" | "rejected";

export type AdminClaimModerationItem = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategoryLabel: string;
  vendorImageUrl?: string;
  claimantName: string;
  claimantEmail?: string;
  claimantInstagram?: string;
  claimantTiktok?: string;
  note?: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
};

export type AdminClaimsModerationData = {
  brandLabel: string;
  title: string;
  description: string;
  navLinks: AdminNavLink[];
  filters: Array<{
    id: AdminClaimFilter;
    label: string;
    count: number;
  }>;
  claims: AdminClaimModerationItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  };
};

export type AdminTaxonomyCategoryItem = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  muted?: boolean;
};

export type AdminTaxonomyData = {
  brandLabel: string;
  title: string;
  description: string;
  createCategoryLabel: string;
  navLinks: AdminNavLink[];
  categories: AdminTaxonomyCategoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  };
};

export type AdminVendorDirectoryItem = {
  id: string;
  vendorName: string;
  vendorSlug: string;
  imageUrl?: string;
  status: "active" | "suspended";
  claimed: boolean;
  verified: boolean;
  categoryLabel: string;
};

export type AdminVendorDirectoryData = {
  brandLabel: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  navLinks: AdminNavLink[];
  vendors: AdminVendorDirectoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageNumbers: number[];
  };
};
