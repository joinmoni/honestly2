import { CreateListRedirect } from "@/components/collections/CreateListRedirect";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { ListDetailScreen } from "@/components/collections/ListDetailScreen";
import { getFooterContent } from "@/lib/services/footer";
import { requireUserSession } from "@/lib/services/session";
import { getUserNavLinks } from "@/lib/user-nav";

type NewListPageProps = {
  searchParams?: Promise<{
    draft?: string;
  }>;
};

export default async function NewListPage({ searchParams }: NewListPageProps) {
  const user = await requireUserSession("/lists/new");
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const footerContent = await getFooterContent();

  if (resolvedSearchParams?.draft === "1") {
    return (
      <>
        <div className="bg-[#FDFCFB] text-stone-900">
          <UserTopNav
            brandLabel="honestly."
            avatarName={user.name}
            avatarEmail={user.email}
            avatarUrl={user.avatarUrl}
            accountRole={user.role}
            navLinks={getUserNavLinks("none")}
          />
          <ListDetailScreen
            isDraft
            draftUserId={user.id}
            data={{
              id: "draft-list",
              name: "New List",
              visibility: "private",
              vendorCount: 0,
              itemCountLabel: "0 vendors saved",
              vendors: [],
              sourceList: {
                id: "draft-list",
                userId: user.id,
                name: "New List",
                isPublic: false,
                items: []
              },
              copy: {
                brandLabel: "honestly.",
                backHref: "/lists",
                backLabel: "Back to lists",
                visibilityPrivateLabel: "Private",
                visibilitySharedLabel: "Shared",
                shareLabel: "Shareable link ready",
                notesHeading: "Planner Notes",
                emptyTitle: "Start building this list",
                emptyDescription: "Name your list first, then save vendors from discovery pages and they will appear here."
              }
            }}
          />
        </div>
        <SiteFooter content={footerContent} variant="dark" />
      </>
    );
  }

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <UserTopNav
          brandLabel="honestly."
          avatarName={user.name}
          avatarEmail={user.email}
          avatarUrl={user.avatarUrl}
          accountRole={user.role}
          navLinks={getUserNavLinks("none")}
        />
        <CreateListRedirect userId={user.id} />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
