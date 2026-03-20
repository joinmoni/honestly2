"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";
import type { HomepageSearchIndex } from "@/lib/types/search";

type HomeHeroSearchProps = {
  searchWhoPlaceholder: string;
  searchWherePlaceholder: string;
  searchIndex: HomepageSearchIndex;
  initialWhoQuery?: string;
  initialWhereQuery?: string;
  onSubmitSearch?: (input: { who: string; where: string }) => void;
  className?: string;
};

type DropdownOption =
  | { id: string; kind: "category"; label: string; secondary?: string; emoji: string; href: string }
  | { id: string; kind: "vendor"; label: string; secondary: string; imageUrl?: string; href: string }
  | { id: string; kind: "location"; label: string };

type ActiveField = "who" | "where" | null;

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function HomeHeroSearch({
  searchWhoPlaceholder,
  searchWherePlaceholder,
  searchIndex,
  initialWhoQuery = "",
  initialWhereQuery = "",
  onSubmitSearch,
  className
}: HomeHeroSearchProps) {
  const router = useRouter();
  const whoInputId = useId();
  const whereInputId = useId();
  const whoFieldRef = useRef<HTMLDivElement | null>(null);
  const whereFieldRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [whoQuery, setWhoQuery] = useState(initialWhoQuery);
  const [whereQuery, setWhereQuery] = useState(initialWhereQuery);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalRect, setPortalRect] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const debouncedWhoQuery = useDebouncedValue(whoQuery, 220);
  const debouncedWhereQuery = useDebouncedValue(whereQuery, 220);

  useEffect(() => {
    if (!activeField) return;

    const sourceRef = activeField === "who" ? whoFieldRef : whereFieldRef;
    const updatePosition = () => {
      const rect = sourceRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPortalRect({
        top: rect.bottom + 12,
        left: rect.left,
        width: rect.width,
        maxHeight: Math.max(200, window.innerHeight - rect.bottom - 28)
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [activeField]);

  useEffect(() => {
    if (!activeField) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        whoFieldRef.current?.contains(target) ||
        whereFieldRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setActiveField(null);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [activeField]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.dataset.searchField === "true") {
      active.blur();
    }
  }, []);

  const whoSuggestions = useMemo(() => {
    const term = debouncedWhoQuery.trim().toLowerCase();
    const categoryMatches = searchIndex.categories
      .filter((category) => (term ? category.name.toLowerCase().includes(term) : true))
      .slice(0, 5);

    const vendorMatches = searchIndex.vendors
      .filter((vendor) => {
        if (!term) return true;
        return (
          vendor.name.toLowerCase().includes(term) ||
          vendor.categoryLabel.toLowerCase().includes(term) ||
          vendor.locationLabel.toLowerCase().includes(term)
        );
      })
      .slice(0, 5);

    const options: DropdownOption[] = [
      ...categoryMatches.map((category) => ({
        id: `category-${category.id}`,
        kind: "category" as const,
        label: category.name,
        emoji: category.emoji,
        href: category.href
      })),
      ...vendorMatches.map((vendor) => ({
        id: `vendor-${vendor.id}`,
        kind: "vendor" as const,
        label: vendor.name,
        secondary: `${vendor.categoryLabel} • ${vendor.locationLabel}`,
        imageUrl: vendor.imageUrl,
        href: `/vendor/${vendor.slug}`
      }))
    ];

    return {
      categoryMatches,
      vendorMatches,
      options
    };
  }, [debouncedWhoQuery, searchIndex.categories, searchIndex.vendors]);

  const whereSuggestions = useMemo(() => {
    const term = debouncedWhereQuery.trim().toLowerCase();
    const locationMatches = searchIndex.locations
      .filter((location) => (term ? location.label.toLowerCase().includes(term) : true))
      .slice(0, 6);

    return {
      locationMatches,
      options: locationMatches.map((location) => ({
        id: `location-${location.id}`,
        kind: "location" as const,
        label: location.label
      }))
    };
  }, [debouncedWhereQuery, searchIndex.locations]);

  const showDropdown = activeField !== null;
  const canUseDOM = typeof document !== "undefined";

  const submitSearch = () => {
    if (onSubmitSearch) {
      onSubmitSearch({ who: whoQuery.trim(), where: whereQuery.trim() });
      setActiveField(null);
      return;
    }
    const params = new URLSearchParams();
    if (whoQuery.trim()) params.set("q", whoQuery.trim());
    if (whereQuery.trim()) params.set("where", whereQuery.trim());
    const query = params.toString();
    router.push(query ? `/vendors?${query}` : "/vendors");
    setActiveField(null);
  };

  const selectOption = (option: DropdownOption) => {
    if (option.kind === "vendor") {
      router.push(option.href);
      setActiveField(null);
      return;
    }

    if (option.kind === "category") {
      setWhoQuery(option.label);
      setActiveField(null);
      return;
    }

    setWhereQuery(option.label);
    setActiveField(null);
  };

  const onKeyDown = (field: ActiveField) => (event: KeyboardEvent<HTMLInputElement>) => {
    const options = field === "who" ? whoSuggestions.options : whereSuggestions.options;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveField(field);
      if (!options.length) return;
      setActiveIndex((current) => (current + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveField(field);
      if (!options.length) return;
      setActiveIndex((current) => (current - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Enter") {
      if (activeField === field && options[activeIndex]) {
        event.preventDefault();
        selectOption(options[activeIndex]);
        return;
      }
      event.preventDefault();
      submitSearch();
      return;
    }

    if (event.key === "Escape") {
      setActiveField(null);
    }
  };

  const listboxId = activeField ? `${activeField}-search-listbox` : undefined;

  return (
    <>
      <form
        className={cn(
          "relative flex flex-col items-center rounded-[1.5rem] border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-200/30 md:flex-row md:rounded-full md:p-2",
          className
        )}
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <div ref={whoFieldRef} className="flex w-full flex-1 flex-col items-start border-b border-stone-100 px-5 py-2 md:border-b-0 md:border-r md:px-6">
          <label htmlFor={whoInputId} className="text-[9px] font-sans font-black uppercase tracking-[0.18em] text-stone-400">
            Who
          </label>
          <input
            id={whoInputId}
            type="text"
            value={whoQuery}
            placeholder={searchWhoPlaceholder}
            className="w-full bg-transparent text-base placeholder:text-stone-300 focus:outline-none md:text-sm"
            data-search-field="true"
            aria-expanded={activeField === "who"}
            aria-controls={activeField === "who" ? listboxId : undefined}
            role="combobox"
            aria-autocomplete="list"
            onFocus={() => {
              setActiveField("who");
              setActiveIndex(0);
            }}
            onChange={(event) => {
              setWhoQuery(event.target.value);
              setActiveField("who");
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown("who")}
          />
        </div>
        <div ref={whereFieldRef} className="flex w-full flex-1 flex-col items-start px-5 py-2 md:px-6">
          <label htmlFor={whereInputId} className="text-[9px] font-sans font-black uppercase tracking-[0.18em] text-stone-400">
            Where
          </label>
          <input
            id={whereInputId}
            type="text"
            value={whereQuery}
            placeholder={searchWherePlaceholder}
            className="w-full bg-transparent text-base placeholder:text-stone-300 focus:outline-none md:text-sm"
            data-search-field="true"
            aria-expanded={activeField === "where"}
            aria-controls={activeField === "where" ? listboxId : undefined}
            role="combobox"
            aria-autocomplete="list"
            onFocus={() => {
              setActiveField("where");
              setActiveIndex(0);
            }}
            onChange={(event) => {
              setWhereQuery(event.target.value);
              setActiveField("where");
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown("where")}
          />
        </div>
        <button
          type="submit"
          className="mt-2 flex h-12 w-full items-center justify-center rounded-xl px-6 font-sans font-black uppercase tracking-widest text-white transition-colors md:mt-0 md:h-auto md:w-auto md:rounded-full md:p-4"
          style={{ backgroundColor: "var(--brand-accent)" }}
          onMouseEnter={(event) => {
            event.currentTarget.style.backgroundColor = "var(--brand-accent-hover)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.backgroundColor = "var(--brand-accent)";
          }}
          aria-label="Search vendors"
        >
          <Search size={20} strokeWidth={2.5} />
        </button>
      </form>

      {canUseDOM && showDropdown && portalRect
        ? createPortal(
            <AnimatePresence>
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="z-[100]"
                style={{
                  position: "fixed",
                  top: portalRect.top,
                  left: portalRect.left,
                  width: portalRect.width,
                  maxHeight: portalRect.maxHeight
                }}
              >
                {activeField === "who" ? (
                  <WhoDropdown
                  id={listboxId ?? "who-search-listbox"}
                  maxHeight={portalRect.maxHeight}
                  query={whoQuery}
                  activeIndex={activeIndex}
                  categoryMatches={whoSuggestions.categoryMatches}
                  vendorMatches={whoSuggestions.vendorMatches}
                  setActiveIndex={setActiveIndex}
                  onSelect={selectOption}
                  onSearchAll={submitSearch}
                />
                ) : (
                  <WhereDropdown
                    id={listboxId ?? "where-search-listbox"}
                    maxHeight={portalRect.maxHeight}
                  query={whereQuery}
                  activeIndex={activeIndex}
                  locations={whereSuggestions.locationMatches}
                  setActiveIndex={setActiveIndex}
                  onSelect={selectOption}
                />
                )}
              </motion.div>
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}

function WhoDropdown({
  id,
  maxHeight,
  query,
  activeIndex,
  categoryMatches,
  vendorMatches,
  setActiveIndex,
  onSelect,
  onSearchAll
}: {
  id: string;
  maxHeight: number;
  query: string;
  activeIndex: number;
  categoryMatches: HomepageSearchIndex["categories"];
  vendorMatches: HomepageSearchIndex["vendors"];
  setActiveIndex: (index: number) => void;
  onSelect: (option: DropdownOption) => void;
  onSearchAll: () => void;
}) {
  const flatOptions: DropdownOption[] = [
    ...categoryMatches.map((category) => ({
      id: `category-${category.id}`,
      kind: "category" as const,
      label: category.name,
      emoji: category.emoji,
      href: category.href
    })),
    ...vendorMatches.map((vendor) => ({
      id: `vendor-${vendor.id}`,
      kind: "vendor" as const,
      label: vendor.name,
      secondary: `${vendor.categoryLabel} • ${vendor.locationLabel}`,
      imageUrl: vendor.imageUrl,
      href: `/vendor/${vendor.slug}`
    }))
  ];

  if (!flatOptions.length) {
    return (
      <div className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-2xl shadow-stone-200/50">
        <p className="text-sm font-medium text-stone-500">No vendors found for that search. Try &quot;Photography&quot; or &quot;Florists&quot;.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-stone-100 bg-white shadow-2xl shadow-stone-200/50">
      <div className="overflow-y-auto p-2" role="listbox" id={id} style={{ maxHeight }}>
        <div className="px-4 py-3">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-stone-400">Suggested Categories</p>
          <div className="space-y-1">
            {categoryMatches.map((category, categoryIndex) => {
              const isActive = categoryIndex === activeIndex;

              return (
                <button
                  key={category.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl border-l-2 border-l-transparent px-3 py-2.5 text-left transition-colors hover:border-l-amber-300 hover:bg-stone-50/40",
                    isActive && "border-l-amber-500 bg-stone-50/30"
                  )}
                  onMouseEnter={() => setActiveIndex(categoryIndex)}
                  onClick={() =>
                    onSelect({
                      id: `category-${category.id}`,
                      kind: "category",
                      label: category.name,
                      emoji: category.emoji,
                      href: category.href
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.emoji}</span>
                    <span className={cn("text-sm font-semibold text-stone-700", isActive && "font-bold text-stone-900")}>{category.name}</span>
                  </div>
                  <span className={cn("text-[10px] font-sans font-black uppercase tracking-widest transition-opacity", isActive ? "text-amber-600" : "text-stone-300 opacity-0 group-hover:opacity-100")}>
                    {isActive ? "Active" : "Press Enter"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-4 my-2 h-px bg-stone-50" />

        <div className="px-4 py-3">
          <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-stone-400">Top Matches</p>
          <div className="space-y-1">
            {vendorMatches.map((vendor, vendorIndex) => {
              const optionIndex = categoryMatches.length + vendorIndex;
              const isActive = optionIndex === activeIndex;

              return (
                <button
                  key={vendor.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-l-2 border-l-transparent px-3 py-2.5 text-left transition-colors hover:border-l-amber-300 hover:bg-stone-50/40",
                    isActive && "border-l-amber-500 bg-stone-50/30"
                  )}
                  onMouseEnter={() => setActiveIndex(optionIndex)}
                  onClick={() =>
                    onSelect({
                      id: `vendor-${vendor.id}`,
                      kind: "vendor",
                      label: vendor.name,
                      secondary: `${vendor.categoryLabel} • ${vendor.locationLabel}`,
                      imageUrl: vendor.imageUrl,
                      href: `/vendor/${vendor.slug}`
                    })
                  }
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-stone-100">
                    {vendor.imageUrl ? <Image src={vendor.imageUrl} alt={vendor.name} width={32} height={32} className="h-8 w-8 object-cover" /> : null}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-stone-800">{vendor.name}</p>
                    <p className="text-[10px] font-medium text-stone-400">{vendor.categoryLabel} • {vendor.locationLabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-stone-50 p-2">
          <button type="button" className="w-full py-3 font-sans text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 transition-colors hover:text-stone-900" onClick={onSearchAll}>
            Search all vendors for &quot;{query || "all"}&quot;
          </button>
        </div>
      </div>
    </div>
  );
}

function WhereDropdown({
  id,
  maxHeight,
  query,
  activeIndex,
  locations,
  setActiveIndex,
  onSelect
}: {
  id: string;
  maxHeight: number;
  query: string;
  activeIndex: number;
  locations: HomepageSearchIndex["locations"];
  setActiveIndex: (index: number) => void;
  onSelect: (option: DropdownOption) => void;
}) {
  if (!locations.length) {
    return (
      <div className="rounded-[2rem] border border-stone-100 bg-white p-6 shadow-2xl shadow-stone-200/50">
        <p className="text-sm font-medium text-stone-500">No locations found for that search. Try &quot;Brooklyn&quot; or &quot;London&quot;.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto rounded-[2rem] border border-stone-100 bg-white p-2 shadow-2xl shadow-stone-200/50" role="listbox" id={id} style={{ maxHeight }}>
      <div className="px-4 py-3">
        <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-stone-400">{query.trim() ? "Matching Locations" : "Popular Locations"}</p>
        <div className="space-y-1">
          {locations.map((location, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={location.id}
                type="button"
                role="option"
                aria-selected={isActive}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border-l-2 border-l-transparent px-3 py-2.5 text-left transition-colors hover:border-l-amber-300 hover:bg-stone-50/40",
                  isActive && "border-l-amber-500 bg-stone-50/30"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() =>
                  onSelect({
                    id: `location-${location.id}`,
                    kind: "location",
                    label: location.label
                  })
                }
              >
                <MapPin size={14} className="text-stone-400" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-stone-800">{location.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
