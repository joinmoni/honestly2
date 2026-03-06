"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import type { AdminReviewFilter, AdminReviewModerationData } from "@/lib/types/admin-dashboard";

type AdminReviewModerationScreenProps = {
  data: AdminReviewModerationData;
};

export function AdminReviewModerationScreen({ data }: AdminReviewModerationScreenProps) {
  const [activeFilter, setActiveFilter] = useState<AdminReviewFilter>("pending");
  const [reviews, setReviews] = useState(data.reviews);

  const filteredReviews = useMemo(() => reviews.filter((review) => review.status === activeFilter), [activeFilter, reviews]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl">{data.title}</h1>
            <p className="italic text-stone-500">{data.description}</p>
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
                      ? "rounded-xl bg-stone-900 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-white"
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
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-amber-600">Target Vendor</p>
                    <h3 className="text-xl font-display">{review.vendorName}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Reviewer</p>
                      <p className="text-sm font-semibold">{review.reviewerName}</p>
                      <p className="text-[10px] text-stone-400">{review.reviewerEmail}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Date Submitted</p>
                      <p className="text-sm font-semibold">{review.submittedDate}</p>
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
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-stone-700">
                        {review.status === "pending" ? "New Submission" : review.status}
                      </span>
                    </div>
                    {review.reviewTitle ? <h4 className="serif-italic text-xl text-stone-800">&quot;{review.reviewTitle}&quot;</h4> : null}
                    {review.reviewBody ? <p className="text-sm font-medium leading-relaxed text-stone-600">{review.reviewBody}</p> : null}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-stone-50 pt-6">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-900"
                      onClick={() => {
                        setReviews((current) =>
                          current.map((item) => (item.id === review.id ? { ...item, status: "rejected" } : item))
                        );
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-stone-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800"
                      onClick={() => {
                        setReviews((current) =>
                          current.map((item) => (item.id === review.id ? { ...item, status: "approved" } : item))
                        );
                      }}
                    >
                      Approve Review
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
