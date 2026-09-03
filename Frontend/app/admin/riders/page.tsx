"use client";

import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { adminNav } from "@/lib/platform";

export default function AdminRidersPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Rider Management"
      subtitle="Review delivery partner applications, vehicle documentation, and active dispatch statuses."
      nav={adminNav}
      actions={<Badge tone="neutral">0 In review</Badge>}
    >
      <Panel className="space-y-4 p-6">
        <SectionHeading eyebrow="Delivery fleet" title="Rider Applications" />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-1">
          <p className="text-sm font-bold text-slate-800">No pending delivery partner applications</p>
          <p className="text-xs text-slate-500">When riders sign up with bike or bicycle verification, their profiles will appear here for platform approval.</p>
        </div>
      </Panel>
    </AppShell>
  );
}
