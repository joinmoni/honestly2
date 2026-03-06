import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none ring-brand-500 focus:ring-2", className)} {...props}>
      {children}
    </select>
  );
}
