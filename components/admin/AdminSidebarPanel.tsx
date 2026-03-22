"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import { BrandWordmark, Eyebrow } from "@/components/ui/Typography";
import { isSupabaseConfigured } from "@/lib/config/app-env";
import { setMockAnonymousSession } from "@/lib/mock-auth-state.client";
import { signOut } from "@/lib/supabase/auth";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";

type AdminSidebarPanelProps = {
  brandLabel: string;
  queueNav: AdminNavLink[];
  structureNav: AdminNavLink[];
};

export function AdminSidebarPanel({ brandLabel, queueNav, structureNav }: AdminSidebarPanelProps) {
  const router = useRouter();

  const handleLogout = async () => {
    if (!isSupabaseConfigured()) {
      setMockAnonymousSession();
      router.push("/login");
      router.refresh();
      return;
    }

    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch {
      // Keep the current session in place if logout fails.
    }
  };

  return (
    <aside className="flex w-full flex-col border-b border-stone-200 bg-white p-8 md:sticky md:top-0 md:h-screen md:w-72 md:border-b-0 md:border-r">
      <Link href="/" className="mb-12 inline-block">
        <BrandWordmark>{brandLabel}</BrandWordmark>
      </Link>

      <nav className="flex-1 space-y-2">
        <Eyebrow className="mb-4">Queue</Eyebrow>
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

        <Eyebrow className="mb-4 mt-10">Structure</Eyebrow>
        {structureNav.map((item) => (
          <motion.div key={item.id} whileHover={{ x: 2 }}>
            <Link href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-50">
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="mt-10 border-t border-stone-100 pt-6 md:mt-auto">
        <button type="button" onClick={handleLogout} className="flex items-center gap-3 text-sm text-stone-400 transition-colors hover:text-rose-600">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
