import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getStoredMockLists, persistMockLists } from "@/lib/mock-list-persistence.client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SavedList } from "@/lib/types/domain";

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

async function resolveProfileId(userId: string): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();

  const directResult = await supabase.from("user_profiles").select("id").eq("id", userId).maybeSingle();
  if (directResult.error) {
    throw directResult.error;
  }
  if (directResult.data?.id) {
    return directResult.data.id as string;
  }

  const authResult = await supabase.from("user_profiles").select("id").eq("auth_user_id", userId).maybeSingle();
  if (authResult.error) {
    throw authResult.error;
  }

  return (authResult.data?.id as string | undefined) ?? null;
}

export async function persistToggleVendorInList(
  lists: SavedList[],
  listId: string,
  vendorId: string
): Promise<SavedList[]> {
  if (!isSupabaseConfigured()) {
    const sourceLists = getStoredMockLists().length ? getStoredMockLists() : lists;
    const nextLists = toggleVendorInList(sourceLists, listId, vendorId);
    persistMockLists(nextLists);
    return nextLists;
  }

  const supabase = getSupabaseBrowserClient();
  const targetList = lists.find((list) => list.id === listId);

  if (!targetList) {
    return lists;
  }

  const hasVendor = targetList.items.some((item) => item.vendorId === vendorId);

  if (hasVendor) {
    const { error } = await supabase.from("saved_list_items").delete().eq("list_id", listId).eq("vendor_id", vendorId);
    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("saved_list_items").insert({
      list_id: listId,
      vendor_id: vendorId,
      created_at: new Date().toISOString()
    });
    if (error) {
      throw error;
    }
  }

  return toggleVendorInList(lists, listId, vendorId);
}

export async function persistCreateListWithVendor(
  lists: SavedList[],
  input: {
    userId: string;
    vendorId: string;
    name?: string;
  }
): Promise<SavedList[]> {
  if (!isSupabaseConfigured()) {
    const sourceLists = getStoredMockLists().length ? getStoredMockLists() : lists;
    const nextLists = createListWithVendor(sourceLists, input);
    persistMockLists(nextLists);
    return nextLists;
  }

  const supabase = getSupabaseBrowserClient();
  const profileId = await resolveProfileId(input.userId);

  if (!profileId) {
    throw new Error("Profile not found for this account.");
  }

  const nextListNumber = lists.length + 1;
  const nextName = input.name ?? `New Collection ${nextListNumber}`;

  const { data: createdList, error: listError } = await supabase
    .from("saved_lists")
    .insert({
      user_id: profileId,
      name: nextName,
      is_public: false
    })
    .select("id, user_id, name, description, is_public, share_slug")
    .single();

  if (listError) {
    throw listError;
  }

  const createdAt = new Date().toISOString();
  const { error: itemError } = await supabase.from("saved_list_items").insert({
    list_id: createdList.id,
    vendor_id: input.vendorId,
    created_at: createdAt
  });

  if (itemError) {
    throw itemError;
  }

  return [
    ...lists,
    {
      id: createdList.id as string,
      userId: createdList.user_id as string,
      name: createdList.name as string,
      description: (createdList.description as string | null) ?? undefined,
      isPublic: Boolean(createdList.is_public),
      shareSlug: (createdList.share_slug as string | null) ?? undefined,
      items: [{ vendorId: input.vendorId, createdAt }]
    }
  ];
}

export async function persistCreateEmptyList(
  lists: SavedList[],
  input: {
    userId: string;
    name?: string;
  }
): Promise<SavedList> {
  if (!isSupabaseConfigured()) {
    const sourceLists = getStoredMockLists().length ? getStoredMockLists() : lists;
    const nextListNumber = sourceLists.length + 1;
    const nextList = {
      id: `list-new-${nextListNumber}`,
      userId: input.userId,
      name: input.name ?? `New Collection ${nextListNumber}`,
      isPublic: false,
      items: []
    };

    persistMockLists([...sourceLists, nextList]);
    return nextList;
  }

  const supabase = getSupabaseBrowserClient();
  const profileId = await resolveProfileId(input.userId);

  if (!profileId) {
    throw new Error("Profile not found for this account.");
  }

  const nextListNumber = lists.length + 1;
  const nextName = input.name ?? `New Collection ${nextListNumber}`;

  const { data: createdList, error } = await supabase
    .from("saved_lists")
    .insert({
      user_id: profileId,
      name: nextName,
      is_public: false
    })
    .select("id, user_id, name, description, is_public, share_slug")
    .single();

  if (error) {
    throw error;
  }

  return {
    id: createdList.id as string,
    userId: createdList.user_id as string,
    name: createdList.name as string,
    description: (createdList.description as string | null) ?? undefined,
    isPublic: Boolean(createdList.is_public),
    shareSlug: (createdList.share_slug as string | null) ?? undefined,
    items: []
  };
}
