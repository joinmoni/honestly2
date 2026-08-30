"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Radar } from "lucide-react";

import { OpportunityActivityForm } from "@/components/revenue-radar/OpportunityActivityForm";
import { Pagination } from "@/components/ui/Pagination";
import {
  OPPORTUNITY_TABLE_COLUMNS,
  getDefaultOpportunityTableWidths,
  getOpportunityTableGridStyle,
  resizeOpportunityTableColumn,
  type OpportunityTableColumnId,
  type OpportunityTableWidths
} from "@/components/revenue-radar/opportunity-table-layout";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { BodyText, BrandWordmark, MetaText, PageTitle, PillText } from "@/components/ui/Typography";
import {
  displayValue,
  formatAiReviewLabel,
  formatDeadlineUrgency,
  formatMoney,
  formatRouteLabel,
  formatScore,
  formatStageLabel,
  formatTrackingStatusLabel,
  formatUkDate,
  isCurrentAiReview,
  trackingStatusTone
} from "@/lib/tender-radar/format";
import {
  countByRoute,
  countByTrackingStatus,
  filterOpportunities,
  paginateItems,
  selectCurrentOpportunities
} from "@/lib/tender-radar/select";
import {
  PIPELINE_SUMMARY_STATUSES,
  ROUTE_LABELS,
  TRACKING_STATUS_LABELS,
  TRACKING_STATUSES,
  getEffectiveTrackingStatus,
  type ActionableRoute,
  type QueueFilter,
  type RevenueOpportunity,
  type RouteFilter,
  type StageFilter,
  type TrackingStatusFilter
} from "@/lib/tender-radar/types";
import { cn } from "@/lib/utils";

export type RevenueRadarScreenStatus = "ok" | "not_configured" | "query_failed";

