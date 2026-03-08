import { notFound } from "next/navigation";
import { ListDetailScreen } from "@/components/collections/ListDetailScreen";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SharedCollectionScreen } from "@/components/shared-collection/SharedCollectionScreen";
import { getListDetailPageData } from "@/lib/services/collections";
import { getFooterContent } from "@/lib/services/footer";
import { getCurrentSession } from "@/lib/services/session";
import { getSharedCollectionBySlug } from "@/lib/services/shared-collections";

type SharedCollectionPageProps = {
  params: Promise<{ shareSlug: string }>;
};

export default async function SharedCollectionPage({ params }: SharedCollectionPageProps) {
  const { shareSlug } = await params;
  const [session, footerContent] = await Promise.all([getCurrentSession(), getFooterContent()]);

  if (session.user) {
    const listData = await getListDetailPageData(session.user.id, shareSlug);

    if (listData) {
      return (
        <>
          <ListDetailScreen
            data={listData}
            avatarName={session.user.name}
            avatarUrl={session.user.avatarUrl}
          />
          <SiteFooter content={footerContent} variant="dark" />
        </>
      );
    }
  }

  const data = await getSharedCollectionBySlug(shareSlug);
  if (!data) notFound();

  return (
    <>
      <SharedCollectionScreen data={data} />
      <SiteFooter content={footerContent} variant="light" />
    </>
  );
}
