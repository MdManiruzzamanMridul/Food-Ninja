"use client";

import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { adminNav } from "@/lib/platform";

export default function AdminPaymentsPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Payments & Dispatches"
      subtitle="Transaction logs, platform fee collection, and restaurant partner payouts."
      nav={adminNav}
      actions={<Badge tone="neutral">৳0.00 In escrow</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Transactions" title="Platform Payment Log" />
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-1">
            <p className="text-sm font-bold text-slate-800">No transactions recorded yet</p>
            <p className="text-xs text-slate-500">Customer online checkouts and cash-on-delivery reconciliations will log here automatically.</p>
          </div>
        </Panel>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Payout management" title="Partner Disbursements" />
          <div className="rounded-2xl border border-black/5 bg-slate-50 p-6 space-y-3 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Platform Commission Rate:</span>
              <span className="font-bold text-slate-900">0.0% (Promo tier)</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Restaurant Balances:</span>
              <span className="font-bold text-slate-900">৳0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Rider Payouts:</span>
              <span className="font-bold text-slate-900">৳0.00</span>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
