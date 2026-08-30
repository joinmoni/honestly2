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
      buyerNeed: null,
      trackingStatus: null,
      noticeUrl: null,
      tenderAccessType: null,
      tenderDocuments: []
    });
  });

  it("maps a joined tender-access row onto the opportunity", () => {
    const actual = mapOpportunityRow(
      {
        process_key: "ea-soil",
        title: "Update of South East Soil Moisture model"
      },
      {
        process_key: "ea-soil",
        notice_url: "https://www.find-tender.service.gov.uk/Notice/082149-2026",
        access_type: "direct_documents",
        portal_url: null,
        documents: [
          {
            id: "A-21101",
            url: "https://www.find-tender.service.gov.uk/Notice/Attachment/A-21101",
            type: "biddingDocuments",
            format: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            description: null
          }
        ],
        submission_method_details: "Submit via the portal.\nInclude pricing.",
        electronic_submission_policy: "allowed"
      }
    );

    expect(actual).toMatchObject({
      processKey: "ea-soil",
      noticeUrl: "https://www.find-tender.service.gov.uk/Notice/082149-2026",
      tenderAccessType: "direct_documents",
      tenderPortalUrl: null,
      submissionMethodDetails: "Submit via the portal.\nInclude pricing.",
      electronicSubmissionPolicy: "allowed"
    });
    expect(actual?.tenderDocuments).toEqual([
      {
        id: "A-21101",
        url: "https://www.find-tender.service.gov.uk/Notice/Attachment/A-21101",
        type: "biddingDocuments",
        format: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        description: null
      }
    ]);
  });

  it("maps pipeline tracking and legacy fields without requiring v2.5 values", () => {
    const actual = mapOpportunityRow({
      process_key: "legacy-1",
      title: "Historic bid",
      commercial_stage: null,
      recommended_route: null,
      commercial_route: "direct",
      ai_review_version: null,
      summary: "Buyer needs a reporting tool.",
      why_we_can_deliver: "We already deliver this.",
      ai_score: 62,
      tracking_status: "submitted",
      submitted_at: "2026-08-30T00:00:00.000Z",
      bid_value: "79500",
      bid_currency: "GBP",
      bid_route: "direct",
      notes: null,
      outcome_value: null
    });

    expect(actual).toMatchObject({
      processKey: "legacy-1",
      recommendedRoute: "direct",
      buyerNeed: "Buyer needs a reporting tool.",
      reason: "We already deliver this.",
      relevanceScore: 62,
      trackingStatus: "submitted",
      submittedAt: "2026-08-30T00:00:00.000Z",
      bidValue: 79500,
      bidRoute: "direct"
    });
  });

  it("returns null without a process key", () => {
    expect(mapOpportunityRow({ title: "Missing key" })).toBeNull();
  });
});
