import { getDataLayer } from "@/lib/services/data-layer";
import { getVendors } from "@/lib/services/vendors";
import type { SharedCollectionPageData } from "@/lib/types/shared-collection";

export async function getSharedCollectionBySlug(shareSlug: string): Promise<SharedCollectionPageData | null> {
  const [collection, vendors] = await Promise.all([
    getDataLayer().getSharedCollectionBySlug(shareSlug),
    getVendors()
  ]);

  if (!collection) return null;

  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  const items = collection.items
    .map((item) => {
      const vendor = vendorById.get(item.vendorId);
      if (!vendor) return null;
      return {
        vendor,
        blurb: item.blurb
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return {
    shareSlug: collection.shareSlug,
    title: collection.title,
    description: collection.description,
    curatorName: collection.curatorName,
    curatorAvatarUrl: collection.curatorAvatarUrl,
    items,
    copy: {
      brandLabel: "honestly.",
      navFollowListLabel: "Follow List",
      navSignUpLabel: "Sign Up",
      heroBylineLabel: collection.curatorAttribution,
      viewProfileLabel: "View Profile",
      ctaTitle: "Build your own archive.",
      ctaDescription: "Save your favorites, curate lists, and share your vision with the world.",
      ctaPrimaryButtonLabel: "Start Curating",
      ctaSecondaryButtonLabel: `Follow ${collection.curatorName.split(" ")[0] ?? "Curator"}`,
      footerLabel: "Honestly • 2026 • Curated with Intention"
    }
  };
}
