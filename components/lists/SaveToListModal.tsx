"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CardTitle, MetaText, SectionTitle } from "@/components/ui/Typography";

type SaveToListOption = {
  id: string;
  name: string;
  itemCount: number;
  previewImageUrl?: string;
  selected: boolean;
};

type SaveToListModalProps = {
  open: boolean;
  title?: string;
  contextImageUrl?: string;
  lists: SaveToListOption[];
  onClose: () => void;
  onToggleList: (listId: string) => void;
  onCreateCollection: () => void;
  onDone: () => void;
};

export function SaveToListModal({
  open,
  title = "Save to list",
  contextImageUrl,
  lists,
  onClose,
  onToggleList,
  onCreateCollection,
  onDone
}: SaveToListModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[90] flex min-h-screen flex-col items-center justify-end bg-stone-100/80 p-4 md:justify-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          {contextImageUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.4, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative mb-[-76px] hidden w-80 overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm blur-[1px] md:block"
            >
              <Image src={contextImageUrl} alt="Selected vendor" width={320} height={320} className="aspect-square w-full object-cover" />
              <div className="p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-100" />
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative z-50 flex max-h-[85vh] w-full max-w-[360px] flex-col overflow-hidden rounded-[2rem] border border-stone-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <SectionTitle className="serif-italic text-[2rem] leading-tight md:text-[2.2rem]">{title}</SectionTitle>
              <button type="button" className="text-stone-300 transition-colors hover:text-stone-900" onClick={onClose} aria-label="Close save modal">
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 px-2 pb-2">
              <div className="max-h-[50vh] space-y-1 overflow-y-auto px-2">
                {lists.map((list) => (
                  <motion.button
                    key={list.id}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    className="group flex w-full items-center justify-between rounded-2xl p-2 text-left transition-all hover:bg-stone-50"
                    onClick={() => onToggleList(list.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                        {list.previewImageUrl ? (
                          <Image src={list.previewImageUrl} alt={list.name} width={48} height={48} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-stone-100" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-[1.6rem] leading-tight md:text-[1.75rem]">{list.name}</CardTitle>
                        <MetaText className="mt-1">{list.itemCount} Items</MetaText>
                      </div>
                    </div>

                    {list.selected ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-stone-200 transition-colors group-hover:border-stone-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="mt-2 border-t border-stone-50 px-2 pt-2">
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} type="button" className="group flex w-full items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-amber-50" onClick={onCreateCollection}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white transition-all group-hover:border-amber-400">
                    <Plus size={18} className="text-stone-400 transition-colors group-hover:text-amber-600" />
                  </div>
                  <span className="text-sm font-bold text-stone-600 transition-colors group-hover:text-amber-800">Create new list</span>
                </motion.button>
              </div>
            </div>

            <div className="rounded-b-[2rem] bg-stone-50/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="w-full rounded-2xl bg-stone-900 py-4 text-sm font-bold text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800" onClick={onDone}>
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    ,
    document.body
  );
}
