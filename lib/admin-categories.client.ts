import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AdminTaxonomyCategoryItem } from "@/lib/types/admin-dashboard";

type CreateCategoryInput = {
  name: string;
  subcategories: string[];
  icon: string;
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function sortFeatured(categories: AdminTaxonomyCategoryItem[]): AdminTaxonomyCategoryItem[] {
  return categories
    .filter((category) => category.featuredOnHome)
    .sort((a, b) => (a.homeOrder ?? Number.MAX_SAFE_INTEGER) - (b.homeOrder ?? Number.MAX_SAFE_INTEGER));
}

export async function createAdminCategory(
  categories: AdminTaxonomyCategoryItem[],
  input: CreateCategoryInput
): Promise<AdminTaxonomyCategoryItem[]> {
  const slug = slugify(input.name);

  if (!isSupabaseConfigured()) {
    return [
      {
        id: `cat-local-${categories.length + 1}`,
        name: input.name,
        slug,
        icon: input.icon,
        subcategories: input.subcategories,
        featuredOnHome: false,
        homeOrder: null,
        promotedSubcategories: [],
        muted: false
      },
      ...categories
    ];
  }

  const supabase = getSupabaseBrowserClient();
  const { data: createdCategory, error: categoryError } = await supabase
    .from("honestly_categories")
    .insert({
      name: input.name,
      slug,
      featured_on_home: false,
      home_order: null,
      promoted_subcategories: []
    })
    .select("id, name, slug, featured_on_home, home_order, promoted_subcategories")
    .single();

  if (categoryError) {
    throw categoryError;
  }

  if (input.subcategories.length) {
    const { error: subcategoryError } = await supabase.from("honestly_subcategories").insert(
      input.subcategories.map((subcategory) => ({
        category_id: createdCategory.id,
        name: subcategory,
        slug: slugify(subcategory)
      }))
    );

    if (subcategoryError) {
      throw subcategoryError;
    }
  }

  return [
    {
      id: createdCategory.id as string,
      name: createdCategory.name as string,
      slug: createdCategory.slug as string,
      icon: input.icon,
      subcategories: input.subcategories,
      featuredOnHome: Boolean(createdCategory.featured_on_home),
      homeOrder: (createdCategory.home_order as number | null) ?? null,
      promotedSubcategories: ((createdCategory.promoted_subcategories as string[] | null) ?? []).slice(),
      muted: false
    },
    ...categories
  ];
}

export async function deleteAdminCategory(
  categories: AdminTaxonomyCategoryItem[],
  categoryId: string
): Promise<AdminTaxonomyCategoryItem[]> {
  if (!isSupabaseConfigured()) {
    return categories.filter((category) => category.id !== categoryId);
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("honestly_categories").delete().eq("id", categoryId);

  if (error) {
    throw error;
  }

  return categories.filter((category) => category.id !== categoryId);
}

export async function addAdminSubcategory(
  categories: AdminTaxonomyCategoryItem[],
  categoryId: string,
  name: string
): Promise<AdminTaxonomyCategoryItem[]> {
  if (!isSupabaseConfigured()) {
    return categories.map((category) =>
      category.id === categoryId ? { ...category, subcategories: [...category.subcategories, name] } : category
    );
  }

  const supabase = getSupabaseBrowserClient();
  const targetCategory = categories.find((category) => category.id === categoryId);
  if (!targetCategory) return categories;

  const { error } = await supabase.from("honestly_subcategories").insert({
    category_id: categoryId,
    name,
    slug: slugify(name)
  });

  if (error) {
    throw error;
  }

  return categories.map((category) =>
    category.id === categoryId ? { ...category, subcategories: [...category.subcategories, name] } : category
  );
}

export async function removeAdminSubcategory(
  categories: AdminTaxonomyCategoryItem[],
  categoryId: string,
  name: string
): Promise<AdminTaxonomyCategoryItem[]> {
  if (!isSupabaseConfigured()) {
    return categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            subcategories: category.subcategories.filter((subcategory) => subcategory !== name),
            promotedSubcategories: category.promotedSubcategories.filter((subcategory) => subcategory !== name)
          }
        : category
    );
  }

  const supabase = getSupabaseBrowserClient();
  const { error: deleteError } = await supabase
    .from("honestly_subcategories")
    .delete()
    .eq("category_id", categoryId)
    .eq("name", name);

  if (deleteError) {
    throw deleteError;
  }

  const targetCategory = categories.find((category) => category.id === categoryId);
  if (!targetCategory) return categories;
  const nextPromoted = targetCategory.promotedSubcategories.filter((subcategory) => subcategory !== name);

  const { error: updateError } = await supabase
    .from("honestly_categories")
    .update({ promoted_subcategories: nextPromoted })
    .eq("id", categoryId);

  if (updateError) {
    throw updateError;
  }

  return categories.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          subcategories: category.subcategories.filter((subcategory) => subcategory !== name),
          promotedSubcategories: nextPromoted
        }
      : category
  );
}

export async function toggleAdminHomepageCategory(
  categories: AdminTaxonomyCategoryItem[],
  categoryId: string
): Promise<AdminTaxonomyCategoryItem[]> {
  const targetCategory = categories.find((category) => category.id === categoryId);
  if (!targetCategory) return categories;

  const nextFeatured = !targetCategory.featuredOnHome;
  const nextHomeOrder = nextFeatured ? sortFeatured(categories).length + 1 : null;

  if (!isSupabaseConfigured()) {
    return categories.map((category) =>
      category.id === categoryId
        ? { ...category, featuredOnHome: nextFeatured, homeOrder: nextHomeOrder }
        : category
    );
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("honestly_categories")
    .update({
      featured_on_home: nextFeatured,
      home_order: nextHomeOrder
    })
    .eq("id", categoryId);

  if (error) {
    throw error;
  }

  return categories.map((category) =>
    category.id === categoryId
      ? { ...category, featuredOnHome: nextFeatured, homeOrder: nextHomeOrder }
      : category
  );
}

export async function reorderAdminHomepageCategories(
  categories: AdminTaxonomyCategoryItem[],
  draggedId: string,
  targetId: string
): Promise<AdminTaxonomyCategoryItem[]> {
  if (draggedId === targetId) return categories;

  const featured = sortFeatured(categories);
  const draggedIndex = featured.findIndex((category) => category.id === draggedId);
  const targetIndex = featured.findIndex((category) => category.id === targetId);
  if (draggedIndex === -1 || targetIndex === -1) return categories;

  const nextFeatured = [...featured];
  const [draggedItem] = nextFeatured.splice(draggedIndex, 1);
  if (!draggedItem) return categories;
  nextFeatured.splice(targetIndex, 0, draggedItem);

  const nextOrder = new Map(nextFeatured.map((category, index) => [category.id, index + 1]));
  const nextCategories = categories.map((category) =>
    category.featuredOnHome ? { ...category, homeOrder: nextOrder.get(category.id) ?? category.homeOrder } : category
  );

  if (!isSupabaseConfigured()) {
    return nextCategories;
  }

  const supabase = getSupabaseBrowserClient();
  const updates = nextFeatured.map((category, index) => ({
    id: category.id,
    home_order: index + 1
  }));

  const { error } = await supabase.from("honestly_categories").upsert(updates, { onConflict: "id" });

  if (error) {
    throw error;
  }

  return nextCategories;
}
