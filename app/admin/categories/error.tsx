"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type AdminCategoriesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminCategoriesError({ reset }: AdminCategoriesErrorProps) {
  return (
    <RouteErrorScreen
      title="Admin categories failed to load"
      description="The taxonomy management screen could not load categories or merchandising controls."
      onRetry={reset}
    />
  );
}
