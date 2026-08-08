"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "./ui";

export function AuthChrome({
  nav,
  children,
}: {
  nav: Array<{ href: string; label: string }>;
  children: ReactNode;
}) {
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
    <div className="w-full rounded-[24px] border border-white/10 bg-panel/72 px-4 py-3 backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
            onClick={handleBack}
          >
            ← Back
          </button>
        </div>

        <Link href="/" className="justify-self-center text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-amber-200/75">Food Ninja</p>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 lg:max-w-[55%]">
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
                    ? "border-amber-300/20 bg-amber-500/10 text-amber-100"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
