"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vendor } from "@/lib/types/domain";

type VendorImageCarouselProps = {
  vendor: Vendor;
  saved?: boolean;
  onSaveClick?: (vendorId: string) => void;
  className?: string;
};

export function VendorImageCarousel({ vendor, saved = false, onSaveClick, className }: VendorImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const images = vendor.images.length ? vendor.images : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const updateActiveIndex = () => {
      const nextIndex = Math.round(node.scrollLeft / node.clientWidth);
      setActiveIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
    };

    updateActiveIndex();
    node.addEventListener("scroll", updateActiveIndex, { passive: true });

    return () => node.removeEventListener("scroll", updateActiveIndex);
  }, [images.length]);

  const scrollToIndex = (index: number) => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ left: node.clientWidth * index, behavior: "smooth" });
  };

  return (
    <div className={cn("relative aspect-[298/246] w-full overflow-hidden rounded-[1.75rem] bg-stone-100", className)}>
      <div ref={scrollRef} className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto">
        {images.map((image) => (
          <div key={image.id} className="relative h-full w-full shrink-0 snap-center">
            <Image src={image.url} alt={image.alt ?? vendor.name} fill className="object-cover" sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1280px) 25vw, 298px" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/35 via-stone-950/10 to-transparent" />

      <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
        <Star size={13} className="fill-white text-white" />
        <span>{vendor.ratingAvg.toFixed(1)}</span>
        <span className="text-white/70">({vendor.reviewCount})</span>
      </div>

      <button
        type="button"
        className="absolute right-4 top-4 rounded-full bg-black/80 p-3 text-white shadow-lg shadow-black/20 transition-colors hover:bg-black"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onSaveClick?.(vendor.id);
        }}
        aria-label="Save vendor"
      >
        <Heart size={22} className={saved ? "fill-white text-white" : "text-white"} />
      </button>

      {images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/60 bg-white/40 transition-all",
                activeIndex === index && "w-5 bg-white"
              )}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                scrollToIndex(index);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
