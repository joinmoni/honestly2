import type { FooterContent } from "@/lib/types/footer";

export const mockFooterContent: FooterContent = {
  brand: "honestly",
  brandAccent: ".",
  tagline:
    "The editorial discovery platform for vetted vendors, fine-art services, and high-end professionals. Curated with intention.",
  sections: [
    {
      id: "platform",
      title: "Platform",
      links: [
        { label: "Browse All Vendors", href: "/vendors" },
        { label: "Featured Collections", href: "/lists" },
        { label: "How it Works", href: "#" },
        { label: "Safety & Trust", href: "#" }
      ]
    },
    {
      id: "professionals",
      title: "For Professionals",
      links: [
        { label: "List your Business", href: "#" },
        { label: "Claim your Page", href: "#" },
        { label: "Vendor Guidelines", href: "#" },
        { label: "Support Center", href: "#" }
      ]
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About Honestly", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Admin Portal", href: "/admin", highlighted: true }
      ]
    }
  ],
  socials: [
    { id: "instagram", href: "#", label: "Instagram" },
    { id: "twitter", href: "#", label: "Twitter" }
  ],
  copyright: "© 2026 Honestly. Built for the craft.",
  statusLabel: "Operational"
};
