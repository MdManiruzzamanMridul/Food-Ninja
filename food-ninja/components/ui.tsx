import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-panel/90 p-5 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.75)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow ? <p className="text-xs uppercase tracking-[0.3em] text-orange-300/70">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const toneClasses = {
    neutral: "bg-white/8 text-slate-200 border-white/10",
    primary: "bg-orange-500/15 text-orange-200 border-orange-400/30",
    success: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    warning: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    danger: "bg-rose-500/15 text-rose-200 border-rose-400/30",
  }[tone];

  return <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium", toneClasses)}>{children}</span>;
}

export function StatCard({
  label,
  value,
  delta,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  return (
    <Panel className="p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
        {delta ? <span className={cn("text-sm font-medium", tone === "success" ? "text-emerald-300" : tone === "warning" ? "text-amber-300" : tone === "danger" ? "text-rose-300" : "text-orange-300")}>{delta}</span> : null}
      </div>
    </Panel>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/8", className)} />;
}

export function TableFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-white/10 bg-panel/85", className)}>
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  return <Badge tone={tone}>{children}</Badge>;
}
