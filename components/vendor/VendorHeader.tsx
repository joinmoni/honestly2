import { Badge } from "@/components/ui/Badge";

type VendorHeaderProps = {
  name: string;
  headline?: string;
  categoryLabel?: string;
  verified?: boolean;
};

export function VendorHeader({ name, headline, categoryLabel, verified }: VendorHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl">{name}</h1>
        {verified ? <Badge tone="success">Verified</Badge> : null}
      </div>
      {categoryLabel ? <p className="text-sm text-muted">{categoryLabel}</p> : null}
      {headline ? <p className="max-w-2xl text-base text-ink">{headline}</p> : null}
    </header>
  );
}
