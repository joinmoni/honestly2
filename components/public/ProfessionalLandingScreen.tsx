import Link from "next/link";

import { BodyText, CardTitle, Eyebrow, MetaText, PageTitle, PillText, SectionTitle } from "@/components/ui/Typography";

export function ProfessionalLandingScreen() {
  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <section className="grid gap-8 rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(24,24,24,0.05)] md:grid-cols-[minmax(0,1.4fr)_340px] md:px-10 md:py-12">
          <div className="max-w-3xl">
            <Eyebrow className="mb-4 text-amber-700">Recommend A Vendor</Eyebrow>
            <PageTitle className="mb-5">Tell us about a vendor you trust.</PageTitle>
            <BodyText className="max-w-2xl">
              Honestly is driven by real client recommendations. If you have worked with a great vendor for a wedding, birthday, or event, you can help bring them onto the platform and claim an existing page if they are already here.
            </BodyText>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login?next=%2Freviews%2Fnew" className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-white transition-colors hover:bg-stone-800">
                <PillText className="text-white">Recommend a vendor</PillText>
              </Link>
              <Link href="/vendors" className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 transition-colors hover:border-stone-900">
                <PillText>Browse vendors to claim a page</PillText>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-stone-900 px-6 py-6 text-white">
            <Eyebrow className="mb-4 text-stone-300">How it works</Eyebrow>
            <ol className="space-y-4">
              <li>
                <MetaText className="mb-1 text-stone-400">1.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Tell us who they are</CardTitle>
                <BodyText className="text-stone-300">Share the vendor you used so we can understand their work and why they belong on Honestly.</BodyText>
              </li>
              <li id="claim">
                <MetaText className="mb-1 text-stone-400">2.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Claim an existing page</CardTitle>
                <BodyText className="text-stone-300">If you already appear on Honestly, open your profile and use the claim flow.</BodyText>
              </li>
              <li>
                <MetaText className="mb-1 text-stone-400">3.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Help great vendors get discovered</CardTitle>
                <BodyText className="text-stone-300">Once approved, the vendor can collect reviews, saves, and shortlist traffic from future clients.</BodyText>
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Community-led</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Client recommendations come first</SectionTitle>
            <BodyText>Honestly is built around real people recommending the vendors they have actually used and trusted.</BodyText>
          </article>
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Claims</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Already listed on Honestly?</SectionTitle>
            <BodyText>Open your vendor page and use <span className="font-semibold text-stone-900">Claim this page</span> to submit ownership details for review.</BodyText>
          </article>
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Professionals</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Vendors can still join directly</SectionTitle>
            <BodyText>If you are the vendor yourself, you can still use this path to claim or introduce your own business.</BodyText>
          </article>
        </section>
      </main>
    </div>
  );
}
