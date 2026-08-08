import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { customerNav } from "@/lib/platform";

export default function CustomerProfilePage() {
  const orders = [
    ["FD-2012", "Delivered", "৳24", "Yesterday"],
    ["FD-2013", "Canceled", "৳18", "3 days ago"],
    ["FD-2014", "Delivered", "৳31", "1 week ago"],
  ];

  return (
    <AppShell
      role="Customer portal"
      title="Profile"
      subtitle="Order history, saved addresses, and reviews."
      nav={customerNav}
      actions={<Badge tone="primary">3 saved addresses</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="space-y-5 p-6">
          <SectionHeading eyebrow="Order history" title="Recent orders" />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order[0]} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{order[0]}</td>
                    <td className="px-4 py-3 text-slate-300">{order[1]}</td>
                    <td className="px-4 py-3 text-slate-300">{order[2]}</td>
                    <td className="px-4 py-3 text-slate-400">{order[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Account" title="Profile details" />
            <div className="grid gap-4">
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Ava Johnson" />
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="ava@example.com" />
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="+880 123 456" />
              <ActionButton endpoint="/profile/update" label="Save profile" />
            </div>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Saved addresses" title="Fast checkout defaults" />
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Home — 12 Lake Road</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Office — 48 North Avenue</div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
