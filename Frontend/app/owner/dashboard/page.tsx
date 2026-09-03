import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, StatCard } from "@/components/ui";
import { ownerNav, ownerOrders, ownerRevenue } from "@/lib/platform";

export default function OwnerDashboardPage() {
  const columns = {
    New: ownerOrders.filter((order) => order.status === "New"),
    Preparing: ownerOrders.filter((order) => order.status === "Preparing"),
    Ready: ownerOrders.filter((order) => order.status === "Ready"),
  };

  return (
    <AppShell
      role="Restaurant owner"
      title="Owner dashboard"
      subtitle="Incoming orders, active statuses, and revenue performance in one dense workspace."
      nav={ownerNav}
      actions={<ActionButton endpoint="/owner/refresh" label="Sync board" tone="secondary" />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {ownerRevenue.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Incoming" title="Realtime order pop-up" description="This card mirrors the toast-like urgency of new food delivery tickets." />
            <div className="rounded-[24px] border border-orange-400/20 bg-orange-500/10 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">New order • OD-9012</p>
                  <p className="text-sm text-slate-300">2 x Wings, 1 x Bowl • Maya</p>
                </div>
                <Badge tone="primary">Now</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionButton endpoint="/owner/orders/accept" label="Accept" />
                <ActionButton endpoint="/owner/orders/reject" label="Reject" tone="secondary" />
              </div>
            </div>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Revenue analytics" title="Trend view" />
            <div className="space-y-3">
              {[72, 45, 88, 62, 96, 78].map((height, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-slate-400">D{index + 1}</span>
                  <div className="h-3 flex-1 rounded-full bg-white/5">
                    <div className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-300" style={{ width: `${height}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <section className="space-y-3">
          <SectionHeading eyebrow="Kanban" title="Order management board" description="New, Preparing, and Ready columns can later map to your real-time order service." />
          <div className="grid gap-4 xl:grid-cols-3">
            {Object.entries(columns).map(([title, orders]) => (
              <Panel key={title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">{title}</p>
                  <Badge tone="neutral">{orders.length}</Badge>
                </div>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">{order.id}</p>
                      <p className="mt-1 text-sm text-slate-400">{order.customer}</p>
                      <p className="mt-3 text-sm text-slate-300">{order.items}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{order.time}</span>
                        <ActionButton endpoint="/owner/orders/move" label="Move" tone="secondary" />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
