import { filterOpportunities, prepareOpportunityList, selectCurrentOpportunities, sortOpportunities } from "@/lib/tender-radar/select";
import type { RevenueOpportunity } from "@/lib/tender-radar/types";

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
    updatedAt: overrides.updatedAt ?? null
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
});
