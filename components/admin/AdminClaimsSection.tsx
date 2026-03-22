"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

import { BodyText, SectionTitle } from "@/components/ui/Typography";
import type { AdminClaimItem } from "@/lib/types/admin-dashboard";

type AdminClaimsSectionProps = {
  claims: AdminClaimItem[];
};

export function AdminClaimsSection({ claims }: AdminClaimsSectionProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 p-6">
        <SectionTitle className="text-xl italic md:text-2xl">New Vendor Claims</SectionTitle>
      </div>

      <div className="divide-y divide-stone-50">
        {claims.map((claim) => (
          <div key={claim.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 font-bold text-amber-600">{claim.initial}</div>
              <div>
                <BodyText className="text-sm font-semibold text-stone-900">{claim.vendorName}</BodyText>
                <BodyText className="text-xs italic text-stone-400">Requested by: {claim.requesterEmail}</BodyText>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} type="button" className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50" aria-label="Approve claim">
                <Check size={18} strokeWidth={2.5} />
              </motion.button>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }} type="button" className="rounded-lg p-2 text-rose-400 hover:bg-rose-50" aria-label="Reject claim">
                <X size={18} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
