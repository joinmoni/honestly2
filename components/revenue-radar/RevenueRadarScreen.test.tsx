import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { RevenueRadarScreen } from "@/components/revenue-radar/RevenueRadarScreen";
import { EMPTY_TRACKING, type RevenueOpportunity } from "@/lib/tender-radar/types";

const saveRevenueRadarTracking = vi.fn();

vi.mock("@/lib/revenue-radar-tracking.client", () => ({
  saveRevenueRadarTracking: (...args: unknown[]) => saveRevenueRadarTracking(...args)
}));

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
    updatedAt: overrides.updatedAt ?? null,
    ...EMPTY_TRACKING,
    ...overrides
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
    expect(screen.getAllByText("New").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /tool for assessing pollutant risks/i }));

    expect(screen.getByText("Buyer Need")).toBeInTheDocument();
    expect(screen.getByText("Assess pollutant risk from landspreading.")).toBeInTheDocument();
    expect(screen.getByText("Recommended Partner Skill")).toBeInTheDocument();
    expect(screen.getByText("Environmental modelling")).toBeInTheDocument();
    expect(screen.getByText("Our Activity")).toBeInTheDocument();
    expect(screen.getByTestId("opportunity-detail-panel")).toHaveClass("md:overflow-x-hidden");
  });

  it("shows the full analysis text when a row is expanded", async () => {
    const user = userEvent.setup();
    render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity({
            buyerNeed:
              "An online system to manage the council's traded services to schools: to administer, track and invoice traded services provided to maintained schools and academies."
          })
        ]}
      />
    );

    await user.click(screen.getByRole("button", { name: /tool for assessing pollutant risks/i }));
    expect(
      screen.getByText(
        "An online system to manage the council's traded services to schools: to administer, track and invoice traded services provided to maintained schools and academies."
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Status").closest("div.grid")).toHaveClass("max-w-2xl");
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
            commercialStage: "early_engagement",
            trackingStatus: null,
            bidValue: null,
            bidRoute: null,
            notes: null
          })
        ]}
      />
    );

    expect(screen.getByText("Needs re-review")).toBeInTheDocument();
    expect(screen.getAllByText("New").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /older opportunity/i }));
    expect(screen.getByText("Why This Route")).toBeInTheDocument();
    expect(screen.getByText("Buyer Need")).toBeInTheDocument();
    expect(screen.getByText("Our Activity")).toBeInTheDocument();
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

  it("filters by my status and keeps submitted, won, lost and passed available", async () => {
    const user = userEvent.setup();
    render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity(),
          opportunity({
            processKey: "submitted-1",
            title: "Submitted bid",
            trackingStatus: "submitted",
            submittedAt: "2026-08-30T00:00:00.000Z",
            bidValue: 79500,
            bidCurrency: "GBP",
            bidRoute: "direct"
          }),
          opportunity({ processKey: "won-1", title: "Won bid", trackingStatus: "won", recommendedRoute: "watch" }),
          opportunity({ processKey: "lost-1", title: "Lost bid", trackingStatus: "lost", recommendedRoute: "watch" }),
          opportunity({ processKey: "passed-1", title: "Passed bid", trackingStatus: "passed", recommendedRoute: "watch" })
        ]}
      />
    );

    expect(screen.getByText("Submitted bid")).toBeInTheDocument();
    expect(screen.queryByText("Won bid")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter my status Submitted" }));
    expect(screen.getByText("Submitted bid")).toBeInTheDocument();
    expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Filter my status Won" }));
    expect(screen.getByText("Won bid")).toBeInTheDocument();
    expect(screen.queryByText("Submitted bid")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter my status Lost" }));
    expect(screen.getByText("Lost bid")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Filter my status Passed" }));
    expect(screen.getByText("Passed bid")).toBeInTheDocument();
  });

  it("keeps an expired submitted opportunity in the default queue", () => {
    render(
      <RevenueRadarScreen
        status="ok"
        opportunities={[
          opportunity({
            processKey: "expired-submitted",
            title: "Expired submitted bid",
            recommendedRoute: "direct_bid",
            commercialStage: "live_bid",
            tenderDeadline: "2020-01-01T00:00:00.000Z",
            trackingStatus: "submitted",
            submittedAt: "2019-12-01T00:00:00.000Z",
            bidValue: 79500,
            bidCurrency: "GBP",
            bidRoute: "direct"
          })
        ]}
      />
    );

    expect(screen.getByText("Expired submitted bid")).toBeInTheDocument();
    expect(screen.getAllByText("Submitted").length).toBeGreaterThan(0);
  });

  it("saves activity without a page reload and shows the new status", async () => {
    const user = userEvent.setup();
    saveRevenueRadarTracking.mockResolvedValue(
      opportunity({
        trackingStatus: "reviewing",
        trackingUpdatedAt: "2026-08-30T12:00:00.000Z"
      })
    );

    render(<RevenueRadarScreen status="ok" opportunities={[opportunity()]} canEdit />);

    await user.click(screen.getByRole("button", { name: /tool for assessing pollutant risks/i }));
    await user.selectOptions(screen.getByLabelText("Status"), "reviewing");
    await user.click(screen.getByRole("button", { name: "Save activity" }));

    expect(saveRevenueRadarTracking).toHaveBeenCalledWith(
      expect.objectContaining({
        processKey: "ea-1",
        status: "reviewing"
      })
    );
    expect(await screen.findByText("Saved")).toBeInTheDocument();
    expect(screen.getAllByText("Reviewing").length).toBeGreaterThan(0);
  });

  it("lets the user drag a table header to widen a column", () => {
    render(<RevenueRadarScreen status="ok" opportunities={[opportunity()]} />);

    const header = screen.getByTestId("opportunity-table-header");
    expect(header.style.gridTemplateColumns.startsWith("280px")).toBe(true);

    fireEvent.pointerDown(screen.getByRole("separator", { name: "Resize Title column", hidden: true }), { clientX: 300 });
    fireEvent.pointerMove(window, { clientX: 420 });
    fireEvent.pointerUp(window);

    expect(header.style.gridTemplateColumns.startsWith("400px")).toBe(true);
  });

  it("pages the opportunity list and resets to the first page when filters change", async () => {
    const user = userEvent.setup();
    const opportunities = Array.from({ length: 21 }, (_, index) =>
      opportunity({
        processKey: `page-${index}`,
        title: `Opportunity ${index + 1}`,
        recommendedRoute: "watch",
        commercialStage: "early_engagement"
      })
    );

    render(<RevenueRadarScreen status="ok" opportunities={opportunities} />);

    expect(screen.getByText("Opportunity 1")).toBeInTheDocument();
    expect(screen.queryByText("Opportunity 21")).not.toBeInTheDocument();
    expect(screen.getByText("1–20 of 21 opportunities")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Opportunity 21")).toBeInTheDocument();
    expect(screen.queryByText("Opportunity 1")).not.toBeInTheDocument();
    expect(screen.getByText("21–21 of 21 opportunities")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show Watch opportunities" }));
    expect(screen.getByText("Opportunity 1")).toBeInTheDocument();
    expect(screen.queryByText("Opportunity 21")).not.toBeInTheDocument();
  });
});
