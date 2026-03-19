import Link from "next/link";
import type { Vendor } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailSidebarProps = {
  vendor: Vendor;
  profile: VendorProfile;
};

export function VendorDetailSidebar({ vendor, profile }: VendorDetailSidebarProps) {
  const primaryLocation = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const locationLabel = primaryLocation
    ? `${primaryLocation.city}${primaryLocation.region ? `, ${primaryLocation.region}` : ""}${primaryLocation.country ? `, ${primaryLocation.country}` : ""}`
    : "Location on request";
  const travelLabel =
    vendor.travels && vendor.serviceRadiusKm
      ? `Travels up to ${vendor.serviceRadiusKm} km`
      : vendor.travels
        ? "Available for travel"
        : "Local service area";

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-xl shadow-stone-200/20 md:rounded-[2.25rem] md:p-8">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 md:mb-3 md:text-[10px] md:tracking-[0.22em]">At a Glance</p>
          <h3 className="mb-5 text-3xl md:mb-6">Service Details</h3>
          <div className="space-y-2 text-[13px] md:space-y-4 md:text-sm">
            <div className="flex justify-between border-b border-stone-50 py-3">
              <span className="text-stone-400">Category</span>
              <span className="font-medium text-stone-800">{profile.serviceDetails.categoryLabel || vendor.primaryCategory?.name || "Vendor"}</span>
            </div>
            <div className="flex justify-between border-b border-stone-50 py-3">
              <span className="text-stone-400">Price Range</span>
              <span className="font-medium text-stone-800">{profile.serviceDetails.priceRangeLabel}</span>
            </div>
            <div className="flex justify-between border-b border-stone-50 py-3">
              <span className="text-stone-400">Availability</span>
              <span className="font-medium text-amber-600">{profile.serviceDetails.availabilityLabel}</span>
            </div>
            <div className="flex justify-between border-b border-stone-50 py-3">
              <span className="text-stone-400">Based In</span>
              <span className="max-w-[12rem] text-right font-medium text-stone-800">{locationLabel}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-stone-400">Travel</span>
              <span className="max-w-[12rem] text-right font-medium text-stone-800">{travelLabel}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-stone-900 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.02] md:mt-8 md:py-4 md:text-[12px]"
            aria-label={profile.ctas.contactLabel}
          >
            {profile.ctas.contactLabel}
          </button>
        </div>

        <div className="rounded-[1.6rem] border border-dashed border-stone-200 bg-stone-50/70 p-5 text-center md:rounded-[2rem] md:p-6">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 md:text-[10px] md:tracking-[0.22em]">Own this business?</p>
          <Link href={`/claim/${vendor.slug}`} className="cursor-pointer text-[10px] font-black uppercase tracking-[0.18em] text-stone-700 underline underline-offset-4 md:text-[11px]">
            {profile.ctas.claimLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
