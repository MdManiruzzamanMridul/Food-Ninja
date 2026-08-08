"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { NavItem } from "@/lib/platform";
import { cn, Panel } from "./ui";

export function AppShell({
  role,
  title,
  subtitle,
  nav,
  actions,
  children,
}: {
  role: string;
  title: string;
  subtitle: string;
  nav: NavItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_35%),linear-gradient(180deg,#050816_0%,#02040b_100%)] text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-[1800px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-80 transform border-r border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl transition md:static md:translate-x-0 md:rounded-[28px] md:border",
            open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex h-full flex-col gap-4">
            <Panel className="bg-panel-muted/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-orange-300/80">{role}</p>
                  <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Live
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">{subtitle}</p>
            </Panel>

            <nav className="flex flex-1 flex-col gap-2 overflow-auto">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-orange-400/25 hover:bg-orange-500/10"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{item.label}</span>
                    <span className="text-xs text-slate-400">{item.hint}</span>
                  </div>
                </Link>
              ))}
            </nav>

            <Panel className="bg-white/[0.03] p-4">
              <p className="text-sm text-slate-300">Backend bridge</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Buttons in this UI call blank-payload placeholder requests. Replace the helper in <code className="rounded bg-white/5 px-1.5 py-0.5">lib/backend.ts</code> with real API endpoints when the backend contract is ready.
              </p>
            </Panel>
          </div>
        </aside>

        {open ? <button type="button" className="fixed inset-0 z-30 bg-slate-950/70 md:hidden" aria-label="Close sidebar" onClick={() => setOpen(false)} /> : null}

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex items-center justify-between rounded-[28px] border border-white/10 bg-panel/70 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 md:hidden"
                onClick={() => setOpen(true)}
              >
                Menu
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Food Ninja</p>
                <p className="text-sm text-slate-300">Fast navigation, realtime operations, and role-specific workflows.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">{actions}</div>
          </div>

          <div className="min-w-0 flex-1">{children}</div>
        </main>
      </div>
    </div>
  );
}
