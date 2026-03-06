import { redirect } from "next/navigation";
import { AdminManagementScreen } from "@/components/admin/AdminManagementScreen";
import { getAdminDashboardData } from "@/lib/services/admin-dashboard";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminDashboardData();

  return <AdminManagementScreen data={data} />;
}
