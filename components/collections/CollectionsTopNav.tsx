import { UserTopNav } from "@/components/ui/UserTopNav";

type CollectionsTopNavProps = {
  brandLabel: string;
  avatarName?: string;
  avatarEmail?: string;
  avatarUrl?: string;
  accountRole?: "user" | "admin";
  navLinks: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;
};

export function CollectionsTopNav({ brandLabel, avatarName, avatarEmail, avatarUrl, accountRole, navLinks }: CollectionsTopNavProps) {
  return (
    <UserTopNav
      brandLabel={brandLabel}
      avatarName={avatarName}
      avatarEmail={avatarEmail}
      avatarUrl={avatarUrl}
      accountRole={accountRole}
      navLinks={navLinks}
    />
  );
}
