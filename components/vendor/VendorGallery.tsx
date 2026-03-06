import Image from "next/image";
import type { VendorImage } from "@/lib/types/domain";

type VendorGalleryProps = {
  images: VendorImage[];
};

export function VendorGallery({ images }: VendorGalleryProps) {
  const [first, ...rest] = images;
  if (!first) return null;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="relative h-72 overflow-hidden rounded-xl2 md:col-span-2 md:h-[420px]">
        <Image src={first.url} alt={first.alt ?? "Vendor image"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
        {rest.slice(0, 2).map((image) => (
          <div key={image.id} className="relative h-36 overflow-hidden rounded-xl2 md:h-[203px]">
            <Image src={image.url} alt={image.alt ?? "Vendor image"} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
