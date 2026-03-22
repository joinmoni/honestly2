"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import { BodyText, SectionTitle } from "@/components/ui/Typography";

type AdminCreateCategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onCreateCategory: (payload: {
    name: string;
    subcategories: string[];
    icon: string;
  }) => void;
};

const ICON_CHOICES = ["✨", "📸", "🌿", "🏰", "🍽️"];

export function AdminCreateCategoryModal({ open, onClose, onCreateCategory }: AdminCreateCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>(["Full Planning", "Day-of Coordination"]);
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("✨");

  const canSubmit = useMemo(() => categoryName.trim().length > 1, [categoryName]);

  const addTag = () => {
    const next = subcategoryInput.trim();
    if (!next) return;
    if (subcategories.some((tag) => tag.toLowerCase() === next.toLowerCase())) {
      setSubcategoryInput("");
      return;
    }
    setSubcategories((current) => [...current, next]);
    setSubcategoryInput("");
  };

  const reset = () => {
    setCategoryName("");
    setSubcategories(["Full Planning", "Day-of Coordination"]);
    setSubcategoryInput("");
    setSelectedIcon("✨");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-y-auto bg-stone-100/85 p-6 pt-24 pb-10 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={{ duration: 0.2 }} className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-stone-50 px-8 pb-6 pt-10">
              <SectionTitle>Create New Category</SectionTitle>
              <BodyText className="mt-2 text-sm text-stone-500">Define a primary category and its associated subcategories.</BodyText>
            </div>

            <form
              className="space-y-8 p-8"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSubmit) return;
                onCreateCategory({
                  name: categoryName.trim(),
                  subcategories,
                  icon: selectedIcon
                });
                reset();
                onClose();
              }}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Primary Category</label>
                <input
                  type="text"
                  placeholder="e.g., Event Planning"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Subcategories</label>

                <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100">
                  <div className="flex flex-wrap gap-2 p-1">
                    {subcategories.map((tag) => (
                      <span key={tag} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-600">
                        {tag}
                        <button type="button" className="text-stone-300 transition-colors hover:text-rose-500" onClick={() => setSubcategories((current) => current.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}>
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder="Add subcategory..."
                      className="min-w-[120px] flex-1 bg-transparent px-2 py-1.5 text-sm focus:outline-none"
                      value={subcategoryInput}
                      onChange={(event) => setSubcategoryInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addTag();
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-[10px] italic text-stone-400">Press Enter to add a subcategory tag.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Category Icon</label>
                <div className="flex gap-4">
                  {ICON_CHOICES.map((icon) => {
                    const active = icon === selectedIcon;
                    return (
                      <motion.button key={icon} type="button" whileTap={{ scale: 0.95 }} className={active ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xl" : "flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-stone-200 text-xl text-stone-300 transition-all hover:border-amber-400 hover:text-amber-500"} onClick={() => setSelectedIcon(icon)}>
                        {active ? icon : <Plus size={18} />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="flex-1 py-4 text-sm font-bold text-stone-400 transition-colors hover:text-stone-900" onClick={() => { reset(); onClose(); }}>
                  Discard
                </motion.button>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="submit" disabled={!canSubmit} className="flex-[2] rounded-2xl bg-stone-900 py-4 text-sm font-bold text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
                  Create Category
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
