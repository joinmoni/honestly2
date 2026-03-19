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
