import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

export function VendorsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="sticky top-0 z-50 border-b border-stone-100 bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-6">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <div className="hidden items-center gap-8 md:flex">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
        <div className="border-t border-stone-100/80 px-6 py-5">
          <div className="mx-auto max-w-[760px]">
            <SkeletonBlock className="h-16 w-full rounded-full" />
          </div>
        </div>
        <div className="border-t border-stone-100/80 px-6 py-3">
          <div className="mx-auto flex max-w-[1600px] gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonBlock key={idx} className="h-10 w-28 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-6 py-16">
        <SkeletonBlock className="mb-10 h-4 w-56" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="space-y-4">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[2.5rem]" />
              <SkeletonBlock className="h-7 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export function VendorDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12">
        <SkeletonBlock className="mb-12 h-64 w-full rounded-[2.5rem]" />
        <SkeletonBlock className="mb-16 h-[420px] w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.5fr)_360px]">
          <div className="space-y-12">
            <SkeletonBlock className="h-72 w-full rounded-[2.25rem]" />
            <SkeletonBlock className="h-[32rem] w-full rounded-[2.25rem]" />
          </div>
          <div className="space-y-6">
            <SkeletonBlock className="h-80 w-full rounded-[2.25rem]" />
            <SkeletonBlock className="h-36 w-full rounded-[2rem]" />
          </div>
        </div>
      </main>
    </div>
  );
}

export function ListsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <SkeletonBlock className="h-12 w-36 rounded-full" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-xl space-y-4">
            <SkeletonBlock className="h-12 w-72" />
            <SkeletonBlock className="h-5 w-full" />
          </div>
          <SkeletonBlock className="h-14 w-56 rounded-2xl" />
        </div>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-4">
              <SkeletonBlock className="aspect-video w-full rounded-3xl" />
              <SkeletonBlock className="h-8 w-2/3" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          ))}
        </section>

        <div className="mt-24">
          <SkeletonBlock className="mb-8 h-8 w-48" />
          <SkeletonBlock className="h-72 w-full rounded-[2rem]" />
        </div>
      </main>
    </div>
  );
}

export function MyReviewsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 space-y-4">
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-5 w-full max-w-xl" />
        </div>
        <div className="mb-10 flex gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-5 w-24" />
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-56 w-full rounded-[2rem]" />
          ))}
        </div>
      </main>
    </div>
  );
}

export function AdminVendorsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <SkeletonBlock className="h-10 w-48 rounded-full" />
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <SkeletonBlock className="h-10 w-72" />
            <SkeletonBlock className="h-5 w-96" />
          </div>
          <SkeletonBlock className="h-14 w-full rounded-2xl md:w-80" />
        </div>

        <SkeletonBlock className="h-[34rem] w-full rounded-[2.5rem]" />
      </main>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-12">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <div className="hidden items-center gap-8 md:flex">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-12 w-36 rounded-full" />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto max-w-3xl pb-28 pt-20 text-center">
          <div className="space-y-4">
            <SkeletonBlock className="mx-auto h-16 w-full max-w-3xl" />
            <SkeletonBlock className="mx-auto h-16 w-2/3" />
          </div>
          <SkeletonBlock className="mx-auto mt-8 h-6 w-full max-w-xl" />
          <SkeletonBlock className="mx-auto mt-12 h-16 w-full max-w-2xl rounded-full" />
        </div>
      </main>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <div className="hidden items-center gap-8 md:flex">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-16 max-w-2xl space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-6 w-full max-w-xl" />
        </div>
        <div className="mb-12 flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-4">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[2.5rem]" />
              <SkeletonBlock className="h-8 w-2/3" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export function SharedCollectionPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-stone-900">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-24">
        <div className="mx-auto mb-24 max-w-2xl text-center">
          <SkeletonBlock className="mx-auto h-16 w-16 rounded-full" />
          <SkeletonBlock className="mx-auto mt-8 h-4 w-32" />
          <SkeletonBlock className="mx-auto mt-4 h-14 w-full max-w-xl" />
          <SkeletonBlock className="mx-auto mt-6 h-6 w-full max-w-lg" />
        </div>
        <div className="space-y-24">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="grid gap-12 md:grid-cols-[minmax(0,3fr)_2fr]">
              <SkeletonBlock className="aspect-[4/5] w-full rounded-[3rem]" />
              <div className="space-y-6">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-12 w-3/4" />
                <SkeletonBlock className="h-28 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <SkeletonBlock className="h-[36rem] w-full rounded-[2.5rem]" />
        <SkeletonBlock className="h-[36rem] w-full rounded-[2.5rem]" />
      </div>
    </div>
  );
}

export function AdminModerationPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <SkeletonBlock className="h-10 w-48 rounded-full" />
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-4">
          <SkeletonBlock className="h-10 w-72" />
          <SkeletonBlock className="h-5 w-96" />
        </div>
        <div className="mt-8 flex gap-3 overflow-hidden">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-10 w-28 rounded-xl" />
          ))}
        </div>
        <div className="mt-10 space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-64 w-full rounded-[2rem]" />
          ))}
        </div>
      </main>
    </div>
  );
}

export function AdminTaxonomyPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <div className="border-b border-stone-100 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <SkeletonBlock className="h-10 w-48 rounded-full" />
          <SkeletonBlock className="h-12 w-40 rounded-full" />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="space-y-4">
            <SkeletonBlock className="h-10 w-72" />
            <SkeletonBlock className="h-5 w-96" />
          </div>
          <SkeletonBlock className="h-12 w-48 rounded-xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-56 w-full rounded-[2rem]" />
          ))}
        </div>
      </main>
    </div>
  );
}

export function ClaimPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-5xl">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="mt-6 h-16 w-2/3" />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <SkeletonBlock className="h-[32rem] w-full rounded-[2.5rem]" />
          <SkeletonBlock className="h-[32rem] w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}

export function VendorEditPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4">
          <SkeletonBlock className="h-10 w-72" />
          <SkeletonBlock className="h-5 w-96" />
        </div>
        <div className="grid gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonBlock key={idx} className="h-72 w-full rounded-[2rem]" />
          ))}
        </div>
      </div>
    </div>
  );
}
