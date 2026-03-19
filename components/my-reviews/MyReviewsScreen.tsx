"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { ReviewFlowModal } from "@/components/vendor-detail/ReviewFlowModal";
import { getUserNavLinks } from "@/lib/user-nav";
import type { MockSession, RatingCriterion, Review } from "@/lib/types/domain";
import type { MyReviewsFilter, MyReviewsPageData } from "@/lib/types/my-reviews";

type MyReviewsScreenProps = {
  data: MyReviewsPageData;
  criteria: RatingCriterion[];
  session: MockSession;
};

export function MyReviewsScreen({ data, criteria, session }: MyReviewsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<MyReviewsFilter>("all");
  const [reviews, setReviews] = useState<Review[]>(data.reviews.map((item) => item.review));
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const reviewsById = useMemo(() => new Map(reviews.map((review) => [review.id, review])), [reviews]);
  const mergedItems = useMemo(() => {
    return data.reviews.map((item) => ({
      ...item,
      review: reviewsById.get(item.review.id) ?? item.review
    }));
  }, [data.reviews, reviewsById]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "published") return mergedItems.filter((item) => item.review.status === "approved");
    if (activeFilter === "under-review") return mergedItems.filter((item) => item.review.status === "pending");
    return mergedItems;
  }, [activeFilter, mergedItems]);

  const activeItem = mergedItems.find((item) => item.review.id === editingReviewId) ?? null;

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <UserTopNav
        brandLabel={data.copy.brandLabel}
        avatarName={session.user?.name}
        avatarEmail={session.user?.email}
        avatarUrl={session.user?.avatarUrl}
        navLinks={getUserNavLinks("my_reviews")}
      />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-12">
          <h1 className="mb-2 text-4xl">{data.copy.heading}</h1>
          <p className="italic text-stone-500">{data.copy.description}</p>
        </header>

        <div className="mb-10 flex gap-8 overflow-x-auto border-b border-stone-100">
          {data.filters.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                className={
                  active
                    ? "border-b-2 border-stone-900 pb-4 text-xs font-bold uppercase tracking-widest"
                    : "pb-4 text-xs font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
                }
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
                {filter.id === "all" ? ` (${filter.count})` : ""}
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {filteredItems.map((item) => {
            const isPublished = item.review.status === "approved";
            const isPending = item.review.status === "pending";
            const isRejected = item.review.status === "rejected";

            return (
              <motion.article
                key={item.review.id}
                whileHover={{ y: -2 }}
                className={
                  isPending
                    ? "rounded-[2rem] border border-dashed border-stone-200 bg-stone-50/50 p-8"
                    : isRejected
                      ? "rounded-[2rem] border border-stone-100 bg-white p-8 opacity-60 grayscale-[0.5]"
                      : "rounded-[2rem] border border-stone-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                }
              >
                <div className={`flex flex-col justify-between gap-6 md:flex-row ${isPending ? "opacity-80" : ""}`}>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          isPublished
                            ? "rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight text-stone-700"
                            : isPending
                              ? "rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight text-amber-700"
                              : "rounded-full bg-stone-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight text-stone-700"
                        }
                      >
                        {isPublished ? data.copy.publishedBadgeLabel : isPending ? data.copy.underReviewBadgeLabel : data.copy.rejectedBadgeLabel}
                      </span>
                      <span className="text-xs text-stone-300">•</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        {data.copy.submittedLabel} {item.submittedText}
                      </span>
                    </div>

                    <div>
                      <p className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${isPublished ? "text-amber-600" : "text-stone-400"}`}>
                        {data.copy.reviewForLabel}
                      </p>
                      <h3 className="serif-italic text-2xl">
                        <Link href={`/vendor/${item.vendorSlug}`} className={isPublished ? "transition-colors hover:underline" : ""}>
                          {item.vendorName}
                        </Link>
                      </h3>
                    </div>

                    {isRejected ? (
                      <div className="rounded-xl border border-stone-200 bg-stone-50/80 p-4">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-stone-700">{data.copy.moderatorNoteLabel}</p>
                        <p className="text-xs text-stone-600">{item.moderatorNote}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-xs text-amber-400">
                          {Array.from({ length: 5 })
                            .map((_, idx) => (idx < Math.round(item.review.overallRating) ? "★" : "☆"))
                            .join("")}
                        </div>
                        {item.review.title ? <h4 className="font-bold italic text-stone-800">&quot;{item.review.title}&quot;</h4> : null}
                        {item.review.body ? <p className={`text-sm leading-relaxed ${isPending ? "text-stone-400" : "line-clamp-2 text-stone-500"}`}>{item.review.body}</p> : null}
                      </div>
                    )}
                  </div>

                  <div className={`flex justify-end gap-3 ${isPending ? "items-center md:flex-col" : "md:flex-col"}`}>
                    {isPublished ? (
                      <>
                        <button
                          type="button"
                          className="rounded-xl border border-stone-200 px-6 py-2 text-xs font-bold transition-colors hover:bg-stone-50"
                          onClick={() => setEditingReviewId(item.review.id)}
                        >
                          {data.copy.editLabel}
                        </button>
                        <Link href={`/vendor/${item.vendorSlug}`} className="px-6 py-2 text-xs font-bold text-stone-400 transition-colors hover:text-stone-900">
                          {data.copy.viewPageLabel}
                        </Link>
                      </>
                    ) : null}

                    {isPending ? (
                      <p className="text-center text-[10px] font-bold italic leading-tight text-stone-400">
                        {data.copy.moderatedLabel}
                      </p>
                    ) : null}

                    {isRejected ? (
                      <button
                        type="button"
                        className="rounded-xl bg-stone-900 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-stone-800"
                        onClick={() => setEditingReviewId(item.review.id)}
                      >
                        {data.copy.resubmitLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>

      {activeItem && session.user ? (
        <ReviewFlowModal
          open={Boolean(activeItem)}
          vendorName={activeItem.vendorName}
          criteria={criteria}
          initialValues={{
            overallRating: activeItem.review.overallRating,
            headline: activeItem.review.title ?? "",
            body: activeItem.review.body ?? "",
            criteria: Object.fromEntries(activeItem.review.ratings.map((rating) => [rating.criterionId, rating.score]))
          }}
          onClose={() => setEditingReviewId(null)}
          onDelete={() => {
            setReviews((current) => current.filter((review) => review.id !== activeItem.review.id));
            setEditingReviewId(null);
          }}
          onSubmit={(values) => {
            setReviews((current) =>
              current.map((review) =>
                review.id === activeItem.review.id
                  ? {
                      ...review,
                      overallRating: values.overallRating,
                      title: values.headline,
                      body: values.body,
                      status: "pending",
                      updatedAt: new Date().toISOString(),
                      ratings: review.ratings.map((rating) => ({
                        ...rating,
                        score: values.criteria[rating.criterionId] ?? rating.score
                      }))
                    }
                  : review
              )
            );
            setEditingReviewId(null);
          }}
        />
      ) : null}
    </div>
  );
}
