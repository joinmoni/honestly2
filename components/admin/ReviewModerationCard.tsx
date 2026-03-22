import { Button } from "@/components/ui/Button";
import { BodyText, CardTitle, MetaText } from "@/components/ui/Typography";
import type { Review } from "@/lib/types/domain";

type ReviewModerationCardProps = {
  review: Review;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
};

export function ReviewModerationCard({ review, onApprove, onReject }: ReviewModerationCardProps) {
  return (
    <article className="surface space-y-3 p-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{review.title ?? "Untitled review"}</CardTitle>
        <MetaText className="normal-case tracking-normal text-stone-500">{review.status}</MetaText>
      </div>
      <BodyText className="text-sm text-stone-500">{review.body}</BodyText>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onReject?.(review.id)}>
          Reject
        </Button>
        <Button onClick={() => onApprove?.(review.id)}>Approve</Button>
      </div>
    </article>
  );
}
