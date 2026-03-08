"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type SharedCollectionErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SharedCollectionError({ reset }: SharedCollectionErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Shared Collection"
      title="We couldn't open this shared list"
      description="This collection isn't loading right now. Try again, or explore the rest of Honestly while we catch up."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
