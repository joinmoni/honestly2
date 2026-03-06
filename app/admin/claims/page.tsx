import { redirect } from "next/navigation";
import { AdminClaimsModerationScreen } from "@/components/admin/AdminClaimsModerationScreen";
import { getAdminClaimsModerationData } from "@/lib/services/admin-claims";
import { getMockAdminSession } from "@/lib/services/session";

export default async function AdminClaimsPage() {
  const session = await getMockAdminSession();

  if (!session.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const data = await getAdminClaimsModerationData();

  return <AdminClaimsModerationScreen data={data} />;
}
