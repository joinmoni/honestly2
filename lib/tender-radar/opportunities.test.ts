import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const isTenderRadarConfigured = vi.fn();
const pipelineLimit = vi.fn();
const accessIn = vi.fn();

vi.mock("@/lib/config/app-env", () => ({
  isTenderRadarConfigured: () => isTenderRadarConfigured()
}));

vi.mock("@/lib/tender-radar/server", () => ({
  getTenderRadarClient: () => ({
    from: (table: string) => {
      if (table === "procurement_tender_access") {
        return {
          select: () => ({
            in: (...args: unknown[]) => accessIn(...args)
          })
        };
      }
      return {
        select: () => ({
          in: () => ({
            limit: () => pipelineLimit()
          })
        })
      };
    }
  })
}));

import { loadRevenueOpportunities } from "@/lib/tender-radar/opportunities";

describe("loadRevenueOpportunities tender access", () => {
  beforeEach(() => {
    isTenderRadarConfigured.mockReset();
    pipelineLimit.mockReset();
    accessIn.mockReset();
    isTenderRadarConfigured.mockReturnValue(true);
  });

  it("left-joins tender access by process_key and leaves missing rows empty", async () => {
    pipelineLimit.mockResolvedValue({
      data: [
        {
          process_key: "ea-soil",
          title: "Update of South East Soil Moisture model",
          recommended_route: "direct_bid",
          commercial_stage: "live_bid",
          tender_deadline: "2026-12-01T00:00:00.000Z",
          ai_review_version: "revenue-radar-v2.5-production"
        },
        {
          process_key: "missing-access",
          title: "No access yet",
          recommended_route: "watch",
          commercial_stage: "early_engagement",
          ai_review_version: "revenue-radar-v2.5-production"
        }
      ],
      error: null
    });
    accessIn.mockResolvedValue({
      data: [
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
          submission_method_details: null,
          electronic_submission_policy: "allowed"
        }
      ],
      error: null
    });

    const actual = await loadRevenueOpportunities();

    expect(actual.status).toBe("ok");
    if (actual.status !== "ok") return;
    expect(accessIn).toHaveBeenCalledWith("process_key", expect.arrayContaining(["ea-soil", "missing-access"]));
    const soil = actual.opportunities.find((item) => item.processKey === "ea-soil");
    const missing = actual.opportunities.find((item) => item.processKey === "missing-access");
    expect(soil?.tenderAccessType).toBe("direct_documents");
    expect(soil?.tenderDocuments).toHaveLength(1);
    expect(missing?.tenderAccessType).toBeNull();
    expect(missing?.tenderDocuments).toEqual([]);
    expect(missing?.noticeUrl).toBeNull();
  });

  it("still returns opportunities when the tender-access query fails", async () => {
    pipelineLimit.mockResolvedValue({
      data: [
        {
          process_key: "ea-1",
          title: "Still visible",
          recommended_route: "watch",
          commercial_stage: "early_engagement",
          ai_review_version: "revenue-radar-v2.5-production"
        }
      ],
      error: null
    });
    accessIn.mockResolvedValue({ data: null, error: { message: "relation missing" } });

    const actual = await loadRevenueOpportunities();

    expect(actual.status).toBe("ok");
    if (actual.status !== "ok") return;
    expect(actual.opportunities[0]?.title).toBe("Still visible");
    expect(actual.opportunities[0]?.tenderAccessType).toBeNull();
    expect(actual.opportunities[0]?.tenderDocuments).toEqual([]);
  });
});
