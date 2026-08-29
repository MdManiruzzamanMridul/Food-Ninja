"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiRegister } from "@/lib/backend";

type RoleOption = {
  id: "user" | "rider" | "admin" | "owner";
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  tone: string;
};

const ROLES: RoleOption[] = [
  {
    id: "user",
    title: "Customer (Foodie)",
    subtitle: "Explore 100+ Dhaka restaurants, order meals, & track deliveries in real time.",
    badge: "Most Popular",
    icon: "🛒",
    tone: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
  },
  {
    id: "rider",
    title: "Delivery Rider",
    subtitle: "Deliver orders with motorbike or bicycle and earn flexibly on your own schedule.",
    badge: "Earn Daily",
    icon: "🛵",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
  {
    id: "owner",
    title: "Restaurant Owner",
    subtitle: "List your restaurant, manage food menus, and grow business across Dhaka.",
    badge: "Partner",
    icon: "🏪",
    tone: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  },
  {
    id: "admin",
    title: "Platform Admin",
    subtitle: "Oversee ecosystem operations, verify partner onboarding, and track metrics.",
    badge: "Staff",
    icon: "🛡️",
    tone: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleOption["id"]>("user");

  // Simplified Form state: strictly Email, Phone, Password
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "bicycle">("bike");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !phone.trim() || !password) {
      toast("Please provide your Email, Phone Number, and Password", "warning");
      return;
    }

    setLoading(true);
    try {
      // Derive clean username and default name from email prefix
      const cleanPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || `user_${Date.now().toString().slice(-4)}`;
      const derivedUsername = cleanPrefix.toLowerCase();
      const derivedName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);

      if (selectedRole === "admin") {
        await apiRegister({
          user_type: "admin",
          username: derivedUsername,
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
      } else if (selectedRole === "rider") {
        await apiRegister({
          user_type: "rider",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: phone.trim(),
          password,
          vehicle,
        } as any);
      } else {
        // Customer or Owner registration
        await apiRegister({
          user_type: "user",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
      }

      toast("Account created successfully! Redirecting to login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create account", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
            { href: "/admin/dashboard", label: "Admin Portal" },
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            {/* Left Column: Role Selection Cards */}
            <Panel className="flex flex-col justify-between p-8">
              <div className="space-y-4">
                <Badge tone="primary">Role selection</Badge>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Choose your Food Ninja account
                </h1>
                <p className="text-sm leading-6 text-slate-400">
                  Select your role to get started. Remaining profile details (NID, Avatar, and Map location) are set up on your first login.
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Account Type</p>
                <div className="grid gap-2.5">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-3.5 text-left transition duration-150",
                        selectedRole === role.id
                          ? "border-orange-400/50 bg-orange-500/15 text-white shadow-md shadow-orange-500/10"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{role.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{role.title}</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-medium text-slate-400 uppercase">
                              {role.badge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 line-clamp-1">{role.subtitle}</span>
                        </div>
                      </div>
                      <span className="text-orange-400 text-sm font-bold">
                        {selectedRole === role.id ? "✓" : "→"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

            {/* Right Column: Simplified Registration Form */}
            <Panel className="p-8">
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ROLES.find((r) => r.id === selectedRole)?.icon}</span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-orange-400">Quick Sign-Up</p>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {ROLES.find((r) => r.id === selectedRole)?.title} Registration
                    </h2>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Only contact & password are required now. Profile verification occurs on first login.
                </p>
              </div>

              <form onSubmit={handleRegister} autoComplete="off" className="grid gap-4">
                {/* Email input with autofill protection */}
                <label className="space-y-1.5 text-xs text-slate-300">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    name="ninja_user_email"
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    placeholder="name@example.com"
                    required
                  />
                </label>

                {/* Phone input */}
                <label className="space-y-1.5 text-xs text-slate-300">
                  <span>Phone Number *</span>
                  <input
                    type="tel"
                    name="ninja_user_phone"
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    placeholder="01700000000"
                    required
                  />
                </label>

                {/* Rider Vehicle selection */}
                {selectedRole === "rider" && (
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-300">Vehicle Type *</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setVehicle("bike")}
                        className={cn(
                          "rounded-xl border p-2.5 text-xs font-semibold transition text-center",
                          vehicle === "bike"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        )}
                      >
                        🏍️ Motorbike
                      </button>
                      <button
                        type="button"
                        onClick={() => setVehicle("bicycle")}
                        className={cn(
                          "rounded-xl border p-2.5 text-xs font-semibold transition text-center",
                          vehicle === "bicycle"
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                            : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        )}
                      >
                        🚲 Bicycle
                      </button>
                    </div>
                  </div>
                )}

                {/* Password input with new-password to stop browser fill */}
                <label className="space-y-1.5 text-xs text-slate-300">
                  <span>Create Password *</span>
                  <input
                    type="password"
                    name="ninja_new_password"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                  )}
                >
                  {loading ? "Creating Account..." : `Register as ${ROLES.find((r) => r.id === selectedRole)?.title}`}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-400 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </Panel>
          </div>
        </AuthChrome>
      </div>
    </main>
  );
}
