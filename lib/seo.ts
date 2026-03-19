import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://honestly.example";

export const SITE_NAME = "Honestly";
export const SITE_DESCRIPTION = "Editorial vendor discovery for high-end events, trusted reviews, and curated lists.";

export function getSiteUrl(): URL {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return new URL(value && value.length ? value : DEFAULT_SITE_URL);
}

export function buildPageMetadata(input: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const metadataBase = getSiteUrl();
  const url = input.path ? new URL(input.path, metadataBase).toString() : metadataBase.toString();

  return {
    metadataBase,
    title: input.title,
    description: input.description,
    alternates: {
      canonical: url
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description
    }
  };
}
