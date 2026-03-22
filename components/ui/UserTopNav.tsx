import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

type UserTopNavProps = {
  brandLabel?: string;
  avatarName?: string | null;
  avatarEmail?: string | null;
  avatarUrl?: string;
  accountRole?: "user" | "admin";
  className?: string;
  navLinks: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

export function UserTopNav({ brandLabel = "honestly.", avatarName, avatarEmail, avatarUrl, accountRole, className, navLinks }: UserTopNavProps) {
  return (
    <>
      <EditorialTopNav
        brandLabel={brandLabel}
        navLinks={navLinks}
        desktopNavSource="navLinks"
        className={className}
        innerClassName="max-w-7xl md:px-12"
        rightSlot={<ProfileMenu name={avatarName} email={avatarEmail} imageUrl={avatarUrl} accountRole={accountRole} size="md" />}
      />
      <MobileBottomNav links={navLinks} />
    </>
  );
}
