"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardTitle, MetaText, SectionTitle } from "@/components/ui/Typography";
import type { SavedVendorRowView } from "@/lib/types/collections";

type SavedVendorsTableProps = {
  title: string;
  rows: SavedVendorRowView[];
  addToListLabel: string;
  onAddToList: (row: SavedVendorRowView) => void;
};

export function SavedVendorsTable({ title, rows, addToListLabel, onAddToList }: SavedVendorsTableProps) {
  return (
    <section className="mt-24">
      <SectionTitle className="mb-8 text-[2.1rem] italic md:text-[2.5rem]">{title}</SectionTitle>
      {!rows.length ? (
        <EmptyState
          eyebrow="Saved Vendors"
          title="No saved vendors yet"
          description="As you save vendors from discovery pages, they will appear here for quick sorting into lists."
        />
      ) : null}
      {rows.length ? (
      <>
      <div className="space-y-4 md:hidden">
        {rows.map((row) => (
          <div key={row.vendorId} className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 overflow-hidden rounded-[1rem] bg-stone-100">
                {row.imageUrl ? <Image src={row.imageUrl} alt={row.vendorName} width={64} height={64} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/vendor/${row.vendorSlug}`} className="block text-stone-900">
                  <CardTitle className="text-[1.9rem] leading-tight md:text-[2.1rem]">{row.vendorName}</CardTitle>
                </Link>
                <MetaText className="mt-2">{row.categoryLabel}</MetaText>
                <MetaText className="mt-1">{row.locationLabel}</MetaText>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-full border border-stone-200 bg-white px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-stone-900 shadow-sm"
              onClick={() => onAddToList(row)}
            >
              {addToListLabel}
            </button>
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
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
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-900 shadow-sm hover:bg-stone-50"
                    onClick={() => onAddToList(row)}
                  >
                    {addToListLabel}
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      ) : null}
    </section>
  );
}
