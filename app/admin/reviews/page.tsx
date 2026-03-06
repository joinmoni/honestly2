import { redirect } from "next/navigation";
import { AdminReviewModerationScreen } from "@/components/admin/AdminReviewModerationScreen";
import { getAdminReviewModerationData } from "@/lib/services/admin-reviews";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminReviewsPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminReviewModerationData();

  return <AdminReviewModerationScreen data={data} />;
}
