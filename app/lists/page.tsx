import { CollectionsTopNav } from "@/components/collections/CollectionsTopNav";
import { CollectionsOverviewScreen } from "@/components/collections/CollectionsOverviewScreen";
import { getCollectionListCards, getCollectionsPageCopy, getSavedVendorRows } from "@/lib/services/collections";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { requireUserSession } from "@/lib/services/session";
import { getUserNavLinks } from "@/lib/user-nav";

export default async function ListsPage() {
  const user = await requireUserSession("/lists");

  const [copy, lists, savedLists, savedRows, footerContent] = await Promise.all([
    getCollectionsPageCopy(),
    getCollectionListCards(user.id),
    getListsByUserId(user.id),
    getSavedVendorRows(user.id),
    getFooterContent()
  ]);

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <CollectionsTopNav
          brandLabel={copy.brandLabel}
          avatarName={user.name}
          avatarEmail={user.email}
          avatarUrl={user.avatarUrl}
          accountRole={user.role}
          navLinks={getUserNavLinks("saved_vendors")}
        />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <CollectionsOverviewScreen userId={user.id} copy={copy} initialLists={lists} initialSavedLists={savedLists} savedRows={savedRows} />
        </main>
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
