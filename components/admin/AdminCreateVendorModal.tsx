"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Star, X } from "lucide-react";
import { BodyText, SectionTitle } from "@/components/ui/Typography";
import type { CreateAdminVendorInput } from "@/lib/admin-vendors.client";
import type { AdminReviewCriterionOption, AdminVendorCategoryOption } from "@/lib/types/admin-dashboard";

const DEFAULT_CRITERION_RATING = 4;

type ReviewDraft = {
  id: string;
  reviewerName: string;
  reviewerEmail: string;
  headline: string;
  body: string;
  status: "pending" | "approved";
  criteria: Record<string, number>;
  manualOverall: number;
};

type AdminCreateVendorModalProps = {
  open: boolean;
  categories: AdminVendorCategoryOption[];
  criteria: AdminReviewCriterionOption[];
  pending?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onCreateVendor: (input: CreateAdminVendorInput) => Promise<void> | void;
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function FieldLabel({ children, required: isRequired }: { children: ReactNode; required?: boolean }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
      {children}
      {isRequired ? (
        <>
          <span className="ml-0.5 text-amber-600" aria-hidden>
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      ) : null}
    </span>
  );
}

export function AdminCreateVendorModal({
  open,
  categories,
  criteria,
  pending = false,
  errorMessage,
  onClose,
  onCreateVendor
}: AdminCreateVendorModalProps) {
  const defaultCategoryId = categories[0]?.id ?? "";
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [primaryCategoryId, setPrimaryCategoryId] = useState(defaultCategoryId);
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("USA");
  const [priceTier, setPriceTier] = useState<"$" | "$$" | "$$$" | "">("");
  const [travels, setTravels] = useState(true);
  const [serviceRadiusKm, setServiceRadiusKm] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [addInitialReviews, setAddInitialReviews] = useState(false);
  const [reviewDrafts, setReviewDrafts] = useState<ReviewDraft[]>([]);
  /** After the user edits the slug field, stop overwriting it from the vendor name until reset or slug cleared. */
  const slugEditedByUserRef = useRef(false);

  const createReviewDraft = (): ReviewDraft => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    reviewerName: "",
    reviewerEmail: "",
    headline: "",
    body: "",
    status: "approved",
    criteria: Object.fromEntries(criteria.map((criterion) => [criterion.id, DEFAULT_CRITERION_RATING])),
    manualOverall: DEFAULT_CRITERION_RATING
  });

  useEffect(() => {
    if (!open) return;
    setPrimaryCategoryId(categories[0]?.id ?? "");
  }, [categories, open]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === primaryCategoryId) ?? null,
    [categories, primaryCategoryId]
  );

  const canSubmit = useMemo(() => {
    const base = Boolean(name.trim() && primaryCategoryId && city.trim());
    if (!addInitialReviews || reviewDrafts.length === 0) return base;
    return base && reviewDrafts.every((draft) => draft.reviewerName.trim().length > 0);
  }, [addInitialReviews, city, name, primaryCategoryId, reviewDrafts]);

  const reset = () => {
    slugEditedByUserRef.current = false;
    setName("");
    setSlug("");
    setHeadline("");
    setDescription("");
    setPrimaryCategoryId(categories[0]?.id ?? "");
    setSubcategoryIds([]);
    setCity("");
    setRegion("");
    setCountry("USA");
    setPriceTier("");
    setTravels(true);
    setServiceRadiusKm("");
    setWebsite("");
    setInstagram("");
    setTiktok("");
    setFacebook("");
    setContactEmail("");
    setContactPhone("");
    setCoverImage(null);
    setGalleryImages([]);
    setAddInitialReviews(false);
    setReviewDrafts([]);
  };

  const close = () => {
    if (pending) return;
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-y-auto bg-stone-950/45 p-6 pt-24 pb-10 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2 }}
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-stone-100 px-8 pb-6 pt-8">
              <div>
                <SectionTitle className="text-stone-900">Create Vendor</SectionTitle>
                <BodyText className="mt-2 text-sm text-stone-500">
                  <span className="text-amber-600">*</span> Required fields
                </BodyText>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
                onClick={close}
                aria-label="Close create vendor modal"
              >
                <X size={18} />
              </button>
            </div>

            <form
              className="max-h-[calc(90vh-112px)] overflow-y-auto px-8 py-8"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSubmit || pending) return;

                const initialReviews =
                  addInitialReviews && reviewDrafts.length > 0
                    ? reviewDrafts.map((draft) => {
                        const overallRating =
                          criteria.length > 0
                            ? Math.round(
                                (criteria.reduce(
                                  (sum, criterion) => sum + (draft.criteria[criterion.id] ?? DEFAULT_CRITERION_RATING),
                                  0
                                ) /
                                  criteria.length) *
                                  10
                              ) / 10
                            : draft.manualOverall;

                        return {
                          reviewerName: draft.reviewerName.trim(),
                          reviewerEmail: draft.reviewerEmail.trim() || undefined,
                          title: draft.headline.trim() || undefined,
                          body: draft.body.trim() || undefined,
                          status: draft.status,
                          criterionScores: { ...draft.criteria },
                          overallRating
                        };
                      })
                    : undefined;

                void onCreateVendor({
                  name,
                  slug,
                  headline,
                  description,
                  primaryCategoryId,
                  subcategoryIds,
                  city,
                  region,
                  country,
                  priceTier: priceTier || undefined,
                  travels,
                  serviceRadiusKm: serviceRadiusKm.trim() ? Number(serviceRadiusKm) : null,
                  website,
                  instagram,
                  tiktok,
                  facebook,
                  contactEmail,
                  contactPhone,
                  coverImage,
                  galleryImages,
                  initialReviews
                });
              }}
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <section className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="admin-create-vendor-name" className="block">
                      <FieldLabel required>Vendor name</FieldLabel>
                    </label>
                    <input
                      id="admin-create-vendor-name"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        const nextName = event.target.value;
                        setName(nextName);
                        if (!slugEditedByUserRef.current) {
                          setSlug(slugify(nextName));
                        }
                      }}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="Wildflower Archive"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="admin-create-vendor-slug" className="block">
                      <FieldLabel>Slug</FieldLabel>
                    </label>
                    <input
                      id="admin-create-vendor-slug"
                      type="text"
                      value={slug}
                      onChange={(event) => {
                        const next = slugify(event.target.value);
                        if (!next) {
                          slugEditedByUserRef.current = false;
                          setSlug(slugify(name));
                        } else {
                          slugEditedByUserRef.current = true;
                          setSlug(next);
                        }
                      }}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="wildflower-archive"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="admin-create-vendor-headline" className="block">
                      <FieldLabel>Headline</FieldLabel>
                    </label>
                    <input
                      id="admin-create-vendor-headline"
                      type="text"
                      value={headline}
                      onChange={(event) => setHeadline(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="Ethereal arrangements for modern romantics."
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="admin-create-vendor-description" className="block">
                      <FieldLabel>Description</FieldLabel>
                    </label>
                    <textarea
                      id="admin-create-vendor-description"
                      rows={6}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      placeholder="Tell users what makes this vendor worth discovering."
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-primary-category" className="block">
                        <FieldLabel required>Primary category</FieldLabel>
                      </label>
                      <select
                        id="admin-create-vendor-primary-category"
                        value={primaryCategoryId}
                        onChange={(event) => {
                          setPrimaryCategoryId(event.target.value);
                          setSubcategoryIds([]);
                        }}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-price-tier" className="block">
                        <FieldLabel>Price tier</FieldLabel>
                      </label>
                      <select
                        id="admin-create-vendor-price-tier"
                        value={priceTier}
                        onChange={(event) => setPriceTier(event.target.value as "$" | "$$" | "$$$" | "")}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                      >
                        <option value="">Not set</option>
                        <option value="$">$</option>
                        <option value="$$">$$</option>
                        <option value="$$$">$$$</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="block">
                      <FieldLabel>Subcategories</FieldLabel>
                    </span>
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-3">
                      {selectedCategory?.subcategories.length ? (
                        selectedCategory.subcategories.map((subcategory) => {
                          const active = subcategoryIds.includes(subcategory.id);
                          return (
                            <button
                              key={subcategory.id}
                              type="button"
                              className={
                                active
                                  ? "rounded-full bg-stone-900 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white"
                                  : "rounded-full border border-stone-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-900"
                              }
                              onClick={() =>
                                setSubcategoryIds((current) =>
                                  current.includes(subcategory.id)
                                    ? current.filter((item) => item !== subcategory.id)
                                    : [...current, subcategory.id]
                                )
                              }
                            >
                              {subcategory.name}
                            </button>
                          );
                        })
                      ) : (
                        <p className="px-2 py-2 text-sm text-stone-500">No subcategories available yet for this category.</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="admin-create-vendor-city" className="block">
                        <FieldLabel required>City</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-city"
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="Hudson Valley"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-region" className="block">
                        <FieldLabel>Region</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-region"
                        type="text"
                        value={region}
                        onChange={(event) => setRegion(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-country" className="block">
                        <FieldLabel>Country</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-country"
                        type="text"
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="USA"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-radius" className="block">
                        <FieldLabel>Service radius (km)</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-radius"
                        type="number"
                        min="0"
                        value={serviceRadiusKm}
                        onChange={(event) => setServiceRadiusKm(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="300"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={travels}
                      onChange={(event) => setTravels(event.target.checked)}
                      className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-amber-100"
                    />
                    Travels for projects outside the primary location
                  </label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-website" className="block">
                        <FieldLabel>Website</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-website"
                        type="url"
                        value={website}
                        onChange={(event) => setWebsite(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-instagram" className="block">
                        <FieldLabel>Instagram</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-instagram"
                        type="url"
                        value={instagram}
                        onChange={(event) => setInstagram(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="https://instagram.com/brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-tiktok" className="block">
                        <FieldLabel>TikTok</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-tiktok"
                        type="url"
                        value={tiktok}
                        onChange={(event) => setTiktok(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="https://tiktok.com/@brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="admin-create-vendor-facebook" className="block">
                        <FieldLabel>Facebook</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-facebook"
                        type="url"
                        value={facebook}
                        onChange={(event) => setFacebook(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="https://facebook.com/brand"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="admin-create-vendor-contact-email" className="block">
                        <FieldLabel>Contact email</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-contact-email"
                        type="email"
                        value={contactEmail}
                        onChange={(event) => setContactEmail(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="hello@studio.com"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label htmlFor="admin-create-vendor-contact-phone" className="block">
                        <FieldLabel>Contact phone</FieldLabel>
                      </label>
                      <input
                        id="admin-create-vendor-contact-phone"
                        type="tel"
                        value={contactPhone}
                        onChange={(event) => setContactPhone(event.target.value)}
                        className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                        placeholder="+1 555 010 0199"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="block">
                      <FieldLabel>Cover image</FieldLabel>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
                      className="block w-full rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.16em] file:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="block">
                      <FieldLabel>Gallery images</FieldLabel>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(event) => setGalleryImages(Array.from(event.target.files ?? []))}
                      className="block w-full rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-500 file:mr-4 file:rounded-full file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.16em] file:text-white"
                    />
                    {galleryImages.length ? (
                      <div className="flex flex-wrap gap-2">
                        {galleryImages.map((file) => (
                          <span
                            key={`${file.name}-${file.size}`}
                            className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-stone-600"
                          >
                            {file.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              </div>

              <section className="mt-10 space-y-6 border-t border-stone-100 pt-8">
                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-stone-200 bg-stone-50/80 px-5 py-4 transition-colors hover:border-stone-300">
                  <input
                    type="checkbox"
                    checked={addInitialReviews}
                    onChange={(event) => {
                      const next = event.target.checked;
                      setAddInitialReviews(next);
                      if (next) {
                        setReviewDrafts((current) => (current.length ? current : [createReviewDraft()]));
                      } else {
                        setReviewDrafts([]);
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-amber-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Add initial reviews</p>
                    <p className="mt-1 text-xs text-stone-500">Optional. Shown on the vendor profile when published.</p>
                  </div>
                </label>

                {addInitialReviews ? (
                  <div className="space-y-6">
                    {reviewDrafts.map((draft, index) => {
                      const computedOverall =
                        criteria.length > 0
                          ? Math.round(
                              (criteria.reduce(
                                (sum, criterion) => sum + (draft.criteria[criterion.id] ?? DEFAULT_CRITERION_RATING),
                                0
                              ) /
                                criteria.length) *
                                10
                            ) / 10
                          : draft.manualOverall;

                      return (
                        <div key={draft.id} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
                          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                              Review {index + 1}
                              {reviewDrafts.length > 1 ? ` of ${reviewDrafts.length}` : ""}
                            </p>
                            {reviewDrafts.length > 1 ? (
                              <button
                                type="button"
                                className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-800"
                                onClick={() => setReviewDrafts((prev) => prev.filter((item) => item.id !== draft.id))}
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                              <label htmlFor={`admin-create-vendor-reviewer-${draft.id}`} className="block">
                                <FieldLabel required>Reviewer name</FieldLabel>
                              </label>
                              <input
                                id={`admin-create-vendor-reviewer-${draft.id}`}
                                type="text"
                                value={draft.reviewerName}
                                onChange={(event) =>
                                  setReviewDrafts((prev) =>
                                    prev.map((item) =>
                                      item.id === draft.id ? { ...item, reviewerName: event.target.value } : item
                                    )
                                  )
                                }
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                                placeholder="Client name"
                              />
                            </div>
                            <div className="space-y-1">
                              <label htmlFor={`admin-create-vendor-reviewer-email-${draft.id}`} className="block">
                                <FieldLabel>Reviewer email</FieldLabel>
                              </label>
                              <input
                                id={`admin-create-vendor-reviewer-email-${draft.id}`}
                                type="email"
                                value={draft.reviewerEmail}
                                onChange={(event) =>
                                  setReviewDrafts((prev) =>
                                    prev.map((item) =>
                                      item.id === draft.id ? { ...item, reviewerEmail: event.target.value } : item
                                    )
                                  )
                                }
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label htmlFor={`admin-create-vendor-review-status-${draft.id}`} className="block">
                                <FieldLabel>Status</FieldLabel>
                              </label>
                              <select
                                id={`admin-create-vendor-review-status-${draft.id}`}
                                value={draft.status}
                                onChange={(event) =>
                                  setReviewDrafts((prev) =>
                                    prev.map((item) =>
                                      item.id === draft.id
                                        ? { ...item, status: event.target.value as "pending" | "approved" }
                                        : item
                                    )
                                  )
                                }
                                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                              >
                                <option value="approved">Approved</option>
                                <option value="pending">Pending moderation</option>
                              </select>
                            </div>
                          </div>

                          {criteria.length > 0 ? (
                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                              {criteria.map((criterion) => (
                                <div key={criterion.id} className="rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
                                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">{criterion.name}</span>
                                  <div className="mt-3 flex gap-1.5">
                                    {Array.from({ length: 5 }).map((_, starIndex) => {
                                      const score = starIndex + 1;
                                      const active = score <= (draft.criteria[criterion.id] ?? DEFAULT_CRITERION_RATING);
                                      return (
                                        <button
                                          key={score}
                                          type="button"
                                          aria-label={`${criterion.name}: ${score} stars`}
                                          className={active ? "text-amber-500" : "text-stone-200"}
                                          onClick={() =>
                                            setReviewDrafts((prev) =>
                                              prev.map((item) =>
                                                item.id === draft.id
                                                  ? {
                                                      ...item,
                                                      criteria: { ...item.criteria, [criterion.id]: score }
                                                    }
                                                  : item
                                              )
                                            )
                                          }
                                        >
                                          <Star size={22} className={active ? "fill-current" : ""} />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-5 rounded-2xl border border-stone-100 bg-stone-50/80 p-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-stone-400">Overall rating</span>
                              <div className="mt-3 flex gap-1.5">
                                {Array.from({ length: 5 }).map((_, starIndex) => {
                                  const score = starIndex + 1;
                                  const active = score <= draft.manualOverall;
                                  return (
                                    <button
                                      key={score}
                                      type="button"
                                      aria-label={`Overall ${score} stars`}
                                      className={active ? "text-amber-500" : "text-stone-200"}
                                      onClick={() =>
                                        setReviewDrafts((prev) =>
                                          prev.map((item) =>
                                            item.id === draft.id ? { ...item, manualOverall: score } : item
                                          )
                                        )
                                      }
                                    >
                                      <Star size={24} className={active ? "fill-current" : ""} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Overall rating</p>
                            <p className="mt-1 text-sm font-semibold text-stone-800">{computedOverall}/5</p>
                          </div>

                          <div className="mt-5 space-y-1">
                            <label htmlFor={`admin-create-vendor-review-headline-${draft.id}`} className="block">
                              <FieldLabel>Headline</FieldLabel>
                            </label>
                            <input
                              id={`admin-create-vendor-review-headline-${draft.id}`}
                              type="text"
                              value={draft.headline}
                              onChange={(event) =>
                                setReviewDrafts((prev) =>
                                  prev.map((item) => (item.id === draft.id ? { ...item, headline: event.target.value } : item))
                                )
                              }
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                              placeholder="The highlight of our wedding day"
                            />
                          </div>
                          <div className="mt-4 space-y-1">
                            <label htmlFor={`admin-create-vendor-review-body-${draft.id}`} className="block">
                              <FieldLabel>Review body</FieldLabel>
                            </label>
                            <textarea
                              id={`admin-create-vendor-review-body-${draft.id}`}
                              rows={4}
                              value={draft.body}
                              onChange={(event) =>
                                setReviewDrafts((prev) =>
                                  prev.map((item) => (item.id === draft.id ? { ...item, body: event.target.value } : item))
                                )
                              }
                              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-5 py-3 text-sm leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
                              placeholder="Process, delivery, and why you’d recommend them."
                            />
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      className="w-full rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 transition-colors hover:border-stone-400 hover:text-stone-800"
                      onClick={() => setReviewDrafts((prev) => [...prev, createReviewDraft()])}
                    >
                      Add another review
                    </button>
                  </div>
                ) : null}
              </section>

              {errorMessage ? (
                <p className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-stone-100 pt-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-2xl px-5 py-3 text-sm font-bold text-stone-500 transition-colors hover:text-stone-900"
                    onClick={close}
                    disabled={pending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || pending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-stone-200 transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={14} />
                    {pending ? "Creating..." : "Create Vendor"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
