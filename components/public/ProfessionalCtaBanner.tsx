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
          <Eyebrow className="mb-3 text-amber-700">For Professionals</Eyebrow>
          <CardTitle className={compact ? "mb-3 text-[2rem] leading-[0.98] md:text-[2.5rem]" : "mb-3"}>
            Bring your business onto Honestly.
          </CardTitle>
          <BodyText>
            Start with a professional account, claim an existing page, or learn how vendor submissions work before you apply.
          </BodyText>
        </div>

        <div className="flex flex-col gap-3 md:min-w-[250px] md:items-end">
          <Link
            href="/for-professionals"
            className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-center text-white transition-colors hover:bg-stone-800"
          >
            <PillText className="text-white">List your business</PillText>
          </Link>
          <Link href="/for-professionals#claim" className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 text-center transition-colors hover:border-stone-900">
            <PillText>Claim your page</PillText>
          </Link>
        </div>
      </div>
    </section>
  );
}
