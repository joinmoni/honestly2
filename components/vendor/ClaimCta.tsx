import Link from "next/link";
import { Button } from "@/components/ui/Button";

type ClaimCtaProps = {
  vendorSlug: string;
};

export function ClaimCta({ vendorSlug }: ClaimCtaProps) {
  return (
    <div className="surface flex items-center justify-between gap-4 p-4">
      <div>
        <p className="font-semibold">Own this listing?</p>
        <p className="text-sm text-muted">Claim your profile to manage details and respond to reviews.</p>
      </div>
      <Link href={`/claim/${vendorSlug}`}>
        <Button variant="secondary">Claim vendor</Button>
      </Link>
    </div>
  );
}
