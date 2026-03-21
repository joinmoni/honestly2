import { notFound } from "next/navigation";

import { ReviewSubmissionPage } from "@/components/reviews/ReviewSubmissionPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getRatingCriteria } from "@/lib/services/reviews";
import { requireUserSession } from "@/lib/services/session";
import { getVendors } from "@/lib/services/vendors";
import { VendorDetailNav } from "@/components/vendor-detail/VendorDetailNav";
import { getCurrentSession } from "@/lib/services/session";

type ReviewNewPageProps = {
  searchParams?: Promise<{
    vendorSlug?: string;
    reviewId?: string;
  }>;
};

export default async function ReviewNewPage({ searchParams }: ReviewNewPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const nextQuery = new URLSearchParams();
  if (resolvedSearchParams?.vendorSlug) nextQuery.set("vendorSlug", resolvedSearchParams.vendorSlug);
  if (resolvedSearchParams?.reviewId) nextQuery.set("reviewId", resolvedSearchParams.reviewId);
  await requireUserSession(`/reviews/new${nextQuery.toString() ? `?${nextQuery.toString()}` : ""}`);

  const [vendors, criteria, footerContent, session] = await Promise.all([
    getVendors(),
    getRatingCriteria(),
    getFooterContent(),
    getCurrentSession()
  ]);

  if (!vendors.length) {
    notFound();
  }

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <VendorDetailNav session={session} />
        <ReviewSubmissionPage vendors={vendors} criteria={criteria} initialVendorSlug={resolvedSearchParams?.vendorSlug} reviewId={resolvedSearchParams?.reviewId} />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
