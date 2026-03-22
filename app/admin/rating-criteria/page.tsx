import { AdminRatingCriteriaScreen } from "@/components/admin/AdminRatingCriteriaScreen";
import { getAdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";

export default async function AdminRatingCriteriaPage() {
  const data = await getAdminRatingCriteriaData();

  return <AdminRatingCriteriaScreen data={data} />;
}
