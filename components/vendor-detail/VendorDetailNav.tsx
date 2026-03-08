import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import type { MockSession } from "@/lib/types/domain";

type VendorDetailNavProps = {
  session: MockSession;
};

export function VendorDetailNav({ session }: VendorDetailNavProps) {
  return (
    <EditorialTopNav
      brandLabel="honestly."
      navLinks={[
        { label: "Browse Vendors", href: "/vendors", active: true },
        { label: "Saved Vendors", href: "/lists" },
        { label: "Preferences", href: "/preferences" }
      ]}
      innerClassName="max-w-7xl md:px-12"
      rightSlot={<ProfileMenu name={session.user?.name} email={session.user?.email} imageUrl={session.user?.avatarUrl} />}
    />
  );
}
