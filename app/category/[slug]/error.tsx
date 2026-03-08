"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type CategoryErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CategoryError({ reset }: CategoryErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Category Page"
      title="We couldn't load this category"
      description="This category page isn't available right now. Try again, or browse the full vendor directory instead."
      secondaryLabel="Browse vendors"
      secondaryHref="/vendors"
      onRetry={reset}
    />
  );
}
