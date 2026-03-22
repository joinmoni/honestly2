import { AdminTaxonomyScreen } from "@/components/admin/AdminTaxonomyScreen";
import { getAdminTaxonomyData } from "@/lib/services/admin-categories";

export default async function AdminCategoriesPage() {
  const data = await getAdminTaxonomyData();

  return <AdminTaxonomyScreen data={data} />;
}
