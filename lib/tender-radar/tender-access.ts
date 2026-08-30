import {
  EMPTY_TENDER_ACCESS,
  isTenderAccessType,
  type RevenueOpportunity,
  type TenderAccessType,
  type TenderDocument
} from "@/lib/tender-radar/types";

export type TenderAccessRow = {
  process_key?: unknown;
  notice_url?: unknown;
  access_type?: unknown;
  portal_url?: unknown;
  documents?: unknown;
  submission_method_details?: unknown;
  electronic_submission_policy?: unknown;
};

export type TenderAccessFields = typeof EMPTY_TENDER_ACCESS;

export const TENDER_ACCESS_COLUMNS = [
  "process_key",
  "notice_url",
  "access_type",
  "portal_url",
  "documents",
  "submission_method_details",
  "electronic_submission_policy"
].join(", ");

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  biddingDocuments: "Tender Document",
  clarifications: "Clarification Document",
  clarificationDocuments: "Clarification Document"
};

function toText(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

export function isSafeHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function parseTenderDocument(value: unknown): TenderDocument | null {
  if (value == null || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const url = toText(record.url);
  if (!isSafeHttpUrl(url)) return null;
  return {
    id: toText(record.id),
    url,
    type: toText(record.type),
    format: toText(record.format),
    description: toText(record.description)
  };
}

export function parseTenderDocuments(value: unknown): TenderDocument[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => parseTenderDocument(item))
    .filter((item): item is TenderDocument => item !== null);
}

function toTenderAccessType(value: unknown): TenderAccessType | null {
  const text = toText(value);
  return isTenderAccessType(text) ? text : null;
}

export function mapTenderAccessFields(row: TenderAccessRow | null | undefined): TenderAccessFields {
  if (!row) return { ...EMPTY_TENDER_ACCESS, tenderDocuments: [] };
  return {
    noticeUrl: toText(row.notice_url),
    tenderAccessType: toTenderAccessType(row.access_type),
    tenderPortalUrl: toText(row.portal_url),
    tenderDocuments: parseTenderDocuments(row.documents),
    submissionMethodDetails: toText(row.submission_method_details),
    electronicSubmissionPolicy: toText(row.electronic_submission_policy)
  };
}

export function applyTenderAccess(
  opportunity: RevenueOpportunity,
  row: TenderAccessRow | null | undefined
): RevenueOpportunity {
  return { ...opportunity, ...mapTenderAccessFields(row) };
}

export function tenderAccessByProcessKey(rows: TenderAccessRow[]): Map<string, TenderAccessRow> {
  const byKey = new Map<string, TenderAccessRow>();
  for (const row of rows) {
    const processKey = toText(row.process_key);
    if (processKey) byKey.set(processKey, row);
  }
  return byKey;
}

export function formatTenderAccessIndicator(
  opportunity: Pick<RevenueOpportunity, "tenderAccessType" | "tenderDocuments">
): string | null {
  if (opportunity.tenderAccessType === "direct_documents") {
    const count = opportunity.tenderDocuments.length;
    return count === 1 ? "1 doc" : `${count} docs`;
  }
  if (opportunity.tenderAccessType === "external_portal") return "Portal";
  if (opportunity.tenderAccessType === "notice_only") return "Notice";
  return null;
}

function humanizeDocumentType(type: string): string {
  const mapped = DOCUMENT_TYPE_LABELS[type];
  if (mapped) return mapped;
  const spaced = type
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!spaced) return "Tender Document";
  return spaced
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function documentBaseLabel(document: TenderDocument): string {
  if (document.description) return document.description;
  if (document.type) return humanizeDocumentType(document.type);
  if (document.id) return `Document ${document.id}`;
  return "Tender Document";
}

export function formatTenderDocumentLabel(document: TenderDocument, documents: TenderDocument[]): string {
  if (document.description) return document.description;
  const base = documentBaseLabel(document);
  const unlabeled = documents.filter((item) => !item.description && documentBaseLabel(item) === base);
  if (unlabeled.length < 2) return base;
  const position = unlabeled.findIndex((item) => item === document || (item.id && item.id === document.id && item.url === document.url));
  return `${base} ${position + 1}`;
}

export function formatElectronicSubmissionPolicy(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value === "allowed") return "Electronic submission allowed";
  if (value === "notAllowed") return "Electronic submission not allowed";
  return value;
}
