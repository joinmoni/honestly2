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
        <div className="rounded-[2.25rem] border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/30">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">At a Glance</p>
          <h3 className="mb-6 text-3xl">Service Details</h3>
          <div className="space-y-4 text-sm">
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
            className="mt-8 w-full rounded-full bg-stone-900 py-4 text-[12px] font-black uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.02]"
            aria-label={profile.ctas.contactLabel}
          >
            {profile.ctas.contactLabel}
          </button>
        </div>

        <div className="rounded-[2rem] border border-dashed border-stone-200 bg-stone-50/70 p-6 text-center">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Own this business?</p>
          <Link href={`/claim/${vendor.slug}`} className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-700 underline underline-offset-4">
            {profile.ctas.claimLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
