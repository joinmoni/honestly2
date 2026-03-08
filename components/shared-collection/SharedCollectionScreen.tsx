"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import type { SharedCollectionPageData } from "@/lib/types/shared-collection";

type SharedCollectionScreenProps = {
  data: SharedCollectionPageData;
};

export function SharedCollectionScreen({ data }: SharedCollectionScreenProps) {
  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <nav className="fixed left-1/2 top-4 z-50 flex w-[92%] max-w-xl -translate-x-1/2 items-center justify-between rounded-full border border-stone-200/50 bg-white/70 px-4 py-3 shadow-xl shadow-stone-200/40 backdrop-blur-xl md:top-6 md:px-6">
        <Link href="/" className="serif-italic text-2xl md:text-3xl">
          {data.copy.brandLabel}
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="hidden text-[10px] font-bold uppercase tracking-widest text-stone-500 transition-colors hover:text-stone-900 sm:block">
            {data.copy.navFollowListLabel}
          </motion.button>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-full bg-stone-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-stone-800">
            {data.copy.navSignUpLabel}
          </motion.button>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28 md:pb-24 md:pt-32">
        <header className="mx-auto mb-20 max-w-2xl text-center md:mb-24">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Image src={data.curatorAvatarUrl} alt={data.curatorName} width={64} height={64} className="rounded-full border-4 border-white shadow-lg" />
              <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-amber-500 p-1 text-white">
                <Star size={10} strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">{data.copy.heroBylineLabel}</p>
          <h1 className="serif-italic mb-6 text-4xl md:text-7xl">{data.title}</h1>
          <p className="serif-italic text-lg leading-relaxed text-stone-500 md:text-xl">{data.description}</p>
        </header>

        <div className="space-y-16 md:space-y-20">
          {data.items.map((item, index) => {
            const cover = item.vendor.images.find((image) => image.kind === "cover") ?? item.vendor.images[0];
            const categoryLabel = item.vendor.primaryCategory?.name ?? "Vendor";
            const reversed = index % 2 === 1;

            return (
              <section key={item.vendor.id} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.38 }}
                  className={`flex flex-col items-center gap-8 ${reversed ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  <div className="aspect-[186/237] w-full overflow-hidden rounded-[1.75rem] shadow-xl shadow-stone-200/40 md:w-[36%]">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={cover.alt ?? item.vendor.name}
                        width={1200}
                        height={1500}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="w-full space-y-4 md:w-[64%]">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        {categoryLabel}
                      </span>
                      <div className="h-[1px] flex-1 bg-stone-100" />
                    </div>
                    <h2 className="text-3xl md:text-4xl">{item.vendor.name}</h2>
                    <p className="serif-italic leading-relaxed text-stone-600">{item.blurb}</p>
                    <div className="pt-4">
                      <Link
                        href={`/vendor/${item.vendor.slug}`}
                        className="inline-flex items-center gap-2 border-b-2 border-stone-900 pb-1 text-sm font-bold transition-all group-hover:gap-4"
                      >
                        {data.copy.viewProfileLabel}
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </section>
            );
          })}
        </div>

        <section className="relative mt-24 overflow-hidden rounded-[2.5rem] bg-stone-900 p-8 text-center text-white md:mt-40 md:rounded-[3rem] md:p-24">
          <div className="relative z-10">
            <h2 className="serif-italic mb-6 text-4xl md:text-6xl">{data.copy.ctaTitle}</h2>
            <p className="mx-auto mb-10 max-w-sm text-lg leading-relaxed text-stone-400">{data.copy.ctaDescription}</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-full bg-white px-10 py-4 font-bold text-stone-900 transition-colors hover:bg-stone-100">
                {data.copy.ctaPrimaryButtonLabel}
              </motion.button>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-full border border-stone-700 bg-stone-800 px-10 py-4 font-bold text-white transition-colors hover:bg-stone-700">
                {data.copy.ctaSecondaryButtonLabel}
              </motion.button>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-amber-600/20 blur-[100px]" />
        </section>
      </main>

    </div>
  );
}
