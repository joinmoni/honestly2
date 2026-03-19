import { notFound } from "next/navigation";
import { ClaimPageScreen } from "@/components/claim/ClaimPageScreen";
import { getClaimPageDataByVendorSlug } from "@/lib/services/claim-page";
import { requireUserSession } from "@/lib/services/session";

type ClaimPageProps = {
  params: Promise<{ vendorSlug: string }>;
};

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { vendorSlug } = await params;
  const user = await requireUserSession(`/claim/${vendorSlug}`);
  const data = await getClaimPageDataByVendorSlug(vendorSlug, user.id);

  if (!data) {
    notFound();
  }

  return <ClaimPageScreen data={data} currentUser={{ id: user.id, name: user.name }} />;
}
