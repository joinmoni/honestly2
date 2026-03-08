"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type VendorsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function VendorsError({ reset }: VendorsErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Vendor Directory"
      title="We couldn't load vendors right now"
      description="The vendor directory is having trouble loading. Try again, or head back home and start a new search."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
