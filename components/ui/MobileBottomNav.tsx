"use client";

import Link from "next/link";
import { Heart, Search, Settings, SquarePen, Star } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type MobileBottomNavProps = {
  links: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

const iconByHref: Record<string, typeof Search> = {
  "/reviews/new": SquarePen,
  "/lists": Heart,
  "/me/reviews": Star,
  "/preferences": Settings
};

export function MobileBottomNav({ links }: MobileBottomNavProps) {
  const pathname = usePathname();
  const items = [{ label: "Explore", href: "/vendors", active: pathname === "/vendors" || pathname === "/" }, ...links];

  useEffect(() => {
    document.body.dataset.mobileNav = "true";
    return () => {
      delete document.body.dataset.mobileNav;
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[160] flex justify-center px-4 md:hidden">
      <nav className="pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-[2rem] border border-white/30 bg-stone-900/85 p-2 text-white shadow-2xl shadow-stone-900/30 backdrop-blur-xl">
        {items.map((item) => {
          const Icon = iconByHref[item.href] ?? Search;
          const active = item.active ?? pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white/72 transition-colors",
                active && "bg-white/14 text-white"
              )}
            >
              <Icon size={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