type RevenueRadarScreenProps = {
  status: RevenueRadarScreenStatus;
  opportunities: RevenueOpportunity[];
  canEdit?: boolean;
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

const STATUS_FILTERS: Array<{ id: TrackingStatusFilter; label: string }> = [
  { id: "all", label: "All" },
  ...TRACKING_STATUSES.map((id) => ({ id, label: TRACKING_STATUS_LABELS[id] }))
];

const SUMMARY_ROUTES: ActionableRoute[] = ["direct_bid", "engage_now", "partner", "watch"];

function routeTone(route: string | null): "success" | "warning" | "neutral" {
  if (route === "direct_bid") return "success";
  if (route === "engage_now") return "warning";
  return "neutral";
}

function TrackingStatusBadge({ opportunity }: { opportunity: RevenueOpportunity }) {
  const status = getEffectiveTrackingStatus(opportunity);
  return (
    <Badge
      tone={trackingStatusTone(status)}
      className={status === "submitted" ? "font-black uppercase tracking-[0.14em]" : undefined}
    >
      {formatTrackingStatusLabel(status)}
    </Badge>
  );
}

export function RevenueRadarScreen({ status, opportunities, canEdit = false }: RevenueRadarScreenProps) {
  const [items, setItems] = useState(opportunities);
  const [query, setQuery] = useState("");
  const [route, setRoute] = useState<RouteFilter>("all");
  const [stage, setStage] = useState<StageFilter>("all");
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatusFilter>("all");
  const [queue, setQueue] = useState<QueueFilter>("active");
  const [paging, setPaging] = useState({ filterKey: "", page: 1 });
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<OpportunityTableWidths>(getDefaultOpportunityTableWidths);
  const [isResizingColumn, setIsResizingColumn] = useState(false);
  const columnDrag = useRef<{ columnId: OpportunityTableColumnId; startX: number; startWidth: number } | null>(null);
  const tableGridStyle = getOpportunityTableGridStyle(columnWidths);
  const radarCounts = useMemo(() => countByRoute(selectCurrentOpportunities(items)), [items]);
  const pipelineCounts = useMemo(() => countByTrackingStatus(items), [items]);
  const visible = useMemo(
    () => filterOpportunities(items, { query, route, stage, status: trackingStatus, queue }),
    [items, query, route, stage, trackingStatus, queue]
  );
  const filterKey = `${query}|${route}|${stage}|${trackingStatus}|${queue}`;
  const page = paging.filterKey === filterKey ? paging.page : 1;
  const paged = useMemo(() => paginateItems(visible, page), [visible, page]);

  function changePage(nextPage: number) {
    setPaging({ filterKey, page: nextPage });
    setExpandedKey(null);
  }

  function replaceOpportunity(updated: RevenueOpportunity) {
    setItems((current) => current.map((item) => (item.processKey === updated.processKey ? updated : item)));
  }

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const drag = columnDrag.current;
      if (!drag) return;
      event.preventDefault();
      setColumnWidths((current) =>
        resizeOpportunityTableColumn(current, drag.columnId, drag.startWidth + event.clientX - drag.startX)
      );
    }
    function handlePointerUp() {
      columnDrag.current = null;
      setIsResizingColumn(false);
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  useEffect(() => {
    if (!isResizingColumn) return;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizingColumn]);

  function startColumnResize(columnId: OpportunityTableColumnId, clientX: number) {
    columnDrag.current = { columnId, startX: clientX, startWidth: columnWidths[columnId] };
    setIsResizingColumn(true);
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <header className="sticky top-0 z-[120] border-b border-stone-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-5">
          <Link href="/" className="min-w-0 shrink">
            <BrandWordmark className="text-[1.75rem] md:text-4xl">
              honestly
              <span className="text-amber-600">.</span>
            </BrandWordmark>
          </Link>
          <span className="ui-meta shrink-0 text-stone-400">Internal</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 md:px-8 md:py-12">
        <header className="mb-6 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-stone-400 md:mb-3">
              <Radar size={14} strokeWidth={2.25} />
              <MetaText>Internal</MetaText>
            </div>
            <PageTitle className="mb-2 text-[2rem] leading-[1.05] md:text-5xl">Revenue Radar</PageTitle>
            <BodyText className="max-w-xl text-sm md:text-base">
              Public-sector opportunities identified and reviewed by Tender Radar.
            </BodyText>
          </div>
          {status === "ok" ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {SUMMARY_ROUTES.map((id) => {
                  const active = route === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      aria-label={`Show ${ROUTE_LABELS[id]} opportunities`}
                      className={cn(
                        "inline-flex min-h-11 items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-xs sm:min-h-0 sm:justify-center sm:rounded-full sm:py-1.5",
                        active ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-600"
                      )}
                      onClick={() => setRoute((current) => (current === id ? "all" : id))}
                    >
                      <span className={cn("font-medium", active ? "text-white" : "text-stone-900")}>{ROUTE_LABELS[id]}</span>
                      <span className={cn("tabular-nums", active ? "text-white/70" : "text-stone-400")}>{radarCounts[id]}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-500">
                {PIPELINE_SUMMARY_STATUSES.map((id) => {
                  const active = trackingStatus === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={active}
                      aria-label={`Show ${TRACKING_STATUS_LABELS[id]} opportunities`}
                      className={cn("inline-flex items-center gap-1.5", active ? "text-stone-900" : "text-stone-500")}
                      onClick={() => setTrackingStatus((current) => (current === id ? "all" : id))}
                    >
                      <span>{TRACKING_STATUS_LABELS[id]}</span>
                      <span className="tabular-nums text-stone-400">{pipelineCounts[id]}</span>
                    </button>
                  );
                })}
              </div>
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
            <div className="sticky top-[3.35rem] z-40 -mx-4 mb-4 space-y-3 border-b border-stone-100 bg-[#F9F8F6]/95 px-4 py-3 backdrop-blur-md md:static md:z-auto md:mx-0 md:mb-6 md:space-y-3 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title or buyer"
                aria-label="Search title or buyer"
                className="h-12 text-base md:h-11 md:max-w-sm md:text-sm"
              />
              <FilterGroup label="Route" value={route} options={ROUTE_FILTERS} onChange={setRoute} />
              <FilterGroup label="Stage" value={stage} options={STAGE_FILTERS} onChange={setStage} />
              <FilterGroup label="My Status" value={trackingStatus} options={STATUS_FILTERS} onChange={setTrackingStatus} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-500 md:text-sm">
                  {paged.totalPages > 1
                    ? `${paged.start}–${paged.end} of ${visible.length} opportunities`
                    : `${visible.length} ${visible.length === 1 ? "opportunity" : "opportunities"}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Queue</span>
                  {(["active", "all"] as QueueFilter[]).map((id) => {
                    const active = queue === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={active}
                        aria-label={`Show ${id} queue`}
                        className={cn(
                          "inline-flex min-h-9 items-center rounded-full px-3 text-[11px] font-bold uppercase tracking-widest",
                          active ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-500"
                        )}
                        onClick={() => setQueue(id)}
                      >
                        {id === "active" ? "Active" : "All"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <EmptyState
                eyebrow="Revenue Radar"
                title="No opportunities match"
                description="Try a different search, route, or stage. Early engagement records stay visible even without a deadline."
              />
            ) : (
              <>
              <div
                className={cn(
                  "space-y-3 md:space-y-0 md:overflow-x-auto md:rounded-xl2 md:border md:border-line md:bg-card md:shadow-soft",
                  isResizingColumn && "cursor-col-resize select-none"
                )}
              >
                <div className="md:min-w-max">
                  <div
                    className="hidden gap-3 border-b border-line px-4 py-3 md:grid"
                    style={tableGridStyle}
                    data-testid="opportunity-table-header"
                  >
                    {OPPORTUNITY_TABLE_COLUMNS.map((column) => (
                      <div key={column.id} className="relative min-w-0 pr-2">
                        <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">
                          {column.label}
                        </p>
                        <span
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={`Resize ${column.label} column`}
                          className="absolute -right-1.5 top-0 z-10 h-full w-3 cursor-col-resize after:absolute after:right-[5px] after:top-0 after:h-full after:w-px after:bg-transparent hover:after:bg-stone-300"
                          onPointerDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            startColumnResize(column.id, event.clientX);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <ul className="space-y-3 md:space-y-0">
                    {paged.items.map((opportunity) => (
                      <OpportunityItem
                        key={opportunity.processKey}
                        opportunity={opportunity}
                        expanded={expandedKey === opportunity.processKey}
                        canEdit={canEdit}
                        tableGridStyle={tableGridStyle}
                        onSaved={replaceOpportunity}
                        onToggle={() =>
                          setExpandedKey((current) => (current === opportunity.processKey ? null : opportunity.processKey))
                        }
                      />
                    ))}
                  </ul>
                </div>
              </div>
              {paged.totalPages > 1 ? (
                <div className="mt-4">
                  <Pagination
                    page={paged.page}
                    totalPages={paged.totalPages}
                    onPageChange={changePage}
                  />
                </div>
              ) : null}
              </>
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
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              aria-label={`Filter ${label.toLowerCase()} ${option.label}`}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-xs font-bold uppercase tracking-widest sm:min-h-9",
                active ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-500"
              )}
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

type OpportunityItemProps = {
  opportunity: RevenueOpportunity;
  expanded: boolean;
  canEdit: boolean;
  tableGridStyle: { gridTemplateColumns: string; minWidth: number };
  onToggle: () => void;
  onSaved: (opportunity: RevenueOpportunity) => void;
};

function OpportunityItem({ opportunity, expanded, canEdit, tableGridStyle, onToggle, onSaved }: OpportunityItemProps) {
  const urgency = formatDeadlineUrgency(opportunity.tenderDeadline);
  const reviewLabel = formatAiReviewLabel(opportunity.aiReviewVersion);
  const title = displayValue(opportunity.title);

  return (
    <li className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:overflow-visible md:rounded-none md:border-0 md:border-b md:border-line md:shadow-none md:last:border-none">
      <button
        type="button"
        className="w-full p-4 text-left transition-colors hover:bg-[#f6f3ec] md:grid md:items-center md:gap-3 md:px-4 md:py-3"
        style={tableGridStyle}
        aria-expanded={expanded}
        onClick={onToggle}
      >
        <div className="min-w-0">
          <div className="mb-2 flex items-start justify-between gap-3 md:hidden">
            <div className="flex flex-wrap gap-2">
              <Badge tone={routeTone(opportunity.recommendedRoute)}>{formatRouteLabel(opportunity.recommendedRoute)}</Badge>
              <TrackingStatusBadge opportunity={opportunity} />
            </div>
            <ChevronDown size={18} className={cn("mt-0.5 shrink-0 text-stone-400 transition-transform", expanded && "rotate-180")} />
          </div>
          <p className="text-base font-medium leading-snug text-stone-900 md:truncate md:text-sm" title={title}>
            {title}
          </p>
          <p className="mt-1 text-sm text-stone-500 md:hidden">{displayValue(opportunity.buyerName)}</p>
          <p className={cn("mt-1 text-[11px]", isCurrentAiReview(opportunity.aiReviewVersion) ? "text-emerald-700" : "text-amber-700")}>
            {isCurrentAiReview(opportunity.aiReviewVersion) ? "v2.5 · Current" : "Needs re-review"}
          </p>
        </div>
        <p className="hidden truncate text-sm text-stone-600 md:block" title={displayValue(opportunity.buyerName)}>
          {displayValue(opportunity.buyerName)}
        </p>
        <div className="hidden md:block">
          <Badge tone={routeTone(opportunity.recommendedRoute)}>{formatRouteLabel(opportunity.recommendedRoute)}</Badge>
        </div>
        <div className="hidden md:block">
          <TrackingStatusBadge opportunity={opportunity} />
        </div>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-sm md:mt-0 md:contents">
          <div className="md:contents">
            <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400 md:hidden">Value</dt>
            <dd className="tabular-nums text-stone-800">{formatMoney(opportunity.valueAmount, opportunity.currency)}</dd>
          </div>
          <div className="md:contents">
            <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400 md:hidden">Deadline</dt>
            <dd>
              <p className="text-stone-800">{formatUkDate(opportunity.tenderDeadline)}</p>
              {urgency ? <p className="mt-0.5 text-[11px] font-medium text-amber-700">{urgency}</p> : null}
            </dd>
          </div>
          <div className="md:contents">
            <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-stone-400 md:hidden">Fit</dt>
            <dd className="tabular-nums text-stone-800">{formatScore(opportunity.relevanceScore)}</dd>
          </div>
        </dl>
        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-stone-600 md:mt-0">
          <p>{formatStageLabel(opportunity.commercialStage)}</p>
          <ChevronDown size={16} className={cn("hidden shrink-0 text-stone-400 transition-transform md:block", expanded && "rotate-180")} />
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
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
          <OpportunityActivityForm
            key={opportunity.processKey}
            opportunity={opportunity}
            canEdit={canEdit}
            onSaved={onSaved}
          />
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
