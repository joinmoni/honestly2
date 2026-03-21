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
  }>;
};

export default async function ReviewNewPage({ searchParams }: ReviewNewPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  await requireUserSession(`/reviews/new${resolvedSearchParams?.vendorSlug ? `?vendorSlug=${resolvedSearchParams.vendorSlug}` : ""}`);

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
        <ReviewSubmissionPage vendors={vendors} criteria={criteria} initialVendorSlug={resolvedSearchParams?.vendorSlug} />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
