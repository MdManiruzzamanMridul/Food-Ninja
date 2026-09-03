"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { adminNav } from "@/lib/platform";
import { apiGetAdminPendingRestaurants, apiVerifyRestaurant } from "@/lib/backend";

type RestaurantRow = {
  restaurant_id: string;
  name: string;
  owner_id: string;
  owner_name?: string;
  open_time: string;
  close_time: string;
  status: string;
};

export default function AdminRestaurantsPage() {
  const { toast } = useToast();
  const [restaurants, setRestaurants] = useState<RestaurantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    setLoading(true);
    try {
      const data = await apiGetAdminPendingRestaurants();
      setRestaurants(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(restaurantId: string, status: "open" | "rejected" | "closed") {
    setActionLoading(restaurantId);
    try {
      await apiVerifyRestaurant(restaurantId, status);
      toast(`Restaurant status updated to ${status}! It is now ${status === 'open' ? 'live on customer feed' : 'offline'}.`, "success");
      await loadRestaurants();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Verification action failed", "danger");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AppShell
      role="Admin panel"
      title="Restaurant Approvals"
      subtitle="Verify submitted restaurants to authorize publishing them on the customer app."
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={loadRestaurants}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
        >
          Sync Review Queue
        </button>
      }
    >
      <div className="space-y-6">
        <Panel className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <SectionHeading
              eyebrow="Review queue"
              title="Partner Restaurant Verification"
              description="Approve restaurants submitted by verified owners to make them visible to Dhaka customers."
            />
            <Badge tone="primary">{restaurants.filter(r => r.status === 'pending').length} Pending</Badge>
          </div>

          {loading ? (
            <p className="py-8 text-center text-xs text-slate-500">Loading restaurants...</p>
          ) : restaurants.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-8 text-center">
              <p className="text-sm font-bold text-slate-900">No restaurants in queue</p>
              <p className="text-xs text-slate-500 mt-1">When approved restaurant owners create kitchens, they will appear here for verification.</p>
            </div>
          ) : (
            <TableFrame>
              <table className="w-full text-left text-xs">
                <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Restaurant ID</th>
                    <th className="px-4 py-3 font-semibold">Restaurant Name</th>
                    <th className="px-4 py-3 font-semibold">Owner</th>
                    <th className="px-4 py-3 font-semibold">Hours</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {restaurants.map((rest) => (
                    <tr key={rest.restaurant_id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{rest.restaurant_id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{rest.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span>{rest.owner_name || rest.owner_id}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">@{rest.owner_id}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {rest.open_time?.slice(0, 5)} - {rest.close_time?.slice(0, 5)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={rest.status === "open" ? "success" : rest.status === "rejected" ? "danger" : "warning"}>
                          {rest.status === "open" ? "LIVE ON APP" : rest.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {rest.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleVerify(rest.restaurant_id, "open")}
                              disabled={actionLoading === rest.restaurant_id}
                              className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                              Approve & Publish
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVerify(rest.restaurant_id, "rejected")}
                              disabled={actionLoading === rest.restaurant_id}
                              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : rest.status === "open" ? (
                          <button
                            type="button"
                            onClick={() => handleVerify(rest.restaurant_id, "closed")}
                            disabled={actionLoading === rest.restaurant_id}
                            className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition disabled:opacity-50"
                          >
                            Unpublish (Close)
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleVerify(rest.restaurant_id, "open")}
                            disabled={actionLoading === rest.restaurant_id}
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
