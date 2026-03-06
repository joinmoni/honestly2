"use client";

import { Avatar } from "@/components/ui/Avatar";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";

type AdminTopNavProps = {
  brandLabel: string;
  navLinks: AdminNavLink[];
  avatarName?: string;
};

export function AdminTopNav({ brandLabel, navLinks, avatarName = "Admin User" }: AdminTopNavProps) {
  return (
    <EditorialTopNav
      brandLabel={brandLabel}
      navLinks={navLinks}
      innerClassName="max-w-[1400px] px-8"
      rightSlot={
        <div className="flex items-center gap-2 rounded-full bg-stone-900 px-2 py-2 text-white shadow-lg shadow-stone-200/40">
          <Avatar name={avatarName} size="sm" />
          <span className="hidden pr-2 text-[11px] font-black uppercase tracking-[0.18em] md:block">{avatarName}</span>
        </div>
      }
    />
  );
}
