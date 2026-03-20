import Image from "next/image";

import { RatingStars } from "@/components/ui/RatingStars";
import { MetaText } from "@/components/ui/Typography";
import type { Review } from "@/lib/types/domain";

type ReviewCardProps = {
  review: Review;
  currentUserId?: string;
  onEditOwnReview?: () => void;
};

export function ReviewCard({ review, currentUserId, onEditOwnReview }: ReviewCardProps) {
  const isEditable = Boolean(currentUserId && review.userId === currentUserId);

  return (
    <article className="rounded-[1.8rem] border border-stone-100 bg-stone-50/50 p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-stone-200">
          {review.userAvatar ? <Image src={review.userAvatar} alt={review.userName} fill sizes="40px" className="object-cover" /> : null}
        </div>
        <div>
          <p className="text-sm font-bold">{review.userName}</p>
          <div className="flex items-center gap-2">
            <MetaText>
              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </MetaText>
            {new Date(review.updatedAt).getTime() > new Date(review.createdAt).getTime() ? (
              <>
                <span className="text-stone-200">•</span>
                <span className="text-[10px] italic text-stone-400">Edited</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <RatingStars value={review.overallRating} size={14} />
          <span className="text-sm font-bold text-stone-900">{review.overallRating.toFixed(1)}</span>
        </div>
      </div>

      {review.title ? <h4 className="mb-2 text-[15px] text-stone-900 md:text-base">{review.title}</h4> : null}
      {review.body ? <p className="text-sm italic leading-relaxed text-stone-600">&quot;{review.body}&quot;</p> : null}

      {review.ratings.length ? (
        <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
          {review.ratings.map((rating) => (
            <div key={`${review.id}-${rating.criterionId}`} className="rounded-[1rem] bg-white px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <MetaText className="tracking-[0.16em] text-stone-500">{rating.criterionName}</MetaText>
                <p className="text-xs font-bold text-stone-900">{rating.score.toFixed(1)}</p>
              </div>
              <div className="h-2 rounded-full bg-stone-100">
                <div className="h-2 rounded-full bg-stone-900" style={{ width: `${(rating.score / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isEditable ? (
        <div className="mt-4 flex justify-end border-t border-stone-50 pt-4">
          <button
            type="button"
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 underline underline-offset-4 transition-colors hover:text-stone-900"
            onClick={onEditOwnReview}
          >
            Edit your review
          </button>
        </div>
      ) : null}
    </article>
  );
}
