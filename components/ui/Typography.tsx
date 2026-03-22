import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

/** Shared class for labels, table headers, pagination — use on non-`<p>` elements (e.g. `<th>`, `<button>`). */
export const metaTextClassName = "text-[10px] font-black uppercase tracking-[0.18em] text-stone-400";

/** Serif wordmark scale — matches main nav brand; wrap children inside `<Link>` for the home link. */
export function BrandWordmark({ children, className }: TypographyProps) {
  return <span className={cn("serif-italic text-[2.65rem] leading-none text-stone-800 md:text-4xl", className)}>{children}</span>;
}

export function Eyebrow({ children, className }: TypographyProps) {
  return <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-stone-400", className)}>{children}</p>;
}

export function PageTitle({ children, className }: TypographyProps) {
  return <h1 className={cn("text-[3rem] leading-[0.95] md:text-5xl", className)}>{children}</h1>;
}

export function SectionTitle({ children, className }: TypographyProps) {
  return <h2 className={cn("text-[2rem] leading-[0.98] md:text-3xl", className)}>{children}</h2>;
}

export function CardTitle({ children, className }: TypographyProps) {
  return <h3 className={cn("text-2xl leading-tight md:text-3xl", className)}>{children}</h3>;
}

export function BodyText({ children, className }: TypographyProps) {
  return <p className={cn("text-[15px] leading-relaxed text-stone-600 md:text-base", className)}>{children}</p>;
}

export function MetaText({ children, className }: TypographyProps) {
  return <p className={cn(metaTextClassName, className)}>{children}</p>;
}

export function PillText({ children, className }: TypographyProps) {
  return <span className={cn("text-[10px] font-black uppercase tracking-[0.18em]", className)}>{children}</span>;
}
