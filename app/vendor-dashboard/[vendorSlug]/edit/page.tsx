import { notFound } from "next/navigation";
import { VendorEditScreen } from "@/components/vendor-dashboard/VendorEditScreen";
import { requireUserSession } from "@/lib/services/session";
import { getVendorEditPageDataBySlug } from "@/lib/services/vendor-edit";

type VendorEditPageProps = {
  params: Promise<{ vendorSlug: string }>;
};

export default async function VendorEditPage({ params }: VendorEditPageProps) {
  const { vendorSlug } = await params;
  await requireUserSession(`/vendor-dashboard/${vendorSlug}/edit`);
  const data = await getVendorEditPageDataBySlug(vendorSlug);

  if (!data) {
    notFound();
  }

  return <VendorEditScreen data={data} />;
}
