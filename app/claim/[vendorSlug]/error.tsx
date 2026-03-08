"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type ClaimErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ClaimError({ reset }: ClaimErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Claim This Business"
      title="We couldn't open this claim page"
      description="The claim flow isn't loading right now. Try again, or return to the vendor page and start from there."
      secondaryLabel="Browse vendors"
      secondaryHref="/vendors"
      onRetry={reset}
    />
  );
}
