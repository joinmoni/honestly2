"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Vendor } from "@/lib/types/domain";

type CategoryVendorCardProps = {
  vendor: Vendor;
};

export function CategoryVendorCard({ vendor }: CategoryVendorCardProps) {
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const style = vendor.subcategories[0]?.name ?? vendor.primaryCategory?.name ?? "Vendor";

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group cursor-pointer">
      <Link href={`/vendor/${vendor.slug}`}>
        <div className="relative mb-3 aspect-[186/237] overflow-hidden rounded-[1.5rem] bg-stone-100 shadow-sm transition-shadow hover:shadow-xl hover:shadow-stone-200/50">
          {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill className="h-full w-full object-cover" sizes="(max-width: 768px) 100vw, 33vw" /> : null}

          <div className="absolute right-2.5 top-2.5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} type="button" className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm" aria-label="Save vendor">
              <Heart size={16} color="#444" />
            </motion.button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">{vendor.name}</h3>
            <div className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">★ {vendor.ratingAvg.toFixed(1)}</div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            {style}
            {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
          </p>
          {vendor.headline ? <p className="text-[12px] italic leading-relaxed text-stone-500">&quot;{vendor.headline}&quot;</p> : null}
        </div>
      </Link>
    </motion.article>
  );
}
