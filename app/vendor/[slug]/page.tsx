import { notFound } from "next/navigation";
import { VendorDetailAbout } from "@/components/vendor-detail/VendorDetailAbout";
import { VendorDetailGallery } from "@/components/vendor-detail/VendorDetailGallery";
import { VendorDetailHero } from "@/components/vendor-detail/VendorDetailHero";
import { VendorDetailNav } from "@/components/vendor-detail/VendorDetailNav";
import { VendorDetailReviewFlow } from "@/components/vendor-detail/VendorDetailReviewFlow";
import { VendorDetailSidebar } from "@/components/vendor-detail/VendorDetailSidebar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { getMockSession } from "@/lib/services/session";
import { getRatingCriteria, getReviewsByVendorId } from "@/lib/services/reviews";
import { getVendorBySlug } from "@/lib/services/vendors";
import { getVendorProfileByVendorId } from "@/lib/services/vendor-profiles";

type VendorDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VendorDetailPage({ params }: VendorDetailPageProps) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const [profile, reviews, criteria, session, footerContent] = await Promise.all([
    getVendorProfileByVendorId(vendor.id),
    getReviewsByVendorId(vendor.id),
    getRatingCriteria(),
    getMockSession(),
    getFooterContent()
  ]);
  const initialLists = session.user ? await getListsByUserId(session.user.id) : [];

  if (!profile) {
    notFound();
  }

  const approvedReviews = reviews.filter((review) => review.status === "approved");

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <VendorDetailNav />

        <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12">
          <VendorDetailHero vendor={vendor} profile={profile} initialLists={initialLists} session={session} />
          <VendorDetailGallery images={vendor.images} />

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.5fr)_360px]">
            <div className="space-y-12">
              <VendorDetailAbout profile={profile} />
              <VendorDetailReviewFlow
                vendorId={vendor.id}
                vendorName={vendor.name}
                profile={profile}
                criteria={criteria}
                initialReviews={approvedReviews}
                initialReviewCount={vendor.reviewCount}
                session={session}
              />
            </div>

            <VendorDetailSidebar vendor={vendor} profile={profile} />
          </div>
        </main>
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
