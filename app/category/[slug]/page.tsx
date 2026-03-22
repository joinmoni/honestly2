import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListingScreen } from "@/components/category-listing/CategoryListingScreen";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCategoryListingPageData } from "@/lib/services/category-listing";
import { getFooterContent } from "@/lib/services/footer";
import { getCurrentSession } from "@/lib/services/session";
import { buildPageMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryListingPageData(slug);

  if (!data) {
    return buildPageMetadata({
      title: "Category not found | Honestly",
      description: "This category page could not be found on Honestly.",
      path: `/category/${slug}`
    });
  }

  return buildPageMetadata({
    title: `${data.categoryName} Vendors | Honestly`,
    description: data.copy.description,
    path: `/category/${data.categorySlug}`
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [data, footerContent] = await Promise.all([
    getCategoryListingPageData(slug),
    getFooterContent()
  ]);
  const session = await getCurrentSession();

  if (!data) {
    notFound();
  }

  return (
    <>
      <CategoryListingScreen
        data={data}
        currentUserName={session.user?.name}
        currentUserEmail={session.user?.email}
        currentUserAvatarUrl={session.user?.avatarUrl}
        currentUserRole={session.user?.role}
      />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
