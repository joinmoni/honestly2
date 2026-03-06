import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SharedCollectionScreen } from "@/components/shared-collection/SharedCollectionScreen";
import { getFooterContent } from "@/lib/services/footer";
import { getSharedCollectionBySlug } from "@/lib/services/shared-collections";

type SharedCollectionPageProps = {
  params: Promise<{ shareSlug: string }>;
};

export default async function SharedCollectionPage({ params }: SharedCollectionPageProps) {
  const { shareSlug } = await params;
  const [data, footerContent] = await Promise.all([
    getSharedCollectionBySlug(shareSlug),
    getFooterContent()
  ]);

  if (!data) {
    notFound();
  }

  return (
    <>
      <SharedCollectionScreen data={data} />
      <SiteFooter content={footerContent} variant="light" />
    </>
  );
}
