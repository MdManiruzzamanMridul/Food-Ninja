"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f1720_0%,#111a26_100%)] text-slate-50">
      <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="w-full rounded-[24px] border border-white/10 bg-panel/72 px-4 py-3 backdrop-blur">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 md:hidden"
                  onClick={() => setOpen(true)}
                >
                  Menu
                </button>
              </div>

              <Link href="/" className="justify-self-center text-center">
                <p className="text-sm uppercase tracking-[0.22em] text-amber-200/75">Food Ninja</p>
              </Link>

              <div className="flex items-center justify-end gap-3">{actions}</div>
            </div>

            <nav className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-white/10 pt-3">
              {nav.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-orange-400/30 bg-orange-500/15 text-orange-100"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <div className="flex gap-6">
            <aside
              className={cn(
                "fixed inset-y-0 left-0 z-40 w-80 transform border-r border-white/10 bg-slate-950/90 p-4 backdrop-blur-xl transition md:static md:translate-x-0 md:rounded-[24px] md:border",
                open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              )}
            >
              <div className="flex h-full flex-col gap-4">
                <Panel className="bg-panel-muted/78 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-200/75">{role}</p>
                      <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
                    </div>
                    <span className="rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100">
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
                      prefetch={false}
                      className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-amber-300/20 hover:bg-white/8"
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

            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
