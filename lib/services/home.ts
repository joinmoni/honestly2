import { getDataLayer } from "@/lib/services/data-layer";
import type { HomeCategoryShortcut, HomeContent } from "@/lib/types/home";

export async function getHomeContent(): Promise<HomeContent> {
  return getDataLayer().getHomeContent();
}

export async function getHomeCategoryShortcuts(): Promise<HomeCategoryShortcut[]> {
  return getDataLayer().getHomeCategoryShortcuts();
}
