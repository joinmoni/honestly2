import { getDataLayer } from "@/lib/services/data-layer";
import type { Vendor } from "@/lib/types/domain";

export async function getVendors(): Promise<Vendor[]> {
  return getDataLayer().getVendors();
}

export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  return getDataLayer().getVendorBySlug(slug);
}

export async function getFeaturedVendors(limit = 3): Promise<Vendor[]> {
  const vendors = await getDataLayer().getVendors();
  return vendors.slice(0, limit);
}

export async function getVendorsByCategory(categorySlug: string): Promise<Vendor[]> {
  const vendors = await getDataLayer().getVendors();
  return vendors.filter((vendor) => vendor.categories.some((category) => category.slug === categorySlug));
}

export async function searchVendors(query: string): Promise<Vendor[]> {
  const vendors = await getDataLayer().getVendors();
  const term = query.toLowerCase().trim();
  if (!term) return vendors;
  return vendors.filter((vendor) => {
    return (
      vendor.name.toLowerCase().includes(term) ||
      vendor.headline?.toLowerCase().includes(term) ||
      vendor.categories.some((cat) => cat.name.toLowerCase().includes(term)) ||
      vendor.subcategories.some((sub) => sub.name.toLowerCase().includes(term))
    );
  });
}
