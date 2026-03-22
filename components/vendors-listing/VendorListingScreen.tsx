"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Map as MapIcon, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import { ProfessionalCtaBanner } from "@/components/public/ProfessionalCtaBanner";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { UserTopNav } from "@/components/ui/UserTopNav";
import { VendorListingCard } from "@/components/vendors-listing/VendorListingCard";
import { createListWithVendor, getSavedVendorIds, toggleVendorInList } from "@/lib/lists.client";
import { getUserNavLinks } from "@/lib/user-nav";
import type { SavedList } from "@/lib/types/domain";
import type { VendorListingPageData } from "@/lib/types/vendor-listing";

type VendorListingScreenProps = {
  data: VendorListingPageData;
  initialLists: SavedList[];
  currentUserId: string | null;
  currentUserName?: string | null;
  currentUserEmail?: string | null;
  currentUserAvatarUrl?: string;
  currentUserRole?: "user" | "admin";
};

export function VendorListingScreen({
  data,
  initialLists,
  currentUserId,
  currentUserName,
  currentUserEmail,
  currentUserAvatarUrl,
  currentUserRole
}: VendorListingScreenProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeChipId, setActiveChipId] = useState<string>(data.searchState.categorySlug);
  const [lists, setLists] = useState<SavedList[]>(initialLists);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    if (typeof document !== "undefined") {
      const active = document.activeElement;
      if (active instanceof HTMLElement) {
        active.blur();
      }
    }
  }, []);

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
      <header className="relative z-[180] border-b border-stone-100 bg-white">
        {currentUserName ? (
          <UserTopNav
            brandLabel={data.copy.brandLabel}
            avatarName={currentUserName}
            avatarEmail={currentUserEmail}
            avatarUrl={currentUserAvatarUrl}
            accountRole={currentUserRole}
            navLinks={getUserNavLinks("none")}
            className="!static border-b-0 bg-white"
          />
        ) : (
          <EditorialTopNav
            brandLabel={data.copy.brandLabel}
            desktopNavSource="navLinks"
            navLinks={data.copy.navLinks.map((link) => ({
              ...link,
              active: link.href === "/vendors"
            }))}
            className="border-b-0 bg-white"
            innerClassName="max-w-7xl md:px-12"
            sticky={false}
            rightSlot={<ProfileMenu name={currentUserName} email={currentUserEmail} imageUrl={currentUserAvatarUrl} accountRole={currentUserRole} />}
          />
        )}

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
                    if (data.searchState.query.trim()) params.set("q", data.searchState.query.trim());
                    if (data.searchState.where.trim()) params.set("where", data.searchState.where.trim());
                    if (chip.id !== "all") params.set("category", chip.id);
                    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
                    router.replace(nextUrl, { scroll: true });
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

      <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-6 md:py-16">
        <div className="mb-6 md:mb-12">
          <p className="text-xs font-sans font-black uppercase tracking-widest text-stone-400">
            {data.copy.showingPrefix} {data.resultCount.toLocaleString()} {data.copy.showingSuffix}
          </p>
        </div>

        {data.vendors.length ? (
          <>
            <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
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
            {!currentUserName ? <ProfessionalCtaBanner className="mt-16 md:mt-20" /> : null}
          </>
        ) : (
          <EmptyState
            eyebrow="Search Results"
            title="No vendors match this search"
            description="Try broadening the category, changing the location, or clearing a filter to explore more profiles."
            ctaLabel="Clear filters"
            onCta={() => {
              setActiveChipId("all");
              router.replace(pathname, { scroll: true });
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
