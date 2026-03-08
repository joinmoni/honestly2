"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type AdminVendorsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminVendorsError({ reset }: AdminVendorsErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Admin Vendors"
      title="We couldn't load the vendor directory"
      description="The admin vendor workspace isn't loading right now. Try again, or return to the admin dashboard."
      secondaryLabel="Admin dashboard"
      secondaryHref="/admin"
      onRetry={reset}
    />
  );
}
