import Link from "next/link";

import { BodyText, CardTitle, Eyebrow, PillText } from "@/components/ui/Typography";

type ProfessionalCtaBannerProps = {
  className?: string;
  compact?: boolean;
};

export function ProfessionalCtaBanner({ className, compact = false }: ProfessionalCtaBannerProps) {
  return (
    <section className={`rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(24,24,24,0.06)] md:px-10 md:py-10 ${className ?? ""}`}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_auto] md:items-end">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3 text-amber-700">Recommend A Vendor</Eyebrow>
          <CardTitle className={compact ? "mb-3 text-[2rem] leading-[0.98] md:text-[2.5rem]" : "mb-3"}>
            Tell us about a vendor you have used.
          </CardTitle>
          <BodyText>
            Used a great vendor before? Help them get discovered on Honestly, or claim an existing page if they are already listed.
          </BodyText>
        </div>

        <div className="flex flex-col gap-3 md:min-w-[250px] md:items-end">
          <Link
            href="/for-professionals"
            className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-center text-white transition-colors hover:bg-stone-800"
          >
            <PillText className="text-white">Recommend a vendor</PillText>
          </Link>
          <Link href="/for-professionals#claim" className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 text-center transition-colors hover:border-stone-900">
            <PillText>Claim an existing page</PillText>
          </Link>
        </div>
      </div>
    </section>
  );
}
