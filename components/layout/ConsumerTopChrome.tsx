import { HomeMobileNav } from "@/components/home/HomeMobileNav";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import type { Category } from "@/lib/types/domain";

type ConsumerTopChromeProps = {
  brandLabel: string;
  categories: Category[];
  currentUserName?: string | null;
  currentUserEmail?: string | null;
  currentUserAvatarUrl?: string;
  currentUserRole?: "user" | "admin";
};

/** Matches the home header: category strip, search, ProfileMenu (member or admin), and HomeMobileNav. */
export function ConsumerTopChrome({
  brandLabel,
  categories,
  currentUserName,
  currentUserEmail,
  currentUserAvatarUrl,
  currentUserRole
}: ConsumerTopChromeProps) {
  const reviewHref = currentUserName ? "/reviews/new" : "/login?next=%2Freviews%2Fnew";
  const topNavLinks = [{ label: "Review", href: reviewHref }];

  return (
    <>
      <EditorialTopNav
        brandLabel={brandLabel}
        navLinks={topNavLinks}
        browseCategories={categories}
        innerClassName="max-w-7xl md:px-12"
        rightSlot={
          <ProfileMenu
            name={currentUserName ?? null}
            email={currentUserEmail ?? null}
            imageUrl={currentUserAvatarUrl}
            accountRole={currentUserRole}
          />
        }
      />
      <HomeMobileNav categories={categories} />
    </>
  );
}
