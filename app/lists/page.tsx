import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionsHeader } from "@/components/collections/CollectionsHeader";
import { CollectionsTopNav } from "@/components/collections/CollectionsTopNav";
import { NewMoodboardCard } from "@/components/collections/NewMoodboardCard";
import { SavedVendorsTable } from "@/components/collections/SavedVendorsTable";
import { getCollectionListCards, getCollectionsPageCopy, getSavedVendorRows } from "@/lib/services/collections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getMockSession } from "@/lib/services/session";

export default async function ListsPage() {
  const session = await getMockSession();
  if (!session.user) {
    return null;
  }

  const [copy, lists, savedRows, footerContent] = await Promise.all([
    getCollectionsPageCopy(),
    getCollectionListCards(session.user.id),
    getSavedVendorRows(session.user.id),
    getFooterContent()
  ]);

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <CollectionsTopNav
          brandLabel={copy.brandLabel}
          avatarName={session.user.name}
          avatarUrl={`https://i.pravatar.cc/100?u=${session.user.id}`}
          navLinks={[
            { label: "Saved Vendors", href: "/lists", active: true },
            { label: "My Reviews", href: "/me/reviews" }
          ]}
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <CollectionsHeader copy={copy} />

          <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <CollectionCard key={list.id} list={list} privateLabel={copy.visibilityPrivateLabel} sharedLabel={copy.visibilitySharedLabel} />
            ))}
            <NewMoodboardCard label={copy.newMoodboardLabel} />
          </section>

          <SavedVendorsTable title={copy.allSavedVendorsTitle} rows={savedRows} addToListLabel={copy.addToListLabel} />
        </main>
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
