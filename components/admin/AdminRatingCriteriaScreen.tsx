"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus } from "lucide-react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { BodyText, CardTitle, MetaText, PageTitle, PillText } from "@/components/ui/Typography";
import {
  createAdminRatingCriterion,
  reorderAdminRatingCriteria,
  toggleAdminRatingCriterion,
  updateAdminRatingCriterion
} from "@/lib/admin-rating-criteria.client";
import type { AdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";
import type { RatingCriterion } from "@/lib/types/domain";

type AdminRatingCriteriaScreenProps = {
  data: AdminRatingCriteriaData;
};

export function AdminRatingCriteriaScreen({ data }: AdminRatingCriteriaScreenProps) {
  const [criteria, setCriteria] = useState(data.criteria);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const runMutation = async (actionKey: string, action: () => Promise<RatingCriterion[]>) => {
    setPendingAction(actionKey);
    setErrorMessage(null);

    try {
      const nextCriteria = await action();
      setCriteria(nextCriteria);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The review rubric could not be updated right now.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <PageTitle className="mb-2 text-[2.8rem] leading-[0.98] md:text-[3.35rem]">{data.title}</PageTitle>
            <BodyText className="italic">{data.description}</BodyText>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800"
            disabled={pendingAction !== null}
            onClick={() =>
              void runMutation("create", () =>
                createAdminRatingCriterion(criteria, {
                  name: `New Criterion ${criteria.length + 1}`,
                  description: "New criterion description."
                })
              )
            }
          >
            <Plus size={14} strokeWidth={3} />
            {data.addLabel}
          </button>
        </header>

        {pendingAction ? <p className="mb-6 text-sm text-stone-500">Saving rubric changes…</p> : null}
        {errorMessage ? <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <motion.article
              key={criterion.id}
              whileHover={{ y: -1 }}
              className={`group flex items-center gap-6 rounded-[2rem] border border-stone-200 bg-white px-8 py-6 shadow-sm ${criterion.active ? "" : "opacity-60 grayscale-[0.5]"}`}
            >
              <button
                type="button"
                className={`transition-colors ${criterion.active ? "cursor-grab text-stone-400 hover:text-stone-500 active:cursor-grabbing" : "text-stone-300"}`}
                aria-label={`Move ${criterion.name}`}
                disabled={pendingAction !== null}
                onClick={() => {
                  if (index <= 0) return;
                  void runMutation(`move-${criterion.id}`, () => reorderAdminRatingCriteria(criteria, criterion.id, index - 1));
                }}
              >
                <GripVertical size={20} strokeWidth={2.5} />
              </button>

              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  {editingId === criterion.id ? (
                    <input
                      autoFocus
                      value={criterion.name}
                      onChange={(event) => {
                        setCriteria((current) =>
                          current.map((item) => (item.id === criterion.id ? { ...item, name: event.target.value } : item))
                        );
                      }}
                      onBlur={() => {
                        setEditingId(null);
                        void runMutation(`edit-${criterion.id}`, () =>
                          updateAdminRatingCriterion(criteria, criterion.id, { name: criterion.name })
                        );
                      }}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  ) : (
                    <CardTitle className={`text-[1.5rem] leading-tight md:text-[1.7rem] ${criterion.active ? "text-stone-900" : "line-through text-stone-400"}`}>{criterion.name}</CardTitle>
                  )}
                  <span
                    className={
                      criterion.active ? "rounded-full bg-stone-100 px-2 py-0.5 text-stone-700" : "rounded-full bg-stone-100 px-2 py-0.5 text-stone-400"
                    }
                  >
                    <PillText className={criterion.active ? "text-stone-700" : "text-stone-400"}>{criterion.active ? "Active" : "Inactive"}</PillText>
                  </span>
                </div>
                <BodyText className={`text-sm ${criterion.active ? "" : "italic text-stone-400"}`}>{criterion.description}</BodyText>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
                  disabled={pendingAction !== null}
                  onClick={() => setEditingId(criterion.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Toggle ${criterion.name}`}
                  className={`relative h-5 w-10 rounded-full ${criterion.active ? "bg-stone-900" : "bg-stone-200"}`}
                  disabled={pendingAction !== null}
                  onClick={() => void runMutation(`toggle-${criterion.id}`, () => toggleAdminRatingCriterion(criteria, criterion.id))}
                >
                  <span className={`absolute top-1 h-3 w-3 rounded-full bg-white ${criterion.active ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <footer className="mt-12 border-t border-stone-100 pt-8 text-center">
          <MetaText>
            Changes here affect the public <span className="text-amber-600">Review Modal</span> in real-time.
          </MetaText>
        </footer>
      </main>
    </div>
  );
}
