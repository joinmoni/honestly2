import type { SavedList } from "@/lib/types/domain";

export const MOCK_LISTS_COOKIE = "honestly_mock_lists";

export function parseLists(rawValue?: string): SavedList[] {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue) as SavedList[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mergeMockLists(baseLists: SavedList[], storedLists: SavedList[]): SavedList[] {
  if (!storedLists.length) {
    return baseLists;
  }

  const storedById = new Map(storedLists.map((list) => [list.id, list]));
  const mergedBase = baseLists.map((list) => storedById.get(list.id) ?? list);
  const createdLists = storedLists.filter((list) => !baseLists.some((base) => base.id === list.id));
  return [...mergedBase, ...createdLists];
}
