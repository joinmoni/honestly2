import {
  filterOpportunities,
  paginateItems,
  prepareMergedOpportunityList,
  prepareOpportunityList,
  selectCurrentOpportunities,
  sortOpportunities
} from "@/lib/tender-radar/select";
import { EMPTY_TRACKING, type RevenueOpportunity } from "@/lib/tender-radar/types";

function opportunity(overrides: Partial<RevenueOpportunity> = {}): RevenueOpportunity {
  return {
    processKey: overrides.processKey ?? "key-1",
    title: overrides.title ?? "Opportunity",
    buyerName: overrides.buyerName ?? "Buyer",
    commercialStage: overrides.commercialStage ?? "early_engagement",
    recommendedRoute: overrides.recommendedRoute ?? "watch",
    relevanceScore: overrides.relevanceScore ?? 50,
    directFitScore: overrides.directFitScore ?? null,
    partnerFitScore: overrides.partnerFitScore ?? null,
    commercialAttractiveness: overrides.commercialAttractiveness ?? null,
    confidence: overrides.confidence ?? null,
    buyerNeed: overrides.buyerNeed ?? null,
    supplierDeliverable: overrides.supplierDeliverable ?? null,
    reason: overrides.reason ?? null,
    nextAction: overrides.nextAction ?? null,
    needPartner: overrides.needPartner ?? null,
    recommendedPartnerSkill: overrides.recommendedPartnerSkill ?? null,
    valueAmount: overrides.valueAmount ?? null,
    currency: overrides.currency ?? "GBP",
    tenderDeadline: overrides.tenderDeadline ?? null,
    aiReviewVersion: overrides.aiReviewVersion ?? null,
    aiReviewedAt: overrides.aiReviewedAt ?? null,
    analysedAt: overrides.analysedAt ?? null,
    updatedAt: overrides.updatedAt ?? null,
    ...EMPTY_TRACKING,
    ...overrides
  };
}

