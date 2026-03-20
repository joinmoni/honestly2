"use client";

import { useEffect, useMemo, useState } from "react";
import { VendorDetailReviews } from "@/components/vendor-detail/VendorDetailReviews";
import { ReviewFlowModal } from "@/components/vendor-detail/ReviewFlowModal";
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
  openRequest?: number;
};

export function VendorDetailReviewFlow({ vendorId, vendorName, profile, criteria, initialReviews, initialReviewCount, session, openRequest = 0 }: VendorDetailReviewFlowProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [open, setOpen] = useState(false);

  const existingUserReview = useMemo(() => {
    if (!session.user) return null;
    return reviews.find((review) => review.userId === session.user?.id) ?? null;
  }, [reviews, session.user]);

  useEffect(() => {
    if (openRequest > 0) {
      setOpen(true);
    }
  }, [openRequest]);

  return (
    <>
      <VendorDetailReviews
        reviewCount={reviewCount}
        reviews={reviews}
        profile={profile}
        leaveReviewLabel={existingUserReview ? "Edit your review" : profile.ctas.leaveReviewLabel}
        onLeaveReview={() => setOpen(true)}
        currentUserId={session.user?.id}
        onEditOwnReview={() => setOpen(true)}
      />

      <ReviewFlowModal
        open={open}
        vendorName={vendorName}
        criteria={criteria}
        initialValues={
          existingUserReview
            ? {
                overallRating: existingUserReview.overallRating,
                headline: existingUserReview.title ?? "",
                body: existingUserReview.body ?? "",
                criteria: Object.fromEntries(existingUserReview.ratings.map((rating) => [rating.criterionId, rating.score]))
              }
            : undefined
        }
        onClose={() => setOpen(false)}
        onDelete={() => {
          if (!existingUserReview) {
            setOpen(false);
            return;
          }

          setReviews((current) => current.filter((entry) => entry.id !== existingUserReview.id));
          setReviewCount((current) => Math.max(0, current - 1));
          setOpen(false);
        }}
        onSubmit={(values) => {
          if (!session.user) {
            setOpen(false);
            return;
          }

          const timestamp = new Date().toISOString();
          const ratings = criteria.map((criterion) => ({
            criterionId: criterion.id,
            criterionName: criterion.name,
            score: values.criteria[criterion.id] ?? 4
          }));

          const nextReview: Review = {
            id: existingUserReview?.id ?? `rev-${vendorId}-${session.user.id}`,
            vendorId,
            userId: session.user.id,
            userName: session.user.name,
            overallRating: values.overallRating,
            title: values.headline,
            body: values.body,
            status: "pending",
            createdAt: existingUserReview?.createdAt ?? timestamp,
            updatedAt: timestamp,
            ratings
          };

          if (existingUserReview) {
            setReviews((current) => current.map((entry) => (entry.id === existingUserReview.id ? nextReview : entry)));
          } else {
            setReviews((current) => [nextReview, ...current]);
            setReviewCount((current) => current + 1);
          }

          setOpen(false);
        }}
      />
    </>
  );
}
