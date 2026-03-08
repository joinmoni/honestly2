import Image from "next/image";
import type { VendorImage } from "@/lib/types/domain";

type VendorDetailGalleryProps = {
  images: VendorImage[];
};

export function VendorDetailGallery({ images }: VendorDetailGalleryProps) {
  const [first, second, third, fourth] = images;
  if (!first) return null;

  return (
    <div className="mb-8 grid h-[300px] grid-cols-2 grid-rows-3 gap-2 overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white p-2 shadow-xl shadow-stone-200/30 md:mb-10 md:h-[360px] md:grid-cols-[1.45fr_0.8fr] md:grid-rows-2 md:gap-2.5 md:rounded-[2.25rem] md:p-2.5">
      <div className="relative col-span-2 row-span-2 md:col-span-1 md:row-span-2">
        <Image src={first.url} alt={first.alt ?? "Vendor image"} fill className="rounded-[1.5rem] object-cover" sizes="(max-width: 768px) 100vw, 42vw" />
      </div>

      {second ? (
        <div className="relative col-span-1 row-span-1 md:col-span-1">
          <Image src={second.url} alt={second.alt ?? "Vendor image"} fill className="rounded-[1.5rem] object-cover" sizes="(max-width: 768px) 50vw, 22vw" />
        </div>
      ) : null}

      {third ? (
        <div className="relative col-span-1 row-span-1">
          <Image src={third.url} alt={third.alt ?? "Vendor image"} fill className="rounded-[1.5rem] object-cover" sizes="(max-width: 768px) 50vw, 22vw" />
        </div>
      ) : null}

      {fourth ? (
        <div className="relative col-span-1 row-span-1 md:col-start-2 md:row-start-2">
          <Image src={fourth.url} alt={fourth.alt ?? "Vendor image"} fill className="rounded-[1.5rem] object-cover" sizes="(max-width: 768px) 50vw, 22vw" />
          <button type="button" className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] bg-black/35 px-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white md:text-[11px]" aria-label="View all photos">
            View All Photos
          </button>
        </div>
      ) : null}
    </div>
  );
}
