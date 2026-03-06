import { getDataLayer } from "@/lib/services/data-layer";
import type { Category, Subcategory } from "@/lib/types/domain";

export async function getCategories(): Promise<Category[]> {
  return getDataLayer().getCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return getDataLayer().getCategoryBySlug(slug);
}

export async function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Promise<Subcategory | null> {
  return getDataLayer().getSubcategoryBySlug(categorySlug, subcategorySlug);
}
