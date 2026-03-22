import type { Category } from "@/lib/types/domain";

/** Max category links in the consumer desktop browse strip (home). */
export const HOME_BROWSE_NAV_MAX = 4;

/**
 * Newest categories first (by `createdAt`), then stable name order for ties / missing dates.
 */
export function pickHomeBrowseNavCategories(categories: Category[]): Category[] {
  return [...categories]
    .sort((a, b) => {
      const tb = b.createdAt ?? "";
      const ta = a.createdAt ?? "";
      if (ta !== tb) return tb.localeCompare(ta);
      return a.name.localeCompare(b.name);
    })
    .slice(0, HOME_BROWSE_NAV_MAX);
}
