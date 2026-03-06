import { Select } from "@/components/ui/Select";

type Option = { label: string; value: string };

type FilterBarProps = {
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: Option[];
};

export function FilterBar({ sortValue, onSortChange, sortOptions }: FilterBarProps) {
  return (
    <div className="surface flex items-center gap-3 p-3">
      <span className="text-sm text-muted">Sort</span>
      <Select className="max-w-[220px]" value={sortValue} onChange={(event) => onSortChange(event.target.value)}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
