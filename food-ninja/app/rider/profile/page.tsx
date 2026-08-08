import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { riderNav } from "@/lib/platform";

export default function RiderProfilePage() {
  return (
    <AppShell
      role="Rider app"
      title="Profile"
      subtitle="Vehicle details and rating history."
      nav={riderNav}
      actions={<Badge tone="primary">4.9 rider rating</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Identity" title="Vehicle and contact info" />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Rahim" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="+880 123 456" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Bike" />
            <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Dhaka" />
          </div>
          <ActionButton endpoint="/rider/profile/save" label="Save profile" />
        </Panel>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Ratings" title="Feedback history" />
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Great communication • 5.0</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Fast delivery • 4.8</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Careful handling • 5.0</div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
