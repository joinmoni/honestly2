import { getRatingCriteria } from "@/lib/services/reviews";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";
import type { RatingCriterion } from "@/lib/types/domain";

export type AdminRatingCriteriaData = {
  brandLabel: string;
  title: string;
  description: string;
  addLabel: string;
  footerNote: string;
  navLinks: AdminNavLink[];
  criteria: RatingCriterion[];
};

export async function getAdminRatingCriteriaData(): Promise<AdminRatingCriteriaData> {
  const criteria = await getRatingCriteria();

  return {
    brandLabel: "honestly. admin",
    title: "Review Rubric",
    description: "Configure the dimensions users use to score vendors.",
    addLabel: "Add Criterion",
    footerNote: "Changes here affect the public Review Modal in real-time.",
    navLinks: [
      { id: "dashboard", label: "Dashboard", href: "/admin" },
      { id: "vendors", label: "Vendors", href: "/admin/vendors" },
      { id: "reviews", label: "Reviews", href: "/admin/reviews" },
      { id: "claims", label: "Claims", href: "/admin/claims" },
      { id: "taxonomy", label: "Taxonomy", href: "/admin/categories" },
      { id: "rating-criteria", label: "Review Rubric", href: "/admin/rating-criteria", active: true }
    ],
    criteria
  };
}
