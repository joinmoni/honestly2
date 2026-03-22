"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";
import { createAdminSeededReview, updateAdminReviewStatus, type SeedAdminReviewInput } from "@/lib/admin-reviews.client";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminSeedReviewModal } from "@/components/admin/AdminSeedReviewModal";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { BodyText, CardTitle, Eyebrow, MetaText, PageTitle, PillText } from "@/components/ui/Typography";
import type { AdminReviewFilter, AdminReviewModerationData } from "@/lib/types/admin-dashboard";

type AdminReviewModerationScreenProps = {
  data: AdminReviewModerationData;
};

export function AdminReviewModerationScreen({ data }: AdminReviewModerationScreenProps) {
  const [activeFilter, setActiveFilter] = useState<AdminReviewFilter>("pending");
  const [reviews, setReviews] = useState(data.reviews);
  const [pendingReviewId, setPendingReviewId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [seedingReview, setSeedingReview] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const filters = useMemo(
    () =>
      data.filters.map((filter) => ({
        ...filter,
        count: reviews.filter((review) => review.status === filter.id).length
      })),
    [data.filters, reviews]
  );

  const filteredReviews = useMemo(() => reviews.filter((review) => review.status === activeFilter), [activeFilter, reviews]);

  const handleSeedReview = async (input: SeedAdminReviewInput) => {
    setSeedingReview(true);
    setSeedError(null);

    try {
      const created = await createAdminSeededReview(input);
      setReviews((current) => [created, ...current]);
      setSeedModalOpen(false);
    } catch (error) {
      setSeedError(error instanceof Error ? error.message : "This review could not be created right now.");
    } finally {
      setSeedingReview(false);
    }
  };

  const handleStatusChange = async (reviewId: string, status: "approved" | "rejected") => {
    setPendingReviewId(reviewId);
    setErrorMessage(null);

    try {
      const nextReviews = await updateAdminReviewStatus(reviews, reviewId, status);
      setReviews(nextReviews);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "This review could not be updated right now.");
    } finally {
      setPendingReviewId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <AdminSeedReviewModal
        open={seedModalOpen}
        vendors={data.vendors}
        criteria={data.criteria}
        pending={seedingReview}
        errorMessage={seedError}
        onClose={() => {
          if (seedingReview) return;
          setSeedError(null);
          setSeedModalOpen(false);
        }}
        onSeedReview={(input) => void handleSeedReview(input)}
      />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <PageTitle className="mb-2">{data.title}</PageTitle>
            <BodyText className="italic">{data.description}</BodyText>
          </div>
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800"
              onClick={() => {
                setSeedError(null);
                setSeedModalOpen(true);
              }}
            >
              <PenLine size={14} strokeWidth={2.5} />
              {data.createReviewLabel}
            </button>
            <div className="flex rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
              {filters.map((filter) => {
                const active = filter.id === activeFilter;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    className={
                      active
                        ? "rounded-xl bg-stone-900 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white"
                        : "px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
                    }
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label} ({filter.count})
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {errorMessage ? <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <motion.article
              key={review.id}
              whileHover={{ y: -2 }}
              className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="space-y-6 border-r border-stone-100 bg-stone-50 p-8 lg:w-1/3">
                  <div>
                    <Eyebrow className="mb-1 text-amber-700">Target Vendor</Eyebrow>
                    <CardTitle>{review.vendorName}</CardTitle>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Eyebrow>Reviewer</Eyebrow>
                      <BodyText className="mt-1 text-sm font-semibold text-stone-900">{review.reviewerName}</BodyText>
                      <MetaText className="mt-1 normal-case tracking-normal">{review.reviewerEmail}</MetaText>
                    </div>
                    <div>
                      <Eyebrow>Date Submitted</Eyebrow>
                      <BodyText className="mt-1 text-sm font-semibold text-stone-900">{review.submittedDate}</BodyText>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between space-y-6 p-8 lg:w-2/3">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-sm text-amber-400">
                        {Array.from({ length: 5 })
                          .map((_, idx) => (idx < Math.round(review.overallRating) ? "★" : "☆"))
                          .join("")}
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {review.seededByAdmin ? (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 ring-1 ring-amber-100">
                            <PillText className="text-amber-900">Admin seeded</PillText>
                          </span>
                        ) : null}
                        <span className="rounded-full bg-stone-100 px-2 py-0.5">
                          <PillText className="text-stone-700">
                            {review.status === "pending" ? "New Submission" : review.status}
                          </PillText>
                        </span>
                      </div>
                    </div>
                    {review.reviewTitle ? (
                      <CardTitle className="serif-italic text-stone-800">&quot;{review.reviewTitle}&quot;</CardTitle>
                    ) : null}
                    {review.reviewBody ? <BodyText className="text-sm leading-relaxed">{review.reviewBody}</BodyText> : null}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-stone-50 pt-6">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900"
                      disabled={pendingReviewId === review.id}
                      onClick={() => void handleStatusChange(review.id, "rejected")}
                    >
                      {pendingReviewId === review.id ? "Updating..." : "Reject"}
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800"
                      disabled={pendingReviewId === review.id}
                      onClick={() => void handleStatusChange(review.id, "approved")}
                    >
                      {pendingReviewId === review.id ? "Updating..." : "Approve Review"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
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
