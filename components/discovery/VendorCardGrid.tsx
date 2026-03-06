import type { Vendor } from "@/lib/types/domain";
import { VendorCard } from "@/components/discovery/VendorCard";

type VendorCardGridProps = {
  vendors: Vendor[];
  savedVendorIds?: string[];
  onToggleSave?: (vendorId: string) => void;
};

export function VendorCardGrid({ vendors, savedVendorIds = [], onToggleSave }: VendorCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} isSaved={savedVendorIds.includes(vendor.id)} onToggleSave={onToggleSave} />
      ))}
    </div>
  );
}
