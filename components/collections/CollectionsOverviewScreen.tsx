"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CollectionCard } from "@/components/collections/CollectionCard";
import { CollectionsHeader } from "@/components/collections/CollectionsHeader";
import { NewMoodboardCard } from "@/components/collections/NewMoodboardCard";
import { SavedVendorsTable } from "@/components/collections/SavedVendorsTable";
import { SaveToListModal } from "@/components/lists/SaveToListModal";
import { isVendorSaved, persistCreateEmptyList, persistCreateListWithVendor, persistToggleVendorInList } from "@/lib/lists.client";
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
  const [lists, setLists] = useState(initialLists);
  const [savedLists, setSavedLists] = useState(initialSavedLists);
  const [tableRows, setTableRows] = useState(savedRows);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<SavedVendorRowView | null>(null);

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
      <CollectionsHeader copy={copy} onCreateList={() => handleCreateList(copy.createListLabel)} />

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => (
          <CollectionCard key={list.id} list={list} privateLabel={copy.visibilityPrivateLabel} sharedLabel={copy.visibilitySharedLabel} />
        ))}
        <NewMoodboardCard label={copy.newMoodboardLabel} onClick={() => handleCreateList(copy.newMoodboardLabel)} />
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
    </>
  );
}
