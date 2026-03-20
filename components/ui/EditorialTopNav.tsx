"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EditorialTopNavLink = {
  label: string;
  href: string;
  active?: boolean;
};

type EditorialTopNavProps = {
  brandLabel: string;
  navLinks: EditorialTopNavLink[];
  rightSlot: ReactNode;
  className?: string;
  innerClassName?: string;
  sticky?: boolean;
};

export function EditorialTopNav({ brandLabel, navLinks, rightSlot, className, innerClassName, sticky = true }: EditorialTopNavProps) {
  return (
    <nav className={cn(sticky ? "sticky top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md" : "border-b border-stone-100 bg-white", className)} aria-label={brandLabel}>
      <div className={cn("mx-auto flex w-full items-center justify-between gap-6 px-6 py-6", innerClassName)}>
        <Link href="/" className="serif-italic shrink-0 text-4xl text-stone-800">
          {brandLabel}
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <div className="flex min-w-0 items-center gap-8 overflow-x-auto whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.15em] text-stone-500">
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={link.active ? "border-b-2 border-stone-900 pb-1 text-stone-900" : "transition-colors hover:text-stone-900"}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="shrink-0">{rightSlot}</div>
      </div>
    </nav>
  );
}
