import type { Review } from "@/lib/types/domain";

export type MyReviewsFilter = "all" | "published" | "under-review";

export type MyReviewsPageCopy = {
  brandLabel: string;
  savedNavLabel: string;
  reviewsNavLabel: string;
  heading: string;
  description: string;
  allFilterLabel: string;
  publishedFilterLabel: string;
  underReviewFilterLabel: string;
  reviewForLabel: string;
  publishedBadgeLabel: string;
  underReviewBadgeLabel: string;
  rejectedBadgeLabel: string;
  submittedLabel: string;
  moderatedLabel: string;
  moderatorNoteLabel: string;
  editLabel: string;
  viewPageLabel: string;
  resubmitLabel: string;
};

export type MyReviewItemView = {
  review: Review;
  vendorName: string;
  vendorSlug: string;
  submittedText: string;
  moderatorNote?: string;
};

export type MyReviewsPageData = {
  copy: MyReviewsPageCopy;
  filters: Array<{
    id: MyReviewsFilter;
    label: string;
    count: number;
  }>;
  reviews: MyReviewItemView[];
};
