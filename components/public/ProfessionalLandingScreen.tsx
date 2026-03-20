import Link from "next/link";

import { BodyText, CardTitle, Eyebrow, MetaText, PageTitle, PillText, SectionTitle } from "@/components/ui/Typography";

export function ProfessionalLandingScreen() {
  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <section className="grid gap-8 rounded-[2rem] border border-stone-200 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(24,24,24,0.05)] md:grid-cols-[minmax(0,1.4fr)_340px] md:px-10 md:py-12">
          <div className="max-w-3xl">
            <Eyebrow className="mb-4 text-amber-700">For Professionals</Eyebrow>
            <PageTitle className="mb-5">Join Honestly as a vendor.</PageTitle>
            <BodyText className="max-w-2xl">
              Create your professional account, tell clients what you offer, and claim an existing page if your work is already featured on Honestly.
            </BodyText>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-white transition-colors hover:bg-stone-800">
                <PillText className="text-white">Start with a professional account</PillText>
              </Link>
              <Link href="/vendors" className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 transition-colors hover:border-stone-900">
                <PillText>Browse vendors to claim your page</PillText>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-stone-900 px-6 py-6 text-white">
            <Eyebrow className="mb-4 text-stone-300">What happens next</Eyebrow>
            <ol className="space-y-4">
              <li>
                <MetaText className="mb-1 text-stone-400">1.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Create your account</CardTitle>
                <BodyText className="text-stone-300">Use email or Google to access the professional flow.</BodyText>
              </li>
              <li id="claim">
                <MetaText className="mb-1 text-stone-400">2.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Claim an existing page</CardTitle>
                <BodyText className="text-stone-300">If you already appear on Honestly, open your profile and use the claim flow.</BodyText>
              </li>
              <li>
                <MetaText className="mb-1 text-stone-400">3.</MetaText>
                <CardTitle className="mb-1 text-[1.55rem] leading-tight text-white md:text-[1.75rem]">Share your work</CardTitle>
                <BodyText className="text-stone-300">Once approved, your profile can collect reviews, saves, and shortlist traffic.</BodyText>
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Account</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Sign in or create an account</SectionTitle>
            <BodyText>Professionals start from the same login entry point as clients. We will route account setup from there.</BodyText>
          </article>
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Claims</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Already listed on Honestly?</SectionTitle>
            <BodyText>Open your vendor page and use <span className="font-semibold text-stone-900">Claim this page</span> to submit ownership details for review.</BodyText>
          </article>
          <article className="rounded-[1.75rem] border border-stone-200 bg-white px-6 py-6">
            <Eyebrow className="mb-3">Support</Eyebrow>
            <SectionTitle className="mb-3 text-[1.85rem] leading-tight md:text-[2.1rem]">Need help before applying?</SectionTitle>
            <BodyText>Use the claim path if you already have a profile, or start from login if you are new to the platform.</BodyText>
          </article>
        </section>
      </main>
    </div>
  );
}
