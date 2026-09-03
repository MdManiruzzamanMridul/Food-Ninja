"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiRegister } from "@/lib/backend";

export default function PartnerRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"rider" | "admin">("rider");

  // Rider Form State
  const [riderName, setRiderName] = useState("");
  const [riderUsername, setRiderUsername] = useState("");
  const [riderEmail, setRiderEmail] = useState("");
  const [riderPhone, setRiderPhone] = useState("");
  const [riderPassword, setRiderPassword] = useState("");
  const [riderVehicle, setRiderVehicle] = useState<"bike" | "bicycle">("bike");
  const [riderLoading, setRiderLoading] = useState(false);

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  async function handleRiderRegister(e: React.FormEvent) {
    e.preventDefault();

    if (
      !riderName.trim() ||
      !riderUsername.trim() ||
      !riderEmail.trim() ||
      !riderPhone.trim() ||
      !riderPassword.trim() ||
      !riderVehicle
    ) {
      toast("Please fill in all rider registration fields", "warning");
      return;
    }

    setRiderLoading(true);
    try {
      await apiRegister({
        user_type: "rider",
        name: riderName.trim(),
        username: riderUsername.trim().toLowerCase(),
        email: riderEmail.trim(),
        phone: riderPhone.trim(),
        password: riderPassword.trim(),
        vehicle: riderVehicle,
      });

      toast("Rider registered successfully! Redirecting to login...", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to register rider";
      toast(errorMsg, "danger");
    } finally {
      setRiderLoading(false);
    }
  }

  async function handleAdminRegister(e: React.FormEvent) {
    e.preventDefault();

    if (
      !adminUsername.trim() ||
      !adminEmail.trim() ||
      !adminPhone.trim() ||
      !adminPassword.trim()
    ) {
      toast("All admin fields are required (Username, Email, Phone, Password)", "warning");
      return;
    }

    setAdminLoading(true);
    try {
      await apiRegister({
        user_type: "admin",
        username: adminUsername.trim().toLowerCase(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        password: adminPassword.trim(),
      });

      toast("Admin registered successfully! Redirecting to login...", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to register admin";
      toast(errorMsg, "danger");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register Customer" },
            { href: "/register/partner", label: "Register Rider / Admin" },
          ]}
        >
          <Panel className="p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="primary">Partner & Admin Onboarding</Badge>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {activeTab === "rider" ? "Rider Registration" : "Admin Registration"}
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  {activeTab === "rider"
                    ? "Join our fleet as a delivery rider. Choose your vehicle type (Bike or Bicycle)."
                    : "Create an administrative account with platform oversight permissions."}
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("rider")}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    activeTab === "rider"
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  Rider
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("admin")}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    activeTab === "admin"
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  Admin
                </button>
              </div>
            </div>
          </Panel>

          {/* Rider Registration Form */}
          {activeTab === "rider" ? (
            <Panel className="p-8">
              <form onSubmit={handleRiderRegister} className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Full Name *</span>
                  <input
                    value={riderName}
                    onChange={(e) => {
                      setRiderName(e.target.value);
                      if (!riderUsername) {
                        setRiderUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase());
                      }
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. Rahim Khan"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Username *</span>
                  <input
                    value={riderUsername}
                    onChange={(e) => setRiderUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. rahim_rider"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    value={riderEmail}
                    onChange={(e) => setRiderEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="rahim@example.com"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Phone Number *</span>
                  <input
                    value={riderPhone}
                    onChange={(e) => setRiderPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="01700000000"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Password *</span>
                  <input
                    type="password"
                    value={riderPassword}
                    onChange={(e) => setRiderPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </label>

                {/* Vehicle Selection Dropdown: Options are Bike and Bicycle */}
                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Vehicle Type *</span>
                  <select
                    value={riderVehicle}
                    onChange={(e) => setRiderVehicle(e.target.value as "bike" | "bicycle")}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                    required
                  >
                    <option value="bike">Bike (Motorcycle / Two-wheeler)</option>
                    <option value="bicycle">Bicycle</option>
                  </select>
                </label>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={riderLoading}
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                    )}
                  >
                    {riderLoading ? "Registering Rider..." : "Register as Delivery Rider"}
                  </button>
                </div>
              </form>
            </Panel>
          ) : (
            /* Admin Registration Form */
            <Panel className="p-8">
              <form onSubmit={handleAdminRegister} className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Admin Username *</span>
                  <input
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. admin_sam"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Admin Email *</span>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="admin@foodninja.com"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Admin Phone *</span>
                  <input
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="01700000000"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300 sm:col-span-1">
                  <span>Password *</span>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={adminLoading}
                    className={cn(
                      "inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                    )}
                  >
                    {adminLoading ? "Registering Admin..." : "Register Admin Account"}
                  </button>
                </div>
              </form>
            </Panel>
          )}

          <div className="text-center text-sm text-slate-400">
            Already registered?{" "}
            <Link href="/login" className="text-orange-300 hover:underline">
              Sign in to your account
            </Link>
          </div>
        </AuthChrome>
      </div>
    </main>
  );
}
