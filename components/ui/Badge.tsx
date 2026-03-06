import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  const tones: Record<string, string> = {
    neutral: "bg-[#f0ece4] text-ink",
    success: "bg-[#e9f4ec] text-[#24563a]",
    warning: "bg-[#f9efd8] text-[#8a5c1b]"
  };

  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>{children}</span>;
}
