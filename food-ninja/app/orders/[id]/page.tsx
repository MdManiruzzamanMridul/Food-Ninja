import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { LiveMap } from "@/components/live-map";
import { StatusTimeline } from "@/components/status-timeline";
import { Badge, Panel } from "@/components/ui";
import { customerNav, orderTimeline } from "@/lib/platform";

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <AppShell
      role="Customer portal"
      title={`Order ${params.id}`}
      subtitle="Realtime order tracking with live map and status timeline."
      nav={customerNav}
      actions={<Badge tone="success">ETA 6 min</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-6">
          <LiveMap title="Live delivery route" subtitle="Customer tracking" accent="sky" />
          <Panel className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Realtime</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Order status timeline</h2>
              </div>
              <ActionButton endpoint="/orders/refresh" label="Refresh ETA" tone="secondary" />
            </div>
            <StatusTimeline
              steps={orderTimeline.map((step) => ({
                label: step.label,
                time: step.time,
                tone:
                  step.tone === "muted"
                    ? "neutral"
                    : step.tone === "success"
                      ? "success"
                      : step.tone === "warning"
                        ? "warning"
                        : "primary",
              }))}
            />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Order info</p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Restaurant</span><span className="text-white">Saffron House</span></div>
              <div className="flex items-center justify-between"><span>Rider</span><span className="text-white">Rahim</span></div>
              <div className="flex items-center justify-between"><span>ETA</span><span className="text-white">6 min</span></div>
              <div className="flex items-center justify-between"><span>Delivery phase</span><span className="text-white">Picked up</span></div>
            </div>
          </Panel>

          <Panel className="space-y-3 p-6">
            <p className="text-sm font-semibold text-slate-800">Need help with your order?</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you need to change your address or contact your rider, you can review your details in your profile.
            </p>
            <Link href="/profile" className="inline-block text-xs font-semibold text-amber-700 hover:underline">
              View Profile & Saved Coordinates →
            </Link>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
