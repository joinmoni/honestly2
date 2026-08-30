import { buildTrackingUpsert, validateTrackingInput } from "@/lib/tender-radar/tracking";

describe("validateTrackingInput", () => {
  it("accepts a complete payload and ignores extra fields", () => {
    const actual = validateTrackingInput({
      processKey: " ea-1 ",
      status: "reviewing",
      bidValue: 79500,
      bidCurrency: "GBP",
      bidRoute: "direct",
      partnerName: "Partner Co",
      notes: "Follow up",
      outcomeValue: null,
      unexpected: "nope"
    });

    expect(actual).toEqual({
      ok: true,
      value: {
        processKey: "ea-1",
        status: "reviewing",
        bidValue: 79500,
        bidCurrency: "GBP",
        bidRoute: "direct",
        partnerName: "Partner Co",
        notes: "Follow up",
        outcomeValue: null
      }
    });
  });

  it("rejects an empty process key", () => {
    expect(validateTrackingInput({ processKey: "  ", status: "reviewing" })).toEqual({
      ok: false,
      error: "process_key is required."
    });
  });

  it("rejects an invalid status", () => {
    expect(validateTrackingInput({ processKey: "ea-1", status: "hot" })).toEqual({
      ok: false,
      error: "status is not a valid tracking status."
    });
  });

  it("rejects a negative bid value", () => {
    expect(validateTrackingInput({ processKey: "ea-1", status: "pursuing", bidValue: -1 })).toEqual({
      ok: false,
      error: "bid_value cannot be negative."
    });
  });

  it("rejects a negative outcome value", () => {
    expect(validateTrackingInput({ processKey: "ea-1", status: "won", outcomeValue: -10 })).toEqual({
      ok: false,
      error: "outcome_value cannot be negative."
    });
  });

  it("rejects an invalid bid route", () => {
    expect(validateTrackingInput({ processKey: "ea-1", status: "pursuing", bidRoute: "broker" })).toEqual({
      ok: false,
      error: "bid_route must be direct, partner, or subcontractor."
    });
  });
});

describe("buildTrackingUpsert", () => {
  const now = new Date("2026-08-30T12:00:00.000Z");
  const input = {
    processKey: "ea-1",
    status: "reviewing" as const,
    bidValue: null,
    bidCurrency: null,
    bidRoute: null,
    partnerName: null,
    notes: null,
    outcomeValue: null
  };

  it("creates a tracking row when moving from new to reviewing", () => {
    const actual = buildTrackingUpsert({ ...input, status: "reviewing" }, null, now);

    expect(actual).toEqual({
      process_key: "ea-1",
      status: "reviewing",
      submitted_at: null,
      bid_value: null,
      bid_currency: null,
      bid_route: null,
      partner_name: null,
      notes: null,
      outcome_at: null,
      outcome_value: null,
      updated_at: "2026-08-30T12:00:00.000Z"
    });
  });

  it("sets submitted_at only when moving to submitted without an existing timestamp", () => {
    const first = buildTrackingUpsert({ ...input, status: "submitted" }, null, now);
    expect(first.submitted_at).toBe("2026-08-30T12:00:00.000Z");

    const later = new Date("2026-09-01T09:00:00.000Z");
    const second = buildTrackingUpsert(
      { ...input, status: "submitted", notes: "Updated note" },
      { submittedAt: "2026-08-30T12:00:00.000Z", outcomeAt: null },
      later
    );
    expect(second.submitted_at).toBe("2026-08-30T12:00:00.000Z");
    expect(second.notes).toBe("Updated note");
  });

  it("sets outcome_at only when moving to won or lost without an existing timestamp", () => {
    const won = buildTrackingUpsert({ ...input, status: "won", outcomeValue: 80000 }, null, now);
    expect(won.outcome_at).toBe("2026-08-30T12:00:00.000Z");
    expect(won.outcome_value).toBe(80000);

    const lost = buildTrackingUpsert(
      { ...input, status: "lost" },
      { submittedAt: null, outcomeAt: "2026-08-20T00:00:00.000Z" },
      now
    );
    expect(lost.outcome_at).toBe("2026-08-20T00:00:00.000Z");
  });

  it("does not set outcome_at for passed", () => {
    const actual = buildTrackingUpsert({ ...input, status: "passed" }, null, now);
    expect(actual.outcome_at).toBeNull();
  });
});
