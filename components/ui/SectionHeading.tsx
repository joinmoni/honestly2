import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">{eyebrow}</p> : null}
      <h2 className="text-3xl text-ink sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-muted sm:text-base">{description}</p> : null}
    </div>
  );
}
