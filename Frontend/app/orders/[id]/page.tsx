"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LiveMap } from "@/components/live-map";
import { StatusTimeline } from "@/components/status-timeline";
import { Badge, Panel } from "@/components/ui";
import { customerNav } from "@/lib/platform";
import { getAuthUser, getOnboardingDetails, apiGetPendingOrders } from "@/lib/backend";
import { useToast } from "@/components/toast-provider";

type ActiveOrder = {
  order_id: string | number;
  status: string;
  bill: string | number;
};

export default function OrderTrackingPage() {
  const params = useParams();
  const rawId = (params?.id as string) || "active";
  const { toast } = useToast();

  const [deliveryArea, setDeliveryArea] = useState<string>("Delivery location not calibrated");
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const details = getOnboardingDetails(user.username);
      if (details?.area) {
        setDeliveryArea(String(details.area));
      }

      setIsLoading(true);
      apiGetPendingOrders()
        .then((orders) => {
          if (Array.isArray(orders) && orders.length > 0) {
            if (rawId === "active") {
              setActiveOrder(orders[0]);
            } else {
              const match = orders.find((o) => String(o.order_id).toLowerCase() === String(rawId).toLowerCase());
              setActiveOrder(match || null);
            }
          } else {
            setActiveOrder(null);
          }
        })
        .catch(() => {
          setActiveOrder(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [rawId]);

  function getPhaseIndex(status?: string): number {
    if (!status) return 0;
    const s = status.toLowerCase();
    if (s === "pending") return 0;
    if (s === "preparing") return 1;
    if (s === "delivering") return 2;
    if (s === "delivered") return 3;
    return 1;
  }

  const currentPhaseIndex = activeOrder ? getPhaseIndex(activeOrder.status) : -1;

  const timelineSteps = [
    {
      label: "Order Placed & Confirmed",
      time: currentPhaseIndex >= 0 ? "Received" : "Pending",
      tone: (currentPhaseIndex >= 0 ? "success" : "neutral") as "success" | "neutral",
    },
    {
      label: "Kitchen Preparing Food",
      time: currentPhaseIndex > 1 ? "Completed" : currentPhaseIndex === 1 ? "In progress" : "Pending",
      tone: (currentPhaseIndex >= 1 ? "success" : "neutral") as "success" | "neutral",
    },
    {
      label: "Courier Picked Up & On the Way",
      time: currentPhaseIndex > 2 ? "Completed" : currentPhaseIndex === 2 ? "Live on map" : "Pending",
      tone: (currentPhaseIndex >= 2 ? "primary" : "neutral") as "primary" | "neutral",
    },
    {
      label: "Delivered to Doorstep",
      time: currentPhaseIndex >= 3 ? "Delivered" : "Pending",
      tone: (currentPhaseIndex >= 3 ? "success" : "neutral") as "success" | "neutral",
    },
  ];

  async function handleRefreshStatus() {
    setIsRefreshing(true);
    try {
      const orders = await apiGetPendingOrders();
      if (Array.isArray(orders) && orders.length > 0) {
        if (rawId === "active") {
          setActiveOrder(orders[0]);
        } else {
          const match = orders.find((o) => String(o.order_id).toLowerCase() === String(rawId).toLowerCase());
          setActiveOrder(match || null);
        }
      }
      toast("Delivery tracking updated from backend.", "success");
    } catch {
      toast("Unable to poll live courier status.", "warning");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <AppShell
      role="Customer portal"
      title={activeOrder ? `Order Tracking: #${activeOrder.order_id}` : "Order Tracking"}
      subtitle="Live GPS delivery route, courier status, and order timeline."
      nav={customerNav}
      actions={
        activeOrder ? (
          <Badge tone={activeOrder.status === "delivering" ? "success" : "primary"}>
            {activeOrder.status.toUpperCase()}
          </Badge>
        ) : (
          <Badge tone="primary">Tracking Portal</Badge>
        )
      }
    >
      {isLoading ? (
        <Panel className="p-12 text-center">
          <p className="text-sm font-semibold text-slate-700">Checking active order status...</p>
          <p className="mt-1 text-xs text-slate-400">Connecting with live order dispatcher</p>
        </Panel>
      ) : !activeOrder ? (
        /* Empty State: No real active order found in database */
        <div className="space-y-6 max-w-2xl mx-auto py-8">
          <Panel className="space-y-5 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
              🛵
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">No Active Delivery in Progress</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {rawId !== "active"
                  ? `Order #${rawId} was not found among your active orders.`
                  : "You do not have any pending orders currently being prepared or delivered."}
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 max-w-md mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Delivery Address:</span>
                <span className="font-semibold text-slate-900 text-right truncate max-w-[60%]">
                  {deliveryArea}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Active Status:</span>
                <span className="font-semibold text-slate-900">Idle (Ready to order)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/home"
                className="rounded-full bg-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition"
              >
                Browse Dhaka Restaurants →
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                View Profile & Order History
              </Link>
            </div>
          </Panel>
        </div>
      ) : (
        /* Real Order Found: Display Real Data */
        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          {/* Left Column: Live Map & Dynamic Timeline */}
          <div className="space-y-6">
            <LiveMap title="Live Courier Route" subtitle="OpenStreetMap Realtime Tracking" accent="sky" />

            <Panel className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">Timeline</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">Delivery Status Progress</h2>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                  className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
                >
                  {isRefreshing ? "Refreshing..." : "Refresh ETA"}
                </button>
              </div>

              <StatusTimeline steps={timelineSteps} />
            </Panel>
          </div>

          {/* Right Column: Order Details */}
          <div className="space-y-6">
            <Panel className="space-y-4 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">Dispatch Summary</p>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span>Order Reference</span>
                  <span className="font-mono font-bold text-slate-900">#{activeOrder.order_id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span>Delivery Destination</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[60%] truncate">
                    {deliveryArea}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span>Current Stage</span>
                  <span className="font-bold capitalize text-amber-700">{activeOrder.status}</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span>Total Bill</span>
                  <span className="font-bold text-slate-900">
                    {typeof activeOrder.bill === "number" ? `৳${activeOrder.bill}` : activeOrder.bill}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span>Courier Contact</span>
                  <span className="text-xs text-slate-500">Contact active upon arrival</span>
                </div>
              </div>
            </Panel>

            <Panel className="space-y-3 p-6">
              <p className="text-sm font-bold text-slate-900">Need adjustments or assistance?</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can adjust your saved delivery coordinates or update contact information directly from your profile settings.
              </p>
              <Link
                href="/profile"
                className="inline-block text-xs font-semibold text-amber-700 hover:underline"
              >
                Open Profile & Saved Locations →
              </Link>
            </Panel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
