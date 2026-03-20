"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CategoryVendorCard } from "@/components/category-listing/CategoryVendorCard";
import { ProfessionalCtaBanner } from "@/components/public/ProfessionalCtaBanner";
import type { CategoryListingPageData } from "@/lib/types/category-listing";

type CategoryListingScreenProps = {
  data: CategoryListingPageData;
};

export function CategoryListingScreen({ data }: CategoryListingScreenProps) {
  const [activeStyleId, setActiveStyleId] = useState("all");
  const activeStyle = data.styleChips.find((chip) => chip.id === activeStyleId);
  const hasAccentSplit =
    data.copy.headlineAccent &&
    data.copy.headlineAccent !== data.copy.headlineTop &&
    data.copy.headlineTop.includes(data.copy.headlineAccent);
  const headlineLead = hasAccentSplit
    ? data.copy.headlineTop.replace(data.copy.headlineAccent, "").trim()
    : data.copy.headlineTop;

  const visibleVendors = useMemo(() => {
    if (!activeStyle || !activeStyle.subcategorySlug) return data.vendors;
    return data.vendors.filter((vendor) => vendor.subcategories.some((subcategory) => subcategory.slug === activeStyle.subcategorySlug));
  }, [activeStyle, data.vendors]);

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="serif-italic text-2xl">
          honestly<span className="text-amber-600">.</span>
        </Link>
        <div className="flex items-center gap-6 text-[13px] font-bold uppercase tracking-[0.15em] text-stone-500">
          <Link href="/vendors" className="border-b-2 border-stone-900 pb-1 text-stone-900">
            {data.copy.navSearchLabel}
          </Link>
          <Link href="/lists" className="transition-colors hover:text-stone-900">
            {data.copy.navCollectionsLabel}
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-16 max-w-2xl">
          <nav className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
            <Link href="/" className="hover:text-stone-600">
              {data.copy.breadcrumbHomeLabel}
            </Link>{" "}
            / <span className="text-stone-900">{data.categoryName}</span>
          </nav>
          <h1 className="mb-6 text-5xl leading-tight md:text-6xl">
            {headlineLead}
            {hasAccentSplit ? (
              <>
                <br />
                <span className="serif-italic text-stone-400">{data.copy.headlineAccent}</span>
              </>
            ) : null}
          </h1>
          <p className="text-lg leading-relaxed text-stone-600">{data.copy.description}</p>
        </header>

        <section className="mb-12 border-b border-stone-100 pb-8">
          <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto">
            {data.styleChips.map((chip) => {
              const active = chip.id === activeStyleId;
              return (
                <motion.button
                  key={chip.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={
                    active
                      ? "whitespace-nowrap rounded-full bg-stone-900 px-5 py-2.5 text-xs font-sans font-black uppercase tracking-widest text-white"
                      : "whitespace-nowrap rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-sans font-black uppercase tracking-widest text-stone-600 transition-colors hover:border-stone-900"
                  }
                  onClick={() => setActiveStyleId(chip.id)}
                >
                  {chip.label}
                </motion.button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVendors.map((vendor) => (
            <CategoryVendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>

        <ProfessionalCtaBanner className="mt-16 md:mt-20" />

        <div className="mt-24 text-center">
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-full border border-stone-200 bg-white px-10 py-4 text-sm font-sans font-black uppercase tracking-widest text-stone-900 shadow-sm transition-colors hover:bg-stone-50">
            {data.copy.exploreMoreLabel}
          </motion.button>
        </div>
      </main>

    </div>
  );
}
