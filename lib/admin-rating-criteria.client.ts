import { isSupabaseConfigured } from "@/lib/config/app-env";
import type { AdminRatingCriterionRow } from "@/lib/services/admin-rating-criteria";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CreateCriterionInput = {
  name: string;
  description: string;
};

type UpdateCriterionInput = {
  name?: string;
  description?: string;
};

function reorderLocalCriteria(
  criteria: AdminRatingCriterionRow[],
  criterionId: string,
  targetIndex: number
): AdminRatingCriterionRow[] {
  const sourceIndex = criteria.findIndex((criterion) => criterion.id === criterionId);
  if (sourceIndex === -1 || targetIndex < 0 || targetIndex >= criteria.length) {
    return criteria;
  }

  const next = [...criteria];
  const [moved] = next.splice(sourceIndex, 1);
  if (!moved) return criteria;
  next.splice(targetIndex, 0, moved);

  return next.map((criterion, index) => ({
    ...criterion,
    position: index + 1
  }));
}

export async function createAdminRatingCriterion(
  criteria: AdminRatingCriterionRow[],
  input: CreateCriterionInput
): Promise<AdminRatingCriterionRow[]> {
  if (!isSupabaseConfigured()) {
    return [
      ...criteria,
      {
        id: `crit-local-${criteria.length + 1}`,
        name: input.name,
        description: input.description,
        active: true,
        position: criteria.length + 1,
        reviewUsageCount: 0
      }
    ];
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("honestly_rating_criteria")
    .insert({
      name: input.name,
      description: input.description,
      active: true,
      position: criteria.length + 1
    })
    .select("id, name, description, active, position")
    .single();

  if (error) {
    throw error;
  }

  return [
    ...criteria,
    {
      id: data.id as string,
      name: data.name as string,
      description: (data.description as string | null) ?? undefined,
      active: Boolean(data.active),
      position: Number(data.position),
      reviewUsageCount: 0
    }
  ];
}

export async function updateAdminRatingCriterion(
  criteria: AdminRatingCriterionRow[],
  criterionId: string,
  input: UpdateCriterionInput
): Promise<AdminRatingCriterionRow[]> {
  if (!isSupabaseConfigured()) {
    return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, ...input } : criterion));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("honestly_rating_criteria")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {})
    })
    .eq("id", criterionId);

  if (error) {
    throw error;
  }

  return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, ...input } : criterion));
}

export async function toggleAdminRatingCriterion(
  criteria: AdminRatingCriterionRow[],
  criterionId: string
): Promise<AdminRatingCriterionRow[]> {
  const currentCriterion = criteria.find((criterion) => criterion.id === criterionId);
  if (!currentCriterion) {
    return criteria;
  }

  const nextActive = !currentCriterion.active;

  if (!isSupabaseConfigured()) {
    return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, active: nextActive } : criterion));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("honestly_rating_criteria").update({ active: nextActive }).eq("id", criterionId);

  if (error) {
    throw error;
  }

  return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, active: nextActive } : criterion));
}

export async function reorderAdminRatingCriteria(
  criteria: AdminRatingCriterionRow[],
  criterionId: string,
  targetIndex: number
): Promise<AdminRatingCriterionRow[]> {
  const nextCriteria = reorderLocalCriteria(criteria, criterionId, targetIndex);

  if (!isSupabaseConfigured()) {
    return nextCriteria;
  }

  const supabase = getSupabaseBrowserClient();
  const updates = nextCriteria.map((criterion) => ({
    id: criterion.id,
    position: criterion.position
  }));

  const { error } = await supabase.from("honestly_rating_criteria").upsert(updates, { onConflict: "id" });

  if (error) {
    throw error;
  }

  return nextCriteria;
}

const DELETE_BLOCKED =
  "This rubric has been used in reviews and cannot be deleted. Turn it off with the toggle instead.";

export async function deleteAdminRatingCriterion(
  criteria: AdminRatingCriterionRow[],
  criterionId: string
): Promise<AdminRatingCriterionRow[]> {
  const target = criteria.find((c) => c.id === criterionId);
  if (!target) {
    return criteria;
  }
  if (target.reviewUsageCount > 0) {
    throw new Error(DELETE_BLOCKED);
  }

  if (!isSupabaseConfigured()) {
    return criteria
      .filter((c) => c.id !== criterionId)
      .map((criterion, index) => ({ ...criterion, position: index + 1 }));
  }

  const supabase = getSupabaseBrowserClient();
  const { error: countError, count } = await supabase
    .from("honestly_review_ratings")
    .select("*", { count: "exact", head: true })
    .eq("criterion_id", criterionId);

  if (countError) {
    throw countError;
  }
  if (count !== null && count > 0) {
    throw new Error(DELETE_BLOCKED);
  }

  const { error: deleteError } = await supabase.from("honestly_rating_criteria").delete().eq("id", criterionId);
  if (deleteError) {
    throw deleteError;
  }

  const next = criteria
    .filter((c) => c.id !== criterionId)
    .map((criterion, index) => ({ ...criterion, position: index + 1 }));

  const positionUpdates = next.map((criterion) => ({
    id: criterion.id,
    position: criterion.position
  }));

  const { error: positionError } = await supabase.from("honestly_rating_criteria").upsert(positionUpdates, { onConflict: "id" });
  if (positionError) {
    throw positionError;
  }

  return next;
}
