export type CollectionsPageCopy = {
  brandLabel: string;
  pageTitle: string;
  pageDescription: string;
  createListLabel: string;
  newMoodboardLabel: string;
  allSavedVendorsTitle: string;
  addToListLabel: string;
  visibilityPrivateLabel: string;
  visibilitySharedLabel: string;
};

export type CollectionsListCardView = {
  id: string;
  name: string;
  href: string;
  visibility: "private" | "shared";
  vendorCount: number;
  previewImageUrls: string[];
  extraCount: number;
};

export type SavedVendorRowView = {
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  imageUrl?: string;
  categoryLabel: string;
  locationLabel: string;
};
