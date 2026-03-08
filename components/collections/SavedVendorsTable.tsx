"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SavedVendorRowView } from "@/lib/types/collections";

type SavedVendorsTableProps = {
  title: string;
  rows: SavedVendorRowView[];
  addToListLabel: string;
};

export function SavedVendorsTable({ title, rows, addToListLabel }: SavedVendorsTableProps) {
  return (
    <section className="mt-24">
      <h2 className="mb-8 text-2xl italic">{title}</h2>
      {!rows.length ? (
        <EmptyState
          eyebrow="Saved Vendors"
          title="No saved vendors yet"
          description="As you save vendors from discovery pages, they will appear here for quick sorting into lists."
        />
      ) : null}
      {rows.length ? (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <th className="pb-4">Vendor</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Location</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {rows.map((row) => (
              <tr key={row.vendorId} className="group">
                <td className="flex items-center gap-4 py-6">
                  <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                    {row.imageUrl ? <Image src={row.imageUrl} alt={row.vendorName} width={48} height={48} className="h-full w-full object-cover" /> : null}
                  </div>
                  <Link href={`/vendor/${row.vendorSlug}`} className="font-bold text-stone-800 hover:underline">
                    {row.vendorName}
                  </Link>
                </td>
                <td className="py-6 text-sm text-stone-500">{row.categoryLabel}</td>
                <td className="py-6 text-sm text-stone-500">{row.locationLabel}</td>
                <td className="py-6 text-right">
                  <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-900 shadow-sm hover:bg-stone-50">
                    {addToListLabel}
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      ) : null}
    </section>
  );
}
