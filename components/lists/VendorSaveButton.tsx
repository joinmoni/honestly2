"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import { isVendorSaved, persistCreateListWithVendor, persistToggleVendorInList } from "@/lib/lists.client";
import type { SavedList, Vendor } from "@/lib/types/domain";

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
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
        onToggleList={async (listId) => {
          setPending(true);
          setErrorMessage(null);
          try {
            const nextLists = await persistToggleVendorInList(lists, listId, vendor.id);
            setLists(nextLists);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "This vendor could not be saved right now.");
          } finally {
            setPending(false);
          }
        }}
        onCreateCollection={async () => {
          if (!currentUserId) return;
          setPending(true);
          setErrorMessage(null);
          try {
            const nextLists = await persistCreateListWithVendor(lists, { userId: currentUserId, vendorId: vendor.id });
            setLists(nextLists);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "A new collection could not be created right now.");
          } finally {
            setPending(false);
          }
        }}
        onDone={() => setOpen(false)}
      />
      {errorMessage ? <p className="mt-3 text-xs text-rose-600">{errorMessage}</p> : null}
      {pending ? <p className="mt-3 text-xs text-stone-500">Updating saved vendors…</p> : null}
    </>
  );
}
