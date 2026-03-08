"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type VendorEditErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function VendorEditError({ reset }: VendorEditErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Vendor Dashboard"
      title="We couldn't open the edit workspace"
      description="This vendor editing page isn't loading right now. Try again, or come back after returning to the dashboard."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
