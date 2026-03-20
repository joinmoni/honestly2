"use client";

import { motion } from "framer-motion";
import { BodyText, MetaText, PageTitle } from "@/components/ui/Typography";

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
        <PageTitle className="mb-2 text-[2.8rem] leading-[0.98] md:text-[3.35rem]">{title}</PageTitle>
        <BodyText>
          System status:{" "}
          <MetaText className={statusState === "operational" ? "text-emerald-600" : "text-amber-600"}>
            {statusLabel}
          </MetaText>
        </BodyText>
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
