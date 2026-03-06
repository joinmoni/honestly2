import Link from "next/link";
import { HomeVendorCard } from "@/components/home/HomeVendorCard";
import type { Vendor } from "@/lib/types/domain";

type HomeFeaturedSectionProps = {
  title: string;
  description: string;
  vendors: Vendor[];
};

export function HomeFeaturedSection({ title, description, vendors }: HomeFeaturedSectionProps) {
  return (
    <section className="py-24">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display">{title}</h2>
          <p className="text-sm text-stone-500">{description}</p>
        </div>
        <Link href="/vendors" className="hidden items-center gap-2 border-b-2 border-stone-900 pb-1 text-sm font-semibold transition-all hover:border-amber-700 hover:text-amber-700 md:flex">
          View all <span aria-hidden>›</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <HomeVendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>
    </section>
  );
}
