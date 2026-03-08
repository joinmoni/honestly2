import type { Category } from "@/lib/types/domain";
import type { HomeCategoryShortcut, HomeContent } from "@/lib/types/home";

export const mockHomeContent: HomeContent = {
  brandName: "honestly",
  heroTitleLine1: "Find vendors",
  heroTitleLine2: "worth talking about.",
  heroDescription: "An editorial discovery platform for high-end vendors. Real reviews, vetted professionals, and curated lists.",
  searchWhoPlaceholder: "Photography, Venues...",
  searchWherePlaceholder: "London, UK",
  featuredTitle: "Featured Vendors",
  featuredDescription: "Hand-picked professionals for your next project.",
  navLinks: [
    { label: "Browse Vendors", href: "/vendors" },
    { label: "How it works", href: "#" }
  ],
  footerTagline: "Elevating discovery through honest community feedback and curated excellence.",
  footerColumns: [
    {
      id: "platform",
      title: "Platform",
      links: [
        { label: "Browse Vendors", href: "/vendors" },
        { label: "For Vendors", href: "#" }
      ]
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Privacy", href: "#" }
      ]
    }
  ]
};

const homeShortcutMetaBySlug: Record<
  string,
  {
    emoji: string;
    label: string;
    featuredOnHome: boolean;
    homeOrder: number | null;
  }
> = {
  photography: { emoji: "📸", label: "Photo", featuredOnHome: true, homeOrder: 1 },
  "floral-design": { emoji: "🌿", label: "Florals", featuredOnHome: true, homeOrder: 2 },
  venues: { emoji: "🏰", label: "Venues", featuredOnHome: true, homeOrder: 3 }
};

export function getMockHomeCategoryShortcuts(categories: Category[]): HomeCategoryShortcut[] {
  return categories
    .map((category) => {
      const meta = homeShortcutMetaBySlug[category.slug];
      if (!meta?.featuredOnHome) return null;

      return {
        id: `shortcut-${category.slug}`,
        label: meta.label,
        emoji: meta.emoji,
        href: `/category/${category.slug}`,
        homeOrder: meta.homeOrder
      };
    })
    .filter((item): item is HomeCategoryShortcut & { homeOrder: number | null } => Boolean(item))
    .sort((a, b) => (a.homeOrder ?? Number.MAX_SAFE_INTEGER) - (b.homeOrder ?? Number.MAX_SAFE_INTEGER))
    .map(({ homeOrder: _homeOrder, ...item }) => item);
}
