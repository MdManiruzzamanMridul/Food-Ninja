import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, StatCard, TableFrame } from "@/components/ui";
import { riderNav } from "@/lib/platform";

export default function RiderEarningsPage() {
  const earnings = [
    { date: "Mon", trips: 8, amount: "$42" },
    { date: "Tue", trips: 11, amount: "$59" },
    { date: "Wed", trips: 10, amount: "$51" },
    { date: "Thu", trips: 12, amount: "$64" },
  ];

  return (
    <AppShell
      role="Rider app"
      title="Earnings"
      subtitle="Payment history, total balances, and completed trips."
      nav={riderNav}
      actions={<Badge tone="success">Balance $1,284</Badge>}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Completed trips" value="428" delta="+14" tone="success" />
          <StatCard label="Pending payout" value="$184" delta="Tomorrow" tone="warning" />
          <StatCard label="Total balance" value="$1,284" delta="+9%" />
        </div>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Payments" title="Weekly earning log" />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Day</th>
                  <th className="px-4 py-3 font-medium">Trips</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((item) => (
                  <tr key={item.date} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{item.date}</td>
                    <td className="px-4 py-3 text-slate-300">{item.trips}</td>
                    <td className="px-4 py-3 text-slate-300">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
          <ActionButton endpoint="/rider/earnings/export" label="Export earnings" tone="secondary" />
        </Panel>
      </div>
    </AppShell>
  );
}
