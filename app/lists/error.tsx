"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type ListsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ListsError({ reset }: ListsErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Saved Lists"
      title="We couldn't open your lists"
      description="Your saved vendors or collections didn't load properly. Try again, or head back to browsing and return in a moment."
      secondaryLabel="Browse vendors"
      secondaryHref="/vendors"
      onRetry={reset}
    />
  );
}
