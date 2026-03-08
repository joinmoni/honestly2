"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

type RouteErrorScreenProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onRetry?: () => void;
};

export function RouteErrorScreen({
  eyebrow = "We hit a snag",
  title = "We couldn't load this page",
  description = "Something went wrong on our side. Try again, or head back to continue browsing.",
  secondaryLabel = "Go home",
  secondaryHref = "/",
  onRetry
}: RouteErrorScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F6F2] px-6 py-16 text-stone-900">
      <div className="w-full max-w-3xl rounded-[2.75rem] border border-stone-200 bg-white p-8 shadow-xl shadow-stone-200/30 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-500">{description}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={onRetry}>Try again</Button>
          <Link
            href={secondaryHref}
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-sans font-black uppercase tracking-widest text-stone-900 transition-colors hover:bg-[#f6f3ec]"
          >
            {secondaryLabel}
          </Link>
        </div>
        <p className="mt-6 text-xs text-stone-400">If this keeps happening, come back in a moment and try again.</p>
        </div>
      </div>
    </div>
  );
}
