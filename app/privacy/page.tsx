import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy | Honestly",
  description: "How Honestly collects, uses, and protects your information when you browse vendors, save lists, and write reviews.",
  path: "/privacy"
});

export default async function PrivacyPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        eyebrow="Legal · Last updated March 22, 2026"
        title="Privacy Policy"
        intro='This policy describes how Honestly ("we," "us") handles personal information when you use our website and services. We aim to be clear and practical, similar to how leading planning platforms communicate with couples and vendors.'
      >
        <MarketingSection title="Information we collect">
          <BodyText>
            <strong>Account information:</strong> When you create an account, we collect details such as your name, email address, and profile preferences you choose to share.
          </BodyText>
          <BodyText>
            <strong>Usage data:</strong> We collect information about how you interact with Honestly (pages viewed, searches, device type, and approximate location derived from IP) to improve performance, security, and relevance.
          </BodyText>
          <BodyText>
            <strong>Content you submit:</strong> Reviews, list names, vendor notes, claim submissions, and messages you send through the platform are stored so we can provide the service and enforce our policies.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="How we use information">
          <ul>
            <li>Operate, maintain, and secure Honestly.</li>
            <li>Show vendor profiles, reviews, and lists you create or follow.</li>
            <li>Process vendor claims and respond to trust &amp; safety reports.</li>
            <li>Send service-related emails (e.g., sign-in links, important updates).</li>
            <li>Analyze aggregated usage to improve discovery and editorial quality.</li>
          </ul>
        </MarketingSection>

        <MarketingSection title="Cookies and similar technologies">
          <BodyText>
            We use cookies and local storage where needed for authentication, preferences, and basic analytics. You can control cookies through your browser settings; disabling some cookies may limit certain features.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Sharing of information">
          <BodyText>
            We do not sell your personal information. We may share data with service providers who help us host, analyze, or email on our behalf—under contracts that limit their use. We may disclose information if required by law or to protect the rights, safety, and integrity of our users and the platform.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Retention">
          <BodyText>
            We keep information only as long as needed for the purposes above, including legal, accounting, and dispute-resolution requirements. You may request deletion of your account subject to exceptions we are required to honor.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Your choices">
          <ul>
            <li>Access or update profile information in your account settings where available.</li>
            <li>Request a copy or deletion of personal data, where applicable by law, via our Support Center.</li>
            <li>Opt out of non-essential marketing communications when we offer them.</li>
          </ul>
        </MarketingSection>

        <MarketingSection title="Children's privacy">
          <BodyText>
            Honestly is not directed at children under 13, and we do not knowingly collect their personal information. If you believe we have done so in error, contact us through the{" "}
            <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">
              Support Center
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="International users">
          <BodyText>
            If you access Honestly from outside the country where our servers are located, your information may be transferred and processed there. We take steps designed to protect it in line with this policy.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Changes to this policy">
          <BodyText>
            We may update this Privacy Policy from time to time. We will post the new date at the top of this page and, when changes are material, provide additional notice as appropriate.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Contact">
          <BodyText>
            Questions about privacy? Start at the{" "}
            <Link href="/support" className="font-semibold text-stone-900 underline decoration-stone-200">
              Support Center
            </Link>
            . For broader context on how we handle trust and safety, see{" "}
            <Link href="/safety-and-trust" className="font-semibold text-stone-900 underline decoration-stone-200">
              Safety &amp; Trust
            </Link>
            .
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
