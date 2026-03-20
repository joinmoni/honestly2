"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { CardTitle, MetaText } from "@/components/ui/Typography";
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
        <div className="relative mb-3 aspect-[186/237] overflow-hidden rounded-[1.5rem]">
          {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
          <span aria-hidden className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
            <Heart size={16} color="#444" />
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[1.8rem] leading-tight md:text-[2rem]">{vendor.name}</CardTitle>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              <span>★</span>
              <span>{vendor.ratingAvg.toFixed(1)}</span>
            </div>
          </div>
          <MetaText className="text-stone-400">
            {primarySubcategory?.name ?? vendor.primaryCategory?.name ?? "Vendor"}
            {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
          </MetaText>
          {vendor.headline ? <p className="line-clamp-1 text-[10px] italic text-stone-600">&quot;{vendor.headline}&quot;</p> : null}
        </div>
      </Link>
    </motion.div>
  );
}
