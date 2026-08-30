import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RevenueRadarScreen } from "@/components/revenue-radar/RevenueRadarScreen";
import type { RevenueOpportunity } from "@/lib/tender-radar/types";

function opportunity(overrides: Partial<RevenueOpportunity> = {}): RevenueOpportunity {
  return {
    processKey: overrides.processKey ?? "ea-1",
    title: overrides.title ?? "Tool for assessing pollutant risks from landspreading",
    buyerName: overrides.buyerName ?? "Environment Agency",
    commercialStage: overrides.commercialStage ?? "live_bid",
    recommendedRoute: overrides.recommendedRoute ?? "partner",
    relevanceScore: overrides.relevanceScore ?? 70,
    directFitScore: overrides.directFitScore ?? 40,
    partnerFitScore: overrides.partnerFitScore ?? 85,
    commercialAttractiveness: overrides.commercialAttractiveness ?? 60,
    confidence: overrides.confidence ?? 75,
    buyerNeed: overrides.buyerNeed ?? "Assess pollutant risk from landspreading.",
    supplierDeliverable: overrides.supplierDeliverable ?? "A risk-assessment tool.",
    reason: overrides.reason ?? "Strong partner fit, weaker direct delivery.",
    nextAction: overrides.nextAction ?? "Identify a technical partner.",
    needPartner: overrides.needPartner ?? true,
    recommendedPartnerSkill: overrides.recommendedPartnerSkill ?? "Environmental modelling",
    valueAmount: overrides.valueAmount ?? 40000,
    currency: overrides.currency ?? "GBP",
    tenderDeadline: overrides.tenderDeadline ?? "2026-09-20T00:00:00.000Z",
    aiReviewVersion: overrides.aiReviewVersion ?? "revenue-radar-v2.5-production",
    aiReviewedAt: overrides.aiReviewedAt ?? "2026-08-28T00:00:00.000Z",
    analysedAt: overrides.analysedAt ?? null,
    updatedAt: overrides.updatedAt ?? null
  };
}

describe("RevenueRadarScreen", () => {
  it("renders the known Environment Agency opportunity and expands detail", async () => {
    const user = userEvent.setup();
    render(<RevenueRadarScreen status="ok" opportunities={[opportunity()]} />);

    expect(screen.getByRole("heading", { name: "Revenue Radar" })).toBeInTheDocument();
    expect(screen.getByText("Tool for assessing pollutant risks from landspreading")).toBeInTheDocument();
    expect(screen.getAllByText("Environment Agency").length).toBeGreaterThan(0);
    expect(screen.getByText("£40k")).toBeInTheDocument();
    expect(screen.getAllByText("Partner").length).toBeGreaterThan(0);
    expect(screen.getByText(/Current/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tool for assessing pollutant risks/i }));

    expect(screen.getByText("Buyer Need")).toBeInTheDocument();
    expect(screen.getByText("Assess pollutant risk from landspreading.")).toBeInTheDocument();
    expect(screen.getByText("Recommended Partner Skill")).toBeInTheDocument();
    expect(screen.getByText("Environmental modelling")).toBeInTheDocument();
  });

  it("filters by search and shows empty and error states", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity(),
          opportunity({
            processKey: "nhs-1",
            title: "Ward furniture",
            buyerName: "NHS Trust",
            recommendedRoute: "watch",
            commercialStage: "early_engagement",
            valueAmount: null,
            buyerNeed: null
          })
        ]}
      />
    );

    await user.type(screen.getByLabelText("Search title or buyer"), "nhs");
    expect(screen.getByText("Ward furniture")).toBeInTheDocument();
    expect(screen.queryByText("Tool for assessing pollutant risks from landspreading")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter route Bid Now" }));
    expect(screen.getByText("No opportunities match")).toBeInTheDocument();

    rerender(<RevenueRadarScreen status="not_configured" opportunities={[]} />);
    expect(screen.getByText("Tender Radar is not connected")).toBeInTheDocument();

    rerender(<RevenueRadarScreen status="query_failed" opportunities={[]} />);
    expect(screen.getByText("Opportunities could not be loaded")).toBeInTheDocument();
  });

  it("marks older AI reviews and missing values safely", async () => {
    const user = userEvent.setup();
    render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity({
            processKey: "old-1",
            title: "Older opportunity",
            buyerName: null,
            valueAmount: null,
            tenderDeadline: null,
            relevanceScore: null,
            aiReviewVersion: "revenue-radar-v2.4-production",
            recommendedRoute: "watch",
            commercialStage: "early_engagement"
          })
        ]}
      />
    );

    expect(screen.getByText("Needs re-review")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /older opportunity/i }));
    expect(screen.getByText("Why This Route")).toBeInTheDocument();
    expect(screen.getByText("Buyer Need")).toBeInTheDocument();
  });

  it("lets summary chips filter the list", async () => {
    const user = userEvent.setup();
    render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity(),
          opportunity({
            processKey: "watch-1",
            title: "Watch this later",
            recommendedRoute: "watch",
            commercialStage: "early_engagement"
          })
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: "Show Watch opportunities" }));
    expect(screen.getByText("Watch this later")).toBeInTheDocument();
    expect(screen.queryByText("Tool for assessing pollutant risks from landspreading")).not.toBeInTheDocument();
    expect(screen.getByText("1 opportunity")).toBeInTheDocument();
  });
});
