import { getDataLayer } from "@/lib/services/data-layer";
import { getListsByUserId } from "@/lib/services/lists";
import { getVendors } from "@/lib/services/vendors";
import type { CollectionsListCardView, CollectionsPageCopy, SavedVendorRowView } from "@/lib/types/collections";

export async function getCollectionsPageCopy(): Promise<CollectionsPageCopy> {
  return getDataLayer().getCollectionsPageCopy();
}

export async function getCollectionListCards(userId: string): Promise<CollectionsListCardView[]> {
  const [lists, vendors] = await Promise.all([getListsByUserId(userId), getVendors()]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));

  return lists.map((list) => {
    const previewImageUrls = list.items
      .map((item) => vendorById.get(item.vendorId)?.images.find((image) => image.kind === "cover")?.url ?? vendorById.get(item.vendorId)?.images[0]?.url)
      .filter((url): url is string => Boolean(url))
      .slice(0, 3);

    return {
      id: list.id,
      name: list.name,
      href: `/lists/${list.id}`,
      visibility: list.isPublic ? "shared" : "private",
      vendorCount: list.items.length,
      previewImageUrls,
      extraCount: Math.max(0, list.items.length - 2)
    };
  });
}

export async function getSavedVendorRows(userId: string): Promise<SavedVendorRowView[]> {
  const [lists, vendors] = await Promise.all([getListsByUserId(userId), getVendors()]);
  const vendorById = new Map(vendors.map((vendor) => [vendor.id, vendor]));
  const uniqueVendorIds = Array.from(new Set(lists.flatMap((list) => list.items.map((item) => item.vendorId))));

  const rows: Array<SavedVendorRowView | null> = uniqueVendorIds.map((vendorId) => {
      const vendor = vendorById.get(vendorId);
      if (!vendor) return null;

      const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
      const cover = vendor.images.find((image) => image.kind === "cover") ?? vendor.images[0];

      return {
        vendorId,
        vendorName: vendor.name,
        vendorSlug: vendor.slug,
        imageUrl: cover?.url,
        categoryLabel: vendor.primaryCategory?.name ?? "Vendor",
        locationLabel: location ? `${location.city}${location.region ? `, ${location.region}` : ""}` : "Location TBD"
      } satisfies SavedVendorRowView;
    });

  return rows.filter((row): row is SavedVendorRowView => row !== null);
}
