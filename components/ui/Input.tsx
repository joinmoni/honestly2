import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn("h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none ring-brand-500 focus:ring-2", className)} {...props} />;
}
