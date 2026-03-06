"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Plus, Trash2 } from "lucide-react";
import type { VendorEditPageData } from "@/lib/types/vendor-edit";

type VendorEditScreenProps = {
  data: VendorEditPageData;
};

export function VendorEditScreen({ data }: VendorEditScreenProps) {
  const [headline, setHeadline] = useState(data.headline);
  const [description, setDescription] = useState(data.description);
  const [locations, setLocations] = useState(data.locations);
  const [images, setImages] = useState(data.images);

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="serif-italic text-sm text-amber-600">{data.copy.businessLabel}</span>
            <span className="h-4 w-[1px] bg-stone-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
              {data.copy.editingPrefix} {data.vendorName}
            </span>
          </div>
          <div className="flex gap-3">
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="px-5 py-2 text-sm font-bold text-stone-500 transition-colors hover:text-stone-900">
              {data.copy.discardLabel}
            </motion.button>
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-full bg-stone-900 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800">
              {data.copy.publishLabel}
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12">
          <h1 className="mb-2 text-4xl">{data.copy.pageTitle}</h1>
          <p className="text-stone-500">
            {data.copy.profileStatusPrefix}{" "}
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
              {data.copy.profileStatusLabel}
            </span>
          </p>
        </header>

        <div className="space-y-16">
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">01</span>
              <h2 className="serif-italic text-xl">{data.copy.sectionNarrativeLabel}</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-500">{data.copy.headlineLabel}</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  className="serif-italic w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-lg transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-stone-500">{data.copy.descriptionLabel}</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-2xl border border-stone-100 bg-stone-50 px-5 py-4 text-sm leading-relaxed transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">02</span>
                <h2 className="serif-italic text-xl">{data.copy.sectionServiceAreasLabel}</h2>
              </div>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="text-[10px] font-bold uppercase tracking-widest text-amber-600"
                onClick={() =>
                  setLocations((current) => [
                    ...current,
                    {
                      id: `loc-${current.length + 1}`,
                      city: "New Location",
                      region: "",
                      country: "USA",
                      isPrimary: false
                    }
                  ])
                }
              >
                {data.copy.addLocationLabel}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {locations.map((location) => (
                <motion.div key={location.id} whileHover={{ y: -2 }} className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-stone-50 p-2 text-stone-400">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-semibold">
                      {location.city}
                      {location.region ? `, ${location.region}` : ""}
                    </span>
                  </div>
                  <button type="button" className="text-stone-300 transition-colors hover:text-rose-400" onClick={() => setLocations((current) => current.filter((item) => item.id !== location.id))}>
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">03</span>
                <h2 className="serif-italic text-xl">{data.copy.sectionGalleryLabel}</h2>
              </div>
              <span className="text-[10px] font-medium italic text-stone-400">{data.copy.dragHintLabel}</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <motion.div key={image.id} whileHover={{ y: -2 }} className="group relative aspect-square overflow-hidden rounded-2xl">
                  <Image src={image.url} alt={image.alt ?? data.vendorName} fill className="object-cover" sizes="(max-width:768px) 33vw, 200px" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" className="rounded-full bg-white/90 p-2 shadow-lg" onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 text-stone-300 transition-all hover:border-amber-400 hover:text-amber-500"
                onClick={() =>
                  setImages((current) => [
                    ...current,
                    {
                      id: `img-${current.length + 1}`,
                      url: current[0]?.url ?? "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=400",
                      alt: `${data.vendorName} gallery image`,
                      kind: "gallery"
                    }
                  ])
                }
              >
                <Plus size={24} />
                <span className="mt-2 text-[10px] font-bold uppercase tracking-widest">{data.copy.uploadLabel}</span>
              </motion.button>
            </div>
          </section>
        </div>

        <div className="mt-32 border-t border-stone-100 pt-12">
          <h3 className="mb-2 text-sm font-bold text-rose-800">{data.copy.unpublishTitle}</h3>
          <p className="mb-6 text-xs text-stone-500">{data.copy.unpublishDescription}</p>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="rounded-xl bg-rose-50 px-6 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100">
            {data.copy.unpublishActionLabel}
          </motion.button>
        </div>
      </main>
    </div>
  );
}
