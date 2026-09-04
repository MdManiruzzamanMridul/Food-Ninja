"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { adminNav } from "@/lib/platform";
import { apiGetPendingAdmins, apiVerifyAdmin, type AdminApprovalRow } from "@/lib/backend";

export default function AdminApprovalsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminApprovalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadAdmins() {
    setLoading(true);
    try {
      setAdmins(await apiGetPendingAdmins());
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to load admin applications", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function approveAdmin(username: string) {
    setActionLoading(username);
    try {
      await apiVerifyAdmin(username, "approved");
      toast(`Admin @${username} approved.`, "success");
      await loadAdmins();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to approve admin", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AppShell
      role="Admin panel"
      title="Admin Approvals"
      subtitle="Only approved administrators can access platform facilities."
      nav={adminNav}
      actions={<button type="button" onClick={loadAdmins} className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold">Refresh Admins</button>}
    >
      <Panel className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <SectionHeading eyebrow="Platform security" title="Pending Admin Accounts" />
          <Badge tone="warning">{admins.length} Pending</Badge>
        </div>
        {loading ? (
          <p className="py-8 text-center text-xs text-slate-500">Loading admin applications...</p>
        ) : admins.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">No pending admin accounts.</p>
        ) : (
          <TableFrame>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Username</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {admins.map((admin) => (
                  <tr key={admin.username}>
                    <td className="px-4 py-3 font-mono font-bold">@{admin.username}</td>
                    <td className="px-4 py-3 text-slate-600">{admin.email}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{admin.phone}</td>
                    <td className="px-4 py-3"><Badge tone="warning">{admin.status.toUpperCase()}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => approveAdmin(admin.username)} disabled={actionLoading === admin.username} className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white disabled:opacity-50">Approve</button>
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
