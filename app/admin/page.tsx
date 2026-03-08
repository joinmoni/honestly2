import { AdminManagementScreen } from "@/components/admin/AdminManagementScreen";
import { getAdminDashboardData } from "@/lib/services/admin-dashboard";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminPage() {
  await requireAdminSession();

  const data = await getAdminDashboardData();

  return <AdminManagementScreen data={data} />;
}
