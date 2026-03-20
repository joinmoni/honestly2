import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorDetailNav } from "@/components/vendor-detail/VendorDetailNav";
import { VendorDetailPageContent } from "@/components/vendor-detail/VendorDetailPageContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { getCurrentSession } from "@/lib/services/session";
import { getRatingCriteria, getReviewsByVendorId } from "@/lib/services/reviews";
import { getVendorBySlug } from "@/lib/services/vendors";
import { getVendorProfileByVendorId } from "@/lib/services/vendor-profiles";
import { buildPageMetadata } from "@/lib/seo";

type VendorDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VendorDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    return buildPageMetadata({
      title: "Vendor not found | Honestly",
      description: "This vendor profile could not be found on Honestly.",
      path: `/vendor/${slug}`
    });
  }

  const primaryLocation = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const locationLabel = primaryLocation ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}` : "Location on request";
  const categoryLabel = vendor.primaryCategory?.name ?? "Vendor";

  return buildPageMetadata({
    title: `${vendor.name} | ${categoryLabel} on Honestly`,
    description: `${vendor.headline ?? vendor.description ?? `${vendor.name} on Honestly`}${locationLabel ? ` Based in ${locationLabel}.` : ""}`,
    path: `/vendor/${vendor.slug}`
  });
}

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
    getCurrentSession(),
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
        <VendorDetailNav session={session} />

        <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-10">
          <VendorDetailPageContent vendor={vendor} profile={profile} initialLists={initialLists} session={session} criteria={criteria} approvedReviews={approvedReviews} />
        </main>
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
