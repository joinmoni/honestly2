import { Button } from "@/components/ui/Button";
import { BodyText, CardTitle, MetaText } from "@/components/ui/Typography";
import type { VendorClaim } from "@/lib/types/domain";

type ClaimModerationCardProps = {
  claim: VendorClaim;
  onApprove?: (claimId: string) => void;
  onReject?: (claimId: string) => void;
};

export function ClaimModerationCard({ claim, onApprove, onReject }: ClaimModerationCardProps) {
  return (
    <article className="surface space-y-3 p-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Claim {claim.id}</CardTitle>
        <MetaText className="normal-case tracking-normal text-stone-500">{claim.status}</MetaText>
      </div>
      {claim.note ? <BodyText className="text-sm text-stone-500">{claim.note}</BodyText> : null}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onReject?.(claim.id)}>
          Reject
        </Button>
        <Button onClick={() => onApprove?.(claim.id)}>Approve</Button>
      </div>
    </article>
  );
}
