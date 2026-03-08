import { VendorSaveButton } from "@/components/lists/VendorSaveButton";
import type { MockSession, SavedList, Vendor } from "@/lib/types/domain";
import type { VendorProfile } from "@/lib/types/vendor-profile";

type VendorDetailHeroProps = {
  vendor: Vendor;
  profile: VendorProfile;
  initialLists: SavedList[];
  session: MockSession;
};

export function VendorDetailHero({ vendor, profile, initialLists, session }: VendorDetailHeroProps) {
  const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
  const categoryLabel = vendor.primaryCategory?.name ?? profile.serviceDetails.categoryLabel ?? "Vendor";
  const subcategoryLabel = vendor.subcategories[0]?.name;
  const locationLabel = location ? `${location.city}${location.region ? `, ${location.region}` : ""}` : null;

  return (
    <div className="mb-6 rounded-[2rem] border border-stone-200/80 bg-white px-5 py-6 shadow-xl shadow-stone-200/20 md:mb-8 md:rounded-[2.25rem] md:px-8 md:py-8">
      <div className="mb-5 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
        <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-stone-500 md:px-4 md:py-2 md:text-[10px] md:tracking-[0.2em]">
          {categoryLabel}
        </span>
        {subcategoryLabel ? (
          <span className="rounded-full border border-stone-200 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 md:px-4 md:py-2 md:text-[10px] md:tracking-[0.2em]">
            {subcategoryLabel}
          </span>
        ) : null}
        {vendor.verified ? <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-700 md:px-4 md:py-2 md:text-[10px] md:tracking-[0.2em]">Verified Vendor</span> : null}
      </div>

      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-6">
        <div className="max-w-3xl">
          <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-stone-400 md:mb-3 md:text-[10px] md:tracking-[0.22em]">
            {locationLabel ?? "Available by request"}
          </p>

          <h1 className="mb-3 text-4xl leading-[0.95] md:mb-3 md:text-6xl">{vendor.name}</h1>

          <p className="max-w-2xl text-base leading-relaxed text-stone-600 md:text-[17px]">
            {vendor.headline ?? vendor.description ?? profile.aboutParagraphs[0]}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:mt-6 md:gap-x-6 md:gap-y-3">
            <div className="flex items-center gap-2 font-bold uppercase tracking-[0.14em] text-stone-900 md:tracking-[0.16em]">
              <span className="text-amber-500">★</span>
              <span>{vendor.ratingAvg.toFixed(1)}</span>
              <span className="text-stone-400">/ 5</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400 md:text-[11px] md:tracking-[0.16em]">{vendor.reviewCount} Reviews</div>
            {profile.serviceDetails.priceRangeLabel ? (
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400 md:text-[11px] md:tracking-[0.16em]">{profile.serviceDetails.priceRangeLabel}</div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 md:min-w-[220px] md:gap-3">
          <button
            type="button"
            className="rounded-full bg-stone-900 px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800 md:px-8 md:py-4 md:text-[12px]"
            aria-label={profile.ctas.contactLabel}
          >
            {profile.ctas.contactLabel}
          </button>
          <div className="flex items-center gap-3">
            <VendorSaveButton
              vendor={vendor}
              label={profile.ctas.saveLabel}
              initialLists={initialLists}
              currentUserId={session.user?.id ?? null}
            />
            <button
              type="button"
              className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900 md:px-5 md:text-[11px]"
              aria-label={profile.ctas.shareLabel}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
