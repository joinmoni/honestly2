import type { SavedList } from "@/lib/types/domain";
import { SavedListCard } from "@/components/lists/SavedListCard";

type SavedListGridProps = {
  lists: SavedList[];
};

export function SavedListGrid({ lists }: SavedListGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {lists.map((list) => (
        <SavedListCard key={list.id} list={list} />
      ))}
    </div>
  );
}
