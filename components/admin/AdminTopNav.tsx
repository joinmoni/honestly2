"use client";

import { AdminChromeProvider, useAdminChromeOptional } from "@/components/admin/AdminChromeContext";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";

type AdminTopNavProps = {
  brandLabel: string;
  navLinks: AdminNavLink[];
  /** When set, wraps with chrome so ProfileMenu works outside `app/admin` layout (tests). */
  avatarName?: string;
};

function AdminTopNavInner({ brandLabel, navLinks, avatarName }: AdminTopNavProps) {
  const chrome = useAdminChromeOptional();
  const displayName = avatarName ?? chrome?.displayName ?? "Admin user";
  const email = chrome?.email;
  const imageUrl = chrome?.avatarUrl;

  const centerLinks = navLinks.map((link) => ({
    label: link.label,
    href: link.href,
    active: link.active,
    count: link.count
  }));

  return (
    <EditorialTopNav
      brandLabel={brandLabel}
      brandHref="/admin"
      navLinks={centerLinks}
      desktopNavSource="navLinks"
      innerClassName="max-w-[1400px] px-8"
      rightSlot={<ProfileMenu name={displayName} email={email} imageUrl={imageUrl} accountRole="admin" />}
    />
  );
}

/** Renders admin top nav; outside `app/admin` layout, pass `avatarName` (and wrap with `AdminChromeProvider` if ProfileMenu needs email/avatar). */
export function AdminTopNav(props: AdminTopNavProps) {
  if (props.avatarName !== undefined) {
    return (
      <AdminChromeProvider value={{ displayName: props.avatarName, email: "", avatarUrl: undefined }}>
        <AdminTopNavInner {...props} />
      </AdminChromeProvider>
    );
  }

  return <AdminTopNavInner {...props} />;
}
