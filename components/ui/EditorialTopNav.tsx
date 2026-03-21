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

function renderBrandLabel(brandLabel: string) {
  const dotIndex = brandLabel.indexOf(".");

  if (dotIndex === -1) {
    return brandLabel;
  }

  const beforeDot = brandLabel.slice(0, dotIndex);
  const afterDot = brandLabel.slice(dotIndex + 1);

  return (
    <>
      {beforeDot}
      <span className="text-amber-600">.</span>
      {afterDot}
    </>
  );
}

export function EditorialTopNav({ brandLabel, navLinks, rightSlot, className, innerClassName, sticky = true }: EditorialTopNavProps) {
  return (
    <nav className={cn(sticky ? "sticky top-0 z-[120] border-b border-stone-100 bg-white/95 backdrop-blur-md" : "border-b border-stone-100 bg-white", className)} aria-label={brandLabel}>
      <div className={cn("mx-auto flex w-full items-center justify-between gap-4 px-6 py-3 md:gap-6 md:py-6", innerClassName)}>
        <Link href="/" className="serif-italic shrink-0 text-[2.65rem] leading-none text-stone-800 md:text-4xl">
          {renderBrandLabel(brandLabel)}
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
