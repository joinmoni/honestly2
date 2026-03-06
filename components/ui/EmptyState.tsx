import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
};

export function EmptyState({ title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="surface flex flex-col items-center gap-3 p-8 text-center">
      <h3 className="text-2xl">{title}</h3>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {ctaLabel ? <Button onClick={onCta}>{ctaLabel}</Button> : null}
    </div>
  );
}
