import { AdminClaimsModerationScreen } from "@/components/admin/AdminClaimsModerationScreen";
import { getAdminClaimsModerationData } from "@/lib/services/admin-claims";

export default async function AdminClaimsPage() {
  const data = await getAdminClaimsModerationData();

  return <AdminClaimsModerationScreen data={data} />;
}
