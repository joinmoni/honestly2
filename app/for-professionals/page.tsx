import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { ProfessionalLandingScreen } from "@/components/public/ProfessionalLandingScreen";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { getFooterContent } from "@/lib/services/footer";
import { getCurrentSession } from "@/lib/services/session";
import { buildPageMetadata } from "@/lib/seo";
import { getUserNavLinks } from "@/lib/user-nav";

export const metadata: Metadata = buildPageMetadata({
  title: "For Professionals | Honestly",
  description: "Learn how to create a professional account, claim your page, and bring your business onto Honestly.",
  path: "/for-professionals"
});

export default async function ForProfessionalsPage() {
  const [footerContent, session] = await Promise.all([getFooterContent(), getCurrentSession()]);

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        {session.user ? (
          <UserTopNav
            brandLabel="honestly."
            avatarName={session.user.name}
            avatarEmail={session.user.email}
            avatarUrl={session.user.avatarUrl}
            navLinks={getUserNavLinks("none")}
          />
        ) : (
          <EditorialTopNav
            brandLabel="honestly."
            navLinks={[
              { label: "Browse Vendors", href: "/vendors" },
              { label: "How it works", href: "/for-professionals", active: true }
            ]}
            innerClassName="max-w-7xl md:px-12"
            rightSlot={<ProfileMenu name={null} email={null} imageUrl={undefined} />}
          />
        )}
        <ProfessionalLandingScreen />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
