import type { ReactNode } from "react";

import { BodyText, Eyebrow, PageTitle, SectionTitle } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

type MarketingPageShellProps = {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  /** Narrow column for long-form policy copy; wider for marketing grids. */
  variant?: "article" | "wide";
  children: ReactNode;
};

export function MarketingPageShell({ eyebrow, title, intro, variant = "article", children }: MarketingPageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto px-6 py-14 md:px-12 md:py-20",
        variant === "wide" ? "max-w-6xl" : "max-w-3xl"
      )}
    >
      <header className="mb-12 md:mb-16">
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <PageTitle className="mb-5 text-[2.5rem] leading-[0.98] md:text-5xl">{title}</PageTitle>
        {intro ? (
          typeof intro === "string" ? (
            <BodyText className="max-w-2xl text-base md:text-lg">{intro}</BodyText>
          ) : (
            intro
          )
        ) : null}
      </header>
      <div className="space-y-12 md:space-y-16">{children}</div>
    </main>
  );
}

type MarketingSectionProps = {
  title: string;
  children: ReactNode;
};

export function MarketingSection({ title, children }: MarketingSectionProps) {
  return (
    <section>
      <SectionTitle className="mb-4 text-[1.65rem] leading-tight md:text-[1.85rem]">{title}</SectionTitle>
      <div className="space-y-4 text-[15px] leading-relaxed text-stone-600 md:text-base [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:font-semibold [&_strong]:text-stone-900">
        {children}
      </div>
    </section>
  );
}
