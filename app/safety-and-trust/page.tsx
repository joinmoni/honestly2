import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Safety & trust | Honestly",
  description:
    "How Honestly approaches reviews, listings, claims, and community safety—so you can plan with confidence.",
  path: "/safety-and-trust"
});

export default async function SafetyAndTrustPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        eyebrow="Trust & safety"
        title="Built for honest recommendations—and real accountability."
        intro="We believe great events start with trustworthy information. Here is how we think about safety, reviews, and what belongs on Honestly."
      >
        <MarketingSection title="Reviews you can weigh seriously">
          <BodyText>
            Reviews should reflect genuine client experiences. We moderate submissions to reduce spam, conflicts of interest, and content that doesn&apos;t meet our community standards. That helps keep the signal high for everyone planning an event.
          </BodyText>
          <BodyText>
            Vendors may respond to feedback when it&apos;s constructive and factual. We don&apos;t allow harassment, threats, or attempts to manipulate ratings.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Listings and claims">
          <BodyText>
            Vendor pages are built to be accurate and useful. When a business claims a page, we review the information provided so couples and hosts know who they&apos;re engaging with.
          </BodyText>
          <BodyText>
            If something looks incorrect or misleading, we take reports seriously and work to resolve them fairly.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Your privacy">
          <BodyText>
            We collect only what we need to run the platform and improve your experience. Read our{" "}
            <Link href="/privacy" className="font-semibold text-stone-900 underline decoration-stone-200">
              Privacy Policy
            </Link>{" "}
            for details on data use, retention, and your choices.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Need help or want to report something?">
          <BodyText>
            Visit the{" "}
            <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">
              Support Center
            </Link>{" "}
            for guidance on accounts, claims, and common questions. For vendor-specific standards, see{" "}
            <Link href="/vendor-guidelines" className="font-semibold text-stone-900 underline decoration-stone-200">
              Vendor Guidelines
            </Link>
            .
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
