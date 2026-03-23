import type { ReactNode } from "react";

import { ConsumerTopChrome } from "@/components/layout/ConsumerTopChrome";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCategories } from "@/lib/services/categories";
import { getFooterContent } from "@/lib/services/footer";
import { getCurrentSession } from "@/lib/services/session";

type PublicMarketingLayoutProps = {
  children: ReactNode;
};

/** Shared nav + footer for public marketing and policy pages (same as About). */
export async function PublicMarketingLayout({ children }: PublicMarketingLayoutProps) {
  const [footerContent, session, categories] = await Promise.all([getFooterContent(), getCurrentSession(), getCategories()]);

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <ConsumerTopChrome
          brandLabel="honestly."
          categories={categories}
          currentUserName={session.user?.name ?? null}
          currentUserEmail={session.user?.email ?? null}
          currentUserAvatarUrl={session.user?.avatarUrl}
          currentUserRole={session.user?.role}
        />
        {children}
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
