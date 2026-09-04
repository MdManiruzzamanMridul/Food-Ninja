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
        "rounded-3xl border border-black/5 bg-panel/90 p-5 shadow-[0_16px_44px_-28px_rgba(15,23,42,0.32)] backdrop-blur",
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
        {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-amber-700">{eyebrow}</p> : null}
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
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
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    primary: "bg-amber-100 text-amber-800 border-amber-200",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    danger: "bg-rose-100 text-rose-800 border-rose-200",
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
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {delta ? <span className={cn("text-sm font-medium", tone === "success" ? "text-emerald-700" : tone === "warning" ? "text-amber-700" : tone === "danger" ? "text-rose-700" : "text-amber-700")}>{delta}</span> : null}
      </div>
    </Panel>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-slate-100", className)} />;
}

export function TableFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto overflow-y-hidden rounded-3xl border border-black/5 bg-panel/80", className)}>
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
