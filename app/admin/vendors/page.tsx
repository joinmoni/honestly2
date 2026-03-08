import { AdminVendorDirectoryScreen } from "@/components/admin/AdminVendorDirectoryScreen";
import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminVendorsPage() {
  await requireAdminSession();

  const data = await getAdminVendorDirectoryData();

  return <AdminVendorDirectoryScreen data={data} />;
}
