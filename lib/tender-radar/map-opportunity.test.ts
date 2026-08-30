import { mapOpportunityRow } from "@/lib/tender-radar/map-opportunity";

describe("mapOpportunityRow", () => {
  it("maps a Tender Radar row and tolerates nulls", () => {
    const actual = mapOpportunityRow({
      process_key: "ea-landspreading",
      title: "Tool for assessing pollutant risks from landspreading",
      buyer_name: "Environment Agency",
      commercial_stage: "live_bid",
      recommended_route: "partner",
      relevance_score: "70",
      ai_confidence: 85,
      ai_reason: "Strong partner fit.",
      partner_fit_score: 85,
      value_amount: 40000,
      currency: "GBP",
      need_partner: true,
      buyer_need: null
    });

    expect(actual).toMatchObject({
      processKey: "ea-landspreading",
      title: "Tool for assessing pollutant risks from landspreading",
      buyerName: "Environment Agency",
      commercialStage: "live_bid",
      recommendedRoute: "partner",
      relevanceScore: 70,
      partnerFitScore: 85,
      confidence: 85,
      reason: "Strong partner fit.",
      valueAmount: 40000,
      needPartner: true,
      buyerNeed: null
    });
  });

  it("returns null without a process key", () => {
    expect(mapOpportunityRow({ title: "Missing key" })).toBeNull();
  });
});
