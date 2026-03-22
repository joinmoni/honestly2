import { headers } from "next/headers";

import { AdminChromeProvider } from "@/components/admin/AdminChromeContext";
import { getAdminNavDisplayName } from "@/lib/session-admin-display";
import { requireAdminSession } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/admin";
  const user = await requireAdminSession(pathname);
  const displayName = getAdminNavDisplayName(user);

  return (
    <AdminChromeProvider value={{ displayName, email: user.email, avatarUrl: user.avatarUrl }}>{children}</AdminChromeProvider>
  );
}
