import { getDataProvider, getSupabaseServerEnv, isSupabaseConfigured } from "@/lib/config/app-env";
import { getRatingCriteria, getReviews } from "@/lib/services/reviews";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { AdminNavLink } from "@/lib/types/admin-dashboard";
import type { RatingCriterion } from "@/lib/types/domain";

export type AdminRatingCriterionRow = RatingCriterion & { reviewUsageCount: number };

export type AdminRatingCriteriaData = {
  brandLabel: string;
  title: string;
  description: string;
  addLabel: string;
  footerNote: string;
  navLinks: AdminNavLink[];
  criteria: AdminRatingCriterionRow[];
};

async function loadCriterionReviewUsageCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  const tallyFromReviews = async () => {
    const reviews = await getReviews();
    for (const review of reviews) {
      for (const rating of review.ratings) {
        counts.set(rating.criterionId, (counts.get(rating.criterionId) ?? 0) + 1);
      }
    }
  };

  if (getDataProvider() !== "supabase" || !isSupabaseConfigured()) {
    await tallyFromReviews();
    return counts;
  }

  const serverEnv = getSupabaseServerEnv();
  if (serverEnv) {
    const client = getSupabaseAdminClient();
    const { data, error } = await client.from("honestly_review_ratings").select("criterion_id");
    if (error) {
      throw new Error(`Failed to load rubric usage counts: ${error.message}`);
    }
    for (const row of data ?? []) {
      const id = row.criterion_id as string;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return counts;
  }

  await tallyFromReviews();
  return counts;
}

export async function getAdminRatingCriteriaData(): Promise<AdminRatingCriteriaData> {
  const [criteria, usageById] = await Promise.all([getRatingCriteria(), loadCriterionReviewUsageCounts()]);
  const criteriaWithUsage: AdminRatingCriterionRow[] = criteria.map((criterion) => ({
    ...criterion,
    reviewUsageCount: usageById.get(criterion.id) ?? 0
  }));

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
      { id: "taxonomy", label: "Categories", href: "/admin/categories" },
      { id: "rating-criteria", label: "Rating criteria", href: "/admin/rating-criteria", active: true }
    ],
    criteria: criteriaWithUsage
  };
}
