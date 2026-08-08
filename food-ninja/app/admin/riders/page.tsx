import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav, adminRiders } from "@/lib/platform";

export default function AdminRidersPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Riders"
      subtitle="Approve, reject, and suspend rider accounts."
      nav={adminNav}
      actions={<Badge tone="primary">Onboarding queue</Badge>}
    >
      <Panel className="space-y-4 p-6">
        <SectionHeading eyebrow="Riders" title="Rider review table" />
        <TableFrame>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {adminRiders.map((rider) => (
                <tr key={rider.name} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{rider.name}</td>
                  <td className="px-4 py-3 text-slate-300">{rider.city}</td>
                  <td className="px-4 py-3 text-slate-300">{rider.vehicle}</td>
                  <td className="px-4 py-3 text-slate-300">{rider.trips}</td>
                  <td className="px-4 py-3"><Badge tone={rider.status === "Approved" ? "success" : rider.status === "Suspended" ? "danger" : "warning"}>{rider.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <ActionButton endpoint="/admin/riders/action" label="Review" tone="secondary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      </Panel>
    </AppShell>
  );
}
