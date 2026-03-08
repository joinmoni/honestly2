import { mockAuthPageCopy } from "@/lib/mock-data/auth-page";
import { getFallbackCategoryListingCopy, mockCategoryListingCopyBySlug } from "@/lib/mock-data/category-listing";
import { mockCategories } from "@/lib/mock-data/categories";
import { mockClaimPageCopy } from "@/lib/mock-data/claim-page";
import { mockVendorClaims } from "@/lib/mock-data/claims";
import { mockCollectionsPageCopy } from "@/lib/mock-data/collections";
import { mockFooterContent } from "@/lib/mock-data/footer";
import { getMockHomeCategoryShortcuts, mockHomeContent } from "@/lib/mock-data/home";
import { mockSavedLists } from "@/lib/mock-data/lists";
import { mockMyReviewsPageCopy } from "@/lib/mock-data/my-reviews";
import { mockRatingCriteria, mockReviews } from "@/lib/mock-data/reviews";
import { mockAdminSession, mockAnonymousSession, mockUserSession } from "@/lib/mock-data/session";
import { mockSharedCollections } from "@/lib/mock-data/shared-collections";
import { mockVendorEditCopy } from "@/lib/mock-data/vendor-edit";
import { mockVendorListingCopy, mockVendorListingFilterChips } from "@/lib/mock-data/vendor-listing";
import { mockVendorProfiles } from "@/lib/mock-data/vendor-profiles";
import { mockVendors } from "@/lib/mock-data/vendors";
import type { AppDataLayer } from "@/lib/services/contracts";

export const mockDataLayer: AppDataLayer = {
  async getVendors() {
    return mockVendors;
  },
  async getVendorBySlug(slug) {
    return mockVendors.find((vendor) => vendor.slug === slug) ?? null;
  },
  async getCategories() {
    return mockCategories;
  },
  async getCategoryBySlug(slug) {
    return mockCategories.find((category) => category.slug === slug) ?? null;
  },
  async getSubcategoryBySlug(categorySlug, subcategorySlug) {
    const category = mockCategories.find((item) => item.slug === categorySlug);
    if (!category) return null;
    return category.subcategories.find((subcategory) => subcategory.slug === subcategorySlug) ?? null;
  },
  async getReviews() {
    return mockReviews;
  },
  async getRatingCriteria() {
    return [...mockRatingCriteria].sort((a, b) => a.position - b.position);
  },
  async getListsByUserId(userId) {
    return mockSavedLists.filter((list) => list.userId === userId);
  },
  async getListById(id) {
    return mockSavedLists.find((list) => list.id === id) ?? null;
  },
  async getPublicListByShareSlug(shareSlug) {
    return mockSavedLists.find((list) => list.shareSlug === shareSlug && list.isPublic) ?? null;
  },
  async getClaims() {
    return mockVendorClaims;
  },
  async getClaimsByVendorId(vendorId) {
    return mockVendorClaims.filter((claim) => claim.vendorId === vendorId);
  },
  async getCurrentSession() {
    return mockUserSession;
  },
  async getAnonymousSession() {
    return mockAnonymousSession;
  },
  async getAdminSession() {
    return mockAdminSession;
  },
  async getVendorProfileByVendorId(vendorId) {
    return mockVendorProfiles.find((profile) => profile.vendorId === vendorId) ?? null;
  },
  async getHomeContent() {
    return mockHomeContent;
  },
  async getHomeCategoryShortcuts() {
    return getMockHomeCategoryShortcuts(mockCategories);
  },
  async getAuthPageCopy() {
    return mockAuthPageCopy;
  },
  async getFooterContent() {
    return mockFooterContent;
  },
  async getClaimPageCopy() {
    return mockClaimPageCopy;
  },
  async getMyReviewsPageCopy() {
    return mockMyReviewsPageCopy;
  },
  async getVendorEditCopy() {
    return mockVendorEditCopy;
  },
  async getVendorListingCopy() {
    return mockVendorListingCopy;
  },
  async getVendorListingFilterChips() {
    return mockVendorListingFilterChips;
  },
  async getCollectionsPageCopy() {
    return mockCollectionsPageCopy;
  },
  async getSharedCollectionBySlug(shareSlug) {
    return mockSharedCollections.find((entry) => entry.shareSlug === shareSlug) ?? null;
  },
  async getCategoryListingCopy(categorySlug, categoryName) {
    return mockCategoryListingCopyBySlug[categorySlug] ?? getFallbackCategoryListingCopy(categoryName);
  }
};
