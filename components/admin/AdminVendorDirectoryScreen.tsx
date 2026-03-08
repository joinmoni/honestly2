"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Ban, Check, Pencil, Search, Shield } from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AdminVendorDirectoryData } from "@/lib/types/admin-dashboard";

type AdminVendorDirectoryScreenProps = {
  data: AdminVendorDirectoryData;
};

export function AdminVendorDirectoryScreen({ data }: AdminVendorDirectoryScreenProps) {
  const [query, setQuery] = useState("");
  const [vendors, setVendors] = useState(data.vendors);

  const filteredVendors = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return vendors;
    return vendors.filter((vendor) => vendor.vendorName.toLowerCase().includes(term));
  }, [query, vendors]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="space-y-2">
            <h1 className="text-4xl">{data.title}</h1>
            <p className="font-medium italic text-stone-500">{data.description}</p>
          </div>

          <div className="group relative w-full md:w-80">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-amber-600">
              <Search size={16} strokeWidth={2.5} />
            </span>
            <input
              type="text"
              placeholder={data.searchPlaceholder}
              className="w-full rounded-2xl border border-stone-200 bg-white py-4 pl-12 pr-5 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </header>

        {filteredVendors.length ? (
          <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-stone-100 bg-stone-50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Vendor</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Ownership</th>
                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-stone-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredVendors.map((vendor) => {
                    const suspended = vendor.status === "suspended";

                    return (
                      <tr key={vendor.id} className={suspended ? "group bg-stone-50/30 grayscale-[0.4]" : "group transition-colors hover:bg-stone-50/50"}>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 shrink-0 overflow-hidden rounded-xl border ${suspended ? "border-stone-200" : "border-stone-100"}`}>
                              {vendor.imageUrl ? (
                                <Image
                                  src={vendor.imageUrl}
                                  alt={vendor.vendorName}
                                  width={100}
                                  height={100}
                                  className={`h-full w-full object-cover ${suspended ? "opacity-50" : ""}`}
                                />
                              ) : null}
                            </div>
                            <div>
                              <p className={`text-sm font-bold leading-tight ${suspended ? "text-stone-400 line-through" : "text-stone-900"}`}>{vendor.vendorName}</p>
                              <p className={`text-[10px] font-medium ${suspended ? "italic text-stone-300" : "text-stone-400"}`}>
                                {suspended ? "Suspended by Admin" : vendor.vendorSlug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          {suspended ? (
                            <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-stone-500">
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-stone-700">
                              <span className="h-1 w-1 rounded-full bg-stone-500" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          {suspended ? (
                            <span className="text-[9px] font-bold uppercase tracking-widest italic text-stone-300">No Data</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {vendor.claimed ? (
                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-stone-400">
                                  <Check size={10} strokeWidth={3} />
                                  Claimed
                                </span>
                              ) : null}
                              {vendor.verified ? (
                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">
                                  <Shield size={10} strokeWidth={3} />
                                  Verified
                                </span>
                              ) : null}
                              {!vendor.claimed && !vendor.verified ? (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-stone-300 italic">No Data</span>
                              ) : null}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-6">
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${suspended ? "text-stone-300" : "text-stone-500"}`}>{vendor.categoryLabel}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {suspended ? (
                            <button
                              type="button"
                              className="rounded-lg bg-stone-900 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-stone-200 transition-all active:scale-95 hover:bg-stone-800"
                              onClick={() => {
                                setVendors((current) => current.map((item) => (item.id === vendor.id ? { ...item, status: "active" } : item)));
                              }}
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button type="button" className="rounded-lg p-2 text-stone-400 shadow-sm transition-all hover:bg-white hover:text-stone-900">
                                <Pencil size={16} />
                              </button>
                              <button
                                type="button"
                                className="rounded-lg p-2 text-stone-400 shadow-sm transition-all hover:bg-white hover:text-stone-900"
                                onClick={() => {
                                  setVendors((current) => current.map((item) => (item.id === vendor.id ? { ...item, status: "suspended" } : item)));
                                }}
                              >
                                <Ban size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            eyebrow="Vendor Directory"
            title={query.trim() ? "No vendors match this search" : "No vendors available"}
            description={
              query.trim()
                ? "Try a different search term or clear the query to view the full vendor directory."
                : "Vendor records will appear here once listings are available for moderation."
            }
            ctaLabel={query.trim() ? "Clear search" : undefined}
            onCta={query.trim() ? () => setQuery("") : undefined}
          />
        )}

        {filteredVendors.length ? (
          <AdminPagination
            currentPage={data.pagination.currentPage}
            totalPages={data.pagination.totalPages}
            pageNumbers={data.pagination.pageNumbers}
          />
        ) : null}
      </main>
    </div>
  );
}
