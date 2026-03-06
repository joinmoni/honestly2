"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus } from "lucide-react";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import type { AdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";

type AdminRatingCriteriaScreenProps = {
  data: AdminRatingCriteriaData;
};

export function AdminRatingCriteriaScreen({ data }: AdminRatingCriteriaScreenProps) {
  const [criteria, setCriteria] = useState(data.criteria);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
      <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <header className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight">{data.title}</h1>
            <p className="font-medium italic text-stone-500">{data.description}</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800"
            onClick={() => {
              setCriteria((current) => [
                ...current,
                {
                  id: `crit-local-${current.length + 1}`,
                  name: `New Criterion ${current.length + 1}`,
                  description: "New criterion description.",
                  active: true,
                  position: current.length + 1
                }
              ]);
            }}
          >
            <Plus size={14} strokeWidth={3} />
            {data.addLabel}
          </button>
        </header>

        <div className="space-y-4">
          {criteria.map((criterion) => (
            <motion.article
              key={criterion.id}
              whileHover={{ y: -1 }}
              className={`group flex items-center gap-6 rounded-[2rem] border border-stone-200 bg-white px-8 py-6 shadow-sm ${criterion.active ? "" : "opacity-60 grayscale-[0.5]"}`}
            >
              <button
                type="button"
                className={`transition-colors ${criterion.active ? "cursor-grab text-stone-400 hover:text-stone-500 active:cursor-grabbing" : "text-stone-300"}`}
                aria-label={`Move ${criterion.name}`}
                onClick={() => {
                  const index = criteria.findIndex((item) => item.id === criterion.id);
                  if (index <= 0) return;

                  setCriteria((current) => {
                    const next = [...current];
                    const previous = next[index - 1];
                    next[index - 1] = next[index]!;
                    next[index] = previous!;
                    return next;
                  });
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
                      onBlur={() => setEditingId(null)}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    />
                  ) : (
                    <h3 className={`font-bold ${criterion.active ? "text-stone-900" : "line-through text-stone-400"}`}>{criterion.name}</h3>
                  )}
                  <span
                    className={
                      criterion.active
                        ? "rounded-full bg-stone-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-stone-700"
                        : "rounded-full bg-stone-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-stone-400"
                    }
                  >
                    {criterion.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className={`text-xs font-medium ${criterion.active ? "text-stone-500" : "italic text-stone-400"}`}>{criterion.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
                  onClick={() => setEditingId(criterion.id)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  aria-label={`Toggle ${criterion.name}`}
                  className={`relative h-5 w-10 rounded-full ${criterion.active ? "bg-stone-900" : "bg-stone-200"}`}
                  onClick={() => {
                    setCriteria((current) =>
                      current.map((item) => (item.id === criterion.id ? { ...item, active: !item.active } : item))
                    );
                  }}
                >
                  <span className={`absolute top-1 h-3 w-3 rounded-full bg-white ${criterion.active ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        <footer className="mt-12 border-t border-stone-100 pt-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Changes here affect the public <span className="text-amber-600">Review Modal</span> in real-time.
          </p>
        </footer>
      </main>
    </div>
  );
}
