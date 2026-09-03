"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav } from "@/lib/platform";
import { apiGetAdminUsers, type AdminUserRow } from "@/lib/backend";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await apiGetAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      role="Admin panel"
      title="Users & Customer Accounts"
      subtitle="Registered customer accounts queried directly from the PostgreSQL 'users' table."
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={loadUsers}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
        >
          ↻ Refresh Database Users
        </button>
      }
    >
      <Panel className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <SectionHeading
            eyebrow="Direct database records"
            title="Registered Customer Directory"
            description="Accounts registered in PostgreSQL table 'users'. Shows live wallet balances and account statuses."
          />
          <Badge tone="primary">{users.length} Registered Users</Badge>
        </div>

        {loading ? (
          <p className="py-8 text-center text-xs text-slate-500">Querying users table from Neon database...</p>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-1">
            <p className="text-sm font-bold text-slate-800">No customer accounts found in database</p>
            <p className="text-xs text-slate-500">When users sign up with role 'Customer', their records will populate here directly from the database.</p>
          </div>
        ) : (
          <TableFrame>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Username</th>
                  <th className="px-4 py-3 font-semibold">Customer Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Wallet Balance</th>
                  <th className="px-4 py-3 font-semibold text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map((user) => (
                  <tr key={user.username} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">@{user.username}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{user.name || "Customer"}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono">{user.phone}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      ৳{Number(user.balance || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge tone={user.status === "ok" ? "success" : user.status === "banned" ? "danger" : "neutral"}>
                        {(user.status || "active").toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        )}
      </Panel>
    </AppShell>
  );
}
