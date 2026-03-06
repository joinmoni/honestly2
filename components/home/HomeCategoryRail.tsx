"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HomeCategoryShortcut } from "@/lib/types/home";

type HomeCategoryRailProps = {
  shortcuts: HomeCategoryShortcut[];
};

export function HomeCategoryRail({ shortcuts }: HomeCategoryRailProps) {
  return (
    <section className="border-t border-stone-100 py-16">
      <div className="scrollbar-hide flex items-center justify-start gap-8 overflow-x-auto pb-4 md:justify-center">
        {shortcuts.map((shortcut, index) => (
          <motion.div key={shortcut.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }} transition={{ duration: 0.24, delay: index * 0.04 }}>
            <Link href={shortcut.href} className="group flex min-w-[80px] cursor-pointer flex-col items-center gap-2">
              <span className="rounded-2xl bg-stone-100 p-4 text-2xl transition-colors group-hover:bg-amber-50">{shortcut.emoji}</span>
              <span className="ui-meta text-stone-500">{shortcut.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