describe("tender radar select", () => {
  const now = new Date("2026-08-30T12:00:00.000Z");

  it("keeps early engagement records without deadlines and drops expired live bids", () => {
    const input = [
      opportunity({ processKey: "early", recommendedRoute: "engage_now", commercialStage: "early_engagement", tenderDeadline: null }),
      opportunity({
        processKey: "expired",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        tenderDeadline: "2026-08-01T00:00:00.000Z"
      }),
      opportunity({
        processKey: "live",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        tenderDeadline: "2026-09-10T00:00:00.000Z"
      }),
      opportunity({ processKey: "ignore", recommendedRoute: "ignore" })
    ];

    const actual = selectCurrentOpportunities(input, now).map((item) => item.processKey);

    expect(actual).toEqual(["early", "live"]);
  });

  it("orders by route, then deadline, then relevance", () => {
    const input = [
      opportunity({ processKey: "watch-high", recommendedRoute: "watch", relevanceScore: 90, tenderDeadline: null }),
      opportunity({
        processKey: "bid-later",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        relevanceScore: 99,
        tenderDeadline: "2026-10-01T00:00:00.000Z"
      }),
      opportunity({
        processKey: "bid-soon",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        relevanceScore: 40,
        tenderDeadline: "2026-09-05T00:00:00.000Z"
      }),
      opportunity({ processKey: "partner", recommendedRoute: "partner", relevanceScore: 80 })
    ];

    const actual = sortOpportunities(input).map((item) => item.processKey);

    expect(actual).toEqual(["bid-soon", "bid-later", "partner", "watch-high"]);
  });

  it("filters by search, route and stage", () => {
    const input = [
      opportunity({
        processKey: "ea",
        title: "Tool for assessing pollutant risks from landspreading",
        buyerName: "Environment Agency",
        recommendedRoute: "partner",
        commercialStage: "live_bid"
      }),
      opportunity({
        processKey: "nhs",
        title: "Ward furniture",
        buyerName: "NHS Trust",
        recommendedRoute: "watch",
        commercialStage: "early_engagement"
      })
    ];

    expect(filterOpportunities(input, { query: "environment", route: "all", stage: "all" }).map((item) => item.processKey)).toEqual([
      "ea"
    ]);
    expect(filterOpportunities(input, { query: "", route: "watch", stage: "all" }).map((item) => item.processKey)).toEqual(["nhs"]);
    expect(filterOpportunities(input, { query: "", route: "all", stage: "early_engagement" }).map((item) => item.processKey)).toEqual([
      "nhs"
    ]);
  });

  it("caps the prepared list", () => {
    const input = Array.from({ length: 210 }, (_, index) =>
      opportunity({ processKey: `key-${index}`, recommendedRoute: "watch", relevanceScore: index })
    );

    expect(prepareOpportunityList(input, now)).toHaveLength(200);
  });

  it("keeps a tracked submitted opportunity after its tender deadline", () => {
    const input = [
      opportunity({
        processKey: "expired-submitted",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        tenderDeadline: "2026-08-01T00:00:00.000Z",
        trackingStatus: "submitted",
        submittedAt: "2026-07-20T00:00:00.000Z"
      }),
      opportunity({
        processKey: "expired-untracked",
        recommendedRoute: "direct_bid",
        commercialStage: "live_bid",
        tenderDeadline: "2026-08-01T00:00:00.000Z"
      })
    ];

    expect(prepareMergedOpportunityList(input, now).map((item) => item.processKey)).toEqual(["expired-submitted"]);
    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", now }).map((item) => item.processKey)
    ).toEqual(["expired-submitted"]);
  });

  it("filters by my status including submitted, won, lost and passed", () => {
    const input = [
      opportunity({ processKey: "new-one", recommendedRoute: "watch" }),
      opportunity({ processKey: "submitted-one", trackingStatus: "submitted", recommendedRoute: "direct_bid" }),
      opportunity({ processKey: "won-one", trackingStatus: "won", recommendedRoute: "partner" }),
      opportunity({ processKey: "lost-one", trackingStatus: "lost", recommendedRoute: "watch" }),
      opportunity({ processKey: "passed-one", trackingStatus: "passed", recommendedRoute: "watch" })
    ];

    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", status: "submitted", now }).map(
        (item) => item.processKey
      )
    ).toEqual(["submitted-one"]);
    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", status: "won", now }).map((item) => item.processKey)
    ).toEqual(["won-one"]);
    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", status: "lost", now }).map((item) => item.processKey)
    ).toEqual(["lost-one"]);
    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", status: "passed", now }).map((item) => item.processKey)
    ).toEqual(["passed-one"]);
    expect(
      filterOpportunities(input, { query: "", route: "all", stage: "all", queue: "active", now }).map((item) => item.processKey)
    ).toEqual(["new-one", "submitted-one"]);
  });

  it("keeps tracked pipeline rows that are missing modern radar fields", () => {
    const input = [
      opportunity({
        processKey: "legacy-submitted",
        recommendedRoute: null,
        commercialStage: null,
        aiReviewVersion: null,
        trackingStatus: "submitted"
      })
    ];

    expect(prepareMergedOpportunityList(input, now).map((item) => item.processKey)).toEqual(["legacy-submitted"]);
  });

  it("pages a list and clamps an out-of-range page", () => {
    const input = Array.from({ length: 25 }, (_, index) => `item-${index}`);

    expect(paginateItems(input, 1, 20)).toMatchObject({
      page: 1,
      totalPages: 2,
      start: 1,
      end: 20,
      items: input.slice(0, 20)
    });
    expect(paginateItems(input, 2, 20)).toMatchObject({
      page: 2,
      totalPages: 2,
      start: 21,
      end: 25,
      items: input.slice(20)
    });
    expect(paginateItems(input, 9, 20).page).toBe(2);
    expect(paginateItems([], 3, 20)).toMatchObject({ page: 1, totalPages: 1, start: 0, end: 0, items: [] });
  });
});
