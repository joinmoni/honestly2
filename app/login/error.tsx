"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type LoginErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LoginError({ reset }: LoginErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Sign In"
      title="We couldn't open sign in"
      description="The sign-in page didn't load properly. Try again, or return to the homepage and come back from there."
      secondaryLabel="Go home"
      secondaryHref="/"
      onRetry={reset}
    />
  );
}
