import { AdminManagementScreen } from "@/components/admin/AdminManagementScreen";
import { getAdminDashboardData } from "@/lib/services/admin-dashboard";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return <AdminManagementScreen data={data} />;
}
