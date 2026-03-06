"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin } from "lucide-react";
import type { Vendor } from "@/lib/types/domain";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { RatingStars } from "@/components/ui/RatingStars";

type VendorCardProps = {
  vendor: Vendor;
  isSaved?: boolean;
  onToggleSave?: (vendorId: string) => void;
};

export function VendorCard({ vendor, isSaved = false, onToggleSave }: VendorCardProps) {
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
  const primaryLocation = vendor.locations.find((location) => location.isPrimary) ?? vendor.locations[0];

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="surface overflow-hidden">
      <div className="relative h-52">
        {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /> : null}
        <div className="absolute right-3 top-3">
          <IconButton aria-label="Save vendor" active={isSaved} onClick={() => onToggleSave?.(vendor.id)}>
            <Heart size={16} className={isSaved ? "fill-current" : undefined} />
          </IconButton>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <Link href={`/vendor/${vendor.slug}`} className="text-lg font-semibold hover:underline">
            {vendor.name}
          </Link>
          {vendor.verified ? <Badge tone="success">Verified</Badge> : null}
        </div>

        <p className="text-sm text-muted">{vendor.primaryCategory?.name ?? "Vendor"}</p>
        {vendor.headline ? <p className="line-clamp-2 text-sm text-ink">{vendor.headline}</p> : null}

        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{primaryLocation ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}` : "Location TBD"}</span>
          </div>
          <span>{vendor.priceTier ?? ""}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <RatingStars value={vendor.ratingAvg} size={14} />
          <span className="font-medium text-ink">{vendor.ratingAvg.toFixed(1)}</span>
          <span className="text-muted">({vendor.reviewCount})</span>
        </div>
      </div>
    </motion.article>
  );
}
