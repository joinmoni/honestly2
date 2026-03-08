import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

type RouteLoadingScreenProps = {
  title?: string;
  subtitle?: string;
};

export function RouteLoadingScreen({
  title = "Loading the next view",
  subtitle = "Fetching content, layout blocks, and navigation context."
}: RouteLoadingScreenProps) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <div className="flex items-center justify-between py-4">
          <SkeletonBlock className="h-10 w-40 rounded-full" />
          <div className="hidden items-center gap-4 md:flex">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-12 w-36 rounded-full" />
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">Loading</p>
          <h1 className="text-5xl md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone-500">{subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <SkeletonBlock className="h-[26rem] w-full rounded-[2.5rem]" />
            <div className="grid gap-6 md:grid-cols-2">
              <SkeletonBlock className="h-56 w-full rounded-[2rem]" />
              <SkeletonBlock className="h-56 w-full rounded-[2rem]" />
            </div>
            <SkeletonBlock className="h-64 w-full rounded-[2rem]" />
          </div>
          <div className="space-y-6">
            <SkeletonBlock className="h-72 w-full rounded-[2rem]" />
            <SkeletonBlock className="h-40 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
