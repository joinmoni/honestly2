import { UserTopNav } from "@/components/ui/UserTopNav";

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
  return <UserTopNav brandLabel={brandLabel} avatarName={avatarName} avatarUrl={avatarUrl} navLinks={navLinks} />;
}
