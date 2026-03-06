import { redirect } from "next/navigation";
import { AdminRatingCriteriaScreen } from "@/components/admin/AdminRatingCriteriaScreen";
import { getAdminRatingCriteriaData } from "@/lib/services/admin-rating-criteria";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminRatingCriteriaPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminRatingCriteriaData();

  return <AdminRatingCriteriaScreen data={data} />;
}
