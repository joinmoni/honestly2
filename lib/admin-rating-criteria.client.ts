import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { RatingCriterion } from "@/lib/types/domain";

type CreateCriterionInput = {
  name: string;
  description: string;
};

type UpdateCriterionInput = {
  name?: string;
  description?: string;
};

function reorderLocalCriteria(criteria: RatingCriterion[], criterionId: string, targetIndex: number): RatingCriterion[] {
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

export async function createAdminRatingCriterion(criteria: RatingCriterion[], input: CreateCriterionInput): Promise<RatingCriterion[]> {
  if (!isSupabaseConfigured()) {
    return [
      ...criteria,
      {
        id: `crit-local-${criteria.length + 1}`,
        name: input.name,
        description: input.description,
        active: true,
        position: criteria.length + 1
      }
    ];
  }

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("rating_criteria")
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
      position: Number(data.position)
    }
  ];
}

export async function updateAdminRatingCriterion(
  criteria: RatingCriterion[],
  criterionId: string,
  input: UpdateCriterionInput
): Promise<RatingCriterion[]> {
  if (!isSupabaseConfigured()) {
    return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, ...input } : criterion));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("rating_criteria")
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

export async function toggleAdminRatingCriterion(criteria: RatingCriterion[], criterionId: string): Promise<RatingCriterion[]> {
  const currentCriterion = criteria.find((criterion) => criterion.id === criterionId);
  if (!currentCriterion) {
    return criteria;
  }

  const nextActive = !currentCriterion.active;

  if (!isSupabaseConfigured()) {
    return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, active: nextActive } : criterion));
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("rating_criteria").update({ active: nextActive }).eq("id", criterionId);

  if (error) {
    throw error;
  }

  return criteria.map((criterion) => (criterion.id === criterionId ? { ...criterion, active: nextActive } : criterion));
}

export async function reorderAdminRatingCriteria(
  criteria: RatingCriterion[],
  criterionId: string,
  targetIndex: number
): Promise<RatingCriterion[]> {
  const nextCriteria = reorderLocalCriteria(criteria, criterionId, targetIndex);

  if (!isSupabaseConfigured()) {
    return nextCriteria;
  }

  const supabase = getSupabaseBrowserClient();
  const updates = nextCriteria.map((criterion) => ({
    id: criterion.id,
    position: criterion.position
  }));

  const { error } = await supabase.from("rating_criteria").upsert(updates, { onConflict: "id" });

  if (error) {
    throw error;
  }

  return nextCriteria;
}
