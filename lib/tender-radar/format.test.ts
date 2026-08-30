import {
  formatAiReviewLabel,
  formatCompactAmount,
  formatDeadlineUrgency,
  formatMoney,
  formatRouteLabel,
  formatScore,
  formatStageLabel,
  formatUkDate
} from "@/lib/tender-radar/format";

describe("tender radar format", () => {
  it("formats GBP values compactly", () => {
    expect(formatMoney(79500, "GBP")).toBe("£79.5k");
    expect(formatMoney(1000000, "GBP")).toBe("£1m");
    expect(formatMoney(500, "£")).toBe("£500");
    expect(formatMoney(null, "GBP")).toBe("—");
    expect(formatMoney(40000, "EUR")).toBe("€40k");
    expect(formatMoney(25000, "USD")).toBe("$25k");
    expect(formatMoney(12000, "NOK")).toBe("NOK 12k");
    expect(formatCompactAmount(1500000)).toBe("1.5m");
  });

  it("maps route and stage labels", () => {
    expect(formatRouteLabel("direct_bid")).toBe("Bid Now");
    expect(formatRouteLabel("engage_now")).toBe("Engage Early");
    expect(formatRouteLabel("partner")).toBe("Partner");
    expect(formatRouteLabel(null)).toBe("—");
    expect(formatStageLabel("live_bid")).toBe("Live Bid");
    expect(formatStageLabel("early_engagement")).toBe("Early Engagement");
    expect(formatStageLabel(null)).toBe("—");
  });

  it("formats UK dates and urgent deadlines", () => {
    expect(formatUkDate("2026-09-04T12:00:00.000Z")).toBe("4 Sept 2026");
    expect(formatUkDate(null)).toBe("—");
    const now = new Date("2026-09-01T09:00:00.000Z");
    expect(formatDeadlineUrgency("2026-09-08T00:00:00.000Z", now)).toBe("7 days left");
    expect(formatDeadlineUrgency("2026-09-01T18:00:00.000Z", now)).toBe("Today");
    expect(formatDeadlineUrgency("2026-10-01T00:00:00.000Z", now)).toBeNull();
  });

  it("formats scores and AI review labels", () => {
    expect(formatScore(70.4)).toBe("70");
    expect(formatScore(null)).toBe("—");
    expect(formatAiReviewLabel("revenue-radar-v2.5-production")).toBe("Current");
    expect(formatAiReviewLabel("revenue-radar-v2.4-production")).toBe("Needs re-review");
    expect(formatAiReviewLabel(null)).toBe("Needs re-review");
  });
});
