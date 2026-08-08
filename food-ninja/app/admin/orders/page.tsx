import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav, adminOrders } from "@/lib/platform";

export default function AdminOrdersPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Global orders"
      subtitle="Platform-wide order visibility and status control."
      nav={adminNav}
      actions={<ActionButton endpoint="/admin/orders/export" label="Export" tone="secondary" />}
    >
      <Panel className="space-y-4 p-6">
        <SectionHeading eyebrow="Orders" title="All platform orders" />
        <TableFrame>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Restaurant</th>
                <th className="px-4 py-3 font-medium">Rider</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.map((order) => (
                <tr key={order.id} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.customer}</td>
                  <td className="px-4 py-3 text-slate-300">{order.restaurant}</td>
                  <td className="px-4 py-3 text-slate-300">{order.rider}</td>
                  <td className="px-4 py-3"><Badge tone={order.status === "Delivered" ? "success" : order.status === "In transit" ? "warning" : "danger"}>{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      </Panel>
    </AppShell>
  );
}
