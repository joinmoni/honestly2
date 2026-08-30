"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { MetaText } from "@/components/ui/Typography";
import { saveRevenueRadarTracking } from "@/lib/revenue-radar-tracking.client";
import { formatBidRouteLabel, formatExactMoney, formatUkDate } from "@/lib/tender-radar/format";
import {
  BID_ROUTE_LABELS,
  BID_ROUTES,
  TRACKING_STATUS_LABELS,
  TRACKING_STATUSES,
  getEffectiveTrackingStatus,
  isBidRoute,
  type BidRoute,
  type RevenueOpportunity,
  type TrackingStatus
} from "@/lib/tender-radar/types";

type OpportunityActivityFormProps = {
  opportunity: RevenueOpportunity;
  canEdit: boolean;
  onSaved: (opportunity: RevenueOpportunity) => void;
};

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function showBidSummary(status: TrackingStatus): boolean {
  return status === "pursuing" || status === "submitted" || status === "won" || status === "lost";
}

export function OpportunityActivityForm({ opportunity, canEdit, onSaved }: OpportunityActivityFormProps) {
  const initialStatus = getEffectiveTrackingStatus(opportunity);
  const [status, setStatus] = useState<TrackingStatus>(initialStatus);
  const [bidValue, setBidValue] = useState(opportunity.bidValue == null ? "" : String(opportunity.bidValue));
  const [bidCurrency, setBidCurrency] = useState(opportunity.bidCurrency ?? "GBP");
  const [bidRoute, setBidRoute] = useState<BidRoute | "">(opportunity.bidRoute ?? "");
  const [partnerName, setPartnerName] = useState(opportunity.partnerName ?? "");
  const [notes, setNotes] = useState(opportunity.notes ?? "");
  const [outcomeValue, setOutcomeValue] = useState(opportunity.outcomeValue == null ? "" : String(opportunity.outcomeValue));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [didSave, setDidSave] = useState(false);
  const showOutcome = status === "won" || status === "lost";

  async function handleSave() {
    if (!canEdit || isSaving) return;
    const parsedBidValue = parseOptionalNumber(bidValue);
    const parsedOutcomeValue = parseOptionalNumber(outcomeValue);
    if (Number.isNaN(parsedBidValue)) {
      setError("Bid value must be a number.");
      return;
    }
    if (Number.isNaN(parsedOutcomeValue)) {
      setError("Outcome value must be a number.");
      return;
    }
    setIsSaving(true);
    setError(null);
    setDidSave(false);
    try {
      const saved = await saveRevenueRadarTracking({
        processKey: opportunity.processKey,
        status,
        bidValue: parsedBidValue,
        bidCurrency: bidCurrency.trim() || null,
        bidRoute: isBidRoute(bidRoute) ? bidRoute : null,
        partnerName: partnerName.trim() || null,
        notes: notes.trim() || null,
        outcomeValue: parsedOutcomeValue
      });
      onSaved(saved);
      setDidSave(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "This opportunity could not be saved right now.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-4 border-t border-line pt-5">
      <div>
        <MetaText className="mb-1">Our Activity</MetaText>
        <p className="text-sm text-stone-500">Record what we decided to do with this opportunity.</p>
      </div>

      {showBidSummary(initialStatus) ? (
        <div className="grid gap-3 rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">
              {TRACKING_STATUS_LABELS[initialStatus]}
            </p>
            <p className="mt-1">{formatUkDate(opportunity.submittedAt ?? opportunity.outcomeAt)}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Bid</p>
            <p className="mt-1">{formatExactMoney(opportunity.bidValue, opportunity.bidCurrency)}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Route</p>
            <p className="mt-1">{formatBidRouteLabel(opportunity.bidRoute)}</p>
          </div>
        </div>
      ) : null}

      <div className="grid max-w-2xl gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Status</span>
          <Select
            aria-label="Status"
            value={status}
            disabled={!canEdit}
            onChange={(event) => setStatus(event.target.value as TrackingStatus)}
          >
            {TRACKING_STATUSES.map((value) => (
              <option key={value} value={value}>
                {TRACKING_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Bid Route</span>
          <Select
            aria-label="Bid Route"
            value={bidRoute}
            disabled={!canEdit}
            onChange={(event) => setBidRoute(event.target.value === "" ? "" : (event.target.value as BidRoute))}
          >
            <option value="">Not set</option>
            {BID_ROUTES.map((value) => (
              <option key={value} value={value}>
                {BID_ROUTE_LABELS[value]}
              </option>
            ))}
          </Select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Bid Value</span>
          <Input
            aria-label="Bid Value"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={bidValue}
            disabled={!canEdit}
            onChange={(event) => setBidValue(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Bid Currency</span>
          <Input
            aria-label="Bid Currency"
            value={bidCurrency}
            disabled={!canEdit}
            onChange={(event) => setBidCurrency(event.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Partner Name</span>
          <Input
            aria-label="Partner Name"
            value={partnerName}
            disabled={!canEdit}
            onChange={(event) => setPartnerName(event.target.value)}
          />
        </label>
        {showOutcome ? (
          <label className="block md:col-span-2">
            <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Outcome Value</span>
            <Input
              aria-label="Outcome Value"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={outcomeValue}
              disabled={!canEdit}
              onChange={(event) => setOutcomeValue(event.target.value)}
            />
          </label>
        ) : null}
        <label className="block md:col-span-2">
          <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">Notes</span>
          <Textarea
            aria-label="Notes"
            rows={4}
            value={notes}
            disabled={!canEdit}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => void handleSave()} disabled={!canEdit || isSaving}>
          {isSaving ? "Saving…" : "Save activity"}
        </Button>
        {didSave ? <p className="text-sm text-emerald-700">Saved</p> : null}
        {!canEdit ? <p className="text-sm text-stone-500">Admin sign-in is required to save.</p> : null}
        {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      </div>
    </section>
  );
}
