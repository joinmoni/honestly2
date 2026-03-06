"use client";

import { motion } from "framer-motion";

type AdminManagementHeaderProps = {
  title: string;
  statusLabel: string;
  statusState: "operational" | "degraded";
  onCreateCategory?: () => void;
};

export function AdminManagementHeader({ title, statusLabel, statusState, onCreateCategory }: AdminManagementHeaderProps) {
  return (
    <header className="mb-12 flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
      <div>
        <h1 className="mb-2 text-4xl">{title}</h1>
        <p className="text-stone-500">
          System status:{" "}
          <span className={statusState === "operational" ? "text-[10px] font-bold uppercase tracking-widest text-emerald-600" : "text-[10px] font-bold uppercase tracking-widest text-amber-600"}>
            {statusLabel}
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-bold transition-colors hover:bg-stone-50">
          Export Data
        </motion.button>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-stone-200" onClick={onCreateCategory}>
          + Create Category
        </motion.button>
      </div>
    </header>
  );
}
