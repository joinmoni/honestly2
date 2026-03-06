import Image from "next/image";
import { useMemo } from "react";
import type { Review } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailReviewsProps = {
  reviewCount: number;
  reviews: Review[];
  profile: VendorProfile;
  onLeaveReview?: () => void;
  leaveReviewLabel?: string;
  currentUserId?: string;
  onEditOwnReview?: () => void;
};

export function VendorDetailReviews({
  reviewCount,
  reviews,
  profile,
  onLeaveReview,
  leaveReviewLabel,
  currentUserId,
  onEditOwnReview
}: VendorDetailReviewsProps) {
  const rubricSummary = useMemo(() => {
    const totals = new Map<string, { label: string; total: number; count: number }>();

    reviews.forEach((review) => {
      review.ratings.forEach((rating) => {
        const current = totals.get(rating.criterionId);
        if (current) {
          current.total += rating.score;
          current.count += 1;
          return;
        }

        totals.set(rating.criterionId, {
          label: rating.criterionName,
          total: rating.score,
          count: 1
        });
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
    <section className="rounded-[2.25rem] border border-stone-200/80 bg-white px-7 py-8 shadow-sm shadow-stone-200/30 md:px-10 md:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Client Notes</p>
          <h2 className="text-3xl md:text-4xl">Kind Words <span className="ml-2 text-stone-300">({reviewCount})</span></h2>
        </div>
        <button
          type="button"
          className="rounded-full bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800"
          aria-label={leaveReviewLabel ?? profile.ctas.leaveReviewLabel}
          onClick={onLeaveReview}
        >
          {leaveReviewLabel ?? profile.ctas.leaveReviewLabel}
        </button>
      </div>

      {rubricSummary.length ? (
        <div className="mb-8 grid gap-3 rounded-[1.8rem] border border-stone-100 bg-stone-50/80 p-5 md:grid-cols-3">
          {rubricSummary.map((item) => (
            <div key={item.label} className="rounded-[1.2rem] bg-white px-4 py-4">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{item.label}</p>
              <div className="flex items-end justify-between gap-4">
                <p className="text-2xl text-stone-900">{item.average.toFixed(1)}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-300">Average Score</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-stone-100">
                <div className="h-2 rounded-full bg-amber-500" style={{ width: `${(item.average / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-8">
        {reviews.map((review) => (
          <article key={review.id} className="rounded-[1.8rem] border border-stone-100 bg-stone-50/50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-stone-200">
                {review.userAvatar ? <Image src={review.userAvatar} alt={review.userName} fill sizes="40px" className="object-cover" /> : null}
              </div>
              <div>
                <p className="text-sm font-bold">{review.userName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                  {new Date(review.updatedAt).getTime() > new Date(review.createdAt).getTime() ? (
                    <>
                      <span className="text-stone-200">•</span>
                      <span className="text-[10px] italic text-stone-400">Edited</span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="ml-auto text-xs text-amber-400">
                {Array.from({ length: 5 })
                  .map((_, idx) => (idx < Math.round(review.overallRating) ? "★" : "☆"))
                  .join("")}
              </div>
            </div>
            {review.title ? <h5 className="mb-2 text-lg text-stone-900">{review.title}</h5> : null}
            {review.body ? <p className="text-sm italic leading-relaxed text-stone-600">&quot;{review.body}&quot;</p> : null}

            {review.ratings.length ? (
              <div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2 xl:grid-cols-3">
                {review.ratings.map((rating) => (
                  <div key={`${review.id}-${rating.criterionId}`} className="rounded-[1rem] bg-white px-4 py-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">{rating.criterionName}</p>
                      <p className="text-sm font-bold text-stone-900">{rating.score.toFixed(1)}</p>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100">
                      <div className="h-2 rounded-full bg-stone-900" style={{ width: `${(rating.score / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {currentUserId && review.userId === currentUserId ? (
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
        ))}
      </div>
    </section>
  );
}
