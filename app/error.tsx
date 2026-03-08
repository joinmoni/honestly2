"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Something went wrong"
      title="We couldn't load this page"
      description="Something went wrong on our side. Try again, or head back to keep exploring Honestly."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
