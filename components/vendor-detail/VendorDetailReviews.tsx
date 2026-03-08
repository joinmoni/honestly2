import type { Review } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";
import { ReviewList } from "@/components/vendor/ReviewList";

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
  return (
    <section className="rounded-[2rem] border border-stone-200/80 bg-white px-5 py-6 shadow-sm shadow-stone-200/20 md:rounded-[2.25rem] md:px-10 md:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 md:mb-3 md:text-[10px] md:tracking-[0.22em]">Client Notes</p>
          <h2 className="text-3xl md:text-4xl">Kind Words <span className="ml-2 text-stone-300">({reviewCount})</span></h2>
        </div>
        <button
          type="button"
          className="self-start rounded-full bg-stone-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800 sm:self-auto md:px-6 md:text-[11px]"
          aria-label={leaveReviewLabel ?? profile.ctas.leaveReviewLabel}
          onClick={onLeaveReview}
        >
          {leaveReviewLabel ?? profile.ctas.leaveReviewLabel}
        </button>
      </div>
      <ReviewList
        reviews={reviews}
        currentUserId={currentUserId}
        onEditOwnReview={onEditOwnReview}
        showRubricSummary
        emptyTitle="No client notes yet"
        emptyDescription="Be the first to leave a detailed review and set the tone for this vendor profile."
      />
    </section>
  );
}
