"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";

type AdminSidebarPanelProps = {
  brandLabel: string;
  queueNav: AdminNavLink[];
  structureNav: AdminNavLink[];
};

export function AdminSidebarPanel({ brandLabel, queueNav, structureNav }: AdminSidebarPanelProps) {
  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-white p-8 md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r">
      <Link href="/" className="serif-italic mb-12 inline-block text-4xl">
        {brandLabel}
      </Link>

      <nav className="flex-1 space-y-2">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Queue</p>
        {queueNav.map((item) => (
          <motion.div key={item.id} whileHover={{ x: 2 }}>
            <Link
              href={item.href}
              className={
                item.active
                  ? "flex items-center justify-between rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-stone-200"
                  : "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-50"
              }
            >
              <span>{item.label}</span>
              {typeof item.count === "number" ? (
                <span className={item.active ? "rounded-full bg-amber-500 px-2 py-0.5 text-[10px] text-white" : "rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500"}>
                  {item.count}
                </span>
              ) : null}
            </Link>
          </motion.div>
        ))}

        <p className="mb-4 mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Structure</p>
        {structureNav.map((item) => (
          <motion.div key={item.id} whileHover={{ x: 2 }}>
            <Link href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-50">
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="mt-10 border-t border-stone-100 pt-6 md:mt-auto">
        <button type="button" className="flex items-center gap-3 text-sm text-stone-400 transition-colors hover:text-rose-600">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
