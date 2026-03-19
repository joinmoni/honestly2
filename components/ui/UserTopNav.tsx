import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";

type UserTopNavProps = {
  brandLabel?: string;
  avatarName?: string | null;
  avatarEmail?: string | null;
  avatarUrl?: string;
  navLinks: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

export function UserTopNav({ brandLabel = "honestly.", avatarName, avatarEmail, avatarUrl, navLinks }: UserTopNavProps) {
  return (
    <EditorialTopNav
      brandLabel={brandLabel}
      navLinks={navLinks}
      innerClassName="max-w-7xl md:px-12"
      rightSlot={<ProfileMenu name={avatarName} email={avatarEmail} imageUrl={avatarUrl} size="md" />}
    />
  );
}
