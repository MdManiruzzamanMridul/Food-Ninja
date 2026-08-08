import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav, adminUsers } from "@/lib/platform";

export default function AdminUsersPage() {
  return (
    <AppShell
      role="Admin panel"
      title="Users"
      subtitle="Dense customer account management table."
      nav={adminNav}
      actions={<ActionButton endpoint="/admin/users/search" label="Sync users" tone="secondary" />}
    >
      <Panel className="space-y-4 p-6">
        <SectionHeading eyebrow="Accounts" title="User table" />
        <TableFrame>
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.email} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white">{user.name}</td>
                  <td className="px-4 py-3 text-slate-300">{user.role}</td>
                  <td className="px-4 py-3 text-slate-300">{user.email}</td>
                  <td className="px-4 py-3"><Badge tone={user.status === "Active" ? "success" : user.status === "Verified" ? "primary" : "warning"}>{user.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <ActionButton endpoint="/admin/users/action" label="Manage" tone="secondary" />
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
