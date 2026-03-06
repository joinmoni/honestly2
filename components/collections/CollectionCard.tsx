"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionsListCardView } from "@/lib/types/collections";

type CollectionCardProps = {
  list: CollectionsListCardView;
  privateLabel: string;
  sharedLabel: string;
};

export function CollectionCard({ list, privateLabel, sharedLabel }: CollectionCardProps) {
  const [first, second, third] = list.previewImageUrls;
  const visibilityLabel = list.visibility === "private" ? privateLabel : sharedLabel;
  const showCollage = Boolean(first && second && third && list.extraCount > 0);

  return (
    <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group cursor-pointer">
      <Link href={list.href}>
        <div className="mb-4 aspect-video overflow-hidden rounded-3xl border border-stone-200 bg-stone-100">
          {showCollage ? (
            <div className="grid h-full grid-cols-2 gap-1">
              <div className="relative h-full">
                <Image src={first} alt={list.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 30vw" />
              </div>
              <div className="grid h-full grid-rows-2 gap-1">
                <div className="relative h-full">
                  <Image src={second} alt={list.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 30vw" />
                </div>
                <div className={cn("relative flex items-center justify-center bg-stone-200 text-sm font-bold text-stone-500")}>
                  <Image src={third} alt={list.name} fill className="object-cover opacity-65" sizes="(max-width:768px) 100vw, 30vw" />
                  <span className="relative z-10">+{list.extraCount}</span>
                </div>
              </div>
            </div>
          ) : first ? (
            <div className="relative h-full w-full">
              <Image src={first} alt={list.name} fill className="object-cover opacity-60" sizes="(max-width:768px) 100vw, 30vw" />
            </div>
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl">{list.name}</h3>
          <p className="text-sm font-medium text-stone-400">
            {list.vendorCount} vendors • {visibilityLabel}
          </p>
        </div>
        <button type="button" className="rounded-full p-2 hover:bg-stone-100" aria-label="List options">
          <MoreHorizontal size={20} />
        </button>
      </div>
    </motion.article>
  );
}
