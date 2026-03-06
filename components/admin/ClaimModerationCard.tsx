import type { VendorClaim } from "@/lib/types/domain";
import { Button } from "@/components/ui/Button";

type ClaimModerationCardProps = {
  claim: VendorClaim;
  onApprove?: (claimId: string) => void;
  onReject?: (claimId: string) => void;
};

export function ClaimModerationCard({ claim, onApprove, onReject }: ClaimModerationCardProps) {
  return (
    <article className="surface space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg">Claim {claim.id}</h4>
        <span className="text-xs uppercase tracking-[0.18em] text-muted">{claim.status}</span>
      </div>
      {claim.note ? <p className="text-sm text-muted">{claim.note}</p> : null}
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onReject?.(claim.id)}>
          Reject
        </Button>
        <Button onClick={() => onApprove?.(claim.id)}>Approve</Button>
      </div>
    </article>
  );
}
