import { ClaimsOverviewScreen } from "@/components/claims/ClaimsOverviewScreen";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { getFooterContent } from "@/lib/services/footer";
import { getClaims } from "@/lib/services/claims";
import { requireUserSession } from "@/lib/services/session";
import { getUserNavLinks } from "@/lib/user-nav";
import { getVendors } from "@/lib/services/vendors";

export default async function ClaimsPage() {
  const user = await requireUserSession("/claims");
  const [claims, vendors, footerContent] = await Promise.all([getClaims(), getVendors(), getFooterContent()]);

  const userClaims = claims
    .filter((claim) => claim.userId === user.id)
    .map((claim) => {
      const vendor = vendors.find((entry) => entry.id === claim.vendorId);
      return {
        id: claim.id,
        vendorName: vendor?.name ?? "Unknown vendor",
        vendorSlug: vendor?.slug ?? "",
        status: claim.status,
        submittedAt: new Date(claim.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        verificationLine:
          claim.verification?.email ??
          claim.verification?.instagram ??
          claim.verification?.tiktok ??
          "No verification details submitted"
      };
    });

  return (
    <>
      <div className="bg-[#FDFCFB] text-stone-900">
        <UserTopNav brandLabel="honestly." avatarName={user.name} avatarEmail={user.email} avatarUrl={user.avatarUrl} navLinks={getUserNavLinks("none")} />
        <ClaimsOverviewScreen claims={userClaims} />
      </div>
      <SiteFooter content={footerContent} variant="dark" />
    </>
  );
}
