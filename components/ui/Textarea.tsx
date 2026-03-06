import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn("w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2", className)} {...props} />;
}
