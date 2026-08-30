import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const loadRevenueOpportunities = vi.fn();

vi.mock("@/lib/tender-radar/opportunities", () => ({
  loadRevenueOpportunities: () => loadRevenueOpportunities()
}));

import { GET } from "@/app/api/revenue-radar/route";

describe("GET /api/revenue-radar", () => {
  beforeEach(() => {
    loadRevenueOpportunities.mockReset();
  });

  it("returns the same opportunity list used by the homepage", async () => {
    const opportunities = [
      {
        processKey: "ea-1",
        title: "Tool for assessing pollutant risks from landspreading",
        trackingStatus: null
      }
    ];
    loadRevenueOpportunities.mockResolvedValue({ status: "ok", opportunities });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ status: "ok", opportunities });
  });

  it("returns 503 when Tender Radar is not configured", async () => {
    loadRevenueOpportunities.mockResolvedValue({ status: "not_configured" });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.status).toBe("not_configured");
    expect(payload.opportunities).toEqual([]);
  });

  it("returns 502 when the Tender Radar query fails", async () => {
    loadRevenueOpportunities.mockResolvedValue({ status: "query_failed" });

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.status).toBe("query_failed");
    expect(payload.opportunities).toEqual([]);
  });
});
