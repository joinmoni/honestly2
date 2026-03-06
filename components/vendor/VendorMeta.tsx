import { RatingStars } from "@/components/ui/RatingStars";

type VendorMetaProps = {
  ratingAvg: number;
  reviewCount: number;
  priceTier?: "$" | "$$" | "$$$";
  travels?: boolean;
};

export function VendorMeta({ ratingAvg, reviewCount, priceTier, travels }: VendorMetaProps) {
  return (
    <div className="surface flex flex-wrap items-center gap-4 p-4 text-sm">
      <div className="flex items-center gap-2">
        <RatingStars value={ratingAvg} size={14} />
        <span>{ratingAvg.toFixed(1)} ({reviewCount} reviews)</span>
      </div>
      {priceTier ? <span className="text-muted">{priceTier}</span> : null}
      <span className="text-muted">{travels ? "Travels to you" : "In-studio / on-location"}</span>
    </div>
  );
}
