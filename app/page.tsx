import { HomeShell } from "@/components/home/HomeShell";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getHomeCategoryShortcuts, getHomeContent } from "@/lib/services/home";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getFeaturedVendors } from "@/lib/services/vendors";

export default async function HomePage() {
  const [content, shortcuts, featuredVendors, footerContent, searchIndex] = await Promise.all([
    getHomeContent(),
    getHomeCategoryShortcuts(),
    getFeaturedVendors(3),
    getFooterContent(),
    getHomepageSearchIndex()
  ]);

  return (
    <>
      <HomeShell content={content} shortcuts={shortcuts} featuredVendors={featuredVendors} searchIndex={searchIndex} />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
