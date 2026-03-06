import { getDataLayer } from "@/lib/services/data-layer";
import type { SavedList } from "@/lib/types/domain";

export async function getListsByUserId(userId: string): Promise<SavedList[]> {
  return getDataLayer().getListsByUserId(userId);
}

export async function getListById(id: string): Promise<SavedList | null> {
  return getDataLayer().getListById(id);
}

export async function getPublicListByShareSlug(shareSlug: string): Promise<SavedList | null> {
  return getDataLayer().getPublicListByShareSlug(shareSlug);
}

export function getSavedVendorIds(lists: SavedList[]): string[] {
  return Array.from(new Set(lists.flatMap((list) => list.items.map((item) => item.vendorId))));
}

export function isVendorSaved(lists: SavedList[], vendorId: string): boolean {
  return lists.some((list) => list.items.some((item) => item.vendorId === vendorId));
}

export function toggleVendorInList(lists: SavedList[], listId: string, vendorId: string): SavedList[] {
  return lists.map((list) => {
    if (list.id !== listId) return list;

    const hasVendor = list.items.some((item) => item.vendorId === vendorId);

    if (hasVendor) {
      return {
        ...list,
        items: list.items.filter((item) => item.vendorId !== vendorId)
      };
    }

    return {
      ...list,
      items: [...list.items, { vendorId, createdAt: new Date().toISOString() }]
    };
  });
}

export function createListWithVendor(
  lists: SavedList[],
  input: {
    userId: string;
    vendorId: string;
    name?: string;
  }
): SavedList[] {
  const nextListNumber = lists.length + 1;

  return [
    ...lists,
    {
      id: `list-new-${nextListNumber}`,
      userId: input.userId,
      name: input.name ?? `New Collection ${nextListNumber}`,
      isPublic: false,
      items: [{ vendorId: input.vendorId, createdAt: new Date().toISOString() }]
    }
  ];
}
