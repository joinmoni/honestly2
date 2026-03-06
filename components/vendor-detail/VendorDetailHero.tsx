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
    <div className="mb-12 rounded-[2.5rem] border border-stone-200/80 bg-white px-7 py-8 shadow-xl shadow-stone-200/30 md:px-10 md:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-stone-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
          {categoryLabel}
        </span>
        {subcategoryLabel ? (
          <span className="rounded-full border border-stone-200 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            {subcategoryLabel}
          </span>
        ) : null}
        {vendor.verified ? <span className="rounded-full bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Verified Vendor</span> : null}
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">
            {locationLabel ?? "Available by request"}
          </p>

          <h1 className="mb-4 text-5xl leading-[0.98] md:text-7xl">{vendor.name}</h1>

          <p className="max-w-2xl text-lg leading-relaxed text-stone-600">
            {vendor.headline ?? vendor.description ?? profile.aboutParagraphs[0]}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-stone-900">
              <span className="text-amber-500">★</span>
              <span>{vendor.ratingAvg.toFixed(1)}</span>
              <span className="text-stone-400">/ 5</span>
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-400">{vendor.reviewCount} Reviews</div>
            {profile.serviceDetails.priceRangeLabel ? (
              <div className="text-[11px] font-black uppercase tracking-[0.16em] text-stone-400">{profile.serviceDetails.priceRangeLabel}</div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:min-w-[220px]">
          <button
            type="button"
            className="rounded-full bg-stone-900 px-8 py-4 text-[12px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-stone-200 transition-all hover:bg-stone-800"
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
              className="flex-1 rounded-full border border-stone-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
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
