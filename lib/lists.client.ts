import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getStoredMockLists, persistMockLists } from "@/lib/mock-list-persistence.client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SavedList } from "@/lib/types/domain";

const DEFAULT_LIST_NAME_PATTERNS = [/^new collection \d+$/i, /^create new list$/i, /^new moodboard$/i, /^new list$/i];

function slugifyListName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function isGenericListName(name: string | undefined): boolean {
  if (!name) return true;
  return DEFAULT_LIST_NAME_PATTERNS.some((pattern) => pattern.test(name.trim()));
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
      name: input.name ?? `New List ${nextListNumber}`,
      isPublic: false,
      items: [{ vendorId: input.vendorId, createdAt: new Date().toISOString() }]
    }
  ];
}

export function updateListDetails(
  lists: SavedList[],
  listId: string,
  input: {
    name?: string;
    isPublic?: boolean;
    shareSlug?: string;
  }
): SavedList[] {
  return lists.map((list) =>
    list.id === listId
      ? {
          ...list,
          name: input.name ?? list.name,
          isPublic: input.isPublic ?? list.isPublic,
          shareSlug: input.shareSlug ?? list.shareSlug
        }
      : list
  );
}

export function deleteList(lists: SavedList[], listId: string): SavedList[] {
  return lists.filter((list) => list.id !== listId);
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
  const nextName = input.name ?? `New List ${nextListNumber}`;

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
      name: input.name ?? `New List ${nextListNumber}`,
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
  const nextName = input.name ?? `New List ${nextListNumber}`;

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

export async function persistUpdateListDetails(
  lists: SavedList[],
  listId: string,
  input: {
    name?: string;
    isPublic?: boolean;
  }
): Promise<SavedList[]> {
  const targetList = lists.find((list) => list.id === listId);
  if (!targetList) {
    return lists;
  }

  const nextName = input.name?.trim() || targetList.name;
  const nextShareSlug = (input.isPublic ?? targetList.isPublic) ? slugifyListName(nextName) || targetList.id : undefined;

  if (!isSupabaseConfigured()) {
    const sourceLists = getStoredMockLists().length ? getStoredMockLists() : lists;
    const nextLists = updateListDetails(sourceLists, listId, {
      name: nextName,
      isPublic: input.isPublic,
      shareSlug: nextShareSlug
    });
    persistMockLists(nextLists);
    return nextLists;
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("saved_lists")
    .update({
      name: nextName,
      is_public: input.isPublic ?? targetList.isPublic,
      share_slug: nextShareSlug ?? null
    })
    .eq("id", listId);

  if (error) {
    throw error;
  }

  return updateListDetails(lists, listId, {
    name: nextName,
    isPublic: input.isPublic,
    shareSlug: nextShareSlug
  });
}

export async function persistDeleteList(lists: SavedList[], listId: string): Promise<SavedList[]> {
  if (!isSupabaseConfigured()) {
    const sourceLists = getStoredMockLists().length ? getStoredMockLists() : lists;
    const nextLists = deleteList(sourceLists, listId);
    persistMockLists(nextLists);
    return nextLists;
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("saved_lists").delete().eq("id", listId);

  if (error) {
    throw error;
  }

  return deleteList(lists, listId);
}
