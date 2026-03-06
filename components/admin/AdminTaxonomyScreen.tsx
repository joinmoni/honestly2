"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminCreateCategoryModal } from "@/components/admin/AdminCreateCategoryModal";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTopNav } from "@/components/admin/AdminTopNav";
import type { AdminTaxonomyData } from "@/lib/types/admin-dashboard";

type AdminTaxonomyScreenProps = {
  data: AdminTaxonomyData;
};

export function AdminTaxonomyScreen({ data }: AdminTaxonomyScreenProps) {
  const [categories, setCategories] = useState(data.categories);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#F9F8F6] font-sans text-stone-900 antialiased">
        <AdminTopNav brandLabel={data.brandLabel} navLinks={data.navLinks} />

        <main className="mx-auto max-w-5xl px-6 py-12">
          <header className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-4xl">{data.title}</h1>
              <p className="font-medium italic text-stone-500">{data.description}</p>
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

          <div className="grid grid-cols-1 gap-6">
            {categories.map((category) => (
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
                        <h3 className={`text-2xl font-display ${category.muted ? "text-stone-500" : ""}`}>{category.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Slug: {category.slug}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!category.muted ? <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Approved Subcategories</p> : null}
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
                                className="opacity-0 transition-opacity hover:text-stone-900 group-hover/tag:opacity-100"
                                onClick={() => {
                                  setCategories((current) =>
                                    current.map((item) =>
                                      item.id === category.id
                                        ? { ...item, subcategories: item.subcategories.filter((itemName) => itemName !== subcategory) }
                                        : item
                                    )
                                  );
                                }}
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
                          onClick={() => {
                            setCategories((current) =>
                              current.map((item) =>
                                item.id === category.id
                                  ? { ...item, subcategories: [...item.subcategories, `New Sub ${item.subcategories.length + 1}`] }
                                  : item
                              )
                            );
                          }}
                        >
                          <Plus size={12} strokeWidth={3} />
                          Add Sub
                        </button>
                      </div>
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
                      onClick={() => setCategories((current) => current.filter((item) => item.id !== category.id))}
                    >
                      <Trash2 size={18} />
                    </button>
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

      <AdminCreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreateCategory={(payload) => {
          setCategories((current) => [
            {
              id: `cat-local-${current.length + 1}`,
              name: payload.name,
              slug: payload.name.toLowerCase().trim().replace(/\s+/g, "-"),
              icon: payload.icon,
              subcategories: payload.subcategories
            },
            ...current
          ]);
        }}
      />
    </>
  );
}
