import type { Metadata } from "next";
import { HomeShell } from "@/components/home/HomeShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getHomeCategoryShortcuts, getHomeContent } from "@/lib/services/home";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getCurrentSession } from "@/lib/services/session";
import { getFeaturedVendors } from "@/lib/services/vendors";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Honestly | Find vendors worth talking about",
  description: "Discover premium event vendors, browse trusted reviews, and curate saved lists with an editorial eye.",
  path: "/"
});

export default async function HomePage() {
  const [content, shortcuts, featuredVendors, footerContent, searchIndex, session] = await Promise.all([
    getHomeContent(),
    getHomeCategoryShortcuts(),
    getFeaturedVendors(3),
    getFooterContent(),
    getHomepageSearchIndex(),
    getCurrentSession()
  ]);

  return (
    <>
      <HomeShell
        content={content}
        shortcuts={shortcuts}
        featuredVendors={featuredVendors}
        searchIndex={searchIndex}
        currentUserName={session.user?.name ?? null}
        currentUserEmail={session.user?.email ?? null}
        currentUserAvatarUrl={session.user?.avatarUrl}
      />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
