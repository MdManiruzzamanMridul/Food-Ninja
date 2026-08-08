import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { ownerNav } from "@/lib/platform";

export default function OwnerSettingsPage() {
  return (
    <AppShell
      role="Restaurant owner"
      title="Settings"
      subtitle="Operating hours, profile details, and banking information."
      nav={ownerNav}
      actions={<Badge tone="primary">Restaurant profile</Badge>}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="space-y-4 p-6 lg:col-span-2">
          <SectionHeading eyebrow="Restaurant profile" title="Core business details" />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Saffron House" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Dhaka" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="11:00 AM" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="11:30 PM" />
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Signature biryani and grill menu." />
          <ActionButton endpoint="/owner/settings/profile" label="Save restaurant profile" />
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Banking" title="Payout account" />
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Bank name and IBAN" />
            <ActionButton endpoint="/owner/settings/bank" label="Save banking details" tone="secondary" />
          </Panel>
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Operating hours" title="Schedule controls" />
            <p className="text-sm leading-6 text-slate-400">Backend can later expose blackout dates, holiday overrides, and pause-dining mode.</p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
