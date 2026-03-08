import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
};

export function EmptyState({ eyebrow, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-dashed border-stone-200 bg-stone-50/80 p-8 text-center">
      {eyebrow ? <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">{eyebrow}</p> : null}
      <h3 className="text-2xl text-stone-900">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-stone-500">{description}</p>
      {ctaLabel ? <Button onClick={onCta}>{ctaLabel}</Button> : null}
    </div>
  );
}
