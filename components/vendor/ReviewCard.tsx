import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Review } from "@/lib/types/domain";

type ReviewCardProps = {
  review: Review;
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="surface space-y-3 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{review.userName}</p>
          <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <Badge tone={review.status === "approved" ? "success" : "warning"}>{review.status}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <RatingStars value={review.overallRating} />
        <span className="text-sm font-medium">{review.overallRating.toFixed(1)}</span>
      </div>
      {review.title ? <h4 className="text-lg">{review.title}</h4> : null}
      {review.body ? <p className="text-sm text-muted">{review.body}</p> : null}
    </article>
  );
}
