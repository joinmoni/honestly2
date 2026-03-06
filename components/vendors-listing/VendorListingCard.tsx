"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Vendor } from "@/lib/types/domain";

type VendorListingCardProps = {
  vendor: Vendor;
  saved: boolean;
  onSaveClick: (vendorId: string) => void;
};

export function VendorListingCard({ vendor, saved, onSaveClick }: VendorListingCardProps) {
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];

  return (
    <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.22 }} className="group cursor-pointer">
      <Link href={`/vendor/${vendor.slug}`}>
        <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.75rem]">
          {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" /> : null}
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            className="absolute right-3 top-3 rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white"
            onClick={(event) => {
              event.preventDefault();
              onSaveClick(vendor.id);
            }}
            aria-label="Save vendor"
          >
            <Heart size={18} className={saved ? "fill-rose-500 text-rose-500" : "stroke-white group-hover:stroke-stone-900"} />
          </motion.button>
        </div>
      </Link>

      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-serif text-stone-900">{vendor.name}</h3>
          <div className="flex items-center gap-1 pt-1 text-xs font-bold">
            <span>★</span>
            <span>{vendor.ratingAvg.toFixed(2)}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="ui-meta text-stone-500">
            {vendor.primaryCategory?.name ?? "Vendor"}
            {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
          </p>
          {vendor.headline ? <p className="text-[11px] italic leading-relaxed text-stone-400">&quot;{vendor.headline}&quot;</p> : null}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <p className="text-xs font-bold text-stone-900">{vendor.priceTier ? `${vendor.priceTier}${vendor.priceTier === "$$$" ? " — $$$$" : ""}` : "$$"}</p>
        </div>
      </div>
    </motion.article>
  );
}
