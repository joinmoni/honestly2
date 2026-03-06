export type FooterSocial = {
  id: "instagram" | "twitter";
  href: string;
  label: string;
};

export type FooterLink = {
  label: string;
  href: string;
  highlighted?: boolean;
};

export type FooterSection = {
  id: string;
  title: string;
  links: FooterLink[];
};

export type FooterContent = {
  brand: string;
  brandAccent: string;
  tagline: string;
  sections: FooterSection[];
  socials: FooterSocial[];
  copyright: string;
  statusLabel: string;
};
