"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { adminNav } from "@/lib/platform";
import { apiGetAdminPendingOwners, apiVerifyOwner } from "@/lib/backend";

type OwnerRow = {
  owner_id: string;
  name: string;
  email: string;
  phone: string;
  nid: string;
  status: string;
};

export default function AdminOwnersPage() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<OwnerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOwners();
  }, []);

  async function loadOwners() {
    setLoading(true);
    try {
      const data = await apiGetAdminPendingOwners();
      setOwners(Array.isArray(data) ? data : []);
    } catch {
      setOwners([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(ownerId: string, status: "approved" | "rejected") {
    setActionLoading(ownerId);
    try {
      await apiVerifyOwner(ownerId, status);
      toast(`Restaurant Owner @${ownerId} marked as ${status}!`, "success");
      await loadOwners();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Action failed", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingCount = owners.filter((o) => o.status === "pending").length;

  return (
    <AppShell
      role="Admin panel"
      title="Restaurant Owner Approvals"
      subtitle="Review submitted restaurant owner credentials from the database to authorize kitchen operations."
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={loadOwners}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
        >
          ↻ Refresh Owners
        </button>
      }
    >
      <div className="space-y-6">
        <Panel className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <SectionHeading
              eyebrow="Direct database records"
              title="Restaurant Owner Verification Queue"
              description="Partners registered in PostgreSQL table 'restaurant_owner'. Approved owners can immediately create and dispatch menus."
            />
            <Badge tone={pendingCount > 0 ? "warning" : "success"}>
              {pendingCount} Pending Review
            </Badge>
          </div>

          {loading ? (
            <p className="py-8 text-center text-xs text-slate-500">Querying restaurant_owner table from database...</p>
          ) : owners.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-bold text-slate-900">No restaurant owners registered yet</p>
              <p className="text-xs text-slate-500 mt-1">When partners register with role &apos;Restaurant Owner&apos;, their credentials will appear here.</p>
            </div>
          ) : (
            <TableFrame>
              <table className="min-w-max w-full text-left text-xs">
                <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Owner Handle</th>
                    <th className="px-4 py-3 font-semibold">Legal Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">National ID (NID)</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {owners.map((owner) => (
                    <tr key={owner.owner_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">@{owner.owner_id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{owner.name}</td>
                      <td className="px-4 py-3 text-slate-600">{owner.email}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{owner.phone}</td>
                      <td className="px-4 py-3 text-slate-700 font-mono font-bold bg-amber-50/50">{owner.nid}</td>
                      <td className="px-4 py-3">
                        <Badge tone={owner.status === "approved" ? "success" : owner.status === "rejected" ? "danger" : "warning"}>
                          {owner.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {owner.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleVerify(owner.owner_id, "approved")}
                              disabled={actionLoading === owner.owner_id}
                              className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              ✓ Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerify(owner.owner_id, "rejected")}
                              disabled={actionLoading === owner.owner_id}
                              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : owner.status === "approved" ? (
                          <button
                            type="button"
                            onClick={() => handleVerify(owner.owner_id, "rejected")}
                            disabled={actionLoading === owner.owner_id}
                            className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleVerify(owner.owner_id, "approved")}
                            disabled={actionLoading === owner.owner_id}
                            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
                          >
                            Re-Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
