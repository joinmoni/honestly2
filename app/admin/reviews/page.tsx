import { AdminReviewModerationScreen } from "@/components/admin/AdminReviewModerationScreen";
import { getAdminReviewModerationData } from "@/lib/services/admin-reviews";

export default async function AdminReviewsPage() {
  const data = await getAdminReviewModerationData();

  return <AdminReviewModerationScreen data={data} />;
}
