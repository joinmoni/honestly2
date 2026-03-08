import { AdminReviewModerationScreen } from "@/components/admin/AdminReviewModerationScreen";
import { getAdminReviewModerationData } from "@/lib/services/admin-reviews";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminReviewsPage() {
  await requireAdminSession();

  const data = await getAdminReviewModerationData();

  return <AdminReviewModerationScreen data={data} />;
}
