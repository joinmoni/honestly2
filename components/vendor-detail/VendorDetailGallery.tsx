import Image from "next/image";
import type { VendorImage } from "@/lib/types/domain";

type VendorDetailGalleryProps = {
  images: VendorImage[];
};

export function VendorDetailGallery({ images }: VendorDetailGalleryProps) {
  const [first, second, third, fourth] = images;
  if (!first) return null;

  return (
    <div className="mb-16 grid h-[420px] grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-[2.5rem] border border-stone-200/70 bg-white p-3 shadow-2xl shadow-stone-200/40 md:h-[640px]">
      <div className="relative col-span-2 row-span-2">
        <Image src={first.url} alt={first.alt ?? "Vendor image"} fill className="rounded-[1.8rem] object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>

      {second ? (
        <div className="relative col-span-2 row-span-1">
          <Image src={second.url} alt={second.alt ?? "Vendor image"} fill className="rounded-[1.8rem] object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      ) : null}

      {third ? (
        <div className="relative col-span-1 row-span-1">
          <Image src={third.url} alt={third.alt ?? "Vendor image"} fill className="rounded-[1.8rem] object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
        </div>
      ) : null}

      {fourth ? (
        <div className="relative col-span-1 row-span-1">
          <Image src={fourth.url} alt={fourth.alt ?? "Vendor image"} fill className="rounded-[1.8rem] object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          <button type="button" className="absolute inset-0 flex items-center justify-center rounded-[1.8rem] bg-black/35 text-[11px] font-black uppercase tracking-[0.18em] text-white" aria-label="View all photos">
            View All Photos
          </button>
        </div>
      ) : null}
    </div>
  );
}
