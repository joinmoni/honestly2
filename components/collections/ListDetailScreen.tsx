"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Lock, PencilLine, Share2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { BodyText, CardTitle, Eyebrow, MetaText, PillText } from "@/components/ui/Typography";
import { DARK_SURFACE_HEADING_TEXT, DARK_SURFACE_LINK_CLASS, DARK_SURFACE_MUTED_TEXT } from "@/lib/dark-surface";
import { cn } from "@/lib/utils";
import { isGenericListName, persistCreateEmptyList, persistUpdateListDetails } from "@/lib/lists.client";
import type { ListDetailPageData } from "@/lib/types/collections";

type ListDetailScreenProps = {
  data: ListDetailPageData;
  isDraft?: boolean;
  draftUserId?: string;
};

export function ListDetailScreen({ data, isDraft = false, draftUserId }: ListDetailScreenProps) {
  const router = useRouter();
  const [sourceList, setSourceList] = useState(data.sourceList);
  const [listName, setListName] = useState(data.name);
  const [visibility, setVisibility] = useState(data.visibility);
  const [shareSlug, setShareSlug] = useState(data.shareSlug);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [showNamingPrompt, setShowNamingPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);
  const visibilityLabel = visibility === "shared" ? data.copy.visibilitySharedLabel : data.copy.visibilityPrivateLabel;
  const shareButtonLabel = visibility === "shared" ? data.copy.shareLabel : isDraft ? "Save list" : "Share publicly";

  const persistDraftIfNeeded = async () => {
    if (!isDraft || !draftUserId) {
      return sourceList;
    }

    const trimmedName = listName.trim();
    if (!trimmedName || isGenericListName(trimmedName)) {
      setShowNamingPrompt(true);
      throw new Error("Name this list before saving it.");
    }

    setSavePending(true);

    try {
      const createdList = await persistCreateEmptyList([], { userId: draftUserId, name: trimmedName });
      setSourceList(createdList);
      router.replace(`/lists/${createdList.id}`);
      return createdList;
    } finally {
      setSavePending(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if ((visibility === "private" || isDraft) && (isGenericListName(listName) || !listName.trim())) {
      setShowNamingPrompt(true);
      setErrorMessage(null);
      return;
    }

    if (isDraft) {
      try {
        await persistDraftIfNeeded();
        return;
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "This list could not be saved right now.");
        return;
      }
    }

    let nextList = sourceList;

    if (visibility === "private") {
      try {
        const nextLists = await persistUpdateListDetails([sourceList], sourceList.id, {
          name: listName.trim(),
          isPublic: true
        });
        nextList = nextLists[0] ?? sourceList;
        setSourceList(nextList);
        setVisibility(nextList.isPublic ? "shared" : "private");
        setShareSlug(nextList.shareSlug);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "This list could not be shared right now.");
        return;
      }
    }

    const shareUrl = `${window.location.origin}/lists/${nextList.shareSlug ?? shareSlug ?? data.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: listName,
          text: data.description ?? `View ${listName} on Honestly.`,
          url: shareUrl
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  };

  return (
    <div className="bg-[#FDFCFB] text-stone-900">
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
        <div className="mb-6 md:mb-8">
          <Link href={data.copy.backHref} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
            <ArrowLeft size={14} />
            {data.copy.backLabel}
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm md:rounded-[2.5rem] md:p-8">
            <Eyebrow className="mb-4">Saved List</Eyebrow>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-start gap-3">
                  <CardTitle className="max-w-[11ch] text-[2.55rem] leading-[0.94] md:max-w-[15ch] md:text-[3.6rem]">{listName}</CardTitle>
                  <button
                    type="button"
                    aria-label="Rename list"
                    className="mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900"
                    onClick={() => {
                      setShowNamingPrompt(true);
                      setErrorMessage(null);
                    }}
                  >
                    <PencilLine size={16} />
                  </button>
                </div>
                {data.description ? <BodyText className="mt-4 max-w-xl">{data.description}</BodyText> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                  {visibility === "shared" ? <Share2 size={12} /> : <Lock size={12} />}
                  <PillText className="text-stone-500">{visibilityLabel}</PillText>
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-stone-500">
                  <PillText className="text-stone-500">{data.itemCountLabel}</PillText>
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                  disabled={savePending}
                >
                  <Share2 size={12} />
                  {savePending ? "Saving..." : shareState === "copied" ? "Link copied" : shareButtonLabel}
                </button>
              </div>
            </div>
            {errorMessage ? <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p> : null}
            {showNamingPrompt ? (
              <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Name this list first</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={listName}
                    onChange={(event) => setListName(event.target.value)}
                    className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-900"
                    placeholder="Summer Wedding 2026"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-stone-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white"
                    onClick={async () => {
                      setShowNamingPrompt(false);
                      await handleShare();
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : null}
            {visibility === "private" ? (
              <BodyText className="mt-4 text-[12px] md:text-sm">
                {isDraft ? "This list is still a draft. Name it to save it, then you can add vendors or share it publicly later." : "This list stays private until you share it publicly."}
              </BodyText>
            ) : null}
          </div>

          <aside className={`rounded-[2.25rem] border border-stone-200 bg-stone-900 p-6 shadow-sm ${DARK_SURFACE_MUTED_TEXT}`}>
            <Eyebrow className={DARK_SURFACE_MUTED_TEXT}>List Workspace</Eyebrow>
            <p className={`mt-4 text-3xl ${DARK_SURFACE_HEADING_TEXT}`}>{data.vendorCount}</p>
            <BodyText className={`mt-2 ${DARK_SURFACE_MUTED_TEXT}`}>
              Vendors currently tracked in this collection. Use this page to review the shortlist before sharing or outreach.
            </BodyText>
            {visibility === "shared" && shareSlug ? (
              <Link
                href={`/lists/${shareSlug}`}
                className={cn(
                  "mt-6 inline-flex items-center gap-2 pb-1 text-[11px] font-black uppercase tracking-[0.18em]",
                  DARK_SURFACE_LINK_CLASS
                )}
              >
                View public version
                <ArrowUpRight size={14} />
              </Link>
            ) : null}
          </aside>
        </section>

        <section className="mt-10">
          {!data.vendors.length ? (
            <EmptyState eyebrow="List Items" title={data.copy.emptyTitle} description={data.copy.emptyDescription} />
          ) : (
            <div className="grid gap-3">
              {data.vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.vendorId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <Link
                    href={`/vendor/${vendor.vendorSlug}`}
                    className="grid gap-4 p-4 md:grid-cols-[140px_minmax(0,1fr)_170px] md:items-center md:p-4.5"
                    aria-label={`Open ${vendor.vendorName}`}
                  >
                    <div className="relative aspect-[186/237] overflow-hidden rounded-[1.25rem] bg-stone-100 md:h-[178px] md:aspect-auto">
                      {vendor.imageUrl ? <Image src={vendor.imageUrl} alt={vendor.vendorName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 160px" /> : null}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                        <div>
                          <MetaText>{vendor.categoryLabel}</MetaText>
                          <h2 className="mt-2 text-[1.65rem] leading-none md:text-[1.9rem]">{vendor.vendorName}</h2>
                        </div>
                      </div>
                      <MetaText className="mt-2">{vendor.locationLabel}</MetaText>
                      {vendor.note ? (
                        <div className="mt-5 rounded-[1.5rem] bg-stone-50 p-4">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">{data.copy.notesHeading}</p>
                          <p className="mt-2 text-sm leading-relaxed text-stone-600">{vendor.note}</p>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col justify-between gap-3 rounded-[1.5rem] border border-stone-100 bg-stone-50/70 p-4">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 md:flex-nowrap">
                        <MetaText>{vendor.categoryLabel}</MetaText>
                        <MetaText>{vendor.locationLabel}</MetaText>
                        <MetaText>Saved</MetaText>
                        <MetaText>{vendor.savedAtLabel}</MetaText>
                        <div className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-800">
                          <PillText className="text-amber-800">In shortlist</PillText>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
