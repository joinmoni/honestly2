"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2x2, MapPin, Search, Store, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Category } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

type HomeCategoryMenuProps = {
  categories: Category[];
  className?: string;
  triggerClassName?: string;
  icon?: ReactNode;
  label?: string;
};

export function HomeCategoryMenu({
  categories,
  className,
  triggerClassName,
  icon,
  label = "Search"
}: HomeCategoryMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    vendors: Array<{ id: string; name: string; slug: string }>;
    locations: Array<{ label: string }>;
  }>({ vendors: [], locations: [] });
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const normalized = query.trim();

    if (!normalized) {
      setResults({ vendors: [], locations: [] });
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search/global?query=${encodeURIComponent(normalized)}`, {
          signal: controller.signal,
          cache: "no-store"
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "Search failed.");
        }
        setResults({
          vendors: payload.vendors ?? [],
          locations: payload.locations ?? []
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setResults({ vendors: [], locations: [] });
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [open, query]);

  const showSearchResults = query.trim().length > 0;
  const hasSearchResults = results.vendors.length > 0 || results.locations.length > 0;
  const topCategories = useMemo(() => categories.slice(0, 3), [categories]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "hidden h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:opacity-90 md:inline-flex",
          triggerClassName
        )}
        style={triggerClassName ? undefined : { backgroundColor: "var(--brand-accent)" }}
        aria-label="Search vendors and locations"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {icon ?? <Search size={18} />}
      </button>

      <button
        type="button"
        className={cn(
          "flex flex-1 flex-col items-center gap-1 rounded-[1.4rem] px-2 py-2.5 text-[10px] font-semibold text-white transition-colors md:hidden",
          triggerClassName
        )}
        style={triggerClassName ? undefined : { backgroundColor: "var(--brand-accent)" }}
        aria-label="Search vendors and locations"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {icon ?? <Search size={18} />}
        <span className="truncate">{label}</span>
      </button>

      <AnimatePresence>
        {open && mounted
          ? createPortal(
              <>
                <motion.div
                  className="fixed inset-0 z-[190] bg-stone-900/20 md:bg-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="fixed inset-x-4 bottom-24 z-[200] rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-2xl md:absolute md:inset-auto md:right-0 md:top-[calc(100%+0.75rem)] md:w-[420px] md:bottom-auto"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Browse</p>
                      <p className="mt-1 text-lg font-semibold text-stone-900">Search vendors or locations</p>
                    </div>
                    <button type="button" className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-900" onClick={() => setOpen(false)}>
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-3 rounded-[1.1rem] border border-stone-200 bg-stone-50 px-4 py-3">
                      <Search size={16} className="text-stone-400" />
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search vendors or locations"
                        className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  <div className="max-h-[56vh] space-y-3 overflow-y-auto pr-1">
                    {showSearchResults ? (
                      <div className="space-y-4">
                        {results.vendors.length ? (
                          <div className="rounded-[1.25rem] border border-stone-100 bg-stone-50/70 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Vendors</p>
                            <div className="mt-3 space-y-2">
                              {results.vendors.map((vendor) => (
                                <Link
                                  key={vendor.id}
                                  href={`/vendor/${vendor.slug}`}
                                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                                  onClick={() => setOpen(false)}
                                >
                                  <Store size={15} className="text-stone-400" />
                                  {vendor.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {results.locations.length ? (
                          <div className="rounded-[1.25rem] border border-stone-100 bg-stone-50/70 p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Locations</p>
                            <div className="mt-3 space-y-2">
                              {results.locations.map((location) => (
                                <Link
                                  key={location.label}
                                  href={`/vendors?where=${encodeURIComponent(location.label)}`}
                                  className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                                  onClick={() => setOpen(false)}
                                >
                                  <MapPin size={15} className="text-stone-400" />
                                  {location.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {!loading && !hasSearchResults ? (
                          <div className="rounded-[1.25rem] border border-stone-100 bg-stone-50/70 p-4 text-sm text-stone-500">No vendors or locations matched that search.</div>
                        ) : null}
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {topCategories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                              onClick={() => setOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>

                        {categories.map((category) => (
                          <div key={category.id} className="rounded-[1.25rem] border border-stone-100 bg-stone-50/70 p-4">
                            <Link href={`/category/${category.slug}`} className="inline-flex items-center gap-2 text-base font-semibold text-stone-900" onClick={() => setOpen(false)}>
                              <Grid2x2 size={15} className="text-stone-400" />
                              {category.name}
                            </Link>
                            {category.subcategories.length ? (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/category/${category.slug}`}
                                    className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
                                    onClick={() => setOpen(false)}
                                  >
                                    {subcategory.name}
                                  </Link>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              </>,
              document.body
            )
          : null}
      </AnimatePresence>
    </div>
  );
}
