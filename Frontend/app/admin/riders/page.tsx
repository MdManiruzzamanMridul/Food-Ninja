"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { adminNav } from "@/lib/platform";
import { apiGetAdminPendingRiders, apiVerifyRider, type AdminRiderRow } from "@/lib/backend";

export default function AdminRidersPage() {
  const { toast } = useToast();
  const [riders, setRiders] = useState<AdminRiderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function loadRiders() {
    setLoading(true);
    try {
      setRiders(await apiGetAdminPendingRiders());
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to load riders", "danger");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRiders();
  }, []);

  async function approveRider(username: string) {
    setActionLoading(username);
    try {
      await apiVerifyRider(username, "offline");
      toast(`Rider @${username} approved and marked offline.`, "success");
      await loadRiders();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to approve rider", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AppShell
      role="Admin panel"
      title="Rider Approvals"
      subtitle="Review delivery partner applications and approve riders for the delivery network."
      nav={adminNav}
      actions={<button type="button" onClick={loadRiders} className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold">Refresh Riders</button>}
    >
      <Panel className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <SectionHeading eyebrow="Delivery fleet" title="Rider Applications" />
          <Badge tone="warning">{riders.filter((rider) => rider.status === "pending").length} Pending</Badge>
        </div>
        {loading ? (
          <p className="py-8 text-center text-xs text-slate-500">Loading rider applications...</p>
        ) : riders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">No rider applications found.</p>
        ) : (
          <TableFrame>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Username</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {riders.map((rider) => (
                  <tr key={rider.username}>
                    <td className="px-4 py-3 font-mono font-bold">@{rider.username}</td>
                    <td className="px-4 py-3">{rider.name}</td>
                    <td className="px-4 py-3 text-slate-600">{rider.email}<br />{rider.phone}</td>
                    <td className="px-4 py-3 uppercase">{rider.vehicle}</td>
                    <td className="px-4 py-3"><Badge tone={rider.status === "offline" ? "success" : "warning"}>{rider.status.toUpperCase()}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      {rider.status === "pending" && (
                        <button type="button" onClick={() => approveRider(rider.username)} disabled={actionLoading === rider.username} className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white disabled:opacity-50">Approve</button>
                      )}
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
