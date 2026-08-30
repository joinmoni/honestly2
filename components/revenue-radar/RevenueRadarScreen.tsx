"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Radar } from "lucide-react";

import { EditorialTopNav } from "@/components/ui/EditorialTopNav";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { BodyText, MetaText, PageTitle, PillText } from "@/components/ui/Typography";
import {
  displayValue,
  formatAiReviewLabel,
  formatDeadlineUrgency,
  formatMoney,
  formatRouteLabel,
  formatScore,
  formatStageLabel,
  formatUkDate,
  isCurrentAiReview
} from "@/lib/tender-radar/format";
import { countByRoute, filterOpportunities } from "@/lib/tender-radar/select";
import {
  ROUTE_LABELS,
  type ActionableRoute,
  type RevenueOpportunity,
  type RouteFilter,
  type StageFilter
} from "@/lib/tender-radar/types";
import { cn } from "@/lib/utils";

export type RevenueRadarScreenStatus = "ok" | "not_configured" | "query_failed";

type RevenueRadarScreenProps = {
  status: RevenueRadarScreenStatus;
  opportunities: RevenueOpportunity[];
};

const ROUTE_FILTERS: Array<{ id: RouteFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "direct_bid", label: ROUTE_LABELS.direct_bid },
  { id: "engage_now", label: ROUTE_LABELS.engage_now },
  { id: "partner", label: ROUTE_LABELS.partner },
  { id: "watch", label: ROUTE_LABELS.watch }
];

const STAGE_FILTERS: Array<{ id: StageFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "live_bid", label: "Live Bid" },
  { id: "early_engagement", label: "Early Engagement" }
];

const SUMMARY_ROUTES: ActionableRoute[] = ["direct_bid", "engage_now", "partner", "watch"];

function routeTone(route: string | null): "success" | "warning" | "neutral" {
  if (route === "direct_bid") return "success";
  if (route === "engage_now") return "warning";
  return "neutral";
}

