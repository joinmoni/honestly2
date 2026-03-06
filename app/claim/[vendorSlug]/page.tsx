import { notFound, redirect } from "next/navigation";
import { ClaimPageScreen } from "@/components/claim/ClaimPageScreen";
import { getClaimPageDataByVendorSlug } from "@/lib/services/claim-page";
import { getMockSession } from "@/lib/services/session";

type ClaimPageProps = {
  params: Promise<{ vendorSlug: string }>;
};

export default async function ClaimPage({ params }: ClaimPageProps) {
  const session = await getMockSession();

  if (!session.user) {
    redirect("/login");
  }

  const { vendorSlug } = await params;
  const data = await getClaimPageDataByVendorSlug(vendorSlug, session.user.id);

  if (!data) {
    notFound();
  }

  return <ClaimPageScreen data={data} />;
}
