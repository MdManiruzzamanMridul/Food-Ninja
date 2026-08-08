import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav, adminRestaurants } from "@/lib/platform";

export default function AdminRestaurantsPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Restaurants"
      subtitle="Approve, reject, and suspend restaurant applications."
      nav={adminNav}
      actions={<Badge tone="primary">Review queue</Badge>}
    >
      <Panel className="space-y-4 p-6">
        <SectionHeading eyebrow="Applications" title="Restaurant approval table" />
        <TableFrame>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {adminRestaurants.map((restaurant) => (
                <tr key={restaurant.name} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{restaurant.name}</td>
                  <td className="px-4 py-3 text-slate-300">{restaurant.city}</td>
                  <td className="px-4 py-3 text-slate-300">{restaurant.owner}</td>
                  <td className="px-4 py-3 text-slate-300">{restaurant.rating}</td>
                  <td className="px-4 py-3"><Badge tone={restaurant.status === "Approved" ? "success" : restaurant.status === "Suspended" ? "danger" : "warning"}>{restaurant.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <ActionButton endpoint="/admin/restaurants/action" label="Review" tone="secondary" />
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
