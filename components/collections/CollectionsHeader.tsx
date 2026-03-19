"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { CollectionsPageCopy } from "@/lib/types/collections";

type CollectionsHeaderProps = {
  copy: CollectionsPageCopy;
  onCreateList?: () => void;
};

export function CollectionsHeader({ copy, onCreateList }: CollectionsHeaderProps) {
  return (
    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-xl">
        <h1 className="mb-4 text-5xl">{copy.pageTitle}</h1>
        <p className="text-stone-500">{copy.pageDescription}</p>
      </div>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 rounded-2xl bg-stone-900 px-8 py-4 font-semibold text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800"
        onClick={onCreateList}
      >
        <Plus size={18} />
        {copy.createListLabel}
      </motion.button>
    </div>
  );
}
