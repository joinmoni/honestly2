import type { Metadata } from "next";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { BodyText, Eyebrow, PageTitle, SectionTitle } from "@/components/ui/Typography";
import { DARK_SURFACE_HEADING_TEXT, DARK_SURFACE_MUTED_TEXT } from "@/lib/dark-surface";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Honestly",
  description: "Why Honestly exists, and what it wants event planning to feel like: clear, truthful, and accountable.",
  path: "/about"
});

export default async function AboutPage() {
  return (
    <PublicMarketingLayout>
      <main className="mx-auto max-w-6xl px-6 py-14 md:px-12 md:py-20">
        <section className="max-w-3xl">
          <Eyebrow className="mb-4">About Honestly</Eyebrow>
          <PageTitle className="mb-5">Built for people who want more truth than facade.</PageTitle>
          <BodyText className="max-w-2xl text-base md:text-lg">
            We built honestly for the regular people who want to plan their events with clarity and truth, not just facades.
          </BodyText>
        </section>

        <section className="mt-14 grid gap-8 md:mt-20 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
            <SectionTitle className="mb-4">Why it exists</SectionTitle>
            <BodyText className="mb-4">
              Event planning can feel like sorting through beautiful imagery and carefully managed impressions. That can make it hard to know what working with a vendor actually feels like when the real pressure starts.
            </BodyText>
            <BodyText>
              Honestly exists to make space for experiences that help other people choose well, ask better questions, and move forward with more confidence.
            </BodyText>
          </div>

          <div className={`rounded-[2rem] bg-stone-900 px-6 py-8 md:px-8 md:py-10 ${DARK_SURFACE_MUTED_TEXT}`}>
            <Eyebrow className={`mb-4 ${DARK_SURFACE_MUTED_TEXT}`}>What we believe</Eyebrow>
            <SectionTitle className={`mb-4 ${DARK_SURFACE_HEADING_TEXT}`}>A safer place to tell the truth.</SectionTitle>
            <BodyText className={DARK_SURFACE_MUTED_TEXT}>
              A safe space to leave your experiences for elevation and learning. To hold people accountable.
            </BodyText>
          </div>
        </section>
      </main>
    </PublicMarketingLayout>
  );
}
