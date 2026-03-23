import type { Metadata } from "next";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { BodyText, Eyebrow, PageTitle, SectionTitle } from "@/components/ui/Typography";
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
            A safe space to leave your experiences for elevation and learning. To hold people accountable.
          </BodyText>
        </section>

        <section className="mt-14 max-w-3xl md:mt-20">
          <div className="rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
            <SectionTitle className="mb-4">What we believe</SectionTitle>
            <BodyText className="mb-4">
              Event planning can feel like sorting through beautiful imagery and carefully managed impressions. That can make it hard to know what working with a vendor actually feels like when the real pressure starts.
            </BodyText>
            <BodyText>
              Honestly exists to make space for experiences that help other people choose well, ask better questions, and move forward with more confidence.
            </BodyText>
          </div>
        </section>
      </main>
    </PublicMarketingLayout>
  );
}
