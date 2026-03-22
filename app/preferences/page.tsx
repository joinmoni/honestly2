import { CollectionsTopNav } from "@/components/collections/CollectionsTopNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PreferencesScreen } from "@/components/preferences/PreferencesScreen";
import { getFooterContent } from "@/lib/services/footer";
import { requireUserSession } from "@/lib/services/session";
import { getUserNavLinks } from "@/lib/user-nav";

export default async function PreferencesPage() {
  const [user, footerContent] = await Promise.all([requireUserSession("/preferences"), getFooterContent()]);

  return (
    <>
      <CollectionsTopNav
        brandLabel="honestly."
        avatarName={user.name}
        avatarEmail={user.email}
        avatarUrl={user.avatarUrl}
        accountRole={user.role}
        navLinks={getUserNavLinks("preferences")}
      />
      <PreferencesScreen session={user} />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
