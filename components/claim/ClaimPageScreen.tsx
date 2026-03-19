"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock3, Instagram, Mail, Music2 } from "lucide-react";
import { submitVendorClaim } from "@/lib/claims.client";
import type { ClaimPageData, ClaimStatusView } from "@/lib/types/claim-page";

type ClaimPageScreenProps = {
  data: ClaimPageData;
  currentUser: {
    id: string;
    name: string;
  };
};

export function ClaimPageScreen({ data, currentUser }: ClaimPageScreenProps) {
  const [email, setEmail] = useState(data.initialContact.email);
  const [instagram, setInstagram] = useState(data.initialContact.instagram);
  const [tiktok, setTiktok] = useState(data.initialContact.tiktok);
  const [note, setNote] = useState(data.initialNote);
  const [state, setState] = useState<ClaimStatusView>(data.state);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState(data.submittedAt);
  const [submitting, setSubmitting] = useState(false);

  const hasContact = Boolean(email.trim() || instagram.trim() || tiktok.trim());

  const handleSubmit = async () => {
    if (!hasContact) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    setSubmitError(null);
    setSubmitting(true);

    try {
      const result = await submitVendorClaim({
        vendorId: data.vendorId,
        userId: currentUser.id,
        claimantName: currentUser.name,
        email: email.trim() || undefined,
        instagram: instagram.trim() || undefined,
        tiktok: tiktok.trim() || undefined,
        note: note.trim() || undefined
      });

      setSubmittedAt(new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(result.submittedAt)));
      setState("pending");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Claim request could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  const submittedLine = submittedAt ? `${data.copy.submittedPrefix} ${submittedAt}` : null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
      <div className="mb-8">
        <Link
          href={data.vendorHref}
          className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900"
        >
          <ArrowLeft size={14} />
          {data.copy.backLabel}
        </Link>
      </div>

      <header className="mb-10 text-center">
        <h1 className="serif-italic mb-3 text-4xl text-stone-800 md:text-5xl">{data.copy.pageTitle}</h1>
        <p className="font-medium text-stone-500">{data.copy.pageDescription}</p>
      </header>

      <div className="mb-10 flex items-center gap-4 rounded-[2rem] border border-stone-100 bg-white p-4 shadow-sm">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-stone-100">
          {data.vendorImageUrl ? (
            <Image src={data.vendorImageUrl} alt={data.vendorName} width={64} height={64} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-600">{data.copy.targetProfileLabel}</p>
          <h2 className="text-xl font-display">{data.vendorName}</h2>
          <p className="text-[10px] font-medium tracking-tight text-stone-400">
            {data.vendorCategoryLabel} • {data.vendorLocationLabel}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-[2.5rem] border border-stone-100 bg-white p-8 shadow-2xl shadow-stone-200/30 md:p-12"
      >
        {state === "form" || state === "rejected" ? (
          <div className="space-y-8">
            {state === "rejected" ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-700">{data.copy.rejectedTitle}</p>
                <p className="text-sm text-stone-600">{data.rejectionReason ?? data.copy.rejectedDescription}</p>
              </div>
            ) : null}

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{data.copy.contactIntroLabel}</p>
              </div>

              <div className="space-y-3">
                <IconInput
                  icon={<Mail size={16} />}
                  placeholder={data.copy.emailLabel}
                  value={email}
                  onChange={setEmail}
                  type="email"
                />
                <IconInput
                  icon={<Instagram size={16} />}
                  placeholder={data.copy.instagramLabel}
                  value={instagram}
                  onChange={setInstagram}
                />
                <IconInput
                  icon={<Music2 size={16} />}
                  placeholder={data.copy.tiktokLabel}
                  value={tiktok}
                  onChange={setTiktok}
                />
              </div>

              {showValidation ? (
                <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
                  {data.copy.requiredContactMessage}
                </p>
              ) : null}
              {submitError ? <p className="text-xs font-medium text-rose-600">{submitError}</p> : null}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{data.copy.relationshipLabel}</label>
                <textarea
                  rows={3}
                  placeholder={data.copy.relationshipPlaceholder}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium leading-relaxed transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-2xl bg-stone-900 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : state === "rejected" ? data.copy.resubmitLabel : data.copy.submitLabel}
              </motion.button>
            </div>

            <p className="px-4 text-center text-[9px] font-medium italic leading-relaxed text-stone-400">{data.copy.reviewNote}</p>
          </div>
        ) : null}

        {state === "pending" ? (
          <ClaimStateBlock
            icon={<Clock3 size={20} />}
            title={data.copy.pendingTitle}
            description={data.copy.pendingDescription}
            submittedLine={submittedLine}
            tone="amber"
          />
        ) : null}

        {state === "approved" ? (
          <div className="space-y-6">
            <ClaimStateBlock
              icon={<CheckCircle2 size={20} />}
              title={data.copy.approvedTitle}
              description={data.copy.approvedDescription}
              submittedLine={submittedLine}
              tone="stone"
            />
            <Link
              href={`/vendor-dashboard/${data.vendorSlug}/edit`}
              className="block w-full rounded-2xl bg-stone-900 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800"
            >
              Continue to Vendor Dashboard
            </Link>
          </div>
        ) : null}
      </motion.div>
    </main>
  );
}

type IconInputProps = {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
};

function IconInput({ icon, placeholder, value, onChange, type = "text" }: IconInputProps) {
  return (
    <div className="group relative">
      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-stone-900">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-4 pl-12 pr-5 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

type ClaimStateBlockProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  submittedLine: string | null;
  tone: "amber" | "stone";
};

function ClaimStateBlock({ icon, title, description, submittedLine, tone }: ClaimStateBlockProps) {
  return (
    <div className={`rounded-[2rem] border p-8 ${tone === "amber" ? "border-amber-100 bg-amber-50/50" : "border-stone-200 bg-stone-50/80"}`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone === "amber" ? "bg-white text-amber-700" : "bg-white text-stone-700"}`}>
        {icon}
      </div>
      <h3 className="serif-italic mb-2 text-2xl">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-600">{description}</p>
      {submittedLine ? <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">{submittedLine}</p> : null}
    </div>
  );
}
