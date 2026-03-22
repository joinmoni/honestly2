import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { MobileBottomNav } from "@/components/ui/MobileBottomNav";

type UserTopNavProps = {
  brandLabel?: string;
  avatarName?: string | null;
  avatarEmail?: string | null;
  avatarUrl?: string;
  className?: string;
  navLinks: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

export function UserTopNav({ brandLabel = "honestly.", avatarName, avatarEmail, avatarUrl, className, navLinks }: UserTopNavProps) {
  return (
    <>
      <EditorialTopNav
        brandLabel={brandLabel}
        navLinks={navLinks}
        className={className}
        innerClassName="max-w-7xl md:px-12"
        rightSlot={<ProfileMenu name={avatarName} email={avatarEmail} imageUrl={avatarUrl} size="md" />}
      />
      <MobileBottomNav links={navLinks} />
    </>
  );
}
