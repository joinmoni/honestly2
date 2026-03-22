"use client";

import { isSupabaseConfigured } from "@/lib/config/app-env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

async function resolveProfileId(userId: string): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();

  const directResult = await supabase.from("honestly_user_profiles").select("id").eq("id", userId).maybeSingle();
  if (directResult.error) {
    throw directResult.error;
  }
  if (directResult.data?.id) {
    return directResult.data.id as string;
  }

  const authResult = await supabase.from("honestly_user_profiles").select("id").eq("auth_user_id", userId).maybeSingle();
  if (authResult.error) {
    throw authResult.error;
  }

  return (authResult.data?.id as string | undefined) ?? null;
}

type SubmitVendorClaimInput = {
  vendorId: string;
  userId: string;
  claimantName: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  note?: string;
};

export async function submitVendorClaim(input: SubmitVendorClaimInput): Promise<{ submittedAt: string }> {
  const submittedAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return { submittedAt };
  }

  const supabase = getSupabaseBrowserClient();
  const profileId = await resolveProfileId(input.userId);

  if (!profileId) {
    throw new Error("Profile not found for this account.");
  }

  const existingResult = await supabase
    .from("honestly_vendor_claims")
    .select("id")
    .eq("vendor_id", input.vendorId)
    .eq("user_id", profileId)
    .maybeSingle();

  if (existingResult.error) {
    throw existingResult.error;
  }

  const payload = {
    vendor_id: input.vendorId,
    user_id: profileId,
    claimant_name: input.claimantName,
    verification_email: input.email || null,
    verification_instagram: input.instagram || null,
    verification_tiktok: input.tiktok || null,
    status: "pending" as const,
    note: input.note || null,
    created_at: submittedAt,
    updated_at: submittedAt
  };

  if (existingResult.data?.id) {
    const { error } = await supabase
      .from("honestly_vendor_claims")
      .update(payload)
      .eq("id", existingResult.data.id);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("honestly_vendor_claims").insert(payload);

    if (error) {
      throw error;
    }
  }

  return { submittedAt };
}
