import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Service | Honestly",
  description: "Terms governing your use of Honestly: accounts, reviews, vendor listings, and acceptable use.",
  path: "/terms"
});

export default async function TermsPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        eyebrow="Legal · Last updated March 22, 2026"
        title="Terms of Service"
        intro="By accessing or using Honestly, you agree to these Terms. Please read them carefully: they set expectations for everyone using the platform, from couples and hosts to vendors and guests."
      >
        <MarketingSection title="Who we are">
          <BodyText>
            Honestly provides an online platform to discover event vendors, read and write reviews, save lists, and related services. References to &quot;you&quot; include anyone who browses or uses the site; &quot;we&quot; or &quot;us&quot; means Honestly.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Eligibility and accounts">
          <BodyText>
            You must be able to form a binding contract in your jurisdiction to create an account. You are responsible for your login credentials and for all activity under your account. Notify us promptly if you suspect unauthorized access; see the{" "}
            <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">
              Support Center
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Acceptable use">
          <ul>
            <li>Do not misuse Honestly, attempt to disrupt the service, or access non-public areas without permission.</li>
            <li>Do not post unlawful, harassing, fraudulent, or misleading content.</li>
            <li>Do not scrape, overload, or automate access in ways that impair the experience for others.</li>
            <li>Do not manipulate reviews, ratings, or rankings, including through incentives, fake accounts, or coordinated campaigns.</li>
          </ul>
        </MarketingSection>

        <MarketingSection title="User content">
          <BodyText>
            You retain ownership of content you submit (such as reviews and list titles). By posting, you grant us a non-exclusive license to host, display, and distribute that content as needed to operate and promote Honestly. You represent that you have the rights to post what you share.
          </BodyText>
          <BodyText>
            We may remove or restrict content that violates these Terms, our{" "}
            <Link href="/vendor-guidelines" className="font-semibold text-stone-900 underline decoration-stone-200">
              Vendor Guidelines
            </Link>
            , or our trust policies described under{" "}
            <Link href="/safety-and-trust" className="font-semibold text-stone-900 underline decoration-stone-200">
              Safety &amp; Trust
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Vendor listings and claims">
          <BodyText>
            Vendor profiles may be created from public information or user recommendations. Businesses may claim pages subject to verification. You agree to provide accurate information during claims and to comply with our vendor standards.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Third parties and transactions">
          <BodyText>
            Honestly helps you discover vendors; contracts, payments, and deliverables are between you and the businesses you hire. We are not a party to those agreements unless explicitly stated otherwise. Links to third-party sites are provided for convenience and are governed by those sites’ terms.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Disclaimers">
          <BodyText>
            The platform is provided &quot;as is&quot; and &quot;as available.&quot; We do not guarantee uninterrupted access or that content is complete or error-free. Reviews reflect individual experiences and opinions, not endorsements by Honestly.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Limitation of liability">
          <BodyText>
            To the fullest extent permitted by law, Honestly and its affiliates will not be liable for indirect, incidental, special, consequential, or punitive damages, or for loss of profits or data, arising from your use of the service. Our aggregate liability for claims relating to the service is limited to the greater of (a) the amount you paid us for the service in the twelve months before the claim or (b) one hundred U.S. dollars, except where such limitations are prohibited.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Indemnity">
          <BodyText>
            You agree to defend and indemnify Honestly against claims arising from your content, your use of the platform in violation of these Terms, or your violation of others&apos; rights, subject to applicable law.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Governing law">
          <BodyText>
            These Terms are governed by the laws of the jurisdiction in which Honestly operates, without regard to conflict-of-law rules, except where consumer protections require otherwise. Courts in that jurisdiction have exclusive venue, where permitted.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Changes">
          <BodyText>
            We may update these Terms. We will post the revised date on this page and, when changes are material, provide additional notice when practical. Continued use after changes means you accept the updated Terms.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Contact">
          <BodyText>
            For questions about these Terms, visit the{" "}
            <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">
              Support Center
            </Link>{" "}
            or review our{" "}
            <Link href="/privacy" className="font-semibold text-stone-900 underline decoration-stone-200">
              Privacy Policy
            </Link>
            .
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
