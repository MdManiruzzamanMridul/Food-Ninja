"use client";

import Link from "next/link";
import { ActionButton } from "@/components/action-button";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto max-w-6xl">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
            { href: "/register/partner", label: "Partner" },
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <Panel className="p-8">
              <Badge tone="primary">Customer registration</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Create your customer profile.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Use this page for account creation, address capture, and preference setup. Backend validation and OTP flows can be attached later without changing the layout.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Saved addresses</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Order history</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Reviews and ratings</div>
              </div>
            </Panel>

            <Panel className="p-8">
              <div className="grid gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  Full name
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Your name" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Phone number
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="+880 1..." />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Email
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="name@example.com" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Password
                  <input type="password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Create password" />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  Default delivery address
                  <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Home, street, city" />
                </label>
                <ActionButton endpoint="/auth/register/customer" label="Create account" />
              </div>
              <p className="mt-5 text-sm text-slate-400">
                Need partner onboarding?{" "}
                <Link href="/register/partner" className="text-orange-300">
                  Use the split registration page
                </Link>
              </p>
            </Panel>
          </div>
        </AuthChrome>
      </div>
    </main>
  );
}
