import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav, adminPayments } from "@/lib/platform";

export default function AdminPaymentsPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Payments"
      subtitle="Transaction logs, platform fee collection, and payout management."
      nav={adminNav}
      actions={<Badge tone="success">Fee collected $2,486</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Transactions" title="Global payment log" />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Ref</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Fee</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminPayments.map((payment) => (
                  <tr key={payment.ref} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{payment.ref}</td>
                    <td className="px-4 py-3 text-slate-300">{payment.type}</td>
                    <td className="px-4 py-3 text-slate-300">{payment.amount}</td>
                    <td className="px-4 py-3 text-slate-300">{payment.fee}</td>
                    <td className="px-4 py-3 text-slate-300">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Payout management" title="Platform fees and disbursements" />
          <div className="space-y-3">
            <ActionButton endpoint="/admin/payments/reconcile" label="Reconcile" />
            <ActionButton endpoint="/admin/payments/payout" label="Trigger payout" tone="secondary" />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
