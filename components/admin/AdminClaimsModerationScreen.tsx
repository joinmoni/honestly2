"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Instagram, Mail, Music2 } from "lucide-react";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import type { AdminClaimFilter, AdminClaimsModerationData } from "@/lib/types/admin-dashboard";

type AdminClaimsModerationScreenProps = {
  data: AdminClaimsModerationData;
};

export function AdminClaimsModerationScreen({ data }: AdminClaimsModerationScreenProps) {
  const [activeFilter, setActiveFilter] = useState<AdminClaimFilter>("pending");
  const [claims, setClaims] = useState(data.claims);

  const filteredClaims = useMemo(() => claims.filter((claim) => claim.status === activeFilter), [activeFilter, claims]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl">{data.title}</h1>
            <p className="font-medium italic text-stone-500">{data.description}</p>
          </div>
          <div className="flex rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
            {data.filters.map((filter) => {
              const active = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  type="button"
                  className={
                    active
                      ? "rounded-xl bg-stone-900 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all"
                      : "px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
                  }
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                  {filter.id === "pending" ? ` (${filter.count})` : ""}
                </button>
              );
            })}
          </div>
        </header>

        <div className="space-y-8">
          {filteredClaims.map((claim) =>
            claim.status === "pending" ? (
              <motion.article
                key={claim.id}
                whileHover={{ y: -2 }}
                className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-sm"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="flex flex-col justify-between border-r border-stone-100 bg-stone-50 p-8 lg:w-72">
                    <div className="space-y-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Target Profile</p>
                      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 shadow-inner">
                        {claim.vendorImageUrl ? <Image src={claim.vendorImageUrl} alt={claim.vendorName} width={400} height={400} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <h3 className="text-xl font-display">{claim.vendorName}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{claim.vendorCategoryLabel}</p>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-stone-200 pt-6">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Submitted</p>
                      <p className="text-xs font-semibold">{claim.submittedDate}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8 p-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-600">Claimant Identity</p>
                        <div className="space-y-2">
                          <h4 className="text-lg font-bold">{claim.claimantName}</h4>
                          {claim.claimantEmail ? (
                            <p className="flex items-center gap-2 text-sm text-stone-500">
                              <Mail size={14} />
                              {claim.claimantEmail}
                            </p>
                          ) : null}
                          <div className="flex gap-4 pt-1">
                            {claim.claimantInstagram ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-stone-400">
                                <Instagram size={14} />
                                {claim.claimantInstagram}
                              </span>
                            ) : null}
                            {claim.claimantTiktok ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-stone-400">
                                <Music2 size={14} />
                                {claim.claimantTiktok}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Relationship Note</p>
                        <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 text-sm italic leading-relaxed text-stone-600">
                          &quot;{claim.note}&quot;
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-stone-50 pt-8">
                      <button
                        type="button"
                        className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900"
                        onClick={() => {
                          setClaims((current) => current.map((item) => (item.id === claim.id ? { ...item, status: "rejected" } : item)));
                        }}
                      >
                        Reject Claim
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-100 transition-all hover:bg-stone-800"
                        onClick={() => {
                          setClaims((current) => current.map((item) => (item.id === claim.id ? { ...item, status: "approved" } : item)));
                        }}
                      >
                        Approve Ownership
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ) : (
              <motion.article
                key={claim.id}
                whileHover={{ y: -1 }}
                className="overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white opacity-60"
              >
                <div className="flex flex-col items-center justify-between gap-6 p-6 lg:flex-row">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                      <Check size={20} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-lg font-display">{claim.vendorName}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        {claim.status === "approved" ? "Claim Approved" : "Claim Rejected"} • {claim.submittedDate}
                      </p>
                    </div>
                  </div>
                  <button type="button" className="rounded-xl border border-stone-200 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900">
                    View Details
                  </button>
                </div>
              </motion.article>
            )
          )}
        </div>

        <AdminPagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          pageNumbers={data.pagination.pageNumbers}
        />
      </main>
    </div>
  );
}
