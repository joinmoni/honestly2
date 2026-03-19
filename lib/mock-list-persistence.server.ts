import { cookies } from "next/headers";

import { MOCK_LISTS_COOKIE, parseLists } from "@/lib/mock-list-persistence.shared";
import type { SavedList } from "@/lib/types/domain";

export async function getServerStoredMockLists(): Promise<SavedList[]> {
  try {
    const cookieStore = await cookies();
    const rawValue = cookieStore.get(MOCK_LISTS_COOKIE)?.value;
    return parseLists(rawValue);
  } catch {
    return [];
  }
}
