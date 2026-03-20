import Link from "next/link";
import { HomeVendorCard } from "@/components/home/HomeVendorCard";
import { BodyText, SectionTitle } from "@/components/ui/Typography";
import type { Vendor } from "@/lib/types/domain";

type HomeFeaturedSectionProps = {
  title: string;
  description: string;
  vendors: Vendor[];
};

export function HomeFeaturedSection({ title, description, vendors }: HomeFeaturedSectionProps) {
  return (
    <section className="py-10 md:py-24">
      <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionTitle className="text-[2.2rem] leading-tight md:text-[2.6rem]">{title}</SectionTitle>
          <BodyText className="mt-1 text-sm">{description}</BodyText>
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

      <div className="mt-10 md:hidden">
        <Link href="/vendors" className="inline-flex items-center gap-2 border-b-2 border-stone-900 pb-1 text-sm font-semibold transition-all hover:border-amber-700 hover:text-amber-700">
          View all <span aria-hidden>›</span>
        </Link>
      </div>
    </section>
  );
}
