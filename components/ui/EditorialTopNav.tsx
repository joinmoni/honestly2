"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { HomeCategoryMenu } from "@/components/home/HomeCategoryMenu";
import { BrandWordmark } from "@/components/ui/Typography";
import { pickHomeBrowseNavCategories } from "@/lib/site-nav";
import type { Category } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

export type EditorialTopNavLink = {
  label: string;
  href: string;
  active?: boolean;
  /** Shown as a small count badge (e.g. admin pending queues). */
  count?: number;
};

type EditorialTopNavProps = {
  brandLabel: string;
  /** Used when `desktopNavSource` is `navLinks`; also kept for mobile/auxiliary use on public pages. */
  navLinks: EditorialTopNavLink[];
  rightSlot: ReactNode;
  className?: string;
  innerClassName?: string;
  sticky?: boolean;
  /** Destination for the brand wordmark. */
  brandHref?: string;
  /**
   * `browse` — center shows the newest categories from `browseCategories` (consumer home).
   * `navLinks` — center shows `navLinks` (e.g. admin sections).
   */
  desktopNavSource?: "browse" | "navLinks";
  /** Required when `desktopNavSource` is `browse`: full taxonomy for the menu and strip (newest first, capped). */
  browseCategories?: Category[];
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

export function EditorialTopNav({
  brandLabel,
  navLinks,
  rightSlot,
  className,
  innerClassName,
  sticky = true,
  brandHref = "/",
  desktopNavSource = "browse",
  browseCategories
}: EditorialTopNavProps) {
  const pathname = usePathname();
  const browseStripCategories =
    desktopNavSource === "browse" && browseCategories?.length ? pickHomeBrowseNavCategories(browseCategories) : [];
  const browseLinks: EditorialTopNavLink[] = browseStripCategories.map((category) => ({
    label: category.name,
    href: `/category/${category.slug}`,
    active: pathname === `/category/${category.slug}`
  }));
  const centerLinks: EditorialTopNavLink[] = desktopNavSource === "navLinks" ? navLinks : browseLinks;

  return (
    <nav className={cn(sticky ? "sticky top-0 z-[120] border-b border-stone-100 bg-white/95 backdrop-blur-md" : "border-b border-stone-100 bg-white", className)} aria-label={brandLabel}>
      <div className={cn("mx-auto flex w-full items-center justify-between gap-4 px-6 py-3 md:gap-6 md:py-6", innerClassName)}>
        <Link href={brandHref} className="shrink-0">
          <BrandWordmark>{renderBrandLabel(brandLabel)}</BrandWordmark>
        </Link>

        <div
          className={cn(
            "min-w-0 flex-1 items-center justify-center overflow-hidden",
            desktopNavSource === "browse"
              ? browseLinks.length > 0
                ? "hidden md:flex"
                : "hidden"
              : "flex"
          )}
        >
          <div className="flex max-w-full min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 sm:gap-6 sm:text-[12px] md:gap-8 md:text-[13px] md:tracking-[0.15em]">
            {centerLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5",
                  link.active ? "border-b-2 border-stone-900 pb-1 text-stone-900" : "transition-colors hover:text-stone-900"
                )}
              >
                <span>{link.label}</span>
                {typeof link.count === "number" && link.count > 0 ? (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black tabular-nums text-amber-900 sm:text-[10px]">{link.count}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <div className="flex items-center gap-3">
            {desktopNavSource === "browse" ? (
              <HomeCategoryMenu categories={browseCategories ?? []} className="hidden md:block" />
            ) : null}
            {rightSlot}
          </div>
        </div>
      </div>
    </nav>
  );
}
