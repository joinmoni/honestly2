"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { BodyText, CardTitle, Eyebrow, PageTitle } from "@/components/ui/Typography";
import type { RatingCriterion, Vendor } from "@/lib/types/domain";

type ReviewSubmissionPageProps = {
  vendors: Vendor[];
  criteria: RatingCriterion[];
  initialVendorSlug?: string;
  reviewId?: string;
};

type ReviewFormValues = {
  overallRating: number;
  headline: string;
  body: string;
  criteria: Record<string, number>;
};

const DEFAULT_RATING = 4;

export function ReviewSubmissionPage({ vendors, criteria, initialVendorSlug, reviewId }: ReviewSubmissionPageProps) {
  const [selectedVendorSlug, setSelectedVendorSlug] = useState(initialVendorSlug ?? "");
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState<ReviewFormValues>(() => ({
    overallRating: DEFAULT_RATING,
    headline: "",
    body: "",
    criteria: Object.fromEntries(criteria.map((criterion) => [criterion.id, DEFAULT_RATING]))
  }));

  const selectedVendor = useMemo(
    () => vendors.find((vendor) => vendor.slug === selectedVendorSlug) ?? null,
    [selectedVendorSlug, vendors]
  );

  const filteredVendors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return vendors.slice(0, 8);
    }

    return vendors.filter((vendor) => {
      const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
      const locationLabel = location ? `${location.city}${location.region ? ` ${location.region}` : ""}` : "";
      return [vendor.name, vendor.primaryCategory?.name ?? "", locationLabel].some((value) =>
        value.toLowerCase().includes(normalized)
      );
    });
  }, [query, vendors]);

  if (submitted && selectedVendor) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-14">
        <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm md:p-10">
          <Eyebrow className="mb-4 text-amber-700">Review submitted</Eyebrow>
          <PageTitle className="mb-4 text-[2.75rem] leading-[0.95] md:text-6xl">Thanks for recommending {selectedVendor.name}.</PageTitle>
          <BodyText className="max-w-2xl">
            Your review is now under review. Once approved, it will appear in your feedback history and help others discover this vendor.
          </BodyText>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/me/reviews" className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-white transition-colors hover:bg-stone-800">
              View my reviews
            </Link>
            <Link href={`/vendor/${selectedVendor.slug}`} className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 transition-colors hover:border-stone-900">
              Back to vendor
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-14">
      <div className="mb-6">
        <Link href={selectedVendor ? `/vendor/${selectedVendor.slug}` : "/vendors"} className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900">
          <ArrowLeft size={14} />
          {selectedVendor ? "Back to vendor" : "Back to vendors"}
        </Link>
      </div>

      <section className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm md:rounded-[2rem] md:p-10">
        <Eyebrow className="mb-4 text-amber-700">Recommend a vendor</Eyebrow>
        <PageTitle className="mb-4 text-[2.75rem] leading-[0.95] md:text-6xl">
          {selectedVendor ? `Tell us about ${selectedVendor.name}.` : "Tell us about a vendor you trust."}
        </PageTitle>
        <BodyText className="max-w-2xl">
          Share the vendor you used so Honestly can surface more great recommendations from real clients.
        </BodyText>

        {!selectedVendor ? (
          <div className="mt-6">
            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Find the vendor</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by vendor, category, or location"
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 outline-none focus:border-stone-900"
              />
            </label>
            <div className="mt-4 grid gap-3">
              {filteredVendors.map((vendor) => {
                const location = vendor.locations.find((entry) => entry.isPrimary) ?? vendor.locations[0];
                return (
                  <button
                    key={vendor.id}
                    type="button"
                    className="rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left transition-colors hover:border-stone-900"
                    onClick={() => setSelectedVendorSlug(vendor.slug)}
                  >
                    <CardTitle className="text-[1.7rem] leading-tight md:text-[1.9rem]">{vendor.name}</CardTitle>
                    <p className="mt-1 text-sm text-stone-500">
                      {vendor.primaryCategory?.name ?? "Vendor"}
                      {location ? ` • ${location.city}${location.region ? `, ${location.region}` : ""}` : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            <div className="border-b border-stone-200 pb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Reviewing</p>
              <CardTitle className="mt-2 text-[1.9rem] leading-tight md:text-[2.1rem]">{selectedVendor.name}</CardTitle>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-amber-700 underline underline-offset-4"
                onClick={() => setSelectedVendorSlug("")}
              >
                Choose a different vendor
              </button>
            </div>

            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-stone-100 bg-stone-50 p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Overall rating</span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const score = index + 1;
                    return (
                      <button
                        key={score}
                        type="button"
                        className={score <= values.overallRating ? "text-3xl text-amber-400" : "text-3xl text-stone-200"}
                        onClick={() => setValues((current) => ({ ...current, overallRating: score }))}
                        aria-label={`Rate ${score} out of 5`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="rounded-[1.35rem] border border-stone-200 bg-white p-4">
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{criterion.name}</span>
                    <div className="mt-4 flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const score = index + 1;
                        const active = score <= (values.criteria[criterion.id] ?? DEFAULT_RATING);

                        return (
                          <button
                            key={score}
                            type="button"
                            aria-label={`${criterion.name}: ${score} stars`}
                            className={active ? "text-amber-500" : "text-stone-200"}
                            onClick={() =>
                              setValues((current) => ({
                                ...current,
                                criteria: { ...current.criteria, [criterion.id]: score }
                              }))
                            }
                          >
                            <Star size={24} className={active ? "fill-current" : ""} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Headline</span>
                <input
                  value={values.headline}
                  onChange={(event) => setValues((current) => ({ ...current, headline: event.target.value }))}
                  placeholder="The highlight of our wedding day"
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base text-stone-900 outline-none focus:border-stone-900"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Your review</span>
                <textarea
                  rows={6}
                  value={values.body}
                  onChange={(event) => setValues((current) => ({ ...current, body: event.target.value }))}
                  placeholder="Tell us about the experience, the process, and why you’d recommend them."
                  className="w-full rounded-[1.5rem] border border-stone-200 bg-white px-4 py-4 text-base leading-relaxed text-stone-900 outline-none focus:border-stone-900"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={`/vendor/${selectedVendor.slug}`} className="inline-flex items-center justify-center rounded-full border border-stone-200 px-6 py-3 transition-colors hover:border-stone-900">
                  Cancel
                </Link>
                <button type="submit" className="inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-3 text-white transition-colors hover:bg-stone-800">
                  {reviewId ? "Update review" : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
