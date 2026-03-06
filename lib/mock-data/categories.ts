import type { Category } from "@/lib/types/domain";

export const mockCategories: Category[] = [
  {
    id: "cat-photography",
    name: "Photography",
    slug: "photography",
    description: "Photographers for weddings, portraits, and editorial campaigns.",
    subcategories: [
      { id: "sub-fine-art-film", name: "Fine Art Film", slug: "fine-art-film", categoryId: "cat-photography" },
      { id: "sub-editorial-photo", name: "Editorial", slug: "editorial", categoryId: "cat-photography" },
      { id: "sub-documentary-photo", name: "Documentary", slug: "documentary", categoryId: "cat-photography" },
      { id: "sub-modernist-photo", name: "Modernist", slug: "modernist", categoryId: "cat-photography" },
      { id: "sub-bw-photo", name: "Black & White", slug: "black-and-white", categoryId: "cat-photography" }
    ]
  },
  {
    id: "cat-venue",
    name: "Venues",
    slug: "venues",
    description: "Character-filled venues for intimate and large events.",
    subcategories: [
      { id: "sub-garden-venue", name: "Garden Venues", slug: "garden-venues", categoryId: "cat-venue" },
      { id: "sub-industrial-venue", name: "Industrial Venues", slug: "industrial-venues", categoryId: "cat-venue" }
    ]
  },
  {
    id: "cat-floral",
    name: "Floral Design",
    slug: "floral-design",
    description: "Modern and sculptural floral design studios.",
    subcategories: [
      { id: "sub-wedding-floral", name: "Wedding Florals", slug: "wedding-florals", categoryId: "cat-floral" },
      { id: "sub-editorial-floral", name: "Editorial Florals", slug: "editorial-florals", categoryId: "cat-floral" }
    ]
  }
];
