import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getMockSession } from "@/lib/services/session";
import { VendorListingScreen } from "@/components/vendors-listing/VendorListingScreen";
import { getVendorListingPageData } from "@/lib/services/vendor-listing";

type VendorsPageProps = {
  searchParams?: Promise<{
    q?: string;
    where?: string;
    category?: string;
  }>;
};

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const session = await getMockSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const [data, footerContent, lists, searchIndex] = await Promise.all([
    getVendorListingPageData({
      query: resolvedSearchParams?.q,
      where: resolvedSearchParams?.where,
      categorySlug: resolvedSearchParams?.category
    }),
    getFooterContent(),
    session.user ? getListsByUserId(session.user.id) : Promise.resolve([]),
    getHomepageSearchIndex()
  ]);

  return (
    <>
      <VendorListingScreen
        key={`${data.searchState.query}:${data.searchState.where}:${data.searchState.categorySlug}`}
        data={data}
        initialLists={lists}
        currentUserId={session.user?.id ?? null}
        currentUserName={session.user?.name ?? null}
        currentUserEmail={session.user?.email ?? null}
        searchIndex={searchIndex}
      />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
