"use client";

import type { SavedList } from "@/lib/types/domain";
import { MOCK_LISTS_COOKIE, parseLists } from "@/lib/mock-list-persistence.shared";

export function getStoredMockLists(): SavedList[] {
  if (typeof document === "undefined") {
    return [];
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${MOCK_LISTS_COOKIE}=`))
    ?.split("=")[1];

  return parseLists(cookieValue ? decodeURIComponent(cookieValue) : undefined);
}

export function persistMockLists(lists: SavedList[]): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${MOCK_LISTS_COOKIE}=${encodeURIComponent(JSON.stringify(lists))}; path=/; max-age=31536000; samesite=lax`;
}
