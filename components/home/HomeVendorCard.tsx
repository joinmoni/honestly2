"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import { CardTitle, MetaText } from "@/components/ui/Typography";
import { persistCreateListWithVendor, persistToggleVendorInList } from "@/lib/lists.client";
import type { SavedList, Vendor } from "@/lib/types/domain";

type HomeVendorCardProps = {
  vendor: Vendor;
  initialLists: SavedList[];
  currentUserId: string | null;
};

export function HomeVendorCard({ vendor, initialLists, currentUserId }: HomeVendorCardProps) {
  const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const primarySubcategory = vendor.subcategories[0];
  const [lists, setLists] = useState(initialLists);
  const [open, setOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const saveListOptions = lists.map((list) => ({
    id: list.id,
    name: list.name,
    itemCount: list.items.length,
    previewImageUrl: undefined,
    selected: list.items.some((item) => item.vendorId === vendor.id)
  }));

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="group cursor-pointer">
      <div className="relative mb-3 aspect-[186/237] overflow-hidden rounded-[1.5rem]">
        <Link href={`/vendor/${vendor.slug}`}>
          {cover ? <Image src={cover.url} alt={cover.alt ?? vendor.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
        </Link>
        <button
          type="button"
          className="absolute right-2.5 top-2.5 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={currentUserId ? "Save vendor to a list" : "Sign in to save this vendor to a list"}
          onClick={() => {
            if (!currentUserId) {
              setShowAuthPrompt(true);
              return;
            }
            setOpen(true);
          }}
        >
          <span aria-hidden>
            <Heart size={16} color="#444" />
          </span>
        </button>
      </div>
      <Link href={`/vendor/${vendor.slug}`}>
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
      <SaveToListModal
        open={open}
        contextImageUrl={cover?.url}
        lists={saveListOptions}
        onClose={() => setOpen(false)}
        onToggleList={async (listId) => {
          const nextLists = await persistToggleVendorInList(lists, listId, vendor.id);
          setLists(nextLists);
        }}
        onCreateCollection={async () => {
          if (!currentUserId) return;
          const nextLists = await persistCreateListWithVendor(lists, { userId: currentUserId, vendorId: vendor.id });
          setLists(nextLists);
        }}
        onDone={() => setOpen(false)}
      />
      {showAuthPrompt ? (
        <div className="mt-3 rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-stone-900">Sign in to add this vendor to a list.</p>
          <p className="mt-1 text-sm text-stone-500">Save vendors to your lists so you can share them with friends and family.</p>
          <div className="mt-3 flex gap-3">
            <Link href={`/login?next=${encodeURIComponent(`/vendor/${vendor.slug}`)}`} className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white">
              Sign in
            </Link>
            <button type="button" className="rounded-full border border-stone-200 px-4 py-2 text-sm" onClick={() => setShowAuthPrompt(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
