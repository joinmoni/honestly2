import type { Metadata } from "next";
import { HomeShell } from "@/components/home/HomeShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCategories } from "@/lib/services/categories";
import { getFooterContent } from "@/lib/services/footer";
import { getHomeCategoryShortcuts, getHomeContent } from "@/lib/services/home";
import { getListsByUserId } from "@/lib/services/lists";
import { getCurrentSession } from "@/lib/services/session";
import { getFeaturedVendors } from "@/lib/services/vendors";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Honestly | Find vendors worth talking about",
  description: "Discover premium event vendors, browse trusted reviews, and curate saved lists with an editorial eye.",
  path: "/"
});

export default async function HomePage() {
  const [content, shortcuts, categories, featuredVendors, footerContent, session] = await Promise.all([
    getHomeContent(),
    getHomeCategoryShortcuts(),
    getCategories(),
    getFeaturedVendors(8),
    getFooterContent(),
    getCurrentSession()
  ]);
  const initialLists = session.user ? await getListsByUserId(session.user.id) : [];

  return (
    <>
      <HomeShell
        content={content}
        shortcuts={shortcuts}
        categories={categories}
        featuredVendors={featuredVendors}
        initialLists={initialLists}
        currentUserId={session.user?.id ?? null}
        currentUserName={session.user?.name ?? null}
        currentUserEmail={session.user?.email ?? null}
        currentUserAvatarUrl={session.user?.avatarUrl}
        currentUserRole={session.user?.role}
      />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
