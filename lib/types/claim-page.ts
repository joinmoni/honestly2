export type ClaimStatusView = "form" | "pending" | "approved" | "rejected";

export type ClaimPageCopy = {
  pageTitle: string;
  pageDescription: string;
  targetProfileLabel: string;
  contactIntroLabel: string;
  emailLabel: string;
  instagramLabel: string;
  tiktokLabel: string;
  relationshipLabel: string;
  relationshipPlaceholder: string;
  submitLabel: string;
  reviewNote: string;
  requiredContactMessage: string;
  pendingTitle: string;
  pendingDescription: string;
  approvedTitle: string;
  approvedDescription: string;
  rejectedTitle: string;
  rejectedDescription: string;
  resubmitLabel: string;
  submittedPrefix: string;
};

export type ClaimPageData = {
  vendorId: string;
  vendorSlug: string;
  vendorName: string;
  vendorImageUrl?: string;
  vendorCategoryLabel: string;
  vendorLocationLabel: string;
  state: ClaimStatusView;
  submittedAt?: string;
  rejectionReason?: string;
  initialContact: {
    email: string;
    instagram: string;
    tiktok: string;
  };
  initialNote: string;
  copy: ClaimPageCopy;
};
