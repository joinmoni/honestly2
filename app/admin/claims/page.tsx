import { AdminClaimsModerationScreen } from "@/components/admin/AdminClaimsModerationScreen";
import { getAdminClaimsModerationData } from "@/lib/services/admin-claims";
import { requireAdminSession } from "@/lib/services/session";

export default async function AdminClaimsPage() {
  await requireAdminSession("/admin/claims");

  const data = await getAdminClaimsModerationData();

  return <AdminClaimsModerationScreen data={data} />;
}
