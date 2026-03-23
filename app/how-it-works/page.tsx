import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "How it works | Honestly",
  description:
    "Discover how Honestly helps you find event vendors, read trusted reviews, save shortlists, and how professionals join the platform.",
  path: "/how-it-works"
});

export default async function HowItWorksPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        variant="wide"
        eyebrow="Planning tools"
        title="Everything you need to build your vendor team—in one place."
        intro="Honestly is built for people who want clarity, not guesswork. Browse curated vendors, learn from real experiences, and keep your shortlist organized as your plans take shape."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Step one</p>
            <h3 className="mt-3 font-serif text-2xl italic text-stone-900">Browse vendors that fit your style</h3>
            <BodyText className="mt-4">
              Explore by category and location. Each profile is designed to show what matters—who they are, what they do, and how couples and hosts have experienced working with them.
            </BodyText>
            <Link href="/vendors" className="mt-5 inline-flex border-b-2 border-stone-900 pb-0.5 text-sm font-semibold text-stone-900">
              Browse all vendors
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Step two</p>
            <h3 className="mt-3 font-serif text-2xl italic text-stone-900">Read reviews you can actually use</h3>
            <BodyText className="mt-4">
              Reviews on Honestly are written to be helpful—specific, respectful, and tied to real projects. Use them to ask better questions and compare vendors with confidence.
            </BodyText>
            <Link href="/reviews/new" className="mt-5 inline-flex border-b-2 border-stone-900 pb-0.5 text-sm font-semibold text-stone-900">
              Recommend a vendor
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Step three</p>
            <h3 className="mt-3 font-serif text-2xl italic text-stone-900">Save and share your shortlist</h3>
            <BodyText className="mt-4">
              Keep your favorite vendors in one list. Share with family, your planner, or your partner so everyone is looking at the same options—no more scattered screenshots or links.
            </BodyText>
            <Link href="/lists" className="mt-5 inline-flex border-b-2 border-stone-900 pb-0.5 text-sm font-semibold text-stone-900">
              View collections
            </Link>
          </div>
          <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">For professionals</p>
            <h3 className="mt-3 font-serif text-2xl italic text-stone-900">Claim your page and join the conversation</h3>
            <BodyText className="mt-4">
              Already listed—or ready to be recommended? Vendors can claim their page, connect with new clients, and show up where people are already planning their events.
            </BodyText>
            <Link href="/for-professionals" className="mt-5 inline-flex border-b-2 border-stone-900 pb-0.5 text-sm font-semibold text-stone-900">
              For professionals
            </Link>
          </div>
        </div>

        <MarketingSection title="Questions along the way?">
          <BodyText>
            Visit our <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">Support Center</Link> for common topics, or read{" "}
            <Link href="/safety-and-trust" className="font-semibold text-stone-900 underline decoration-stone-200">Safety &amp; Trust</Link> to learn how we approach reviews and listings.
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
