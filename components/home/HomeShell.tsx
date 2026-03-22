import Link from "next/link";
import { HomeCategoryRail } from "@/components/home/HomeCategoryRail";
import { HomeFeaturedSection } from "@/components/home/HomeFeaturedSection";
import { HomeMobileNav } from "@/components/home/HomeMobileNav";
import { ProfessionalCtaBanner } from "@/components/public/ProfessionalCtaBanner";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import type { Category, SavedList, Vendor } from "@/lib/types/domain";
import type { HomeCategoryShortcut, HomeContent } from "@/lib/types/home";

type HomeShellProps = {
  content: HomeContent;
  shortcuts: HomeCategoryShortcut[];
  categories: Category[];
  featuredVendors: Vendor[];
  initialLists: SavedList[];
  currentUserId?: string | null;
  currentUserName?: string | null;
  currentUserEmail?: string | null;
  currentUserAvatarUrl?: string;
  currentUserRole?: "user" | "admin";
};

export function HomeShell({
  content,
  shortcuts,
  categories,
  featuredVendors,
  initialLists,
  currentUserId,
  currentUserName,
  currentUserEmail,
  currentUserAvatarUrl,
  currentUserRole
}: HomeShellProps) {
  const reviewHref = currentUserName ? "/reviews/new" : "/login?next=%2Freviews%2Fnew";
  const topNavLinks = [{ label: "Review", href: reviewHref }];

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <EditorialTopNav
        brandLabel={`${content.brandName}.`}
        navLinks={topNavLinks}
        browseCategories={categories}
        innerClassName="max-w-7xl md:px-12"
        rightSlot={
          <ProfileMenu name={currentUserName} email={currentUserEmail} imageUrl={currentUserAvatarUrl} accountRole={currentUserRole} />
        }
      />
      <HomeMobileNav categories={categories} />

      <main className="mx-auto max-w-7xl px-4 md:px-12">
        <section className="mx-auto max-w-3xl pb-4 pt-8 text-center md:pb-6 md:pt-20">
          <h1 className="mb-5 text-5xl leading-[0.98] tracking-tight md:mb-8 md:text-7xl">
            {content.heroTitleLine1} <br />
            <span className="serif-italic text-stone-500">{content.heroTitleLine2}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-stone-600 md:mb-12 md:max-w-xl md:text-lg">{content.heroDescription}</p>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 md:mt-6 md:flex-row">
            <p className="text-center text-sm text-stone-500 md:text-left">
              Used a great vendor before? <span className="font-medium text-stone-700">Share it with Honestly.</span>
            </p>
            <Link
              href={reviewHref}
              className="inline-flex min-w-[190px] items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Write a review
            </Link>
          </div>
          <div className="mt-6 border-t border-stone-100 pt-4 md:mt-6 md:pt-4">
            <HomeCategoryRail shortcuts={shortcuts} />
          </div>
        </section>

        <HomeFeaturedSection title={content.featuredTitle} description={content.featuredDescription} vendors={featuredVendors} initialLists={initialLists} currentUserId={currentUserId ?? null} />
        {!currentUserName ? <ProfessionalCtaBanner className="mb-16 mt-12 md:mb-24 md:mt-16" compact /> : null}
      </main>

    </div>
  );
}
