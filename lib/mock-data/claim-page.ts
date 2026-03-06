import type { ClaimPageCopy } from "@/lib/types/claim-page";

export const mockClaimPageCopy: ClaimPageCopy = {
  pageTitle: "Claim your profile",
  pageDescription: "Verify your business to manage your presence on Honestly.",
  targetProfileLabel: "Target Profile",
  contactIntroLabel: "Provide at least one verification method",
  emailLabel: "Professional Email",
  instagramLabel: "Instagram handle or link",
  tiktokLabel: "TikTok handle or link",
  relationshipLabel: "Relationship Note",
  relationshipPlaceholder: "Explain your role in the business...",
  submitLabel: "Submit Claim Request",
  reviewNote: "All claims are manually reviewed by our curators.",
  requiredContactMessage: "Add at least one of email, Instagram, or TikTok.",
  pendingTitle: "Claim under review",
  pendingDescription: "Your request has been received. Our team is verifying the business details before granting access.",
  approvedTitle: "Claim approved",
  approvedDescription: "This profile is now linked to your account. You can continue into the vendor dashboard from here.",
  rejectedTitle: "Claim needs another edit",
  rejectedDescription: "Your original request could not be verified. Update your contact details and resubmit.",
  resubmitLabel: "Fix & Re-submit",
  submittedPrefix: "Submitted"
};
