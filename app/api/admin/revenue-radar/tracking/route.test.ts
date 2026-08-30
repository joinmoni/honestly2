import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getAdminSession = vi.fn();
const isTenderRadarConfigured = vi.fn();
const saveRevenueOpportunityTracking = vi.fn();

vi.mock("@/lib/services/session", () => ({
  getAdminSession: () => getAdminSession()
}));

vi.mock("@/lib/config/app-env", () => ({
  isTenderRadarConfigured: () => isTenderRadarConfigured()
}));

vi.mock("@/lib/tender-radar/save-tracking", () => ({
  saveRevenueOpportunityTracking: (...args: unknown[]) => saveRevenueOpportunityTracking(...args)
}));

import { POST } from "@/app/api/admin/revenue-radar/tracking/route";

function request(body: unknown) {
  return new Request("http://localhost/api/admin/revenue-radar/tracking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

describe("POST /api/admin/revenue-radar/tracking", () => {
  beforeEach(() => {
    getAdminSession.mockReset();
    isTenderRadarConfigured.mockReset();
    saveRevenueOpportunityTracking.mockReset();
    isTenderRadarConfigured.mockReturnValue(true);
  });

  it("rejects a non-admin before mutating", async () => {
    getAdminSession.mockResolvedValue({ user: { id: "u1", name: "User", email: "u@example.com", role: "user" } });

    const response = await POST(request({ processKey: "ea-1", status: "reviewing" }));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error).toMatch(/admin/i);
    expect(saveRevenueOpportunityTracking).not.toHaveBeenCalled();
  });

  it("rejects an invalid status", async () => {
    getAdminSession.mockResolvedValue({ user: { id: "a1", name: "Admin", email: "a@example.com", role: "admin" } });

    const response = await POST(request({ processKey: "ea-1", status: "hot" }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/status/i);
    expect(saveRevenueOpportunityTracking).not.toHaveBeenCalled();
  });

  it("rejects a negative bid value", async () => {
    getAdminSession.mockResolvedValue({ user: { id: "a1", name: "Admin", email: "a@example.com", role: "admin" } });

    const response = await POST(request({ processKey: "ea-1", status: "pursuing", bidValue: -5 }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/bid_value/i);
    expect(saveRevenueOpportunityTracking).not.toHaveBeenCalled();
  });

  it("saves an explicit tracking object for an admin", async () => {
    getAdminSession.mockResolvedValue({ user: { id: "a1", name: "Admin", email: "a@example.com", role: "admin" } });
    saveRevenueOpportunityTracking.mockResolvedValue({ processKey: "ea-1", trackingStatus: "reviewing" });

    const response = await POST(
      request({
        processKey: "ea-1",
        status: "reviewing",
        extra: "ignored"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(saveRevenueOpportunityTracking).toHaveBeenCalledWith({
      processKey: "ea-1",
      status: "reviewing",
      bidValue: null,
      bidCurrency: null,
      bidRoute: null,
      partnerName: null,
      notes: null,
      outcomeValue: null
    });
  });
});
