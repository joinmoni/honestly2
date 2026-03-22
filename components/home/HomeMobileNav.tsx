"use client";

import Link from "next/link";
import { Bookmark, Search, SquarePen, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HomeCategoryMenu } from "@/components/home/HomeCategoryMenu";
import type { Category } from "@/lib/types/domain";

type HomeMobileNavProps = {
  categories: Category[];
};

export function HomeMobileNav({ categories }: HomeMobileNavProps) {
  const pathname = usePathname();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[160] flex justify-center px-4 md:hidden">
      <nav className="pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-[2rem] border border-white/30 bg-stone-900/85 p-2 text-white shadow-2xl shadow-stone-900/30 backdrop-blur-xl">
        <Link
          href="/reviews/new"
          className={cn("flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white/72", pathname === "/reviews/new" && "bg-white/14 text-white")}
        >
          <SquarePen size={18} />
          <span>Review</span>
        </Link>
        <HomeCategoryMenu
          categories={categories}
          triggerClassName={cn(
            "flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white/72 transition-colors",
            pathname === "/vendors" && "bg-white/14 text-white"
          )}
          icon={<Search size={18} />}
          label="Explore"
        />
        <Link
          href="/lists"
          className={cn("flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white/72", pathname.startsWith("/lists") && "bg-white/14 text-white")}
        >
          <Bookmark size={18} />
          <span>Saved</span>
        </Link>
        <Link
          href="/me/reviews"
          className={cn("flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white/72", pathname.startsWith("/me/reviews") && "bg-white/14 text-white")}
        >
          <Star size={18} />
          <span>My reviews</span>
        </Link>
      </nav>
    </div>
  );
}
