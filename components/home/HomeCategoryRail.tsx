"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HomeCategoryShortcut } from "@/lib/types/home";

type HomeCategoryRailProps = {
  shortcuts: HomeCategoryShortcut[];
};

export function HomeCategoryRail({ shortcuts }: HomeCategoryRailProps) {
  return (
    <section className="border-t border-stone-100 py-8 md:py-16">
      <div className="scrollbar-hide flex snap-x snap-mandatory items-center justify-start gap-3 overflow-x-auto pb-2 md:justify-center md:gap-8 md:pb-4">
        {shortcuts.map((shortcut, index) => (
          <motion.div
            key={shortcut.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.28, delay: index * 0.05 }}
            className="snap-start"
          >
            <Link href={shortcut.href} className="group flex min-w-[64px] cursor-pointer flex-col items-center gap-2 md:min-w-[82px] md:gap-2.5">
              <span className="rounded-2xl bg-stone-100 p-2 text-lg transition-colors duration-300 group-hover:bg-amber-50 md:p-4 md:text-2xl">{shortcut.emoji}</span>
              <span className="ui-meta text-stone-500">{shortcut.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
