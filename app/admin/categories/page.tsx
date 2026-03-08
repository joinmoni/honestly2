import { AdminTaxonomyScreen } from "@/components/admin/AdminTaxonomyScreen";
import { getAdminTaxonomyData } from "@/lib/services/admin-categories";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminCategoriesPage() {
  await requireAdminSession();

  const data = await getAdminTaxonomyData();

  return <AdminTaxonomyScreen data={data} />;
}
