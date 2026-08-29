"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { customerNav } from "@/lib/platform";
import {
  getAuthUser,
  apiGetPendingOrders,
  clearAuthSession,
  getOnboardingDetails,
  setOnboarded,
  apiUpdateLocation,
} from "@/lib/backend";
import { useToast } from "@/components/toast-provider";
import { OSMLocationPicker } from "@/components/osm-location-picker";

type OrderItem = {
  order_id: string | number;
  status: string;
  bill: string | number;
};

export default function CustomerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<{ username: string; user_type: string; email?: string } | null>(null);
  const [profileDetails, setProfileDetails] = useState<Record<string, any> | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Location edit modal / toggle state
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLat, setTempLat] = useState(23.7925);
  const [tempLng, setTempLng] = useState(90.4078);
  const [tempArea, setTempArea] = useState("Gulshan 2, Dhaka");
  const [isSavingLocation, setIsSavingLocation] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);

      // Load saved onboarding & location data from local storage
      const savedDetails = getOnboardingDetails(authUser.username);
      if (savedDetails) {
        setProfileDetails(savedDetails);
        if (savedDetails.latitude) setTempLat(Number(savedDetails.latitude));
        if (savedDetails.longitude) setTempLng(Number(savedDetails.longitude));
        if (savedDetails.area) setTempArea(String(savedDetails.area));
      }

      // Fetch real pending orders from backend
      setLoadingOrders(true);
      apiGetPendingOrders()
        .then((fetchedOrders) => {
          if (Array.isArray(fetchedOrders)) {
            setOrders(fetchedOrders);
          }
        })
        .catch(() => {
          // If no orders yet, keep empty list
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

  async function handleSaveLocation() {
    if (!user) return;
    setIsSavingLocation(true);

    try {
      // 1. Update PostgreSQL PostGIS geography in backend
      await apiUpdateLocation({ latitude: tempLat, longitude: tempLng });

      // 2. Persist updated location details in profile storage
      const updated = {
        ...(profileDetails || {}),
        latitude: tempLat,
        longitude: tempLng,
        area: tempArea,
        updatedAt: new Date().toISOString(),
      };

      setOnboarded(user.username, updated);
      setProfileDetails(updated);
      setIsEditingLocation(false);
      toast("Delivery location updated successfully!", "success");
    } catch {
      // Offline fallback
      const updated = {
        ...(profileDetails || {}),
        latitude: tempLat,
        longitude: tempLng,
        area: tempArea,
        offlineFallback: true,
      };
      setOnboarded(user.username, updated);
      setProfileDetails(updated);
      setIsEditingLocation(false);
      toast("Location updated locally!", "success");
    } finally {
      setIsSavingLocation(false);
    }
  }

  const currentArea = profileDetails?.area || tempArea || "Gulshan 2, Dhaka";
  const currentLat = profileDetails?.latitude ? Number(profileDetails.latitude).toFixed(4) : tempLat.toFixed(4);
  const currentLng = profileDetails?.longitude ? Number(profileDetails.longitude).toFixed(4) : tempLng.toFixed(4);

  return (
    <AppShell
      role="Customer portal"
      title="Profile Overview"
      subtitle="Account credentials, active delivery location, and order history."
      nav={customerNav}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone="primary">
            {user ? `${user.username} (${user.user_type})` : "Guest"}
          </Badge>
          {user && (
            <button
              onClick={handleLogout}
              className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
            >
              Sign out
            </button>
          )}
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        {/* Left Column: Orders History */}
        <Panel className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <SectionHeading eyebrow="Order history" title="Active & Recent Orders" />
            {loadingOrders && <span className="text-xs text-amber-600 animate-pulse">Syncing orders...</span>}
          </div>

          {orders.length > 0 ? (
            <TableFrame>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-black/5">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order ID</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Total Bill</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id} className="border-t border-black/5">
                      <td className="px-4 py-3 font-medium text-slate-900">{order.order_id}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {typeof order.bill === "number" ? `৳${order.bill}` : order.bill}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableFrame>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-slate-50/70 p-8 text-center space-y-3">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-bold text-xl">
                🛍️
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-800">No orders placed yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your active deliveries and past completed meals will appear here as soon as you place an order.
                </p>
              </div>
              <Link
                href="/home"
                className="inline-flex rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition"
              >
                Browse Restaurants →
              </Link>
            </div>
          )}
        </Panel>

        {/* Right Column: Account Details & Location */}
        <div className="space-y-6">
          {/* Profile Details */}
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Account" title="Personal Details" />
            <div className="grid gap-3.5">
              <label className="text-xs font-semibold text-slate-700">
                Username
                <input
                  readOnly
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none"
                  value={user?.username || "Not signed in"}
                />
              </label>
              <label className="text-xs font-semibold text-slate-700">
                Full Legal Name
                <input
                  readOnly
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none"
                  value={profileDetails?.legalName || "Standard Account"}
                />
              </label>
              <label className="text-xs font-semibold text-slate-700">
                Contact Phone
                <input
                  readOnly
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none font-mono"
                  value={profileDetails?.phone || "Not set"}
                />
              </label>
            </div>
          </Panel>

          {/* Delivery Location & Map Editor */}
          <Panel className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <SectionHeading eyebrow="Delivery coordinates" title="Delivery Location" />
              <button
                type="button"
                onClick={() => setIsEditingLocation((prev) => !prev)}
                className="rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 shadow-xs"
              >
                {isEditingLocation ? "Cancel" : "Edit Location"}
              </button>
            </div>

            {/* Current Active Location Card */}
            <div className="rounded-2xl border border-black/10 bg-slate-50/80 p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-bold text-slate-900">{currentArea}</span>
                </div>
                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-mono text-slate-600 font-medium">
                  {currentLat}° N, {currentLng}° E
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Couriers use these PostGIS coordinates to compute delivery distance, ETA, and optimal routing.
              </p>
            </div>

            {/* Expandable OpenStreetMap Editor */}
            {isEditingLocation && (
              <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/30 p-4 animate-fadeIn">
                <div>
                  <p className="text-xs font-bold text-slate-900">Pin New Delivery Location on OpenStreetMap</p>
                  <p className="text-[11px] text-slate-500">
                    Click anywhere on the map, drag the pin, or click "My Live GPS" to set your coordinates.
                  </p>
                </div>

                <OSMLocationPicker
                  initialLat={Number(profileDetails?.latitude || tempLat)}
                  initialLng={Number(profileDetails?.longitude || tempLng)}
                  onLocationChange={(lat, lng, address) => {
                    setTempLat(lat);
                    setTempLng(lng);
                    if (address) setTempArea(address);
                  }}
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingLocation(false)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveLocation}
                    disabled={isSavingLocation}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition disabled:opacity-50"
                  >
                    <span>{isSavingLocation ? "Saving..." : "Save Location"}</span>
                  </button>
                </div>
              </div>
            )}
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
