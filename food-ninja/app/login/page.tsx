"use client";

import { useState } from "react";
import Link from "next/link";
import { ActionButton } from "@/components/action-button";
import { Panel, Badge } from "@/components/ui";

export default function LoginPage() {
  const [role, setRole] = useState("Customer");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Panel className="flex flex-col justify-between p-8">
          <div className="space-y-5">
            <Badge tone="primary">Unified login portal</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">Sign in to Food Ninja.</h1>
            <p className="text-sm leading-6 text-slate-400">
              This UI keeps one login entry for all roles. The backend can route the account to the correct dashboard after authentication.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Customer", "Partner", "Admin"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${role === item ? "border-orange-400/40 bg-orange-500/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                <span className="block font-medium">{item}</span>
                <span className="text-xs text-slate-400">Role-aware routing</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-8">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Login</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Welcome back</h2>
            </div>
            <div className="grid gap-4">
              <label className="space-y-2 text-sm text-slate-300">
                Email or phone
                <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="name@example.com" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Password
                <input type="password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500" placeholder="••••••••" />
              </label>
              <label className="space-y-2 text-sm text-slate-300">
                Login target
                <select value={role} onChange={(event) => setRole(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
                  <option>Customer</option>
                  <option>Partner</option>
                  <option>Admin</option>
                </select>
              </label>
              <ActionButton endpoint="/auth/login" label={`Login as ${role}`} />
              <p className="text-xs leading-5 text-slate-500">
                Replace the placeholder request in <code className="rounded bg-white/5 px-1.5 py-0.5">components/action-button.tsx</code> or the backend bridge when real auth is ready.
              </p>
            </div>
            <p className="text-sm text-slate-400">
              New here?{" "}
              <Link href="/register" className="text-orange-300">
                Create a customer account
              </Link>
            </p>
          </div>
        </Panel>
      </div>
    </main>
  );
}
