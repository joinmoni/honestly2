"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PenLine, X } from "lucide-react";

import { BodyText, SectionTitle } from "@/components/ui/Typography";
import type { SeedAdminReviewInput } from "@/lib/admin-reviews.client";
import type { AdminReviewCriterionOption, AdminReviewVendorOption } from "@/lib/types/admin-dashboard";

type AdminSeedReviewModalProps = {
  open: boolean;
  vendors: AdminReviewVendorOption[];
  criteria: AdminReviewCriterionOption[];
  pending?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSeedReview: (input: SeedAdminReviewInput) => Promise<void> | void;
};

export function AdminSeedReviewModal({
  open,
  vendors,
  criteria,
  pending = false,
  errorMessage,
  onClose,
  onSeedReview
}: AdminSeedReviewModalProps) {
  const defaultVendorId = vendors[0]?.id ?? "";
  const [vendorId, setVendorId] = useState(defaultVendorId);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [overallRating, setOverallRating] = useState("5");
  const [status, setStatus] = useState<"pending" | "approved">("approved");
  const [criterionScores, setCriterionScores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setVendorId(vendors[0]?.id ?? "");
  }, [open, vendors]);

  const canSubmit = useMemo(() => {
    return Boolean(vendorId && reviewerName.trim() && overallRating);
  }, [overallRating, reviewerName, vendorId]);

  const reset = () => {
    setVendorId(vendors[0]?.id ?? "");
    setReviewerName("");
    setReviewerEmail("");
    setTitle("");
    setBody("");
    setOverallRating("5");
    setStatus("approved");
    setCriterionScores({});
  };

  const close = () => {
    if (pending) return;
    reset();
    onClose();
  };

  const buildCriterionScoresPayload = (): Record<string, number> | undefined => {
    const out: Record<string, number> = {};
    for (const c of criteria) {
      const raw = criterionScores[c.id]?.trim();
      if (!raw) continue;
      const n = Number(raw);
      if (Number.isNaN(n)) continue;
      out[c.id] = Math.min(5, Math.max(1, n));
    }
    return Object.keys(out).length ? out : undefined;
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-y-auto bg-stone-950/45 p-6 pt-24 pb-10 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2 }}
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-stone-100 px-8 pb-6 pt-8">
              <div>
                <SectionTitle className="text-stone-900">Seed review</SectionTitle>
                <BodyText className="mt-2 text-sm text-stone-500">
                  Create an admin-authored review with optional rubric scores. Approved reviews update vendor aggregates immediately.
                </BodyText>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
                onClick={close}
                aria-label="Close seed review modal"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="max-h-[calc(90vh-112px)] overflow-y-auto px-8 py-8"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSubmit || pending) return;
                void onSeedReview({
                  vendorId,
                  reviewerName: reviewerName.trim(),
                  reviewerEmail: reviewerEmail.trim() || undefined,
                  title: title.trim() || undefined,
                  body: body.trim() || undefined,
                  overallRating: Number(overallRating),
                  status,
                  criterionScores: buildCriterionScoresPayload()
                });
              }}
            >
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Vendor</label>
                  <select
                    value={vendorId}
                    onChange={(event) => setVendorId(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                  >
                    {vendors.length ? (
                      vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No vendors available</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Reviewer name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(event) => setReviewerName(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="Jordan Lee"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Reviewer email (optional)</label>
                    <input
                      type="email"
                      value={reviewerEmail}
                      onChange={(event) => setReviewerEmail(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="jordan@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Overall rating</label>
                    <select
                      value={overallRating}
                      onChange={(event) => setOverallRating(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={String(n)}>
                          {n} / 5
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Initial status</label>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value as "pending" | "approved")}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                    >
                      <option value="approved">Approved (live)</option>
                      <option value="pending">Pending moderation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Title (optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                    placeholder="Dream team for our weekend"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Body (optional)</label>
                  <textarea
                    rows={5}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                    placeholder="What stood out about working with this vendor?"
                  />
                </div>

                {criteria.length ? (
                  <div className="space-y-3 rounded-2xl border border-stone-100 bg-stone-50/80 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Rubric scores (optional)</p>
                    <p className="text-xs text-stone-500">Leave blank to store only the overall rating.</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {criteria.map((criterion) => (
                        <div key={criterion.id} className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">{criterion.name}</label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            step={0.5}
                            value={criterionScores[criterion.id] ?? ""}
                            onChange={(event) =>
                              setCriterionScores((prev) => ({
                                ...prev,
                                [criterion.id]: event.target.value
                              }))
                            }
                            placeholder="1–5"
                            className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {errorMessage ? (
                <p className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
              ) : null}

              <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
                <p className="text-xs text-stone-500">Seeded reviews are stored with source admin and no linked user account.</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-2xl px-5 py-3 text-sm font-bold text-stone-500 transition-colors hover:text-stone-900"
                    onClick={close}
                    disabled={pending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || pending || !vendors.length}
                    className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PenLine size={14} />
                    {pending ? "Saving..." : "Create review"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
