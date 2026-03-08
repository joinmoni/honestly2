"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type AdminReviewsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminReviewsError({ reset }: AdminReviewsErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Admin Reviews"
      title="We couldn't load review moderation"
      description="The moderation queue isn't available right now. Try again, or head back to the admin dashboard."
      secondaryLabel="Admin dashboard"
      secondaryHref="/admin"
      onRetry={reset}
    />
  );
}
