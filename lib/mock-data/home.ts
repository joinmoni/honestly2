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

export const mockHomeCategoryShortcuts: HomeCategoryShortcut[] = [
  { id: "shortcut-photo", label: "Photo", emoji: "📸", href: "/category/photography" },
  { id: "shortcut-florals", label: "Florals", emoji: "🌿", href: "/category/floral-design" },
  { id: "shortcut-venues", label: "Venues", emoji: "🏰", href: "/category/venues" },
  { id: "shortcut-catering", label: "Catering", emoji: "🍽️", href: "/vendors" },
  { id: "shortcut-planning", label: "Planning", emoji: "✨", href: "/vendors" }
];
