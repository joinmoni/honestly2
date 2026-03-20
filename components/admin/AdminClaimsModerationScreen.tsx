"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Instagram, Mail, Music2 } from "lucide-react";
import { updateAdminClaimStatus } from "@/lib/admin-claims.client";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { BodyText, CardTitle, Eyebrow, MetaText, PageTitle, PillText } from "@/components/ui/Typography";
import type { AdminClaimFilter, AdminClaimsModerationData } from "@/lib/types/admin-dashboard";

type AdminClaimsModerationScreenProps = {
  data: AdminClaimsModerationData;
};

export function AdminClaimsModerationScreen({ data }: AdminClaimsModerationScreenProps) {
  const [activeFilter, setActiveFilter] = useState<AdminClaimFilter>("pending");
  const [claims, setClaims] = useState(data.claims);
  const [pendingClaimId, setPendingClaimId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredClaims = useMemo(() => claims.filter((claim) => claim.status === activeFilter), [activeFilter, claims]);

  const handleStatusChange = async (claimId: string, status: "approved" | "rejected") => {
    setPendingClaimId(claimId);
    setErrorMessage(null);

    try {
      const nextClaims = await updateAdminClaimStatus(claims, claimId, status);
      setClaims(nextClaims);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "This claim could not be updated right now.");
    } finally {
      setPendingClaimId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <PageTitle className="mb-2 text-[2.8rem] leading-[0.98] md:text-[3.35rem]">{data.title}</PageTitle>
            <BodyText className="italic">{data.description}</BodyText>
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

        {errorMessage ? <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

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
                      <Eyebrow>Target Profile</Eyebrow>
                      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-stone-100 shadow-inner">
                        {claim.vendorImageUrl ? <Image src={claim.vendorImageUrl} alt={claim.vendorName} width={400} height={400} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <CardTitle className="text-[2rem] leading-tight md:text-[2.2rem]">{claim.vendorName}</CardTitle>
                        <MetaText>{claim.vendorCategoryLabel}</MetaText>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-stone-200 pt-6">
                      <Eyebrow>Submitted</Eyebrow>
                      <BodyText className="mt-1 text-sm font-semibold text-stone-900">{claim.submittedDate}</BodyText>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8 p-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <Eyebrow className="text-amber-700">Claimant Identity</Eyebrow>
                        <div className="space-y-2">
                          <CardTitle className="text-[1.7rem] leading-tight md:text-[1.9rem]">{claim.claimantName}</CardTitle>
                          {claim.claimantEmail ? (
                            <BodyText className="flex items-center gap-2 text-sm">
                              <Mail size={14} />
                              {claim.claimantEmail}
                            </BodyText>
                          ) : null}
                          <div className="flex gap-4 pt-1">
                            {claim.claimantInstagram ? (
                              <MetaText className="flex items-center gap-1">
                                <Instagram size={14} />
                                {claim.claimantInstagram}
                              </MetaText>
                            ) : null}
                            {claim.claimantTiktok ? (
                              <MetaText className="flex items-center gap-1">
                                <Music2 size={14} />
                                {claim.claimantTiktok}
                              </MetaText>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Eyebrow>Relationship Note</Eyebrow>
                        <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                          <BodyText className="italic leading-relaxed">
                            &quot;{claim.note}&quot;
                          </BodyText>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-stone-50 pt-8">
                      <button
                        type="button"
                        className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900"
                        disabled={pendingClaimId === claim.id}
                        onClick={() => void handleStatusChange(claim.id, "rejected")}
                      >
                        {pendingClaimId === claim.id ? "Updating..." : "Reject Claim"}
                      </button>
                      <button
                        type="button"
                        className="rounded-xl bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-100 transition-all hover:bg-stone-800"
                        disabled={pendingClaimId === claim.id}
                        onClick={() => void handleStatusChange(claim.id, "approved")}
                      >
                        {pendingClaimId === claim.id ? "Updating..." : "Approve Ownership"}
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
                      <CardTitle className="text-[1.6rem] leading-tight md:text-[1.8rem]">{claim.vendorName}</CardTitle>
                      <MetaText className="mt-1">
                        {claim.status === "approved" ? "Claim Approved" : "Claim Rejected"} • {claim.submittedDate}
                      </MetaText>
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
