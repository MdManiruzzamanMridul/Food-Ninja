"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { NavItem } from "@/lib/platform";
import { cn, Panel } from "./ui";
import { getAuthUser, apiLogout, type AuthUser } from "@/lib/backend";
import { useToast } from "./toast-provider";

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }

  async function handleLogout() {
    try {
      await apiLogout();
      toast("Signed out successfully", "neutral");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  }

  return (
    <div className="light-app min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),linear-gradient(180deg,#fffaf2_0%,#f6f1e8_100%)] text-slate-900">
      <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
        <div className="space-y-6">
          <header className="w-full rounded-[24px] border border-black/5 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
                  onClick={() => setOpen(true)}
                >
                  Menu
                </button>
              </div>

              <Link href="/" className="justify-self-center text-center">
                <p className="text-sm uppercase tracking-[0.22em] text-amber-700">Food Ninja</p>
              </Link>

              <div className="flex items-center justify-end gap-2">
                {actions}
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/20"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>

            <nav className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-black/5 pt-3">
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
                        ? "border-amber-300 bg-amber-100 text-amber-800"
                        : "border-black/10 bg-white text-slate-600 hover:bg-amber-50 hover:text-slate-900",
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
                "fixed inset-y-0 left-0 z-40 w-80 transform border-r border-black/10 bg-[#fffaf2]/95 p-4 shadow-xl backdrop-blur-xl transition md:static md:translate-x-0 md:rounded-[24px] md:border",
                open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
              )}
            >
              <div className="flex h-full flex-col gap-4">
                <Panel className="bg-panel-muted/90 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-amber-700">{role}</p>
                      <h1 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h1>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                      Live
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
                </Panel>

                <nav className="flex flex-1 flex-col gap-2 overflow-auto">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 shadow-sm transition hover:border-amber-200 hover:bg-amber-50"
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-800">{item.label}</span>
                        <span className="text-xs text-slate-500">{item.hint}</span>
                      </div>
                    </Link>
                  ))}
                </nav>

                <Panel className="bg-amber-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    {user ? `Logged in as: ${user.username}` : "Guest session"}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {user ? `Role: ${user.user_type}` : "Sign in to access personalized orders and settings."}
                  </p>
                  {user && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-3 w-full rounded-xl bg-red-500/10 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-500/20"
                    >
                      Log out
                    </button>
                  )}
                </Panel>
              </div>
            </aside>

            {open ? <button type="button" className="fixed inset-0 z-30 bg-slate-950/35 md:hidden" aria-label="Close sidebar" onClick={() => setOpen(false)} /> : null}

            <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
