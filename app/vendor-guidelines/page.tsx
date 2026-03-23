import type { Metadata } from "next";
import Link from "next/link";

import { PublicMarketingLayout } from "@/components/layout/PublicMarketingLayout";
import { MarketingPageShell, MarketingSection } from "@/components/marketing/MarketingPageShell";
import { BodyText } from "@/components/ui/Typography";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Vendor guidelines | Honestly",
  description:
    "Standards for vendors on Honestly: accurate profiles, respectful engagement, and a better experience for couples and hosts.",
  path: "/vendor-guidelines"
});

export default async function VendorGuidelinesPage() {
  return (
    <PublicMarketingLayout>
      <MarketingPageShell
        eyebrow="For professionals"
        title="Guidelines for vendors on Honestly"
        intro="These standards help every vendor show up clearly and fairly—so planners get reliable information and your work is represented the way you intend."
      >
        <MarketingSection title="Accurate, up-to-date profiles">
          <ul>
            <li>Use your real business name and the services you actively offer.</li>
            <li>Keep contact details, locations, and categories current.</li>
            <li>Images should represent your own work or be properly licensed and credited.</li>
          </ul>
        </MarketingSection>

        <MarketingSection title="Honest representation">
          <BodyText>
            Don&apos;t mislead visitors about pricing, availability, awards, or press. If you advertise packages or starting prices, make sure they reflect what clients can reasonably expect.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Reviews and responses">
          <BodyText>
            Encourage happy clients to leave feedback on Honestly—never through incentives tied to positive reviews. When you reply, stay professional, specific, and focused on resolving concerns.
          </BodyText>
        </MarketingSection>

        <MarketingSection title="What we don&apos;t allow">
          <ul>
            <li>Harassment, hate speech, or discriminatory content.</li>
            <li>Fake reviews, coordinated rating manipulation, or pressure on clients.</li>
            <li>Spam, unrelated promotions, or attempts to divert users to unsafe off-platform payments without transparency.</li>
          </ul>
        </MarketingSection>

        <MarketingSection title="Claims and verification">
          <BodyText>
            When you claim a page, provide truthful ownership details. We may ask for additional verification to protect businesses and clients alike. Learn more under{" "}
            <Link href="/safety-and-trust" className="font-semibold text-stone-900 underline decoration-stone-200">
              Safety &amp; Trust
            </Link>
            .
          </BodyText>
        </MarketingSection>

        <MarketingSection title="Get started">
          <BodyText>
            New to Honestly? Start with{" "}
            <Link href="/for-professionals" className="font-semibold text-stone-900 underline decoration-stone-200">
              For professionals
            </Link>{" "}
            to recommend a vendor or claim an existing page.
          </BodyText>
        </MarketingSection>
      </MarketingPageShell>
    </PublicMarketingLayout>
  );
}
