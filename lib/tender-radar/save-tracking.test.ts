import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const maybeSingle = vi.fn();
const upsert = vi.fn();
const loadRevenueOpportunityByKey = vi.fn();

vi.mock("@/lib/tender-radar/server", () => ({
  getTenderRadarClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle
        })
      }),
      upsert
    })
  })
}));

vi.mock("@/lib/tender-radar/opportunities", () => ({
  loadRevenueOpportunityByKey: (...args: unknown[]) => loadRevenueOpportunityByKey(...args)
}));

import { saveRevenueOpportunityTracking } from "@/lib/tender-radar/save-tracking";

describe("saveRevenueOpportunityTracking", () => {
  beforeEach(() => {
    maybeSingle.mockReset();
    upsert.mockReset();
    loadRevenueOpportunityByKey.mockReset();
  });

  it("upserts a tracking row by process_key and does not insert duplicates", async () => {
    maybeSingle.mockResolvedValue({ data: null, error: null });
    upsert.mockResolvedValue({ error: null });
    loadRevenueOpportunityByKey.mockResolvedValue({
      processKey: "ea-1",
      trackingStatus: "reviewing"
    });

    const first = await saveRevenueOpportunityTracking({
      processKey: "ea-1",
      status: "reviewing",
      bidValue: null,
      bidCurrency: null,
      bidRoute: null,
      partnerName: null,
      notes: null,
      outcomeValue: null
    });
    await saveRevenueOpportunityTracking({
      processKey: "ea-1",
      status: "reviewing",
      bidValue: null,
      bidCurrency: null,
      bidRoute: null,
      partnerName: null,
      notes: "again",
      outcomeValue: null
    });

    expect(first.trackingStatus).toBe("reviewing");
    expect(upsert).toHaveBeenCalledTimes(2);
    expect(upsert.mock.calls[0][1]).toEqual({ onConflict: "process_key" });
    expect(upsert.mock.calls[0][0].process_key).toBe("ea-1");
    expect(upsert.mock.calls[1][0].process_key).toBe("ea-1");
  });

  it("keeps an existing submitted_at on later edits", async () => {
    maybeSingle.mockResolvedValue({
      data: { submitted_at: "2026-08-20T10:00:00.000Z", outcome_at: null },
      error: null
    });
    upsert.mockResolvedValue({ error: null });
    loadRevenueOpportunityByKey.mockResolvedValue({
      processKey: "ea-1",
      trackingStatus: "submitted",
      submittedAt: "2026-08-20T10:00:00.000Z"
    });

    await saveRevenueOpportunityTracking({
      processKey: "ea-1",
      status: "submitted",
      bidValue: 79500,
      bidCurrency: "GBP",
      bidRoute: "direct",
      partnerName: null,
      notes: "Still submitted",
      outcomeValue: null
    });

    expect(upsert.mock.calls[0][0].submitted_at).toBe("2026-08-20T10:00:00.000Z");
  });
});
