"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import {
  addAdminSubcategory,
  createAdminCategory,
  deleteAdminCategory,
  removeAdminSubcategory,
  reorderAdminHomepageCategories,
  toggleAdminHomepageCategory
} from "@/lib/admin-categories.client";
import { AdminCreateCategoryModal } from "@/components/admin/AdminCreateCategoryModal";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { BodyText, CardTitle, Eyebrow, PageTitle, SectionTitle } from "@/components/ui/Typography";
import type { AdminTaxonomyData } from "@/lib/types/admin-dashboard";

type AdminTaxonomyScreenProps = {
  data: AdminTaxonomyData;
};

export function AdminTaxonomyScreen({ data }: AdminTaxonomyScreenProps) {
  const [categories, setCategories] = useState(data.categories);
  const [createOpen, setCreateOpen] = useState(false);
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const orderedCategories = [...categories].sort((a, b) => {
    if (a.featuredOnHome && b.featuredOnHome) {
      return (a.homeOrder ?? Number.MAX_SAFE_INTEGER) - (b.homeOrder ?? Number.MAX_SAFE_INTEGER);
    }
    if (a.featuredOnHome) return -1;
    if (b.featuredOnHome) return 1;
    return a.name.localeCompare(b.name);
  });
  const featuredCategories = orderedCategories.filter((category) => category.featuredOnHome);

  const runMutation = async (actionKey: string, action: () => Promise<typeof categories>) => {
    setPendingAction(actionKey);
    setErrorMessage(null);

    try {
      const nextCategories = await action();
      setCategories(nextCategories);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The taxonomy could not be updated right now.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
        <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <PageTitle className="mb-2">{data.title}</PageTitle>
              <BodyText className="italic text-stone-500">{data.description}</BodyText>
            </div>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="flex items-center gap-2 rounded-2xl bg-stone-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={14} strokeWidth={3} />
              {data.createCategoryLabel}
            </motion.button>
          </header>

          {pendingAction ? <p className="mb-6 text-sm text-stone-500">Saving taxonomy changes…</p> : null}
          {errorMessage ? <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid grid-cols-1 gap-6">
              {orderedCategories.map((category) => (
              <motion.article
                key={category.id}
                whileHover={{ y: -2 }}
                className={`group rounded-[2.5rem] border border-stone-200 bg-white p-8 shadow-sm ${category.muted ? "opacity-80" : ""}`}
              >
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-inner ${category.muted ? "bg-stone-100" : "bg-amber-50"}`}>
                        {category.icon}
                      </div>
                      <div>
                        <CardTitle className={category.muted ? "text-stone-500" : undefined}>{category.name}</CardTitle>
                        <Eyebrow>Slug: {category.slug}</Eyebrow>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!category.muted ? <Eyebrow className="text-[9px]">Approved Subcategories</Eyebrow> : null}
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((subcategory) => (
                          <span
                            key={subcategory}
                            className={`group/tag flex cursor-default items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-colors ${category.muted ? "border-stone-100 bg-stone-50 text-stone-400" : "border-stone-100 bg-stone-50 text-stone-600 hover:bg-white"}`}
                          >
                            {subcategory}
                            {!category.muted ? (
                              <button
                                type="button"
                                className="opacity-100 transition-opacity hover:text-stone-900 md:opacity-0 md:group-hover/tag:opacity-100"
                                disabled={pendingAction !== null}
                                onClick={() => void runMutation(`remove-sub-${category.id}-${subcategory}`, () => removeAdminSubcategory(categories, category.id, subcategory))}
                                aria-label={`Remove ${subcategory}`}
                              >
                                <X size={12} />
                              </button>
                            ) : null}
                          </span>
                        ))}

                        <button
                          type="button"
                          className={`flex items-center gap-1 rounded-xl border px-4 py-2 text-xs font-bold transition-all ${category.muted ? "border-dashed border-stone-200 text-stone-400" : "border-dashed border-stone-200 text-amber-600 hover:border-amber-400 hover:bg-amber-50"}`}
                          disabled={pendingAction !== null}
                          onClick={() =>
                            void runMutation(`add-sub-${category.id}`, () =>
                              addAdminSubcategory(categories, category.id, `New Sub ${category.subcategories.length + 1}`)
                            )
                          }
                        >
                          <Plus size={12} strokeWidth={3} />
                          Add Sub
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-stone-100 bg-stone-50/70 p-4">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <Eyebrow className="text-[9px]">Homepage Merchandising</Eyebrow>
                          <BodyText className="text-xs">Control which taxonomy rows appear on the homepage and in what order.</BodyText>
                        </div>
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                            category.featuredOnHome ? "bg-amber-100 text-amber-800" : "bg-white text-stone-500"
                          }`}
                          disabled={pendingAction !== null}
                          onClick={() => void runMutation(`feature-${category.id}`, () => toggleAdminHomepageCategory(categories, category.id))}
                        >
                          <Star size={12} className={category.featuredOnHome ? "fill-current" : ""} />
                          {category.featuredOnHome ? "Featured on Home" : "Feature on Home"}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                          {category.featuredOnHome && category.homeOrder ? `Home Row ${category.homeOrder}` : "Not on Homepage"}
                        </span>
                      </div>

                      {category.featuredOnHome && category.promotedSubcategories.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {category.promotedSubcategories.map((subcategory) => (
                            <span key={`${category.id}-${subcategory}`} className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500">
                              {subcategory}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button type="button" className="rounded-xl p-3 text-stone-400 transition-all hover:bg-stone-50 hover:text-stone-900" aria-label={`Edit ${category.name}`}>
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      className="rounded-xl p-3 text-stone-400 transition-all hover:bg-stone-50 hover:text-stone-900"
                      aria-label={`Delete ${category.name}`}
                      disabled={pendingAction !== null}
                      onClick={() => void runMutation(`delete-${category.id}`, () => deleteAdminCategory(categories, category.id))}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
              ))}
            </div>

            <aside className="xl:sticky xl:top-28 xl:self-start">
              <div className="rounded-[2.25rem] border border-stone-200 bg-white p-6 shadow-sm">
                <Eyebrow className="mb-2">Homepage Layout</Eyebrow>
                <SectionTitle>Arrange Featured Rows</SectionTitle>
                <BodyText className="mt-2 text-sm">
                  Drag featured categories to control the order they appear in the homepage shortcut rail and merchandising stack.
                </BodyText>

                <div className="mt-6 space-y-3">
                  {featuredCategories.map((category) => (
                    <div
                      key={category.id}
                      draggable
                      onDragStart={() => setDraggingCategoryId(category.id)}
                      onDragEnd={() => setDraggingCategoryId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (!draggingCategoryId) return;
                        void runMutation(`reorder-${draggingCategoryId}-${category.id}`, () =>
                          reorderAdminHomepageCategories(categories, draggingCategoryId, category.id)
                        );
                        setDraggingCategoryId(null);
                      }}
                      className={`flex items-center gap-3 rounded-[1.4rem] border px-4 py-4 transition-colors ${
                        draggingCategoryId === category.id ? "border-amber-300 bg-amber-50" : "border-stone-200 bg-stone-50/70"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">{category.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-stone-900">{category.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">
                          Home Row {category.homeOrder}
                        </p>
                      </div>
                      <GripVertical size={16} className="text-stone-400" />
                    </div>
                  ))}
                </div>

                {!featuredCategories.length ? (
                  <div className="mt-6 rounded-[1.4rem] border border-dashed border-stone-200 bg-stone-50/60 px-4 py-6 text-center text-sm text-stone-500">
                    Feature a category from the left to add it to the homepage ordering panel.
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          <AdminPagination
            currentPage={data.pagination.currentPage}
            totalPages={data.pagination.totalPages}
            pageNumbers={data.pagination.pageNumbers}
          />
        </main>
      </div>

      <AdminCreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateCategory={(payload) => {
          void runMutation(`create-${payload.name}`, () => createAdminCategory(categories, payload));
        }}
      />
    </>
  );
}
