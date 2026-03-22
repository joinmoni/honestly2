import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionsTopNav } from "@/components/collections/CollectionsTopNav";
import { ListDetailScreen } from "@/components/collections/ListDetailScreen";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SharedCollectionScreen } from "@/components/shared-collection/SharedCollectionScreen";
import { getListDetailPageData } from "@/lib/services/collections";
import { getFooterContent } from "@/lib/services/footer";
import { getCurrentSession } from "@/lib/services/session";
import { getSharedCollectionBySlug } from "@/lib/services/shared-collections";
import { buildPageMetadata } from "@/lib/seo";
import { getUserNavLinks } from "@/lib/user-nav";

type SharedCollectionPageProps = {
  params: Promise<{ shareSlug: string }>;
};

export async function generateMetadata({ params }: SharedCollectionPageProps): Promise<Metadata> {
  const { shareSlug } = await params;
  const data = await getSharedCollectionBySlug(shareSlug);

  if (!data) {
    return buildPageMetadata({
      title: "Shared list not found | Honestly",
      description: "This shared collection could not be found on Honestly.",
      path: `/lists/${shareSlug}`
    });
  }

  return buildPageMetadata({
    title: `${data.title} | Shared on Honestly`,
    description: data.description,
    path: `/lists/${data.shareSlug}`
  });
}

export default async function SharedCollectionPage({ params }: SharedCollectionPageProps) {
  const { shareSlug } = await params;
  const [session, footerContent] = await Promise.all([getCurrentSession(), getFooterContent()]);

  if (session.user) {
    const listData = await getListDetailPageData(session.user.id, shareSlug);

    if (listData) {
      return (
        <>
          <CollectionsTopNav
            brandLabel="honestly."
            avatarName={session.user.name}
            avatarEmail={session.user.email}
            avatarUrl={session.user.avatarUrl}
            accountRole={session.user.role}
            navLinks={getUserNavLinks("saved_vendors")}
          />
          <ListDetailScreen data={listData} />
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
