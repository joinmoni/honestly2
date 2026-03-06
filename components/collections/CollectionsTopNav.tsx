import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";

type CollectionsTopNavProps = {
  brandLabel: string;
  avatarName?: string;
  avatarUrl?: string;
  navLinks: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

export function CollectionsTopNav({ brandLabel, avatarName, avatarUrl, navLinks }: CollectionsTopNavProps) {
  return (
    <EditorialTopNav
      brandLabel={brandLabel}
      navLinks={navLinks}
      innerClassName="max-w-7xl"
      rightSlot={<ProfileMenu name={avatarName} imageUrl={avatarUrl} size="md" />}
    />
  );
}
