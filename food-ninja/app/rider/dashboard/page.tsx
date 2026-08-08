import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { LiveMap } from "@/components/live-map";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { riderDeliveries, riderNav } from "@/lib/platform";
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
          <LiveMap title="Current delivery map" subtitle="Realtime routing" accent="emerald" />
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
            <SectionHeading eyebrow="Assignments" title="Incoming requests" />
            <div className="space-y-3">
              {riderDeliveries.map((delivery) => (
                <div key={delivery.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{delivery.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{delivery.distance} • ETA {delivery.eta}</p>
                    </div>
                    <Badge tone={delivery.status === "Arrived" ? "warning" : delivery.status === "Picked Up" ? "primary" : "neutral"}>{delivery.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Route response" title="Keep the backend contract blank" />
            <p className="text-sm leading-6 text-slate-400">
              Each action button already posts an empty payload. Once the rider service exists, map the phase updates and GPS sync into those endpoints.
            </p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
