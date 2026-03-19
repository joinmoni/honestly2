"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

type NewMoodboardCardProps = {
  label: string;
  onClick?: () => void;
};

export function NewMoodboardCard({ label, onClick }: NewMoodboardCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="group flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-stone-200 transition-colors hover:border-amber-400"
      onClick={onClick}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 transition-colors group-hover:bg-amber-50">
        <Plus className="text-stone-400 group-hover:text-amber-600" size={24} />
      </div>
      <span className="text-sm font-bold text-stone-400 group-hover:text-amber-800">{label}</span>
    </motion.button>
  );
}
