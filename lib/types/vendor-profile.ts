export type VendorProfile = {
  vendorId: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  serviceDetails: {
    categoryLabel: string;
    priceRangeLabel: string;
    availabilityLabel: string;
  };
  ctas: {
    saveLabel: string;
    shareLabel: string;
    contactLabel: string;
    leaveReviewLabel: string;
    claimLabel: string;
  };
};
