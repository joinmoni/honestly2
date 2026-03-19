import { AdminRatingCriteriaScreen } from "@/components/admin/AdminRatingCriteriaScreen";
import { getAdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminRatingCriteriaPage() {
  await requireAdminSession("/admin/rating-criteria");

  const data = await getAdminRatingCriteriaData();

  return <AdminRatingCriteriaScreen data={data} />;
}
