import Link from "next/link";
import { HomeCategoryRail } from "@/components/home/HomeCategoryRail";
import { HomeFeaturedSection } from "@/components/home/HomeFeaturedSection";
import { HomeHeroSearch } from "@/components/home/HomeHeroSearch";
import { ProfileMenu } from "@/components/ui/ProfileMenu";
import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import type { Vendor } from "@/lib/types/domain";
import type { HomeCategoryShortcut, HomeContent } from "@/lib/types/home";
import type { HomepageSearchIndex } from "@/lib/types/search";

type HomeShellProps = {
  content: HomeContent;
  shortcuts: HomeCategoryShortcut[];
  featuredVendors: Vendor[];
  searchIndex: HomepageSearchIndex;
};

export function HomeShell({ content, shortcuts, featuredVendors, searchIndex }: HomeShellProps) {
  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <EditorialTopNav
        brandLabel={`${content.brandName}.`}
        navLinks={content.navLinks}
        innerClassName="max-w-7xl md:px-12"
        rightSlot={<ProfileMenu name="Avery Johnson" email="avery@example.com" />}
      />

      <main className="mx-auto max-w-7xl px-6 md:px-12">
        <section className="mx-auto max-w-3xl pb-28 pt-20 text-center">
          <h1 className="mb-8 text-6xl leading-[1.02] tracking-tight md:text-7xl">
            {content.heroTitleLine1} <br />
            <span className="serif-italic text-stone-500">{content.heroTitleLine2}</span>
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg text-stone-600">{content.heroDescription}</p>

          <HomeHeroSearch
            searchWhoPlaceholder={content.searchWhoPlaceholder}
            searchWherePlaceholder={content.searchWherePlaceholder}
            searchIndex={searchIndex}
          />
        </section>

        <HomeCategoryRail shortcuts={shortcuts} />
        <HomeFeaturedSection title={content.featuredTitle} description={content.featuredDescription} vendors={featuredVendors} />
      </main>

    </div>
  );
}
