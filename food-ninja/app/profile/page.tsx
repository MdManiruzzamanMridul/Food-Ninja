"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { customerNav } from "@/lib/platform";
import { getAuthUser, apiGetPendingOrders, clearAuthSession } from "@/lib/backend";

type OrderItem = {
  order_id: string | number;
  status: string;
  bill: string | number;
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; user_type: string; email?: string } | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
      // Try to fetch real pending orders from backend
      setLoadingOrders(true);
      apiGetPendingOrders()
        .then((fetchedOrders) => {
          if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
            setOrders(fetchedOrders);
          }
        })
        .catch(() => {
          // Fallback gracefully if no orders yet
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, []);

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  const fallbackOrders = [
    { order_id: "FD-2012", status: "Delivered", bill: "৳240" },
    { order_id: "FD-2013", status: "Pending", bill: "৳180" },
    { order_id: "FD-2014", status: "Preparing", bill: "৳310" },
  ];

  const displayOrders = orders.length > 0 ? orders : fallbackOrders;

  return (
    <AppShell
      role="Customer portal"
      title="Profile"
      subtitle="Order history, saved addresses, and active session."
      nav={customerNav}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone="primary">
            {user ? `${user.username} (${user.user_type})` : "Guest"}
          </Badge>
          {user && (
            <button
              onClick={handleLogout}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
            >
              Sign out
            </button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <SectionHeading eyebrow="Order history" title="Active & Recent orders" />
            {loadingOrders && <span className="text-xs text-amber-400">Syncing with backend...</span>}
          </div>
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total Bill</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order.order_id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-medium text-white">{order.order_id}</td>
                    <td className="px-4 py-3 text-slate-300">
                      <span className="inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs text-amber-300">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{typeof order.bill === "number" ? `৳${order.bill}` : order.bill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Account" title="Profile details" />
            <div className="grid gap-4">
              <label className="text-xs text-slate-400">
                Username / Identifier
                <input
                  readOnly
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  value={user?.username || "Not logged in"}
                />
              </label>
              <label className="text-xs text-slate-400">
                Role / Type
                <input
                  readOnly
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
                  value={user?.user_type || "guest"}
                />
              </label>
            </div>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Saved addresses" title="Fast checkout defaults" />
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Home — 12 Lake Road, Gulshan</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Office — 48 North Avenue, Banani</div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
