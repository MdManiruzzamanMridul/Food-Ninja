import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { ownerNav, ownerOrders } from "@/lib/platform";

export default function OwnerOrdersPage() {
  const transactions = [
    { id: "TX-9001", type: "Card", amount: "৳28", status: "Captured" },
    { id: "TX-9002", type: "Wallet", amount: "৳16", status: "Pending" },
    { id: "TX-9003", type: "Cash", amount: "৳22", status: "Settled" },
  ];

  return (
    <AppShell
      role="Restaurant owner"
      title="Historical orders"
      subtitle="Past transactions and archived order data."
      nav={ownerNav}
      actions={<ActionButton endpoint="/owner/orders/export" label="Export" tone="secondary" />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel><p className="text-sm text-slate-400">Completed orders</p><p className="mt-2 text-3xl font-semibold text-white">1,284</p></Panel>
          <Panel><p className="text-sm text-slate-400">Refunds</p><p className="mt-2 text-3xl font-semibold text-white">12</p></Panel>
          <Panel><p className="text-sm text-slate-400">Net sales</p><p className="mt-2 text-3xl font-semibold text-white">৳8,940</p></Panel>
        </div>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Orders" title="Archived order table" />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ownerOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{order.id}</td>
                    <td className="px-4 py-3 text-slate-300">{order.customer}</td>
                    <td className="px-4 py-3 text-slate-300">{order.items}</td>
                    <td className="px-4 py-3"><Badge tone={order.status === "Ready" ? "success" : order.status === "Preparing" ? "warning" : "primary"}>{order.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Transactions" title="Past payment records" />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Transaction</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{transaction.id}</td>
                    <td className="px-4 py-3 text-slate-300">{transaction.type}</td>
                    <td className="px-4 py-3 text-slate-300">{transaction.amount}</td>
                    <td className="px-4 py-3 text-slate-300">{transaction.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>
      </div>
    </AppShell>
  );
}
