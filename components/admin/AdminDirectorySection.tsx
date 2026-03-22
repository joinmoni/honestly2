"use client";

import { motion } from "framer-motion";

import { BodyText, metaTextClassName, SectionTitle } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { AdminDirectoryItem } from "@/lib/types/admin-dashboard";

type AdminDirectorySectionProps = {
  rows: AdminDirectoryItem[];
};

export function AdminDirectorySection({ rows }: AdminDirectorySectionProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm xl:col-span-2">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-stone-100 p-6 md:flex-row md:items-center">
        <SectionTitle className="text-xl italic md:text-2xl">Active Vendor Directory</SectionTitle>
        <input type="text" placeholder="Search by name..." className="rounded-full bg-stone-50 px-4 py-2 text-xs outline-none ring-amber-200 focus:ring-1" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-stone-50">
            <tr>
              <th className={cn("px-8 py-4 text-left font-normal", metaTextClassName)}>Vendor Name</th>
              <th className={cn("px-8 py-4 text-left font-normal", metaTextClassName)}>Status</th>
              <th className={cn("px-8 py-4 text-left font-normal", metaTextClassName)}>Verification</th>
              <th className={cn("px-8 py-4 text-right font-normal", metaTextClassName)}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-8 py-6">
                  <BodyText className="text-sm font-semibold text-stone-900">{row.vendorName}</BodyText>
                </td>
                <td className="px-8 py-6">
                  <span className={row.statusTone === "active" ? "rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-emerald-700" : "rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-rose-600"}>
                    {row.statusLabel}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <BodyText
                    className={
                      row.verificationLabel === "Vetted Creator"
                        ? "text-xs font-medium italic text-stone-600"
                        : "text-xs font-medium text-stone-400"
                    }
                  >
                    {row.verificationLabel}
                  </BodyText>
                </td>
                <td className="space-x-3 px-8 py-6 text-right">
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="text-xs font-bold text-stone-400 transition-colors hover:text-stone-900">
                    Edit
                  </motion.button>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="text-xs font-bold uppercase text-rose-400 transition-colors hover:text-rose-600">
                    Suspend
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
