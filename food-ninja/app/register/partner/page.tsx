"use client";

import { ActionButton } from "@/components/action-button";
import { Panel, Badge } from "@/components/ui";

export default function PartnerRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-6">
        <Panel className="p-8">
          <Badge tone="primary">Split registration</Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Register riders and restaurant owners.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            This single page handles both partner types while keeping the backend contract separate. Route each form to a different service when your teammate wires the API.
          </p>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="p-8">
            <Badge tone="success">Rider onboarding</Badge>
            <div className="mt-5 grid gap-4">
              <label className="space-y-2 text-sm text-slate-300"><span>Name</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Phone</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Vehicle type</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Bike / scooter" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Documents</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="License and ID" /></label>
              <ActionButton endpoint="/auth/register/rider" label="Register rider" />
            </div>
          </Panel>

          <Panel className="p-8">
            <Badge tone="primary">Restaurant owner onboarding</Badge>
            <div className="mt-5 grid gap-4">
              <label className="space-y-2 text-sm text-slate-300"><span>Restaurant name</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Contact person</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Business license</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <label className="space-y-2 text-sm text-slate-300"><span>Bank account</span><input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" /></label>
              <ActionButton endpoint="/auth/register/owner" label="Register restaurant owner" />
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
}
