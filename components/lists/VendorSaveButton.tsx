"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import type { SavedList, Vendor } from "@/lib/types/domain";
import {
  createListWithVendor,
  isVendorSaved,
  toggleVendorInList
} from "@/lib/services/lists";

type VendorSaveButtonProps = {
  vendor: Vendor;
  label: string;
  initialLists: SavedList[];
  currentUserId: string | null;
};

export function VendorSaveButton({
  vendor,
  label,
  initialLists,
  currentUserId
}: VendorSaveButtonProps) {
  const [lists, setLists] = useState(initialLists);
  const [open, setOpen] = useState(false);
  const saved = isVendorSaved(lists, vendor.id);

  const saveListOptions = lists.map((list) => {
    const selected = list.items.some((item) => item.vendorId === vendor.id);

    return {
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      previewImageUrl: undefined,
      selected
    };
  });

  const coverImageUrl = vendor.images.find((image) => image.kind === "cover")?.url ?? vendor.images[0]?.url;

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.96 }}
        animate={saved ? { scale: [1, 1.14, 1] } : { scale: 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-stone-200 px-6 py-3 text-sm font-medium transition-all hover:bg-stone-50 md:flex-none"
        aria-label={saved ? "Saved" : label}
        onClick={() => setOpen(true)}
      >
        <Heart size={16} className={saved ? "fill-stone-900 text-stone-900" : "text-stone-900"} />
        {saved ? "Saved" : label}
      </motion.button>

      <SaveToListModal
        open={open}
        contextImageUrl={coverImageUrl}
        lists={saveListOptions}
        onClose={() => setOpen(false)}
        onToggleList={(listId) => setLists((current) => toggleVendorInList(current, listId, vendor.id))}
        onCreateCollection={() => {
          if (!currentUserId) return;
          setLists((current) => createListWithVendor(current, { userId: currentUserId, vendorId: vendor.id }));
        }}
        onDone={() => setOpen(false)}
      />
    </>
  );
}
