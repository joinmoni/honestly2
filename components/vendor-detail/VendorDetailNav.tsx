import { UserTopNav } from "@/components/ui/UserTopNav";
import { getUserNavLinks } from "@/lib/user-nav";
import type { MockSession } from "@/lib/types/domain";

type VendorDetailNavProps = {
  session: MockSession;
};

export function VendorDetailNav({ session }: VendorDetailNavProps) {
  return (
    <UserTopNav
      brandLabel="honestly."
      avatarName={session.user?.name}
      avatarEmail={session.user?.email}
      avatarUrl={session.user?.avatarUrl}
      navLinks={getUserNavLinks("none")}
    />
  );
}
