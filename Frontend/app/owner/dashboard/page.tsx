"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Badge, Panel, SectionHeading, StatCard, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { ownerNav } from "@/lib/platform";
import {
  getAuthUser,
  clearAuthSession,
  setAuthSession,
  getAuthToken,
  apiGetOwnerStatus,
  apiGetOwnerRestaurants,
  apiCreateRestaurant,
  apiDeleteRestaurant,
  type OwnerRestaurant,
} from "@/lib/backend";
import { OSMLocationPicker } from "@/components/osm-location-picker";
import { Modal } from "@/components/modal";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<{ username: string; user_type: string; email?: string } | null>(null);
  const [ownerStatus, setOwnerStatus] = useState<string>("pending");
  const [ownerDetails, setOwnerDetails] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Restaurants state
  const [restaurants, setRestaurants] = useState<OwnerRestaurant[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  // Add Restaurant Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [restName, setRestName] = useState("");
  const [openTime, setOpenTime] = useState("10:00:00");
  const [closeTime, setCloseTime] = useState("23:00:00");
  const [latitude, setLatitude] = useState(23.7925);
  const [longitude, setLongitude] = useState(90.4078);
  const [areaAddress, setAreaAddress] = useState("Gulshan, Dhaka");
  const [submittingRestaurant, setSubmittingRestaurant] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<OwnerRestaurant | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      router.push("/login?role=owner");
      return;
    }
    setUser(authUser);

    // Fetch live status from backend
    loadOwnerData();
  }, []);

  async function loadOwnerData() {
    setIsLoadingStatus(true);
    try {
      const data = await apiGetOwnerStatus();
      setOwnerStatus(data.status);
      setOwnerDetails(data);

      const token = getAuthToken();
      const current = getAuthUser();
      if (token && current) {
        setAuthSession(token, { ...current, status: data.status });
      }

      if (data.status === "approved") {
        await loadRestaurants();
      }
    } catch {
      // If offline or pending, fallback to session status
      const current = getAuthUser();
      if (current?.status) {
        setOwnerStatus(current.status);
      }
    } finally {
      setIsLoadingStatus(false);
    }
  }

  async function loadRestaurants() {
    setLoadingRestaurants(true);
    try {
      const list = await apiGetOwnerRestaurants();
      setRestaurants(list);
      // If approved and no restaurant registered yet, automatically prompt the wizard
      if (list.length === 0) {
        setShowAddModal(true);
      }
    } catch {
      // ignore
    } finally {
      setLoadingRestaurants(false);
    }
  }

  async function handleRefreshStatus() {
    setIsRefreshing(true);
    try {
      const data = await apiGetOwnerStatus();
      setOwnerStatus(data.status);
      setOwnerDetails(data);

      const token = getAuthToken();
      const current = getAuthUser();
      if (token && current) {
        setAuthSession(token, { ...current, status: data.status });
      }

      if (data.status === "approved") {
        toast("Congratulations! Your account has been approved by the Admin.", "success");
        await loadRestaurants();
      } else {
        toast("Application still pending admin verification.", "warning");
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to refresh verification status", "danger");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleCreateRestaurant(e: React.FormEvent) {
    e.preventDefault();

    if (!restName.trim()) {
      toast("Please enter your restaurant name", "warning");
      return;
    }

    setSubmittingRestaurant(true);
    try {
      const res = await apiCreateRestaurant({
        name: restName.trim(),
        open_time: openTime,
        close_time: closeTime,
        latitude,
        longitude,
      });

      toast(res.message || "Restaurant registered and submitted for Admin verification!", "success");
      setShowAddModal(false);
      setRestName("");
      await loadRestaurants();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create restaurant", "danger");
    } finally {
      setSubmittingRestaurant(false);
    }
  }

  async function handleDeleteRestaurant() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiDeleteRestaurant(deleteTarget.restaurant_id);
      toast(`Restaurant "${deleteTarget.name}" deleted successfully`, "success");
      setDeleteTarget(null);
      await loadRestaurants();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete restaurant", "danger");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleLogout() {
    clearAuthSession();
    toast("Logged out successfully", "default");
    router.push("/login?role=owner");
  }

  // 1. LOADING STATE
  if (isLoadingStatus) {
    return (
      <AppShell
        role="Restaurant Owner"
        title="Owner Workspace"
        subtitle="Verifying owner authorization status..."
        nav={ownerNav}
      >
        <Panel className="p-12 text-center">
          <p className="text-sm font-semibold text-slate-700">Connecting with verification server...</p>
        </Panel>
      </AppShell>
    );
  }

  // 2. PENDING VERIFICATION GATE
  // If owner is pending admin verification, block access to all other sections
  if (ownerStatus === "pending") {
    return (
      <AppShell
        role="Restaurant Owner"
        title="Verification Pending"
        subtitle="Your application is currently undergoing platform administrator review."
        nav={[{ href: "/owner/dashboard", label: "Verification Status", hint: "Review queue" }]}
      >
        <div className="max-w-2xl mx-auto py-6 space-y-6">
          <Panel className="space-y-6 p-8 text-center border-amber-300/60 bg-white shadow-xl shadow-amber-950/5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
              ⏳
            </div>

            <div className="space-y-2">
              <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800">
                PENDING ADMIN VERIFICATION
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Restaurant Owner Review In Progress
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                Thank you for joining Food Ninja! Your business profile has been submitted and is currently being evaluated by our platform administration team. While your account is under review, access to customer menus and restaurant operations is temporarily locked.
              </p>
            </div>

            {/* Submitted Owner Details */}
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-5 text-left space-y-3 text-xs">
              <p className="font-bold text-slate-800 text-sm border-b border-black/5 pb-2">
                Your Submitted Business Profile
              </p>
              <div className="grid gap-2 sm:grid-cols-2 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Owner Handle:</span>
                  <span className="font-semibold text-slate-900 font-mono">@{user?.username}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Full Legal Name:</span>
                  <span className="font-semibold text-slate-900">{ownerDetails?.name || user?.username}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Email:</span>
                  <span className="font-semibold text-slate-900">{ownerDetails?.email || user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="font-semibold text-slate-900">{ownerDetails?.phone || "Submitted"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">National ID / NID:</span>
                  <span className="font-semibold text-slate-900 font-mono">{ownerDetails?.nid || "Verified"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Verification Status:</span>
                  <span className="font-bold text-amber-700">Under Admin Review</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
                className="rounded-full bg-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-500/25 hover:bg-amber-600 transition disabled:opacity-50"
              >
                {isRefreshing ? "Checking Status..." : "Refresh Verification Status"}
              </button>
            </div>
          </Panel>
        </div>
      </AppShell>
    );
  }

  // 3. APPROVED WORKSPACE
  return (
    <AppShell
      role="Restaurant Owner"
      title="Owner Dashboard"
      subtitle="Manage your restaurants, operating hours, OpenStreetMap delivery radius, and incoming tickets."
      nav={ownerNav}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone="success">✓ Verified Partner</Badge>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-amber-600 transition"
          >
            + Add Restaurant
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Section: My Restaurants List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeading
              eyebrow="Business locations"
              title="My Restaurants"
              description="Manage the restaurants tied to your verified owner account."
            />
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-xs hover:bg-slate-50 transition"
            >
              <span>+ Register New Restaurant</span>
            </button>
          </div>

          {loadingRestaurants ? (
            <Panel className="p-8 text-center text-slate-500 text-xs">
              Loading restaurants from Neon database...
            </Panel>
          ) : restaurants.length === 0 ? (
            <Panel className="p-8 text-center space-y-3 bg-amber-50/40 border-amber-200">
              <p className="text-sm font-bold text-slate-900">No restaurants registered yet</p>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Now that your account is approved, add your restaurant details and pin its location on OpenStreetMap to begin taking orders.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center rounded-full bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition"
              >
                Register Your First Restaurant →
              </button>
            </Panel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((rest) => (
                <Panel key={rest.restaurant_id} className="space-y-4 p-5 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base font-bold text-slate-900">{rest.name}</p>
                      <Badge tone={rest.status === "open" ? "success" : rest.status === "pending" ? "warning" : "neutral"}>
                        {rest.status === "open" ? "Live on App" : rest.status === "pending" ? "Pending Admin" : rest.status}
                      </Badge>
                    </div>

                    <div className="rounded-xl border border-black/5 bg-slate-50 p-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Operating Hours:</span>
                        <span className="font-semibold text-slate-900 font-mono">
                          {rest.open_time?.slice(0, 5)} - {rest.close_time?.slice(0, 5)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>GPS Coordinates:</span>
                        <span className="font-mono text-slate-700 font-medium">
                          {Number(rest.latitude).toFixed(3)}°, {Number(rest.longitude).toFixed(3)}°
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-[50%]">
                      {rest.restaurant_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(rest)}
                      className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                </Panel>
              ))}
            </div>
          )}
        </section>

        {/* Section: Revenue & Analytics Stats */}
        <section className="space-y-4">
          <SectionHeading eyebrow="Performance" title="Kitchen Operations & Metrics" />
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard label="Today's Orders" value={restaurants.length > 0 ? "0 active" : "0"} delta="+0%" />
            <StatCard label="Total Revenue" value="৳0.00" delta="+0%" />
            <StatCard label="Active Kitchen Status" value={restaurants.some(r => r.status === 'open') ? "Open" : "Pending review"} delta="Live" />
          </div>
        </section>
      </div>

      {/* POST-VERIFICATION RESTAURANT SETUP MODAL */}
      <Modal
        open={showAddModal}
        title="Register Your Restaurant"
        description="Provide your restaurant name, daily operating hours, and pin your kitchen on OpenStreetMap."
        onClose={() => setShowAddModal(false)}
      >
        <form onSubmit={handleCreateRestaurant} className="space-y-4 text-xs">
          {/* Restaurant Name */}
          <label className="block space-y-1.5 font-medium text-slate-700">
            <span className="font-semibold text-slate-900">Restaurant Name *</span>
            <input
              value={restName}
              onChange={(e) => setRestName(e.target.value)}
              placeholder="e.g. Saffron Palace Grill"
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </label>

          {/* Operating Hours */}
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5 font-medium text-slate-700">
              <span className="font-semibold text-slate-900">Opening Time *</span>
              <input
                type="time"
                value={openTime.slice(0, 5)}
                onChange={(e) => setOpenTime(`${e.target.value}:00`)}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white font-mono"
                required
              />
            </label>
            <label className="block space-y-1.5 font-medium text-slate-700">
              <span className="font-semibold text-slate-900">Closing Time *</span>
              <input
                type="time"
                value={closeTime.slice(0, 5)}
                onChange={(e) => setCloseTime(`${e.target.value}:00`)}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white font-mono"
                required
              />
            </label>
          </div>

          {/* Location Picker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Pin Kitchen on OpenStreetMap *</span>
              <span className="font-mono text-[10px] text-slate-500">
                {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Click on the map or drag the pin to set your exact kitchen dispatch point.
            </p>
            <OSMLocationPicker
              initialLat={latitude}
              initialLng={longitude}
              onLocationChange={(lat, lng, address) => {
                setLatitude(lat);
                setLongitude(lng);
                if (address) setAreaAddress(address);
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black/5">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingRestaurant}
              className="rounded-full bg-amber-500 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition disabled:opacity-50"
            >
              {submittingRestaurant ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        open={Boolean(deleteTarget)}
        title="Delete Restaurant"
        description="Are you sure you want to delete this restaurant? This action cannot be undone."
        onClose={() => setDeleteTarget(null)}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Deleting <span className="font-bold text-slate-900">{deleteTarget?.name}</span> will remove it from the Food Ninja directory and cancel any pending orders.
          </p>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Keep Restaurant
            </button>
            <button
              type="button"
              onClick={handleDeleteRestaurant}
              disabled={isDeleting}
              className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
