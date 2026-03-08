"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Lock, Share2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ListDetailPageData } from "@/lib/types/collections";

type ListDetailScreenProps = {
  data: ListDetailPageData;
  avatarName?: string;
  avatarUrl?: string;
};

export function ListDetailScreen({ data, avatarName, avatarUrl }: ListDetailScreenProps) {
  const visibilityLabel = data.visibility === "shared" ? data.copy.visibilitySharedLabel : data.copy.visibilityPrivateLabel;

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <div className="border-b border-stone-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href={data.copy.backHref} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
              <ArrowLeft size={14} />
              {data.copy.backLabel}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {data.visibility === "shared" && data.shareSlug ? (
              <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 md:inline-flex">
                {data.copy.shareLabel}
              </span>
            ) : null}
            <div className="flex items-center gap-2 rounded-full bg-stone-900 px-2 py-2 text-white shadow-lg shadow-stone-200/40">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-stone-200 bg-stone-100">
                {avatarUrl ? <Image src={avatarUrl} alt={avatarName ?? "Profile"} fill className="object-cover" sizes="32px" /> : null}
              </div>
              <span className="hidden pr-2 text-[11px] font-black uppercase tracking-[0.18em] md:block">{avatarName ?? "You"}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Saved List</p>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-5xl">{data.name}</h1>
                {data.description ? <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-500">{data.description}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                  {data.visibility === "shared" ? <Share2 size={12} /> : <Lock size={12} />}
                  {visibilityLabel}
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                  {data.itemCountLabel}
                </span>
              </div>
            </div>
          </div>

          <aside className="rounded-[2.25rem] border border-stone-200 bg-stone-900 p-6 text-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">List Workspace</p>
            <p className="mt-4 text-3xl">{data.vendorCount}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">Vendors currently tracked in this collection. Use this page to review the shortlist before sharing or outreach.</p>
            {data.visibility === "shared" && data.shareSlug ? (
              <Link href={`/lists/${data.shareSlug}`} className="mt-6 inline-flex items-center gap-2 border-b border-white pb-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                View public version
                <ArrowUpRight size={14} />
              </Link>
            ) : null}
          </aside>
        </section>

        <section className="mt-10">
          {!data.vendors.length ? (
            <EmptyState eyebrow="List Items" title={data.copy.emptyTitle} description={data.copy.emptyDescription} />
          ) : (
            <div className="grid gap-4">
              {data.vendors.map((vendor, index) => (
                <motion.article
                  key={vendor.vendorId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="grid gap-5 rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[160px_minmax(0,1fr)_210px] md:p-5"
                >
                  <Link href={`/vendor/${vendor.vendorSlug}`} className="relative aspect-[186/237] overflow-hidden rounded-[1.25rem] bg-stone-100 md:h-[204px] md:aspect-auto">
                    {vendor.imageUrl ? <Image src={vendor.imageUrl} alt={vendor.vendorName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 160px" /> : null}
                  </Link>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{vendor.categoryLabel}</p>
                        <h2 className="mt-2 text-[2rem] leading-none">{vendor.vendorName}</h2>
                      </div>
                      <Link href={`/vendor/${vendor.vendorSlug}`} className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
                        View Vendor
                      </Link>
                    </div>
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-stone-400">{vendor.locationLabel}</p>
                    {vendor.note ? (
                      <div className="mt-5 rounded-[1.5rem] bg-stone-50 p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">{data.copy.notesHeading}</p>
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">{vendor.note}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-between gap-4 rounded-[1.5rem] border border-stone-100 bg-stone-50/70 p-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Saved</p>
                      <p className="mt-2 text-xl text-stone-900">{vendor.savedAtLabel}</p>
                    </div>
                    <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                      In shortlist
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
