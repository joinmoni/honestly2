import {
  isBidRoute,
  isTrackingStatus,
  type BidRoute,
  type TrackingStatus
} from "@/lib/tender-radar/types";

export type TrackingInput = {
  processKey: string;
  status: TrackingStatus;
  bidValue: number | null;
  bidCurrency: string | null;
  bidRoute: BidRoute | null;
  partnerName: string | null;
  notes: string | null;
  outcomeValue: number | null;
};

export type ExistingTrackingTimestamps = {
  submittedAt: string | null;
  outcomeAt: string | null;
};

export type TrackingUpsertRow = {
  process_key: string;
  status: TrackingStatus;
  submitted_at: string | null;
  bid_value: number | null;
  bid_currency: string | null;
  bid_route: BidRoute | null;
  partner_name: string | null;
  notes: string | null;
  outcome_at: string | null;
  outcome_value: number | null;
  updated_at: string;
};

export type TrackingValidationResult =
  | { ok: true; value: TrackingInput }
  | { ok: false; error: string };

function toTrimmedText(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function toOptionalNonNegativeNumber(value: unknown, field: string): { ok: true; value: number | null } | { ok: false; error: string } {
  if (value == null || value === "") return { ok: true, value: null };
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) {
    return { ok: false, error: `${field} must be a number.` };
  }
  if (parsed < 0) {
    return { ok: false, error: `${field} cannot be negative.` };
  }
  return { ok: true, value: parsed };
}

export function validateTrackingInput(raw: unknown): TrackingValidationResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "A tracking payload is required." };
  }
  const body = raw as Record<string, unknown>;
  const processKey = toTrimmedText(body.processKey);
  if (!processKey) {
    return { ok: false, error: "process_key is required." };
  }
  const status = toTrimmedText(body.status);
  if (!isTrackingStatus(status)) {
    return { ok: false, error: "status is not a valid tracking status." };
  }
  const bidRouteRaw = toTrimmedText(body.bidRoute);
  if (bidRouteRaw && !isBidRoute(bidRouteRaw)) {
    return { ok: false, error: "bid_route must be direct, partner, or subcontractor." };
  }
  const bidValue = toOptionalNonNegativeNumber(body.bidValue, "bid_value");
  if (!bidValue.ok) return bidValue;
  const outcomeValue = toOptionalNonNegativeNumber(body.outcomeValue, "outcome_value");
  if (!outcomeValue.ok) return outcomeValue;
  return {
    ok: true,
    value: {
      processKey,
      status,
      bidValue: bidValue.value,
      bidCurrency: toTrimmedText(body.bidCurrency),
      bidRoute: bidRouteRaw && isBidRoute(bidRouteRaw) ? bidRouteRaw : null,
      partnerName: toTrimmedText(body.partnerName),
      notes: toTrimmedText(body.notes),
      outcomeValue: outcomeValue.value
    }
  };
}

export function resolveSubmittedAt(
  status: TrackingStatus,
  existingSubmittedAt: string | null,
  nowIso: string
): string | null {
  if (existingSubmittedAt) return existingSubmittedAt;
  if (status === "submitted") return nowIso;
  return null;
}

export function resolveOutcomeAt(
  status: TrackingStatus,
  existingOutcomeAt: string | null,
  nowIso: string
): string | null {
  if (existingOutcomeAt) return existingOutcomeAt;
  if (status === "won" || status === "lost") return nowIso;
  return null;
}

export function buildTrackingUpsert(
  input: TrackingInput,
  existing: ExistingTrackingTimestamps | null,
  now: Date
): TrackingUpsertRow {
  const nowIso = now.toISOString();
  return {
    process_key: input.processKey,
    status: input.status,
    submitted_at: resolveSubmittedAt(input.status, existing?.submittedAt ?? null, nowIso),
    bid_value: input.bidValue,
    bid_currency: input.bidCurrency,
    bid_route: input.bidRoute,
    partner_name: input.partnerName,
    notes: input.notes,
    outcome_at: resolveOutcomeAt(input.status, existing?.outcomeAt ?? null, nowIso),
    outcome_value: input.outcomeValue,
    updated_at: nowIso
  };
}
