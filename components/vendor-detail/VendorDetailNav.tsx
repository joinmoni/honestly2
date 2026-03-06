import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";

export function VendorDetailNav() {
  return (
    <EditorialTopNav
      brandLabel="honestly."
      navLinks={[
        { label: "Browse Vendors", href: "/vendors", active: true },
        { label: "Saved Vendors", href: "/lists" }
      ]}
      innerClassName="max-w-7xl md:px-12"
      rightSlot={<ProfileMenu name="Avery Johnson" email="avery@example.com" />}
    />
  );
}
