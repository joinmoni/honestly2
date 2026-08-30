import {
  applyTenderAccess,
  formatElectronicSubmissionPolicy,
  formatTenderAccessIndicator,
  formatTenderDocumentLabel,
  isSafeHttpUrl,
  mapTenderAccessFields,
  parseTenderDocuments,
  tenderAccessByProcessKey
} from "@/lib/tender-radar/tender-access";
import { EMPTY_TENDER_ACCESS, EMPTY_TRACKING, type RevenueOpportunity } from "@/lib/tender-radar/types";

const documentA = {
  id: "A-1",
  url: "https://www.find-tender.service.gov.uk/Notice/Attachment/A-1",
  type: "biddingDocuments",
  format: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  description: null
};

const documentB = {
  id: "A-2",
  url: "https://www.find-tender.service.gov.uk/Notice/Attachment/A-2",
  type: "biddingDocuments",
  format: "application/pdf",
  description: null
};

function opportunity(overrides: Partial<RevenueOpportunity> = {}): RevenueOpportunity {
  return {
    processKey: "ea-1",
    title: "Opportunity",
    buyerName: "Buyer",
    commercialStage: "live_bid",
    recommendedRoute: "watch",
    relevanceScore: 50,
    directFitScore: null,
    partnerFitScore: null,
    commercialAttractiveness: null,
    confidence: null,
    buyerNeed: null,
    supplierDeliverable: null,
    reason: null,
    nextAction: null,
    needPartner: null,
    recommendedPartnerSkill: null,
    valueAmount: null,
    currency: "GBP",
    tenderDeadline: null,
    aiReviewVersion: null,
    aiReviewedAt: null,
    analysedAt: null,
    updatedAt: null,
    ...EMPTY_TRACKING,
    ...EMPTY_TENDER_ACCESS,
    ...overrides
  };
}

describe("tender access mapping", () => {
  it("returns empty access fields when the join row is missing", () => {
    expect(mapTenderAccessFields(null)).toEqual({
      noticeUrl: null,
      tenderAccessType: null,
      tenderPortalUrl: null,
      tenderDocuments: [],
      submissionMethodDetails: null,
      electronicSubmissionPolicy: null
    });
  });

  it("drops documents without a safe url and ignores unknown access types", () => {
    const actual = mapTenderAccessFields({
      process_key: "ea-1",
      notice_url: "  ",
      access_type: "mystery",
      portal_url: null,
      documents: [
        { id: "skip", url: null, type: "biddingDocuments", format: null, description: null },
        { id: "bad", url: "javascript:alert(1)", type: "biddingDocuments", format: null, description: null },
        documentA
      ]
    });

    expect(actual.noticeUrl).toBeNull();
    expect(actual.tenderAccessType).toBeNull();
    expect(actual.tenderDocuments).toEqual([documentA]);
  });

  it("indexes access rows by process_key and applies them to an opportunity", () => {
    const byKey = tenderAccessByProcessKey([
      { process_key: "  ", notice_url: "https://example.com" },
      { process_key: "diamond-1", access_type: "external_portal", portal_url: "https://tenders.diamond.ac.uk" }
    ]);

    const actual = applyTenderAccess(opportunity({ processKey: "diamond-1" }), byKey.get("diamond-1"));
    expect(actual.tenderAccessType).toBe("external_portal");
    expect(actual.tenderPortalUrl).toBe("https://tenders.diamond.ac.uk");
    expect(byKey.has("")).toBe(false);
  });

  it("parses only array documents", () => {
    expect(parseTenderDocuments(null)).toEqual([]);
    expect(parseTenderDocuments({ url: "https://example.com/doc" })).toEqual([]);
  });
});

describe("tender access presentation", () => {
  it("formats the compact row indicator", () => {
    expect(formatTenderAccessIndicator(opportunity({ tenderAccessType: "direct_documents", tenderDocuments: [documentA, documentB] }))).toBe("2 docs");
    expect(formatTenderAccessIndicator(opportunity({ tenderAccessType: "direct_documents", tenderDocuments: [documentA] }))).toBe("1 doc");
    expect(formatTenderAccessIndicator(opportunity({ tenderAccessType: "external_portal" }))).toBe("Portal");
    expect(formatTenderAccessIndicator(opportunity({ tenderAccessType: "notice_only" }))).toBe("Notice");
    expect(formatTenderAccessIndicator(opportunity())).toBeNull();
  });

  it("uses description when present and otherwise labels from type", () => {
    const withDescription = { ...documentA, description: "ITT pack" };
    const clarification = {
      ...documentB,
      type: "clarifications",
      description: null
    };
    expect(formatTenderDocumentLabel(withDescription, [withDescription, documentB])).toBe("ITT pack");
    expect(formatTenderDocumentLabel(documentA, [documentA, documentB])).toBe("Tender Document 1");
    expect(formatTenderDocumentLabel(documentB, [documentA, documentB])).toBe("Tender Document 2");
    expect(formatTenderDocumentLabel(clarification, [clarification])).toBe("Clarification Document");
  });

  it("maps known electronic submission policies and leaves unknown values intact", () => {
    expect(formatElectronicSubmissionPolicy("allowed")).toBe("Electronic submission allowed");
    expect(formatElectronicSubmissionPolicy("notAllowed")).toBe("Electronic submission not allowed");
    expect(formatElectronicSubmissionPolicy("required")).toBe("required");
    expect(formatElectronicSubmissionPolicy(null)).toBeNull();
  });

  it("only accepts http(s) urls", () => {
    expect(isSafeHttpUrl("https://tenders.diamond.ac.uk")).toBe(true);
    expect(isSafeHttpUrl("http://example.com/notice")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("not-a-url")).toBe(false);
    expect(isSafeHttpUrl(null)).toBe(false);
  });
});
