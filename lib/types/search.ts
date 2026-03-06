export type HomepageCategorySuggestion = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  href: string;
};

export type HomepageVendorSuggestion = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  categoryLabel: string;
  locationLabel: string;
};

export type HomepageLocationSuggestion = {
  id: string;
  city: string;
  region?: string;
  country?: string;
  label: string;
};

export type HomepageSearchIndex = {
  categories: HomepageCategorySuggestion[];
  vendors: HomepageVendorSuggestion[];
  locations: HomepageLocationSuggestion[];
};

export type SearchSuggestions = {
  vendors: Array<{ id: string; name: string; slug: string }>;
  categories: Array<{ id: string; name: string; slug: string; emoji?: string; href: string }>;
  locations: Array<{ city: string; region?: string; country?: string; label: string }>;
};

export type VendorDirectorySearchInput = {
  query?: string;
  where?: string;
  categorySlug?: string;
};
