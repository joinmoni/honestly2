import { cn } from "@/lib/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function IconButton({ className, active = false, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:bg-[#f6f3ec]",
        active && "border-brand-600 text-brand-700",
        className
      )}
      {...props}
    />
  );
}
