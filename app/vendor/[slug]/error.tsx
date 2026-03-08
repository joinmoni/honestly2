"use client";

import { RouteErrorScreen } from "@/components/ui/RouteErrorScreen";

type VendorDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function VendorDetailError({ reset }: VendorDetailErrorProps) {
  return (
    <RouteErrorScreen
      eyebrow="Vendor Profile"
      title="This vendor profile isn't available right now"
      description="We couldn't load this vendor page at the moment. Try again, or head back to browse other vendors."
      secondaryLabel="Browse vendors"
      secondaryHref="/vendors"
      onRetry={reset}
    />
  );
}
