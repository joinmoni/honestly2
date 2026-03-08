"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type AdminRatingCriteriaErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminRatingCriteriaError({ reset }: AdminRatingCriteriaErrorProps) {
  return (
    <RouteErrorScreen
      title="Rating criteria failed to load"
      description="The scoring rubric configuration screen could not load its current criteria data."
      onRetry={reset}
    />
  );
}
