import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
};

export function Chip({ children, active = false, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1.5 text-xs font-medium",
        active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line bg-white text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
