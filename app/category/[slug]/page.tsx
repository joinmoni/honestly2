import { notFound } from "next/navigation";
import { CategoryListingScreen } from "@/components/category-listing/CategoryListingScreen";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCategoryListingPageData } from "@/lib/services/category-listing";
import { getFooterContent } from "@/lib/services/footer";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [data, footerContent] = await Promise.all([
    getCategoryListingPageData(slug),
    getFooterContent()
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <CategoryListingScreen data={data} />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