export function RevenueRadarScreen({ status, opportunities }: RevenueRadarScreenProps) {
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<RouteFilter>("all");
  const [stage, setStage] = useState<StageFilter>("all");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const counts = useMemo(() => countByRoute(opportunities), [opportunities]);
  const visible = useMemo(
    () => filterOpportunities(opportunities, { query, route, stage }),
    [opportunities, query, route, stage]
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <EditorialTopNav
        brandLabel="honestly."
        brandHref="/"
        desktopNavSource="navLinks"
        navLinks={[{ label: "Revenue Radar", href: "/revenue-radar", active: true }]}
        innerClassName="max-w-6xl px-6 md:px-8"
        rightSlot={<span className="ui-meta text-stone-400">Internal</span>}
      />

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-12">
        <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-stone-400">
              <Radar size={14} strokeWidth={2.25} />
              <MetaText>Internal</MetaText>
            </div>
            <PageTitle className="mb-2">Revenue Radar</PageTitle>
            <BodyText>Public-sector opportunities identified and reviewed by Tender Radar.</BodyText>
          </div>
          {status === "ok" ? (
            <div className="flex flex-wrap gap-2">
              {SUMMARY_ROUTES.map((id) => (
                <span key={id} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600">
                  <span className="font-medium text-stone-900">{ROUTE_LABELS[id]}</span>
                  <span className="tabular-nums text-stone-400">{counts[id]}</span>
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {status === "not_configured" ? (
          <EmptyState
            eyebrow="Configuration"
            title="Tender Radar is not connected"
            description="Add the Tender Radar database settings on the server, then reload this page."
          />
        ) : null}

        {status === "query_failed" ? (
          <EmptyState
            eyebrow="Unavailable"
            title="Opportunities could not be loaded"
            description="Tender Radar did not return data just now. Try again in a moment."
          />
        ) : null}

        {status === "ok" ? (
          <>
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or buyer"
                aria-label="Search title or buyer"
                className="lg:max-w-sm"
              />
              <FilterGroup label="Route" value={route} options={ROUTE_FILTERS} onChange={setRoute} />
              <FilterGroup label="Stage" value={stage} options={STAGE_FILTERS} onChange={setStage} />
            </div>

            {visible.length === 0 ? (
              <EmptyState
                eyebrow="Revenue Radar"
                title="No opportunities match"
                description="Try a different search, route, or stage. Early engagement records stay visible even without a deadline."
              />
            ) : (
              <div className="surface overflow-hidden">
                <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_7.5rem_6rem_8rem_4.5rem_7.5rem] gap-3 border-b border-line px-4 py-3 md:grid">
                  {["Title", "Buyer", "Route", "Value", "Deadline", "Fit", "Stage"].map((label) => (
                    <p key={label} className={cn("text-[10px] font-black uppercase tracking-[0.18em] text-stone-400")}>
                      {label}
                    </p>
                  ))}
                </div>
                <ul>
                  {visible.map((opportunity) => (
                    <OpportunityRow
                      key={opportunity.processKey}
                      opportunity={opportunity}
                      expanded={expandedKey === opportunity.processKey}
                      onToggle={() =>
                        setExpandedKey((current) => (current === opportunity.processKey ? null : opportunity.processKey))
                      }
                    />
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

type FilterGroupProps<T extends string> = {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (value: T) => void;
};

function FilterGroup<T extends string>({ label, value, options, onChange }: FilterGroupProps<T>) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
      <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{label}</span>
      <div className="flex rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              className={
                active
                  ? "rounded-xl bg-stone-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white"
                  : "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-stone-600"
              }
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type OpportunityRowProps = {
  opportunity: RevenueOpportunity;
  expanded: boolean;
  onToggle: () => void;
};

function OpportunityRow({ opportunity, expanded, onToggle }: OpportunityRowProps) {
  const urgency = formatDeadlineUrgency(opportunity.tenderDeadline);
  const reviewLabel = formatAiReviewLabel(opportunity.aiReviewVersion);

  return (
    <li className="border-b border-line last:border-none">
      <button
        type="button"
        className="grid w-full grid-cols-1 gap-2 px-4 py-3 text-left transition-colors hover:bg-[#f6f3ec] md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_7.5rem_6rem_8rem_4.5rem_7.5rem] md:items-center md:gap-3"
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-stone-900">{displayValue(opportunity.title)}</p>
          <p className="mt-1 text-xs text-stone-400 md:hidden">{displayValue(opportunity.buyerName)}</p>
          <p className={cn("mt-1 text-[11px]", isCurrentAiReview(opportunity.aiReviewVersion) ? "text-emerald-700" : "text-amber-700")}>
            {isCurrentAiReview(opportunity.aiReviewVersion) ? "v2.5 · Current" : "Needs re-review"}
          </p>
        </div>
        <p className="hidden truncate text-sm text-stone-600 md:block">{displayValue(opportunity.buyerName)}</p>
        <div>
          <Badge tone={routeTone(opportunity.recommendedRoute)}>{formatRouteLabel(opportunity.recommendedRoute)}</Badge>
        </div>
        <p className="text-sm tabular-nums text-stone-700">{formatMoney(opportunity.valueAmount, opportunity.currency)}</p>
        <div>
          <p className="text-sm text-stone-700">{formatUkDate(opportunity.tenderDeadline)}</p>
          {urgency ? <p className="mt-0.5 text-[11px] font-medium text-amber-700">{urgency}</p> : null}
        </div>
        <p className="text-sm tabular-nums text-stone-700">{formatScore(opportunity.relevanceScore)}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-stone-600">{formatStageLabel(opportunity.commercialStage)}</p>
          <ChevronDown size={16} className={cn("shrink-0 text-stone-400 transition-transform", expanded && "rotate-180")} />
        </div>
      </button>

      {expanded ? (
        <div className="space-y-5 border-t border-line bg-[#fcfaf6] px-4 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailBlock label="Buyer Need" value={opportunity.buyerNeed} />
            <DetailBlock label="Supplier Deliverable" value={opportunity.supplierDeliverable} />
            <DetailBlock label="Why This Route" value={opportunity.reason} />
            <DetailBlock label="Recommended Next Action" value={opportunity.nextAction} />
          </div>

          <div>
            <MetaText className="mb-3">Scores</MetaText>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <ScoreCell label="Relevance" value={opportunity.relevanceScore} />
              <ScoreCell label="Direct Fit" value={opportunity.directFitScore} />
              <ScoreCell label="Partner Fit" value={opportunity.partnerFitScore} />
              <ScoreCell label="Attractiveness" value={opportunity.commercialAttractiveness} />
              <ScoreCell label="Confidence" value={opportunity.confidence} />
            </div>
          </div>

          {opportunity.recommendedRoute === "partner" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <DetailBlock
                label="Partner Needed"
                value={opportunity.needPartner == null ? null : opportunity.needPartner ? "Yes" : "No"}
              />
              <DetailBlock label="Recommended Partner Skill" value={opportunity.recommendedPartnerSkill} />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-stone-400">
            <PillText className={isCurrentAiReview(opportunity.aiReviewVersion) ? "text-emerald-700" : "text-amber-700"}>
              {isCurrentAiReview(opportunity.aiReviewVersion) ? "v2.5" : "Older"} · {reviewLabel}
            </PillText>
            <span className="text-[11px] text-stone-400">
              {displayValue(opportunity.aiReviewVersion)} · Last reviewed {formatUkDate(opportunity.aiReviewedAt)}
            </span>
          </div>
        </div>
      ) : null}
    </li>
  );
}

function DetailBlock({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <MetaText className="mb-1">{label}</MetaText>
      <p className="text-sm leading-relaxed text-stone-700">{displayValue(value)}</p>
    </div>
  );
}

function ScoreCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white px-3 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400">{label}</p>
      <p className="mt-1 text-lg tabular-nums text-stone-900">{formatScore(value)}</p>
    </div>
  );
}
