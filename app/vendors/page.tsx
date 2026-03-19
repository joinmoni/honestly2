import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { getHomepageSearchIndex } from "@/lib/services/search";
import { getCurrentSession } from "@/lib/services/session";
import { VendorListingScreen } from "@/components/vendors-listing/VendorListingScreen";
import { getVendorListingPageData } from "@/lib/services/vendor-listing";
import { buildPageMetadata } from "@/lib/seo";

type VendorsPageProps = {
  searchParams?: Promise<{
    q?: string;
    where?: string;
    category?: string;
  }>;
};

export async function generateMetadata({ searchParams }: VendorsPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim();
  const where = resolvedSearchParams?.where?.trim();
  const category = resolvedSearchParams?.category?.trim();

  const titleParts = ["Honestly Vendors"];
  if (category && category !== "all") titleParts.push(category);
  if (where) titleParts.push(where);

  const description = query
    ? `Browse vendor results for ${query}${where ? ` in ${where}` : ""} and discover trusted event professionals on Honestly.`
    : "Browse trusted vendors, filter by category and location, and discover event professionals on Honestly.";

  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (where) params.set("where", where);
  if (category && category !== "all") params.set("category", category);

  return buildPageMetadata({
    title: titleParts.join(" | "),
    description,
    path: params.toString() ? `/vendors?${params.toString()}` : "/vendors"
  });
}

export default async function VendorsPage({ searchParams }: VendorsPageProps) {
  const session = await getCurrentSession();
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
        currentUserAvatarUrl={session.user?.avatarUrl}
        searchIndex={searchIndex}
      />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
