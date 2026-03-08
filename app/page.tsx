import { HomeShell } from "@/components/home/HomeShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getHomeCategoryShortcuts, getHomeContent } from "@/lib/services/home";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getCurrentSession } from "@/lib/services/session";
import { getFeaturedVendors } from "@/lib/services/vendors";

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
