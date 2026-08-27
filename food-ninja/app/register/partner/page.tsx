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

  // Admin registration form state
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  // Partner form state
  const [partnerType, setPartnerType] = useState<"admin" | "partner">("admin");

  async function handleAdminRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!adminUsername.trim() || !adminEmail.trim() || !adminPhone.trim() || !adminPassword.trim()) {
      toast("All admin fields are required (Username, Email, Phone, Password)", "warning");
      return;
    }

    setAdminLoading(true);
    try {
      await apiRegister({
        username: adminUsername.trim(),
        email: adminEmail.trim(),
        phone: adminPhone.trim(),
        password: adminPassword.trim(),
        user_type: "admin",
      });

      toast("Admin account registered successfully! Redirecting to login...", "success");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to register admin", "danger");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
            { href: "/register/partner", label: "Admin & Partners" },
          ]}
        >
          <Panel className="p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge tone="primary">Role registration</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">Admin & Partner Onboarding</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                  Register administrators or partners with direct integration into the Food Ninja backend database.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPartnerType("admin")}
                  className={cn(
                    "rounded-2xl border px-4 py-2 text-sm font-medium transition",
                    partnerType === "admin"
                      ? "border-orange-400/40 bg-orange-500/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  )}
                >
                  Admin Setup
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerType("partner")}
                  className={cn(
                    "rounded-2xl border px-4 py-2 text-sm font-medium transition",
                    partnerType === "partner"
                      ? "border-orange-400/40 bg-orange-500/15 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                  )}
                >
                  Riders & Owners
                </button>
              </div>
            </div>
          </Panel>

          {partnerType === "admin" ? (
            <div className="mx-auto max-w-2xl">
              <Panel className="p-8">
                <Badge tone="warning">Admin registration</Badge>
                <form onSubmit={handleAdminRegister} className="mt-5 grid gap-4">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Admin Username *</span>
                    <input
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="e.g. admin_sam"
                      required
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-300">
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

                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Admin Phone *</span>
                    <input
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                      placeholder="+880 1700 000000"
                      required
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-300">
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

                  <button
                    type="submit"
                    disabled={adminLoading}
                    className={cn(
                      "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                    )}
                  >
                    {adminLoading ? "Registering admin..." : "Register Admin"}
                  </button>
                </form>
                <p className="mt-5 text-sm text-slate-400">
                  Already have an admin account?{" "}
                  <Link href="/login" className="text-orange-300 hover:underline">
                    Sign in as Admin
                  </Link>
                </p>
              </Panel>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Panel className="p-8">
                <Badge tone="success">Rider onboarding</Badge>
                <div className="mt-5 grid gap-4">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Full name</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Rider Name" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Phone</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="+880 1..." />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Vehicle type</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Bike / scooter" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Documents</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="License and ID" />
                  </label>
                </div>
              </Panel>

              <Panel className="p-8">
                <Badge tone="primary">Restaurant owner onboarding</Badge>
                <div className="mt-5 grid gap-4">
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Restaurant name</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Restaurant Name" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Contact person</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Contact Name" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Business license</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="License Number" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Bank account</span>
                    <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Account Details" />
                  </label>
                </div>
              </Panel>
            </div>
          )}
        </AuthChrome>
      </div>
    </main>
  );
}
