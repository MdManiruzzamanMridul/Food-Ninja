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
        "rounded-3xl border border-white/10 bg-panel/85 p-5 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.55)] backdrop-blur",
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
        {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-amber-200/70">{eyebrow}</p> : null}
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
    neutral: "bg-white/6 text-slate-200 border-white/10",
    primary: "bg-amber-500/12 text-amber-100 border-amber-400/20",
    success: "bg-emerald-500/12 text-emerald-100 border-emerald-400/20",
    warning: "bg-amber-500/12 text-amber-100 border-amber-400/20",
    danger: "bg-rose-500/12 text-rose-100 border-rose-400/20",
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
        {delta ? <span className={cn("text-sm font-medium", tone === "success" ? "text-emerald-200" : tone === "warning" ? "text-amber-200" : tone === "danger" ? "text-rose-200" : "text-amber-200")}>{delta}</span> : null}
      </div>
    </Panel>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/6", className)} />;
}

export function TableFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-white/10 bg-panel/80", className)}>
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
