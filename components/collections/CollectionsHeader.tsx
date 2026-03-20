import type { CollectionsPageCopy } from "@/lib/types/collections";
import { BodyText, PageTitle } from "@/components/ui/Typography";

type CollectionsHeaderProps = {
  copy: CollectionsPageCopy;
};

export function CollectionsHeader({ copy }: CollectionsHeaderProps) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="max-w-xl">
        <PageTitle className="mb-4">{copy.pageTitle}</PageTitle>
        <BodyText>{copy.pageDescription}</BodyText>
      </div>
    </div>
  );
}
