import type { Vendor } from "@/lib/types/domain";

export type SharedCollectionItem = {
  vendorId: string;
  blurb: string;
};

export type SharedCollection = {
  shareSlug: string;
  title: string;
  description: string;
  curatorName: string;
  curatorAvatarUrl: string;
  curatorAttribution: string;
  items: SharedCollectionItem[];
};

export type SharedCollectionViewItem = {
  vendor: Vendor;
  blurb: string;
};

export type SharedCollectionPageData = {
  shareSlug: string;
  title: string;
  description: string;
  curatorName: string;
  curatorAvatarUrl: string;
  items: SharedCollectionViewItem[];
  copy: {
    brandLabel: string;
    navFollowListLabel: string;
    navSignUpLabel: string;
    heroBylineLabel: string;
    viewProfileLabel: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimaryButtonLabel: string;
    ctaSecondaryButtonLabel: string;
    footerLabel: string;
  };
};
