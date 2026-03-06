import Link from "next/link";
import type { Subcategory } from "@/lib/types/domain";
import { Chip } from "@/components/ui/Chip";

type CategoryChipRowProps = {
  categorySlug: string;
  subcategories: Subcategory[];
  activeSubcategorySlug?: string;
};

export function CategoryChipRow({ categorySlug, subcategories, activeSubcategorySlug }: CategoryChipRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {subcategories.map((subcategory) => (
        <Link key={subcategory.id} href={`/category/${categorySlug}/${subcategory.slug}`}>
          <Chip active={subcategory.slug === activeSubcategorySlug}>{subcategory.name}</Chip>
        </Link>
      ))}
    </div>
  );
}
