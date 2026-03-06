import type { Review } from "@/lib/types/domain";
import { Button } from "@/components/ui/Button";

type ReviewModerationCardProps = {
  review: Review;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
};

export function ReviewModerationCard({ review, onApprove, onReject }: ReviewModerationCardProps) {
  return (
    <article className="surface space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg">{review.title ?? "Untitled review"}</h4>
        <span className="text-xs uppercase tracking-[0.18em] text-muted">{review.status}</span>
      </div>
      <p className="text-sm text-muted">{review.body}</p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onReject?.(review.id)}>
          Reject
        </Button>
        <Button onClick={() => onApprove?.(review.id)}>Approve</Button>
      </div>
    </article>
  );
}
