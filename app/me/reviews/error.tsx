"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type MyReviewsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MyReviewsError({ reset }: MyReviewsErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="My Reviews"
      title="We couldn't load your review history"
      description="Your review activity isn't available right now. Try again, or head back to your saved vendors."
      secondaryLabel="Saved vendors"
      secondaryHref="/lists"
      onRetry={reset}
    />
  );
}
