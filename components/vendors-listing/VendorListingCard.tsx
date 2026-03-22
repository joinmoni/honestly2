"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { VendorImageCarousel } from "@/components/vendors/VendorImageCarousel";
import { CardTitle, MetaText } from "@/components/ui/Typography";
import type { Vendor } from "@/lib/types/domain";

type VendorListingCardProps = {
  vendor: Vendor;
  saved: boolean;
  onSaveClick: (vendorId: string) => void;
};

export function VendorListingCard({ vendor, saved, onSaveClick }: VendorListingCardProps) {
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.22 }} className="group mx-auto w-[298px] cursor-pointer md:hover:-translate-y-0">
      <Link href={`/vendor/${vendor.slug}`} className="block">
        <VendorImageCarousel vendor={vendor} saved={saved} onSaveClick={onSaveClick} />
      </Link>

      <div className="space-y-2 px-1 pb-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-[1.8rem] leading-tight text-stone-900 md:text-[2rem]">{vendor.name}</CardTitle>
        </div>
        <div className="space-y-1">
          <MetaText className="text-stone-500">
            {vendor.primaryCategory?.name ?? "Vendor"}
            {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
          </MetaText>
          {vendor.headline ? <p className="line-clamp-2 text-[12px] leading-relaxed text-stone-600">&quot;{vendor.headline}&quot;</p> : null}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <p className="text-xs font-bold text-stone-900">{vendor.priceTier ? `${vendor.priceTier}${vendor.priceTier === "$$$" ? " — $$$$" : ""}` : "$$"}</p>
        </div>
      </div>
    </motion.article>
  );
}
