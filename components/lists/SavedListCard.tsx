import Link from "next/link";
import type { SavedList } from "@/lib/types/domain";
import { Badge } from "@/components/ui/Badge";

type SavedListCardProps = {
  list: SavedList;
};

export function SavedListCard({ list }: SavedListCardProps) {
  return (
    <Link href={`/lists/${list.id}`} className="surface block p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl">{list.name}</h3>
        <Badge tone={list.isPublic ? "success" : "neutral"}>{list.isPublic ? "Public" : "Private"}</Badge>
      </div>
      {list.description ? <p className="mt-2 text-sm text-muted">{list.description}</p> : null}
      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-brand-600">{list.items.length} saved</p>
    </Link>
  );
}
