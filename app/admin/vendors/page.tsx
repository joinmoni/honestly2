import { redirect } from "next/navigation";
import { AdminVendorDirectoryScreen } from "@/components/admin/AdminVendorDirectoryScreen";
import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminVendorsPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminVendorDirectoryData();

  return <AdminVendorDirectoryScreen data={data} />;
}
