import { CollectionsTopNav } from "@/components/collections/CollectionsTopNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PreferencesScreen } from "@/components/preferences/PreferencesScreen";
import { getFooterContent } from "@/lib/services/footer";
import { requireUserSession } from "@/lib/services/session";

export default async function PreferencesPage() {
  const [user, footerContent] = await Promise.all([requireUserSession(), getFooterContent()]);

  return (
    <>
      <CollectionsTopNav
        brandLabel="honestly."
        avatarName={user.name}
        avatarUrl={user.avatarUrl}
        navLinks={[
          { label: "Saved Vendors", href: "/lists" },
          { label: "My Reviews", href: "/me/reviews" },
          { label: "Preferences", href: "/preferences", active: true }
        ]}
      />
      <PreferencesScreen session={user} />
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
