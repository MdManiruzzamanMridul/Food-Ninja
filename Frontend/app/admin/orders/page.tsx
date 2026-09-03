"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { adminNav } from "@/lib/platform";
import { apiGetPendingOrders } from "@/lib/backend";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await apiGetPendingOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      role="Admin panel"
      title="Global Orders"
      subtitle="Platform-wide order visibility and delivery status control."
      nav={adminNav}
      actions={
        <button
          type="button"
          onClick={loadOrders}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
        >
          ↻ Sync Orders
        </button>
      }
    >
      <Panel className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <SectionHeading eyebrow="Live dispatch" title="Platform Order Stream" />
          <Badge tone="primary">{orders.length} Active</Badge>
        </div>

        {loading ? (
          <p className="py-8 text-center text-xs text-slate-500">Connecting with order dispatch...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center space-y-1">
            <p className="text-sm font-bold text-slate-800">No active delivery tickets in transit</p>
            <p className="text-xs text-slate-500">Live order dispatches and rider pickups will stream into this table in real time.</p>
          </div>
        ) : (
          <TableFrame>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-black/5 bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Created At</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {orders.map((order) => (
                  <tr key={order.order_id || order.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{order.order_id || order.id}</td>
                    <td className="px-4 py-3 text-slate-700">{order.stage || "Placed"}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono">{order.created_at || "Recent"}</td>
                    <td className="px-4 py-3">
                      <Badge tone="warning">{order.status || "In progress"}</Badge>
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
