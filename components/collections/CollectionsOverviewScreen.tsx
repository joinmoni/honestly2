"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionsHeader } from "@/components/collections/CollectionsHeader";
import { NewMoodboardCard } from "@/components/collections/NewMoodboardCard";
import { SavedVendorsTable } from "@/components/collections/SavedVendorsTable";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import {
  isGenericListName,
  isVendorSaved,
  persistCreateEmptyList,
  persistCreateListWithVendor,
  persistDeleteList,
  persistToggleVendorInList,
  persistUpdateListDetails
} from "@/lib/lists.client";
import type { SavedList } from "@/lib/types/domain";
import type { CollectionsListCardView, CollectionsPageCopy, SavedVendorRowView } from "@/lib/types/collections";

type CollectionsOverviewScreenProps = {
  userId: string;
  copy: CollectionsPageCopy;
  initialLists: CollectionsListCardView[];
  initialSavedLists: SavedList[];
  savedRows: SavedVendorRowView[];
};

export function CollectionsOverviewScreen({ userId, copy, initialLists, initialSavedLists, savedRows }: CollectionsOverviewScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lists, setLists] = useState(initialLists);
  const [savedLists, setSavedLists] = useState(initialSavedLists);
  const [tableRows, setTableRows] = useState(savedRows);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<SavedVendorRowView | null>(null);
  const [activeList, setActiveList] = useState<CollectionsListCardView | null>(null);

  const syncCardAfterToggle = (listId: string, didAdd: boolean, imageUrl?: string) => {
    setLists((current) =>
      current.map((list) => {
        if (list.id !== listId) return list;

        const vendorCount = Math.max(0, list.vendorCount + (didAdd ? 1 : -1));
        const previewImageUrls = didAdd && imageUrl ? [imageUrl, ...list.previewImageUrls.filter((url) => url !== imageUrl)].slice(0, 3) : list.previewImageUrls;

        return {
          ...list,
          vendorCount,
          previewImageUrls,
          extraCount: Math.max(0, vendorCount - 2)
        };
      })
    );
  };

  const handleCreateList = async (name?: string) => {
    setPending(true);
    setErrorMessage(null);

    try {
      const createdList = await persistCreateEmptyList(
        savedLists.map((list) => ({
          id: list.id,
          userId,
          name: list.name,
          description: list.description,
          isPublic: list.isPublic,
          shareSlug: list.shareSlug,
          items: list.items
        })),
        { userId, name }
      );

      const nextCard: CollectionsListCardView = {
        id: createdList.id,
        name: createdList.name,
        href: `/lists/${createdList.id}`,
        visibility: createdList.isPublic ? "shared" : "private",
        vendorCount: 0,
        previewImageUrls: [],
        extraCount: 0
      };

      setLists((current) => [...current, nextCard]);
      setSavedLists((current) => [...current, createdList]);
      router.push(`/lists/${createdList.id}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "A new list could not be created right now.");
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("create") !== "1" || pending) return;
    void handleCreateList(copy.createListLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const syncCardsFromSavedLists = (nextLists: SavedList[]) => {
    setLists((current) =>
      current
        .map((card) => {
          const source = nextLists.find((list) => list.id === card.id);
          if (!source) return null;
          return {
            ...card,
            name: source.name,
            href: `/lists/${source.id}`,
            visibility: source.isPublic ? "shared" : "private"
          };
        })
        .filter((card): card is CollectionsListCardView => Boolean(card))
    );
  };

  const handleOpenActions = (list: CollectionsListCardView) => {
    setActiveList(list);
    setErrorMessage(null);
  };

  const handleShareList = async () => {
    if (!activeList) return;

    setPending(true);
    setErrorMessage(null);

    try {
      const sourceList = savedLists.find((list) => list.id === activeList.id);
      const sourceName = sourceList?.name ?? activeList.name;

      if (isGenericListName(sourceName)) {
        setErrorMessage("Name this list before sharing it publicly.");
        setPending(false);
        return;
      }

      const nextLists = await persistUpdateListDetails(savedLists, activeList.id, {
        name: sourceName,
        isPublic: true
      });

      setSavedLists(nextLists);
      syncCardsFromSavedLists(nextLists);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "This list could not be shared right now.");
    } finally {
      setPending(false);
    }
  };

  const handleDeleteList = async () => {
    if (!activeList) return;

    setPending(true);
    setErrorMessage(null);
    try {
      const nextLists = await persistDeleteList(savedLists, activeList.id);
      setSavedLists(nextLists);
      syncCardsFromSavedLists(nextLists);
      setActiveList(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "This list could not be deleted right now.");
    } finally {
      setPending(false);
    }
  };

  const selectedVendorSavedOptions = selectedVendor
    ? savedLists.map((list) => ({
        id: list.id,
        name: list.name,
        itemCount: list.items.length,
        previewImageUrl: undefined,
        selected: list.items.some((item) => item.vendorId === selectedVendor.vendorId)
      }))
    : [];

  return (
    <>
      <CollectionsHeader copy={copy} />

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <CollectionCard key={list.id} list={list} privateLabel={copy.visibilityPrivateLabel} sharedLabel={copy.visibilitySharedLabel} onOpenActions={handleOpenActions} />
        ))}
        <NewMoodboardCard label={copy.newListCardLabel} onClick={() => handleCreateList(copy.newListCardLabel)} />
      </section>

      {pending ? <p className="mt-6 text-sm text-stone-500">Creating your new list…</p> : null}
      {errorMessage ? <p className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}

      <SavedVendorsTable title={copy.allSavedVendorsTitle} rows={tableRows} addToListLabel={copy.addToListLabel} onAddToList={setSelectedVendor} />

      <SaveToListModal
        open={selectedVendor !== null}
        title={copy.addToListLabel}
        contextImageUrl={selectedVendor?.imageUrl}
        lists={selectedVendorSavedOptions}
        onClose={() => setSelectedVendor(null)}
        onToggleList={async (listId) => {
          if (!selectedVendor) return;

          setPending(true);
          setErrorMessage(null);

          try {
            const currentList = savedLists.find((list) => list.id === listId);
            const didAdd = currentList ? !currentList.items.some((item) => item.vendorId === selectedVendor.vendorId) : false;
            const nextLists = await persistToggleVendorInList(savedLists, listId, selectedVendor.vendorId);

            setSavedLists(nextLists);
            syncCardAfterToggle(listId, didAdd, selectedVendor.imageUrl);

            if (!isVendorSaved(nextLists, selectedVendor.vendorId)) {
              setTableRows((current) => current.filter((row) => row.vendorId !== selectedVendor.vendorId));
              setSelectedVendor(null);
            }
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "This vendor could not be added to a list right now.");
          } finally {
            setPending(false);
          }
        }}
        onCreateCollection={async () => {
          if (!selectedVendor) return;

          setPending(true);
          setErrorMessage(null);

          try {
            const nextLists = await persistCreateListWithVendor(savedLists, {
              userId,
              vendorId: selectedVendor.vendorId
            });
            const createdList = nextLists.at(-1);

            if (!createdList) {
              throw new Error("A new collection could not be created right now.");
            }

            setSavedLists(nextLists);
            setLists((current) => [
              ...current,
              {
                id: createdList.id,
                name: createdList.name,
                href: `/lists/${createdList.id}`,
                visibility: createdList.isPublic ? "shared" : "private",
                vendorCount: createdList.items.length,
                previewImageUrls: selectedVendor.imageUrl ? [selectedVendor.imageUrl] : [],
                extraCount: Math.max(0, createdList.items.length - 2)
              }
            ]);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "A new collection could not be created right now.");
          } finally {
            setPending(false);
          }
        }}
        onDone={() => setSelectedVendor(null)}
      />

      <AnimatePresence>
        {activeList ? (
          <motion.div
            className="fixed inset-0 z-[95] flex items-end justify-center bg-stone-900/35 p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveList(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">List actions</p>
              <h3 className="mt-3 text-2xl leading-tight">{activeList.name}</h3>
              <div className="mt-5 space-y-3">
                <button type="button" className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white" onClick={handleShareList}>
                  {activeList.visibility === "shared" ? "Share" : copy.sharePubliclyLabel}
                </button>
                <button type="button" className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700" onClick={handleDeleteList}>
                  {copy.deleteListLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
