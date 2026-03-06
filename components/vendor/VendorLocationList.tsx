import { MapPin } from "lucide-react";
import type { VendorLocation } from "@/lib/types/domain";

type VendorLocationListProps = {
  locations: VendorLocation[];
};

export function VendorLocationList({ locations }: VendorLocationListProps) {
  return (
    <ul className="space-y-2 text-sm text-muted">
      {locations.map((location) => (
        <li key={location.id} className="flex items-center gap-2">
          <MapPin size={14} />
          <span>
            {location.city}
            {location.region ? `, ${location.region}` : ""}
            {location.country ? `, ${location.country}` : ""}
            {location.isPrimary ? " (Primary)" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
