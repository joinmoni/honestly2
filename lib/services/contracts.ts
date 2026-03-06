import type { AuthPageCopy } from "@/lib/types/auth-page";
import type { CategoryListingCopy } from "@/lib/types/category-listing";
import type { CollectionsPageCopy } from "@/lib/types/collections";
import type {
  Category,
  MockSession,
  RatingCriterion,
  Review,
  SavedList,
  Subcategory,
  Vendor,
  VendorClaim
} from "@/lib/types/domain";
import type { FooterContent } from "@/lib/types/footer";
import type { HomeCategoryShortcut, HomeContent } from "@/lib/types/home";
import type { ClaimPageCopy } from "@/lib/types/claim-page";
import type { MyReviewsPageCopy } from "@/lib/types/my-reviews";
import type { SharedCollection } from "@/lib/types/shared-collection";
import type { VendorEditCopy } from "@/lib/types/vendor-edit";
import type { VendorListingCopy, VendorListingFilterChip } from "@/lib/types/vendor-listing";
import type { VendorProfile } from "@/lib/types/vendor-profile";

export interface AppDataLayer {
  getVendors(): Promise<Vendor[]>;
  getVendorBySlug(slug: string): Promise<Vendor | null>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Promise<Subcategory | null>;
  getReviews(): Promise<Review[]>;
  getRatingCriteria(): Promise<RatingCriterion[]>;
  getListsByUserId(userId: string): Promise<SavedList[]>;
  getListById(id: string): Promise<SavedList | null>;
  getPublicListByShareSlug(shareSlug: string): Promise<SavedList | null>;
  getClaims(): Promise<VendorClaim[]>;
  getClaimsByVendorId(vendorId: string): Promise<VendorClaim[]>;
  getMockSession(): Promise<MockSession>;
  getAnonymousSession(): Promise<MockSession>;
  getMockAdminSession(): Promise<MockSession>;
  getVendorProfileByVendorId(vendorId: string): Promise<VendorProfile | null>;
  getHomeContent(): Promise<HomeContent>;
  getHomeCategoryShortcuts(): Promise<HomeCategoryShortcut[]>;
  getAuthPageCopy(): Promise<AuthPageCopy>;
  getFooterContent(): Promise<FooterContent>;
  getClaimPageCopy(): Promise<ClaimPageCopy>;
  getMyReviewsPageCopy(): Promise<MyReviewsPageCopy>;
  getVendorEditCopy(): Promise<VendorEditCopy>;
  getVendorListingCopy(): Promise<VendorListingCopy>;
  getVendorListingFilterChips(): Promise<VendorListingFilterChip[]>;
  getCollectionsPageCopy(): Promise<CollectionsPageCopy>;
  getSharedCollectionBySlug(shareSlug: string): Promise<SharedCollection | null>;
  getCategoryListingCopy(categorySlug: string, categoryName: string): Promise<CategoryListingCopy>;
}
