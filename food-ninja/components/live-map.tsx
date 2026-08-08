import { cn } from "./ui";

export function LiveMap({
  title,
  subtitle,
  accent = "orange",
}: {
  title: string;
  subtitle: string;
  accent?: "orange" | "emerald" | "sky";
}) {
  const accentClass =
    accent === "emerald"
      ? "from-emerald-500/25 via-emerald-400/10 to-transparent"
      : accent === "sky"
        ? "from-sky-500/25 via-sky-400/10 to-transparent"
        : "from-orange-500/25 via-orange-400/10 to-transparent";

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1020]">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.26em] text-slate-400">{subtitle}</p>
      </div>
      <div className="relative h-[340px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px]">
        <div className={cn("absolute inset-0 bg-gradient-to-br", accentClass)} />
        <div className="absolute left-[12%] top-[22%] h-4 w-4 rounded-full border-4 border-white bg-orange-500 shadow-[0_0_0_12px_rgba(249,115,22,0.18)]" />
        <div className="absolute left-[68%] top-[26%] h-4 w-4 rounded-full border-4 border-white bg-emerald-400 shadow-[0_0_0_12px_rgba(34,197,94,0.18)]" />
        <div className="absolute left-[42%] top-[60%] h-4 w-4 rounded-full border-4 border-white bg-sky-400 shadow-[0_0_0_12px_rgba(56,189,248,0.18)]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 16 22 C 28 20, 36 30, 43 40 S 59 60, 69 28" fill="none" stroke="rgba(249,115,22,0.9)" strokeWidth="1.4" strokeDasharray="4 2" />
          <path d="M 42 61 C 48 58, 58 48, 68 29" fill="none" stroke="rgba(56,189,248,0.7)" strokeWidth="1.1" strokeDasharray="3 2" />
        </svg>
        <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Realtime position</p>
          <p className="mt-1 text-sm text-white">GPS lock stable • refreshed now</p>
        </div>
        <div className="absolute right-5 top-5 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ETA</p>
          <p className="mt-1 text-xl font-semibold text-white">6 min</p>
        </div>
      </div>
    </div>
  );
}
