"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type RevenueRadarErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RevenueRadarError({ reset }: RevenueRadarErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Revenue Radar"
      title="We couldn't load opportunities"
      description="Something went wrong while loading Tender Radar. Try again, or head back home."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
