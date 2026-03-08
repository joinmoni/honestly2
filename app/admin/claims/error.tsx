"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type AdminClaimsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminClaimsError({ reset }: AdminClaimsErrorProps) {
  return (
    <RouteErrorScreen
      title="Admin claims moderation failed to load"
      description="The vendor-claim queue or moderation state could not be loaded for this admin route."
      onRetry={reset}
    />
  );
}
