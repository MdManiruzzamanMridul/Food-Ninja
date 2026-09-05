"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, StatCard, TableFrame } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { adminNav } from "@/lib/platform";
import {
  apiGetAdminPendingOwners,
  apiVerifyOwner,
  apiGetAdminPendingRestaurants,
  apiVerifyRestaurant,
} from "@/lib/backend";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [ownersData, restData] = await Promise.all([
        apiGetAdminPendingOwners(),
        apiGetAdminPendingRestaurants(),
      ]);
      setOwners(ownersData);
      setRestaurants(restData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOwner(ownerId: string, status: "approved" | "rejected") {
    setActionLoading(`owner-${ownerId}`);
    try {
      await apiVerifyOwner(ownerId, status);
      toast(`Restaurant Owner ${ownerId} has been ${status}!`, "success");
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to verify owner", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVerifyRestaurant(restaurantId: string, status: "closed") {
    setActionLoading(`rest-${restaurantId}`);
    try {
      await apiVerifyRestaurant(restaurantId, status);
      toast(`Restaurant status updated to ${status}.`, "success");
      await loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to verify restaurant", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  const pendingOwners = owners.filter((o) => o.status === "pending");
  const pendingRestaurants = restaurants.filter((r) => r.status === "pending");
  const approvedRestaurants = restaurants.filter((r) => r.status === "open");

  return (
    <AppShell
      role="Admin Portal"
      title="Platform Operations & Approvals"
      subtitle="Verify restaurant partner credentials and authorize kitchen locations for Dhaka customers."
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={loadData}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
        >
          ↻ Refresh Database
        </button>
      }
    >
      <div className="space-y-8">
        {/* Real Live Database Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Pending Owner Reviews"
            value={loading ? "..." : String(pendingOwners.length)}
            delta={pendingOwners.length > 0 ? "Action Needed" : "Up to date"}
          />
          <StatCard
            label="Pending Kitchen Approvals"
            value={loading ? "..." : String(pendingRestaurants.length)}
            delta={pendingRestaurants.length > 0 ? "Action Needed" : "Up to date"}
          />
          <StatCard
            label="Live Active Restaurants"
            value={loading ? "..." : String(approvedRestaurants.length)}
            delta="Published on App"
          />
          <StatCard
            label="Total Registered Partners"
            value={loading ? "..." : String(owners.length)}
            delta="In Database"
          />
        </div>

        {/* PRIMARY QUEUE: Pending Restaurant Owners (Action Required) */}
        <Panel className="space-y-5 p-6 border-amber-300/60 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Immediate Action Required
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Pending Restaurant Owner Applications
              </h2>
              <p className="text-xs text-slate-600">
                Review submitted owner credentials (National ID, legal name, phone). Approving an owner unlocks their dashboard to register their restaurant.
              </p>
            </div>
            <Link
              href="/admin/owners"
              className="hidden sm:inline-flex rounded-full border border-black/10 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              All Restaurant Owners →
            </Link>
          </div>

          {loading ? (
            <p className="py-6 text-center text-xs text-slate-500">Querying Neon database...</p>
          ) : pendingOwners.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center">
              <span className="text-2xl">✓</span>
              <p className="mt-1 text-sm font-bold text-emerald-900">All Owner Applications Processed</p>
              <p className="text-xs text-emerald-700 mt-0.5">There are no pending restaurant owner registrations awaiting review right now.</p>
            </div>
          ) : (
            <TableFrame>
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Owner Handle</th>
                    <th className="px-4 py-3 font-semibold">Legal Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Contact Phone</th>
                    <th className="px-4 py-3 font-semibold">National ID (NID)</th>
                    <th className="px-4 py-3 font-semibold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pendingOwners.map((owner) => (
                    <tr key={owner.owner_id} className="hover:bg-amber-50/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">@{owner.owner_id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{owner.name}</td>
                      <td className="px-4 py-3 text-slate-600">{owner.email}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{owner.phone}</td>
                      <td className="px-4 py-3 text-slate-700 font-mono font-bold bg-amber-50/50">{owner.nid}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerifyOwner(owner.owner_id, "approved")}
                            disabled={actionLoading === `owner-${owner.owner_id}`}
                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            ✓ Approve Owner
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVerifyOwner(owner.owner_id, "rejected")}
                            disabled={actionLoading === `owner-${owner.owner_id}`}
                            className="rounded-full border border-rose-300 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          )}
        </Panel>

        {/* SECONDARY QUEUE: Pending Restaurants (Action Required) */}
        <Panel className="space-y-5 p-6 border-slate-200 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Menu & Kitchen Verification
              </span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Pending Restaurant Submissions
              </h2>
              <p className="text-xs text-slate-600">
                Newly created restaurants waiting for approval. Approving publishes the restaurant to the customer browsing page (/home).
              </p>
            </div>
            <Link
              href="/admin/restaurants"
              className="hidden sm:inline-flex rounded-full border border-black/10 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Full Restaurant Directory →
            </Link>
          </div>

          {loading ? (
            <p className="py-6 text-center text-xs text-slate-500">Querying restaurants...</p>
          ) : pendingRestaurants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm font-bold text-slate-800">No Restaurants Pending Review</p>
              <p className="text-xs text-slate-500 mt-0.5">When verified owners submit a new restaurant, it will appear here for publication approval.</p>
            </div>
          ) : (
            <TableFrame>
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Restaurant Name</th>
                    <th className="px-4 py-3 font-semibold">Owner</th>
                    <th className="px-4 py-3 font-semibold">Hours</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {pendingRestaurants.map((rest) => (
                    <tr key={rest.restaurant_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{rest.name}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">@{rest.owner_id}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {rest.open_time?.slice(0, 5)} - {rest.close_time?.slice(0, 5)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="warning">PENDING</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleVerifyRestaurant(rest.restaurant_id, "closed")}
                            disabled={actionLoading === `rest-${rest.restaurant_id}`}
                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            ✓ Approve & Close
                          </button>
                        </div>
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
