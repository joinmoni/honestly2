import { notFound, redirect } from "next/navigation";
import { VendorEditScreen } from "@/components/vendor-dashboard/VendorEditScreen";
import { getMockSession } from "@/lib/services/session";
import { getVendorEditPageDataBySlug } from "@/lib/services/vendor-edit";

type VendorEditPageProps = {
  params: Promise<{ vendorSlug: string }>;
};

export default async function VendorEditPage({ params }: VendorEditPageProps) {
  const session = await getMockSession();

  if (!session.user) {
    redirect("/login");
  }

  const { vendorSlug } = await params;
  const data = await getVendorEditPageDataBySlug(vendorSlug);

  if (!data) {
    notFound();
  }

  return <VendorEditScreen data={data} />;
}
