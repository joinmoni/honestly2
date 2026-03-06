import type { VendorImage, VendorLocation } from "@/lib/types/domain";

export type VendorEditCopy = {
  businessLabel: string;
  editingPrefix: string;
  discardLabel: string;
  publishLabel: string;
  pageTitle: string;
  profileStatusPrefix: string;
  profileStatusLabel: string;
  sectionNarrativeLabel: string;
  sectionServiceAreasLabel: string;
  sectionGalleryLabel: string;
  headlineLabel: string;
  descriptionLabel: string;
  addLocationLabel: string;
  dragHintLabel: string;
  uploadLabel: string;
  unpublishTitle: string;
  unpublishDescription: string;
  unpublishActionLabel: string;
};

export type VendorEditPageData = {
  vendorId: string;
  vendorSlug: string;
  vendorName: string;
  headline: string;
  description: string;
  locations: VendorLocation[];
  images: VendorImage[];
  copy: VendorEditCopy;
};
