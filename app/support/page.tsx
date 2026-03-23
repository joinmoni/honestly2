import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Support Center | Honestly",
  description: "Get help with Honestly: accounts, lists, reviews, vendor claims, and trust & safety.",
  path: "/support"
});

export default async function SupportPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        eyebrow="Help"
        title="We are here to help you get the most out of Honestly."
        intro="Find quick answers below. For policy and safety questions, we have linked the right resources so you always know where to look."
      >
        <MarketingSection title="Planning & discovery">
          <BodyText>
            <strong>Browse vendors:</strong> Start at{" "}
            <Link href="/vendors" className="font-semibold text-stone-900 underline decoration-stone-200">
              Browse all vendors
            </Link>{" "}
            and filter by category. New to the platform? See{" "}
            <Link href="/how-it-works" className="font-semibold text-stone-900 underline decoration-stone-200">
              How it works
            </Link>
            .
          </BodyText>
          <BodyText>
            <strong>Lists & shortlists:</strong> Save vendors to a list from a profile, then manage everything under{" "}
            <Link href="/lists" className="font-semibold text-stone-900 underline decoration-stone-200">
              Featured collections
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Reviews & recommendations">
          <BodyText>
            <strong>Leave a review:</strong> Share an experience through{" "}
            <Link href="/reviews/new" className="font-semibold text-stone-900 underline decoration-stone-200">
              Recommend a vendor
            </Link>
            . Your feedback helps other hosts and couples plan with confidence.
          </BodyText>
          <BodyText>
            <strong>Moderation & trust:</strong> Read how we approach content in{" "}
            <Link href="/safety-and-trust" className="font-semibold text-stone-900 underline decoration-stone-200">
              Safety &amp; Trust
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Vendors & claims">
          <BodyText>
            <strong>Claim your page:</strong> If you&apos;re listed on Honestly, start from{" "}
            <Link href="/for-professionals#claim" className="font-semibold text-stone-900 underline decoration-stone-200">
              Claim your page
            </Link>{" "}
            on our professionals hub. Standards for businesses are in{" "}
            <Link href="/vendor-guidelines" className="font-semibold text-stone-900 underline decoration-stone-200">
              Vendor guidelines
            </Link>
            .
          </BodyText>
          <BodyText>
            <strong>Ownership disputes:</strong> Use the claim flow with accurate business details. We may request verification to protect both vendors and clients.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Account & legal">
          <BodyText>
            <strong>Sign in:</strong> Use{" "}
            <Link href="/login" className="font-semibold text-stone-900 underline decoration-stone-200">
              Log in
            </Link>{" "}
            to access lists, reviews, and preferences. Our{" "}
            <Link href="/privacy" className="font-semibold text-stone-900 underline decoration-stone-200">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="font-semibold text-stone-900 underline decoration-stone-200">
              Terms of Service
            </Link>{" "}
            explain how we handle data and platform rules.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Still stuck?">
          <BodyText>
            We are rolling out direct messaging for support. In the meantime, revisit this page and our policy hubs; we add answers as the product grows. For general questions about the company, see{" "}
            <Link href="/about" className="font-semibold text-stone-900 underline decoration-stone-200">
              About Honestly
            </Link>
            .
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
