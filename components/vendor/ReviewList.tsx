import { useMemo } from "react";

import type { Review } from "@/lib/types/domain";
import { ReviewCard } from "@/components/vendor/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetaText } from "@/components/ui/Typography";

type ReviewListProps = {
  reviews: Review[];
  currentUserId?: string;
  onEditOwnReview?: () => void;
  showRubricSummary?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ReviewList({
  reviews,
  currentUserId,
  onEditOwnReview,
  showRubricSummary = false,
  emptyTitle = "No reviews yet",
  emptyDescription = "This profile has not received any published feedback yet."
}: ReviewListProps) {
  const rubricSummary = useMemo(() => {
    const totals = new Map<string, { label: string; total: number; count: number }>();

    reviews.forEach((review) => {
      review.ratings.forEach((rating) => {
        const current = totals.get(rating.criterionId);
        if (current) {
          current.total += rating.score;
          current.count += 1;
        } else {
          totals.set(rating.criterionId, {
            label: rating.criterionName,
            total: rating.score,
            count: 1
          });
        }
      });
    });

    return Array.from(totals.values())
      .map((item) => ({
        label: item.label,
        average: item.total / item.count
      }))
      .sort((a, b) => b.average - a.average);
  }, [reviews]);

  return (
    <div className="space-y-6">
      {!reviews.length ? (
        <EmptyState eyebrow="Reviews" title={emptyTitle} description={emptyDescription} />
      ) : null}

      {showRubricSummary && rubricSummary.length ? (
        <div className="grid gap-3 rounded-[1.8rem] border border-stone-100 bg-stone-50/80 p-5 md:grid-cols-3">
          {rubricSummary.map((item) => (
            <div key={item.label} className="rounded-[1.2rem] bg-white px-4 py-4">
              <MetaText className="mb-2">{item.label}</MetaText>
              <div className="flex items-end justify-between gap-4">
                <p className="text-lg text-stone-900 md:text-xl">{item.average.toFixed(1)}</p>
                <MetaText className="text-stone-300">Average Score</MetaText>
              </div>
              <div className="mt-3 h-2 rounded-full bg-stone-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(item.average / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} currentUserId={currentUserId} onEditOwnReview={onEditOwnReview} />
      ))}
    </div>
  );
}
