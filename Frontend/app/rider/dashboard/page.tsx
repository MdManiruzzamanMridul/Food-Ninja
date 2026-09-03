import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { LiveMap } from "@/components/live-map";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { riderNav } from "@/lib/platform";
import { StatusToggle } from "@/components/status-toggle";

export default function RiderDashboardPage() {
  return (
    <AppShell
      role="Rider app"
      title="Delivery dashboard"
      subtitle="Availability, routing, and one-tap delivery phase updates."
      nav={riderNav}
      actions={<StatusToggle endpoint="/rider/availability" initial />}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-6">
          <LiveMap title="Dhaka Courier Map" subtitle="Realtime OpenStreetMap" accent="emerald" />
          <Panel className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <SectionHeading eyebrow="Delivery phase" title="One-tap status updates" />
              <ActionButton endpoint="/rider/refresh" label="Refresh" tone="secondary" />
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionButton endpoint="/rider/update-phase" label="Picked Up" />
              <ActionButton endpoint="/rider/update-phase" label="Arrived" tone="secondary" />
              <ActionButton endpoint="/rider/update-phase" label="Delivered" tone="secondary" />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Assignments" title="Active Delivery Requests" />
            <div className="rounded-2xl border border-black/10 bg-slate-50/70 p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800">No active delivery requests</p>
              <p className="text-xs text-slate-500">
                You are currently marked as available. Incoming orders from nearby restaurants will appear here.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
