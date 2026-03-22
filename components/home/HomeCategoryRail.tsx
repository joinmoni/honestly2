import Link from "next/link";
import type { HomeCategoryShortcut } from "@/lib/types/home";

type HomeCategoryRailProps = {
  shortcuts: HomeCategoryShortcut[];
};

export function HomeCategoryRail({ shortcuts }: HomeCategoryRailProps) {
  return (
    <section className="py-3 md:py-6">
      <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-2">
        {shortcuts.map((shortcut, index) => (
          <Link
            key={shortcut.id}
            href={shortcut.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
          >
            <span className="text-base">{shortcut.emoji}</span>
            <span>{shortcut.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
