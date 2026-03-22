import { AdminVendorDirectoryScreen } from "@/components/admin/AdminVendorDirectoryScreen";
import { getAdminVendorDirectoryData } from "@/lib/services/admin-vendors";

export default async function AdminVendorsPage() {
  const data = await getAdminVendorDirectoryData();

  return <AdminVendorDirectoryScreen data={data} />;
}
