"use client";

import { motion } from "framer-motion";
import type { AdminCategoryGroup } from "@/lib/types/admin-dashboard";

type AdminCategoriesSectionProps = {
  groups: AdminCategoryGroup[];
};

export function AdminCategoriesSection({ groups }: AdminCategoriesSectionProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 p-6">
        <h2 className="text-xl italic">Categories &amp; Subcategories</h2>
      </div>

      <div className="space-y-4 p-6">
        {groups.map((group) => (
          <motion.div key={group.id} whileHover={{ y: -1 }} className="flex flex-col gap-3 rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{group.name}</span>
              <button type="button" className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                + Add Sub
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.subcategories.map((subcategory) => (
                <span key={`${group.id}-${subcategory}`} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] font-bold text-stone-500">
                  {subcategory}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
