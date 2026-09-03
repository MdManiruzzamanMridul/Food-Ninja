export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-6 text-slate-900 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between rounded-[28px] border border-black/5 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div className="space-y-1.5">
            <div className="h-3 w-24 rounded-full bg-amber-200/60" />
            <div className="h-4 w-56 rounded-full bg-slate-200" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-18 rounded-full bg-slate-100" />
            <div className="h-9 w-28 rounded-full bg-amber-300/70" />
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[36px] border border-black/5 bg-white p-8 shadow-sm md:p-12 space-y-6">
            <div className="h-7 w-48 rounded-full bg-amber-100" />
            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded-2xl bg-slate-200" />
              <div className="h-5 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="h-14 rounded-2xl bg-slate-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-h-72 rounded-[30px] bg-slate-200/80 sm:row-span-2" />
            <div className="min-h-44 rounded-[30px] bg-slate-200/80" />
            <div className="min-h-44 rounded-[30px] bg-slate-200/80" />
          </div>
        </section>
      </div>
    </main>
  );
}
