import { getDataLayer } from "@/lib/services/data-layer";
import { getCategoryBySlug } from "@/lib/services/categories";
import { getVendorsByCategory } from "@/lib/services/vendors";
import type { CategoryListingPageData } from "@/lib/types/category-listing";

export async function getCategoryListingPageData(categorySlug: string): Promise<CategoryListingPageData | null> {
  const [category, vendors] = await Promise.all([getCategoryBySlug(categorySlug), getVendorsByCategory(categorySlug)]);

  if (!category) return null;

  const copy = await getDataLayer().getCategoryListingCopy(category.slug, category.name);

  return {
    categorySlug: category.slug,
    categoryName: category.name,
    copy,
    vendors,
    styleChips: [
      { id: "all", label: copy.allStylesLabel },
      ...category.subcategories.map((subcategory) => ({ id: subcategory.id, label: subcategory.name, subcategorySlug: subcategory.slug }))
    ]
  };
}
