export type HomeNavLink = {
  label: string;
  href: string;
};

export type HomeCategoryShortcut = {
  id: string;
  label: string;
  emoji: string;
  href: string;
};

export type HomeFooterColumn = {
  id: string;
  title: string;
  links: HomeNavLink[];
};

export type HomeContent = {
  brandName: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  searchWhoPlaceholder: string;
  searchWherePlaceholder: string;
  featuredTitle: string;
  featuredDescription: string;
  navLinks: HomeNavLink[];
  footerTagline: string;
  footerColumns: HomeFooterColumn[];
};
