"use client";

import { useMemo } from "react";

import { VendorDetailReviews } from "@/components/vendor-detail/VendorDetailReviews";
import type { MockSession, RatingCriterion, Review } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailReviewFlowProps = {
  vendorId: string;
  vendorName: string;
  profile: VendorProfile;
  criteria: RatingCriterion[];
  initialReviews: Review[];
  initialReviewCount: number;
  session: MockSession;
  onLeaveReviewNavigate?: () => void;
};

export function VendorDetailReviewFlow({
  vendorId,
  vendorName,
  profile,
  criteria,
  initialReviews,
  initialReviewCount,
  session,
  onLeaveReviewNavigate
}: VendorDetailReviewFlowProps) {
  void vendorId;
  void vendorName;
  void criteria;

  const existingUserReview = useMemo(() => {
    if (!session.user) return null;
    return initialReviews.find((review) => review.userId === session.user?.id) ?? null;
  }, [initialReviews, session.user]);

  return (
    <VendorDetailReviews
      reviewCount={initialReviewCount}
      reviews={initialReviews}
      profile={profile}
      leaveReviewLabel={existingUserReview ? "Edit your review" : profile.ctas.leaveReviewLabel}
      onLeaveReview={onLeaveReviewNavigate}
      currentUserId={session.user?.id}
      onEditOwnReview={onLeaveReviewNavigate}
    />
  );
}
