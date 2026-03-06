import { redirect } from "next/navigation";
import { AdminTaxonomyScreen } from "@/components/admin/AdminTaxonomyScreen";
import { getAdminTaxonomyData } from "@/lib/services/admin-categories";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminCategoriesPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminTaxonomyData();

  return <AdminTaxonomyScreen data={data} />;
}
