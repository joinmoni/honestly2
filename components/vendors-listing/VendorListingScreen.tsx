"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { VendorListingCard } from "@/components/vendors-listing/VendorListingCard";
import {
  createListWithVendor,
  getSavedVendorIds,
  toggleVendorInList
} from "@/lib/services/lists";
import type { SavedList } from "@/lib/types/domain";
import type { HomepageSearchIndex } from "@/lib/types/search";
import type { VendorListingPageData } from "@/lib/types/vendor-listing";

type VendorListingScreenProps = {
  data: VendorListingPageData;
  initialLists: SavedList[];
  currentUserId: string | null;
  currentUserName?: string | null;
  currentUserEmail?: string | null;
  currentUserAvatarUrl?: string;
  searchIndex: HomepageSearchIndex;
};

export function VendorListingScreen({ data, initialLists, currentUserId, currentUserName, currentUserEmail, currentUserAvatarUrl, searchIndex }: VendorListingScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeChipId, setActiveChipId] = useState<string>(data.searchState.categorySlug);
  const [currentSearch, setCurrentSearch] = useState({ query: data.searchState.query, where: data.searchState.where });
  const [lists, setLists] = useState<SavedList[]>(initialLists);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);

  const vendorById = useMemo(() => new Map(data.vendors.map((vendor) => [vendor.id, vendor])), [data.vendors]);

  const savedVendorIds = useMemo(() => getSavedVendorIds(lists), [lists]);

  const activeVendor = activeVendorId ? vendorById.get(activeVendorId) ?? null : null;

  const saveListOptions = lists.map((list) => {
    const previewVendorId = list.items[0]?.vendorId;
    const previewVendor = previewVendorId ? vendorById.get(previewVendorId) : undefined;
    const previewImage = previewVendor?.images.find((image) => image.kind === "cover") ?? previewVendor?.images[0];
    const selected = activeVendorId ? list.items.some((item) => item.vendorId === activeVendorId) : false;

    return {
      id: list.id,
      name: list.name,
      itemCount: list.items.length,
      previewImageUrl: previewImage?.url,
      selected
    };
  });

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <header className="sticky top-0 z-50 border-b border-stone-100 bg-white">
        <EditorialTopNav
          brandLabel={data.copy.brandLabel}
          navLinks={data.copy.navLinks.map((link) => ({
            ...link,
            active: link.href === "/vendors"
          }))}
          className="border-b-0 bg-white"
          innerClassName="max-w-[1600px]"
          rightSlot={<ProfileMenu name={currentUserName} email={currentUserEmail} imageUrl={currentUserAvatarUrl} />}
        />

        <div className="border-t border-stone-100/80">
          <div className="mx-auto flex max-w-[1600px] px-6 py-5 md:justify-center">
            <HomeHeroSearch
              className="w-full shadow-sm md:min-w-[640px] md:max-w-[760px]"
              searchWhoPlaceholder={data.copy.searchAnyCategoryLabel}
              searchWherePlaceholder={data.copy.searchAnywhereLabel}
              searchIndex={searchIndex}
              initialWhoQuery={data.searchState.query}
              initialWhereQuery={data.searchState.where}
              onSubmitSearch={({ who, where }) => {
                setCurrentSearch({ query: who, where });
                const params = new URLSearchParams();
                if (who) params.set("q", who);
                if (where) params.set("where", where);
                if (activeChipId !== "all") params.set("category", activeChipId);
                const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
                router.replace(nextUrl, { scroll: false });
              }}
            />
          </div>
        </div>

        <div className="border-t border-stone-100/80">
          <div className="scrollbar-hide mx-auto flex max-w-[1600px] items-center gap-3 overflow-x-auto px-6 py-3">
            {data.filterChips.map((chip) => {
              const active = chip.id === activeChipId;
              return (
                <motion.button
                  key={chip.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={
                    active
                      ? "whitespace-nowrap rounded-full bg-stone-900 px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-white"
                      : "whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-stone-500 transition-colors hover:border-stone-900"
                  }
                  onClick={() => {
                    setActiveChipId(chip.id);
                    const params = new URLSearchParams();
                    if (currentSearch.query.trim()) params.set("q", currentSearch.query.trim());
                    if (currentSearch.where.trim()) params.set("where", currentSearch.where.trim());
                    if (chip.id !== "all") params.set("category", chip.id);
                    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
                    router.replace(nextUrl, { scroll: false });
                  }}
                >
                  {chip.emoji ? `${chip.emoji} ${chip.label}` : chip.label}
                </motion.button>
              );
            })}

            <div className="mx-2 h-5 w-px bg-stone-200" />
            <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} type="button" className="flex whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-sans font-black uppercase tracking-widest text-stone-500 transition-colors hover:border-stone-900">
              <SlidersHorizontal size={14} className="mr-2" />
              {data.copy.filtersLabel}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="mb-20">
          <p className="text-xs font-sans font-black uppercase tracking-widest text-stone-400">
            {data.copy.showingPrefix} {data.resultCount.toLocaleString()} {data.copy.showingSuffix}
          </p>
        </div>

        {data.vendors.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.vendors.map((vendor) => (
              <VendorListingCard
                key={vendor.id}
                vendor={vendor}
                saved={savedVendorIds.includes(vendor.id)}
                onSaveClick={(vendorId) => {
                  setActiveVendorId(vendorId);
                  setSaveModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="Search Results"
            title="No vendors match this search"
            description="Try broadening the category, changing the location, or clearing a filter to explore more profiles."
            ctaLabel="Clear filters"
            onCta={() => {
              setActiveChipId("all");
              setCurrentSearch({ query: "", where: "" });
              router.replace(pathname, { scroll: false });
            }}
          />
        )}

        <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} type="button" className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-bold text-white shadow-2xl">
            {data.copy.showMapLabel}
            <MapIcon size={16} />
          </motion.button>
        </div>

        <SaveToListModal
          open={saveModalOpen}
          contextImageUrl={activeVendor?.images.find((image) => image.kind === "cover")?.url ?? activeVendor?.images[0]?.url}
          lists={saveListOptions}
          onClose={() => setSaveModalOpen(false)}
          onToggleList={(listId) => {
            if (!activeVendorId) return;
            setLists((current) => toggleVendorInList(current, listId, activeVendorId));
          }}
          onCreateCollection={() => {
            if (!activeVendorId || !currentUserId) return;
            setLists((current) => createListWithVendor(current, { userId: currentUserId, vendorId: activeVendorId }));
          }}
          onDone={() => setSaveModalOpen(false)}
        />
      </main>
    </div>
  );
}
