"use client";

import { motion } from "framer-motion";

import { BodyText, metaTextClassName, PillText, SectionTitle } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { AdminCategoryGroup } from "@/lib/types/admin-dashboard";

type AdminCategoriesSectionProps = {
  groups: AdminCategoryGroup[];
};

export function AdminCategoriesSection({ groups }: AdminCategoriesSectionProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 p-6">
        <SectionTitle className="text-xl italic md:text-2xl">Categories &amp; Subcategories</SectionTitle>
      </div>

      <div className="space-y-4 p-6">
        {groups.map((group) => (
          <motion.div key={group.id} whileHover={{ y: -1 }} className="flex flex-col gap-3 rounded-2xl bg-stone-50 p-4">
            <div className="flex items-center justify-between">
              <BodyText className="text-sm font-semibold text-stone-900">{group.name}</BodyText>
              <button type="button" className={cn(metaTextClassName, "transition-colors hover:text-stone-600")}>
                + Add Sub
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.subcategories.map((subcategory) => (
                <span
                  key={`${group.id}-${subcategory}`}
                  className="rounded-full border border-stone-200 bg-white px-3 py-1"
                >
                  <PillText className="text-stone-500">{subcategory}</PillText>
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
