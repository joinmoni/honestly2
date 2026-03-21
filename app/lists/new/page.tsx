import { CreateListRedirect } from "@/components/collections/CreateListRedirect";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { getFooterContent } from "@/lib/services/footer";
import { getListsByUserId } from "@/lib/services/lists";
import { requireUserSession } from "@/lib/services/session";
import { getUserNavLinks } from "@/lib/user-nav";

export default async function NewListPage() {
  const user = await requireUserSession("/lists/new");
  const [lists, footerContent] = await Promise.all([getListsByUserId(user.id), getFooterContent()]);

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <UserTopNav brandLabel="honestly." avatarName={user.name} avatarEmail={user.email} avatarUrl={user.avatarUrl} navLinks={getUserNavLinks("none")} />
        <CreateListRedirect userId={user.id} initialLists={lists} />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
