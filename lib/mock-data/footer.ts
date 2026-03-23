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
        { label: "How it Works", href: "/how-it-works" },
        { label: "Safety & Trust", href: "/safety-and-trust" }
      ]
    },
    {
      id: "professionals",
      title: "Recommend A Vendor",
      links: [
        { label: "Tell Us About a Vendor", href: "/login?next=%2Freviews%2Fnew" },
        { label: "Claim your Page", href: "/for-professionals#claim" },
        { label: "Vendor Guidelines", href: "/vendor-guidelines" },
        { label: "Support Center", href: "/support" }
      ]
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "About Honestly", href: "/about" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" }
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
