"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui";

type RoleOption = {
  id: "user" | "rider" | "owner" | "admin";
  code: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  icon: "user" | "rider" | "owner" | "admin";
};

const ROLES: RoleOption[] = [
  {
    id: "user",
    code: "01",
    title: "Customer",
    category: "Food Enthusiast",
    description: "Browse 100+ Dhaka culinary spots, real-time live routing, and fast door delivery.",
    badge: "Foodie",
    icon: "user",
  },
  {
    id: "rider",
    code: "02",
    title: "Delivery Partner",
    category: "Logistics Fleet",
    description: "Accept instant trip dispatches across Dhaka with motorbike or bicycle. Flexible daily payouts.",
    badge: "Fleet",
    icon: "rider",
  },
  {
    id: "owner",
    code: "03",
    title: "Restaurant Owner",
    category: "Merchant Partner",
    description: "List food items, optimize kitchen throughput, and tap into citywide food orders.",
    badge: "Merchant",
    icon: "owner",
  },
  {
    id: "admin",
    code: "04",
    title: "Platform Admin",
    category: "Operations Control",
    description: "Monitor platform metrics, manage partner accounts, and maintain city operations.",
    badge: "Console",
    icon: "admin",
  },
];

function RoleIcon({ type }: { type: RoleOption["icon"] }) {
  if (type === "user") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (type === "rider") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L9 9l3-3 3.5 3 2.5-.5" />
        <path d="M12 17.5V14l-3-2.5" />
      </svg>
    );
  }
  if (type === "owner") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function RegisterRoleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!open) return null;

  function handleSelectRole(roleId: RoleOption["id"]) {
    onClose();
    router.push(`/register?role=${roleId}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 sm:p-6 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white text-slate-900 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 font-bold">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                  Food Ninja
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Create Account
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Choose Account Type
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select your account type to configure the right interface and permissions. You can register quickly with just your email and password.
          </p>

          {/* Grid of Clean White Role Cards */}
          <div className="grid gap-3.5 sm:grid-cols-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleSelectRole(role.id)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-50/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors duration-200 group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-white">
                      <RoleIcon type={role.icon} />
                    </div>
                    <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 group-hover:bg-amber-200 group-hover:text-amber-900 transition-colors">
                      {role.badge}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">
                      {role.category}
                    </p>
                    <h3 className="mt-0.5 text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                      {role.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-200/70 pt-3 text-xs font-semibold text-slate-700 group-hover:text-amber-700 transition-colors">
                  <span>Register as {role.title.split(" ")[0]}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>Already registered with an account?</span>
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 transition hover:underline"
            >
              <span>Sign in here</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
