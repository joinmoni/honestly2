type RouteLoadingScreenProps = {
  title?: string;
  subtitle?: string;
};

export function RouteLoadingScreen({
  title = "Honestly is loading",
  subtitle = "Pulling in the next view."
}: RouteLoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F6F2] px-6 text-stone-900">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex items-end gap-1">
          <span className="serif-italic text-[6.5rem] leading-none text-stone-900 md:text-[7.5rem]">h</span>
          <span className="mb-3 inline-block h-4 w-4 animate-pulse rounded-full bg-[var(--brand-accent)] md:mb-4 md:h-5 md:w-5" />
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="h-1.5 w-10 animate-pulse rounded-full bg-stone-300 [animation-delay:0ms]" />
          <span className="h-1.5 w-16 animate-pulse rounded-full bg-[var(--brand-accent)] [animation-delay:120ms]" />
          <span className="h-1.5 w-10 animate-pulse rounded-full bg-stone-300 [animation-delay:240ms]" />
        </div>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">Loading</p>
        <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-500 md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
