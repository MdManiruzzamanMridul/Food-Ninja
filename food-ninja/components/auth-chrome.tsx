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
    <div className="w-full rounded-[24px] border border-black/5 bg-white/85 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
            onClick={handleBack}
          >
            ← Back
          </button>
        </div>

        <Link href="/" className="justify-self-center text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-amber-700">Food Ninja</p>
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
                    ? "border-amber-300 bg-amber-100 text-amber-800"
                    : "border-black/10 bg-white text-slate-600 hover:bg-amber-50 hover:text-slate-900",
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
