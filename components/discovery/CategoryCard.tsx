import Link from "next/link";
import type { Category } from "@/lib/types/domain";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="surface block p-5 transition hover:-translate-y-0.5">
      <h3 className="text-xl">{category.name}</h3>
      {category.description ? <p className="mt-2 text-sm text-muted">{category.description}</p> : null}
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-brand-600">{category.subcategories.length} subcategories</p>
    </Link>
  );
}
