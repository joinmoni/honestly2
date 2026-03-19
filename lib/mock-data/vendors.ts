import type { Vendor } from "@/lib/types/domain";

export const mockVendors: Vendor[] = [
  {
    id: "ven-wildflower-archive",
    slug: "wildflower-archive",
    name: "Wildflower Archive",
    headline: "Ethereal arrangements for modern romantics.",
    description: "Wildflower Archive crafts expressive floral stories with a fine-art approach.",
    verified: true,
    claimed: true,
    status: "active",
    ratingAvg: 4.9,
    reviewCount: 124,
    priceTier: "$$$",
    primaryCategory: { id: "cat-floral", name: "Floral Design", slug: "floral-design" },
    subcategories: [{ id: "sub-wedding-floral", name: "Fine Art Florals", slug: "fine-art-florals" }],
    categories: [{ id: "cat-floral", name: "Floral Design", slug: "floral-design" }],
    locations: [
      { id: "loc-wildflower-1", city: "Hudson Valley", region: "NY", country: "USA", isPrimary: true },
      { id: "loc-wildflower-2", city: "Brooklyn", region: "NY", country: "USA", isPrimary: false }
    ],
    images: [
      {
        id: "img-wildflower-cover",
        url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=1200",
        alt: "Floral arrangement",
        kind: "cover"
      },
      {
        id: "img-wildflower-gallery-1",
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
        alt: "Wedding table setup",
        kind: "gallery"
      },
      {
        id: "img-wildflower-gallery-2",
        url: "https://images.unsplash.com/photo-1517722014278-c256a911678b?auto=format&fit=crop&q=80&w=600",
        alt: "Wedding bouquet",
        kind: "gallery"
      },
      {
        id: "img-wildflower-gallery-3",
        url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600",
        alt: "Seasonal flowers",
        kind: "gallery"
      }
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "website", url: "https://example.com" }
    ],
    travels: true,
    serviceRadiusKm: 300
  },
  {
    id: "ven-wild-rose-studio",
    slug: "the-wild-rose-studio",
    name: "The Wild Rose Studio",
    headline: "Fine art botanical sculptures...",
    description: "The Wild Rose Studio creates sculptural floral installations with seasonal stems.",
    verified: true,
    claimed: true,
    status: "active",
    ratingAvg: 4.92,
    reviewCount: 88,
    priceTier: "$$$",
    primaryCategory: { id: "cat-floral", name: "Floral Design", slug: "floral-design" },
    subcategories: [{ id: "sub-wedding-floral", name: "Fine Art Florals", slug: "fine-art-florals" }],
    categories: [{ id: "cat-floral", name: "Floral Design", slug: "floral-design" }],
    locations: [{ id: "loc-wild-rose-1", city: "Hudson Valley", region: "NY", country: "USA", isPrimary: true }],
    images: [
      {
        id: "img-wild-rose-cover",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        alt: "Floral studio wedding setup",
        kind: "cover"
      }
    ],
    socials: [{ platform: "instagram", url: "https://instagram.com" }],
    travels: true,
    serviceRadiusKm: 220
  },
  {
    id: "ven-estate-silver-lake",
    slug: "estate-at-silver-lake",
    name: "Estate at Silver Lake",
    headline: "A historic manor on 40 acres...",
    description: "Estate at Silver Lake is a private venue for elevated weddings and events.",
    verified: true,
    claimed: true,
    status: "active",
    ratingAvg: 4.85,
    reviewCount: 73,
    priceTier: "$$$",
    primaryCategory: { id: "cat-venue", name: "Venues", slug: "venues" },
    subcategories: [{ id: "sub-garden-venue", name: "Garden Venues", slug: "garden-venues" }],
    categories: [{ id: "cat-venue", name: "Venues", slug: "venues" }],
    locations: [{ id: "loc-silver-lake-1", city: "Catskills", region: "NY", country: "USA", isPrimary: true }],
    images: [
      {
        id: "img-silver-lake-cover",
        url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
        alt: "Historic manor venue",
        kind: "cover"
      }
    ],
    socials: [{ platform: "website", url: "https://example.com" }],
    travels: false,
    serviceRadiusKm: 0
  },
  {
    id: "ven-golden-hour-stills",
    slug: "golden-hour-stills",
    name: "Golden Hour Stills",
    headline: "Capturing the quiet moments in between.",
    description: "Golden Hour Stills documents celebrations with cinematic warmth and emotional framing.",
    verified: true,
    claimed: false,
    status: "active",
    ratingAvg: 5.0,
    reviewCount: 29,
    priceTier: "$$",
    primaryCategory: { id: "cat-photography", name: "Photography", slug: "photography" },
    subcategories: [{ id: "sub-editorial-photo", name: "Editorial", slug: "editorial" }],
    categories: [{ id: "cat-photography", name: "Photography", slug: "photography" }],
    locations: [{ id: "loc-golden-1", city: "Austin", region: "TX", country: "USA", isPrimary: true }],
    images: [
      {
        id: "img-golden-cover",
        url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800",
        alt: "Wedding photography",
        kind: "cover"
      }
    ],
    socials: [{ platform: "instagram", url: "https://instagram.com" }],
    travels: true,
    serviceRadiusKm: 250
  },
  {
    id: "ven-film-archive",
    slug: "the-film-archive",
    name: "The Film Archive",
    headline: "Thoughtful, grain-heavy imagery that feels like a forgotten memory.",
    description: "The Film Archive specializes in analogue-forward photography with timeless editorial composition.",
    verified: true,
    claimed: true,
    status: "active",
    ratingAvg: 4.9,
    reviewCount: 42,
    priceTier: "$$$",
    primaryCategory: { id: "cat-photography", name: "Photography", slug: "photography" },
    subcategories: [{ id: "sub-fine-art-film", name: "Fine Art Film", slug: "fine-art-film" }],
    categories: [{ id: "cat-photography", name: "Photography", slug: "photography" }],
    locations: [{ id: "loc-film-archive-1", city: "London", country: "UK", isPrimary: true }],
    images: [
      {
        id: "img-film-archive-cover",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
        alt: "Film photography portrait",
        kind: "cover"
      }
    ],
    socials: [{ platform: "instagram", url: "https://instagram.com" }],
    travels: true,
    serviceRadiusKm: null
  },
  {
    id: "ven-the-glass-house",
    slug: "the-glass-house",
    name: "The Glass House",
    headline: "A minimalist sanctuary in the high desert.",
    description: "The Glass House is a design-led venue for modern intimate gatherings.",
    verified: false,
    claimed: false,
    status: "active",
    ratingAvg: 4.8,
    reviewCount: 17,
    priceTier: "$$$",
    primaryCategory: { id: "cat-venue", name: "Venues", slug: "venues" },
    subcategories: [{ id: "sub-garden-venue", name: "Venues", slug: "garden-venues" }],
    categories: [{ id: "cat-venue", name: "Venues", slug: "venues" }],
    locations: [{ id: "loc-glass-1", city: "Joshua Tree", region: "CA", country: "USA", isPrimary: true }],
    images: [
      {
        id: "img-glass-cover",
        url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
        alt: "Venue in desert",
        kind: "cover"
      }
    ],
    socials: [{ platform: "website", url: "https://example.com" }],
    travels: false,
    serviceRadiusKm: 0
  },
  {
    id: "ven-vintage-archive-co",
    slug: "vintage-archive-co",
    name: "Vintage Archive Co.",
    headline: "Collected rentals for editorial celebrations.",
    description: "Vintage Archive Co. curates rental pieces for heritage-inspired events.",
    verified: false,
    claimed: false,
    status: "suspended",
    ratingAvg: 4.2,
    reviewCount: 8,
    priceTier: "$$",
    primaryCategory: { id: "cat-rentals", name: "Rentals", slug: "rentals" },
    subcategories: [{ id: "sub-rental-curation", name: "Prop Rentals", slug: "prop-rentals" }],
    categories: [{ id: "cat-rentals", name: "Rentals", slug: "rentals" }],
    locations: [{ id: "loc-vintage-1", city: "Nashville", region: "TN", country: "USA", isPrimary: true }],
    images: [
      {
        id: "img-vintage-cover",
        url: "https://images.unsplash.com/photo-1531058022888-21d959556d02?auto=format&fit=crop&q=80&w=100",
        alt: "Vintage rentals archive",
        kind: "cover"
      }
    ],
    socials: [{ platform: "instagram", url: "https://instagram.com" }],
    travels: false,
    serviceRadiusKm: 0
  }
];
