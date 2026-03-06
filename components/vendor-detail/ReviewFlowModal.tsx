"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RatingCriterion } from "@/lib/types/domain";

type ReviewFlowValues = {
  overallRating: number;
  headline: string;
  body: string;
  criteria: Record<string, number>;
};

type ReviewFlowModalProps = {
  open: boolean;
  vendorName: string;
  criteria: RatingCriterion[];
  initialValues?: ReviewFlowValues;
  onClose: () => void;
  onSubmit: (values: ReviewFlowValues) => void;
  onDelete?: () => void;
};

const DEFAULT_RATING = 4;

function getInitialReviewValues(
  initialValues: ReviewFlowValues | undefined,
  defaultCriteria: Record<string, number>
): ReviewFlowValues {
  return {
    overallRating: initialValues?.overallRating ?? DEFAULT_RATING,
    headline: initialValues?.headline ?? "",
    body: initialValues?.body ?? "",
    criteria: initialValues?.criteria ?? defaultCriteria
  };
}

export function ReviewFlowModal({ open, vendorName, criteria, initialValues, onClose, onSubmit, onDelete }: ReviewFlowModalProps) {
  const defaultCriteria = useMemo(() => {
    return Object.fromEntries(criteria.map((item) => [item.id, DEFAULT_RATING]));
  }, [criteria]);

  return (
    <AnimatePresence>
      {open ? (
        <ReviewFlowDialog
          vendorName={vendorName}
          criteria={criteria}
          initialValues={initialValues}
          defaultCriteria={defaultCriteria}
          onClose={onClose}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      ) : null}
    </AnimatePresence>
  );
}

type ReviewFlowDialogProps = Omit<ReviewFlowModalProps, "open"> & {
  defaultCriteria: Record<string, number>;
};

function ReviewFlowDialog({
  vendorName,
  criteria,
  initialValues,
  defaultCriteria,
  onClose,
  onSubmit,
  onDelete
}: ReviewFlowDialogProps) {
  const isEditMode = Boolean(initialValues);
  const initialState = getInitialReviewValues(initialValues, defaultCriteria);

  const [overallRating, setOverallRating] = useState(initialState.overallRating);
  const [headline, setHeadline] = useState(initialState.headline);
  const [body, setBody] = useState(initialState.body);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>(initialState.criteria);

  const reset = () => {
    setOverallRating(initialState.overallRating);
    setHeadline(initialState.headline);
    setBody(initialState.body);
    setCriteriaScores(initialState.criteria);
  };

  return (
    <motion.div className="fixed inset-0 z-[80] flex min-h-screen items-center justify-center bg-stone-200/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }} className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="px-8 pb-6 pt-10 text-center">
          {isEditMode ? (
            <div className="mb-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-700">Update your feedback</div>
          ) : null}
          <h2 className="text-3xl">{isEditMode ? "Edit your review" : "Share your experience"}</h2>
          <p className="mt-1 text-sm text-stone-500">
            {isEditMode ? "For " : "How was your time with "}
            <span className="font-semibold text-stone-900">{vendorName}</span>
            {isEditMode ? "" : "?"}
          </p>
        </div>

        <form
          className={isEditMode ? "space-y-6 p-8" : "space-y-8 p-8"}
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({ overallRating, headline, body, criteria: criteriaScores });
          }}
        >
          <div className={isEditMode ? "flex flex-col items-center gap-2 border-b border-stone-50 pb-6" : "flex flex-col items-center gap-3"}>
            {!isEditMode ? <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Overall Rating</span> : null}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const score = index + 1;
                return (
                  <motion.button
                    key={score}
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className={score <= overallRating ? "text-3xl text-amber-400" : "text-3xl text-stone-200 transition-colors hover:text-amber-200"}
                    onClick={() => setOverallRating(score)}
                    aria-label={`Rate ${score} out of 5`}
                  >
                    ★
                  </motion.button>
                );
              })}
            </div>
            {isEditMode ? <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Click to change rating</span> : null}
          </div>

          {!isEditMode ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {criteria.slice(0, 2).map((criterion) => (
                <div key={criterion.id} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-tight text-stone-600">{criterion.name}</label>
                  <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-3">
                    <span className="text-xs text-stone-400">Poor</span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      className="h-1 w-20 accent-amber-600"
                      value={criteriaScores[criterion.id] ?? DEFAULT_RATING}
                      onChange={(event) => setCriteriaScores((current) => ({ ...current, [criterion.id]: Number(event.target.value) }))}
                    />
                    <span className="text-xs text-stone-400">Great</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-tight text-stone-500">Headline</label>
              <input
                type="text"
                placeholder="The highlight of our wedding day"
                className={isEditMode ? "w-full rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100" : "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"}
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-tight text-stone-500">{isEditMode ? "Detailed Review" : "Your Review"}</label>
              <textarea
                rows={isEditMode ? 5 : 4}
                placeholder="Tell us about the process, the results, and why you’d recommend them..."
                className={isEditMode ? "w-full rounded-xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm leading-relaxed transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100" : "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"}
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>
          </div>

          {isEditMode ? (
            <div className="space-y-3 pt-4">
              <motion.button type="submit" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="w-full rounded-2xl bg-stone-900 py-4 font-bold text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800">
                Save Changes
              </motion.button>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-xl border border-stone-100 py-3 text-xs font-bold text-stone-500 transition-colors hover:bg-stone-50"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="flex-1 rounded-xl py-3 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-50" onClick={onDelete}>
                  Delete Review
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 pt-4">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-2xl border border-stone-200 px-6 py-4 font-semibold text-stone-600 transition-colors hover:bg-stone-50"
                onClick={() => {
                  reset();
                  onClose();
                }}
              >
                Cancel
              </motion.button>
              <motion.button type="submit" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="flex-[2] rounded-2xl bg-stone-900 px-6 py-4 font-semibold text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800 active:scale-[0.98]">
                Submit Review
              </motion.button>
            </div>
          )}

          {!isEditMode ? <p className="text-center text-[10px] font-medium uppercase tracking-widest text-stone-400">Your review will be public and subject to moderation.</p> : null}
        </form>
      </motion.div>
    </motion.div>
  );
}
