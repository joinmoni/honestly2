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

export type ListDetailVendorView = {
  vendorId: string;
  vendorSlug: string;
  vendorName: string;
  imageUrl?: string;
  categoryLabel: string;
  locationLabel: string;
  note?: string;
  savedAtLabel: string;
};

export type ListDetailPageData = {
  id: string;
  name: string;
  description?: string;
  visibility: "private" | "shared";
  shareSlug?: string;
  vendorCount: number;
  itemCountLabel: string;
  vendors: ListDetailVendorView[];
  copy: {
    brandLabel: string;
    backHref: string;
    backLabel: string;
    visibilityPrivateLabel: string;
    visibilitySharedLabel: string;
    shareLabel: string;
    notesHeading: string;
    emptyTitle: string;
    emptyDescription: string;
  };
};
