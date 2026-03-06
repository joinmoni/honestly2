"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Vendor } from "@/lib/types/domain";

type HomeVendorCardProps = {
  vendor: Vendor;
};

export function HomeVendorCard({ vendor }: HomeVendorCardProps) {
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const primarySubcategory = vendor.subcategories[0];

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="group cursor-pointer">
      <Link href={`/vendor/${vendor.slug}`}>
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-3xl">
          {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
          <span aria-hidden className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
            <Heart size={18} color="#444" />
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display">{vendor.name}</h3>
            <div className="flex items-center gap-1 text-sm font-bold">
              <span>★</span>
              <span>{vendor.ratingAvg.toFixed(1)}</span>
            </div>
          </div>
          <p className="ui-meta text-stone-400">
            {primarySubcategory?.name ?? vendor.primaryCategory?.name ?? "Vendor"}
            {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
          </p>
          {vendor.headline ? <p className="line-clamp-1 text-[11px] italic text-stone-600">&quot;{vendor.headline}&quot;</p> : null}
        </div>
      </Link>
    </motion.div>
  );
}
