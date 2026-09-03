import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, StatCard, TableFrame } from "@/components/ui";
import { adminMetrics, adminNav, adminOrders } from "@/lib/platform";

export default function AdminDashboardPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Platform control center"
      subtitle="High-volume metrics, active deliveries, and financial oversight."
      nav={adminNav}
      actions={<ActionButton endpoint="/admin/refresh" label="Refresh metrics" tone="secondary" />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {adminMetrics.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Global orders" title="Live platform delivery view" />
            <TableFrame>
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.map((order) => (
                    <tr key={order.id} className="border-t border-white/10">
                      <td className="px-4 py-3 text-white">{order.id}</td>
                      <td className="px-4 py-3 text-slate-300">{order.status}</td>
                      <td className="px-4 py-3 text-slate-300">{order.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Platform health" title="Realtime monitoring" />
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><span className="text-slate-300">Active deliveries</span><Badge tone="success">1,142</Badge></div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><span className="text-slate-300">Pending approvals</span><Badge tone="warning">28</Badge></div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><span className="text-slate-300">Failed payments</span><Badge tone="danger">4</Badge></div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
