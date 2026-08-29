"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, cn } from "@/components/ui";
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
    subtitle: "Explore 100+ Dhaka restaurants, order favorite meals, & track live.",
    badge: "Most Popular",
    icon: "🛒",
    tone: "from-orange-500/20 to-amber-500/10 border-orange-500/30",
  },
  {
    id: "rider",
    title: "Delivery Rider",
    subtitle: "Deliver orders with bike or bicycle and earn on your schedule.",
    badge: "Earn Daily",
    icon: "🛵",
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
  {
    id: "owner",
    title: "Restaurant Owner",
    subtitle: "List your restaurant, manage food menus, and grow revenue.",
    badge: "Partner",
    icon: "🏪",
    tone: "from-sky-500/20 to-blue-500/10 border-sky-500/30",
  },
  {
    id: "admin",
    title: "Platform Admin",
    subtitle: "Manage ecosystem, verify riders, and monitor global metrics.",
    badge: "Staff",
    icon: "🛡️",
    tone: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  },
];

export function RegisterRoleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleOption["id"] | null>(null);

  // Simplified Form state (strictly only Email, Phone, Password)
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "bicycle">("bike");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRole) {
      toast("Please select an account type to register", "warning");
      return;
    }

    if (!email.trim() || !phone.trim() || !password) {
      toast("Please fill in your Email, Phone Number, and Password", "warning");
      return;
    }

    setLoading(true);

    try {
      // Derive standard username and initial name from email prefix
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
        // Customer (user) or Restaurant Owner (user)
        await apiRegister({
          user_type: "user",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
      }

      toast("Account registered successfully! Redirecting to login...", "success");
      onClose();

      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create account";
      toast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToRoles() {
    setSelectedRole(null);
    setEmail("");
    setPhone("");
    setPassword("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/15 bg-slate-900 text-white shadow-[0_25px_100px_-20px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-orange-400">Join Food Ninja</p>
            <h3 className="mt-0.5 text-xl font-bold tracking-tight text-white">
              {selectedRole
                ? `Sign up as ${ROLES.find((r) => r.id === selectedRole)?.title}`
                : "Choose Account Type"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* STEP 1: ROLE SELECTION CARDS */}
          {!selectedRole ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                Select how you would like to use Food Ninja today. You can always manage your profile later.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "group flex flex-col justify-between rounded-2xl border p-5 text-left transition duration-200 hover:scale-[1.02] bg-gradient-to-br hover:shadow-lg",
                      role.tone
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl transition group-hover:scale-110">{role.icon}</span>
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                          {role.badge}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-bold text-white group-hover:text-orange-300 transition">
                        {role.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {role.subtitle}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-xs font-semibold text-orange-400">
                      <span>Select & Continue</span>
                      <span className="ml-1 transition group-hover:translate-x-1">➔</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center text-xs text-slate-400">
                Already registered?{" "}
                <Link href="/login" onClick={onClose} className="text-orange-400 font-semibold hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          ) : (
            /* STEP 2: SIMPLIFIED REGISTRATION FORM (ONLY EMAIL, PHONE, PASSWORD) */
            <form onSubmit={handleRegister} autoComplete="off" className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{ROLES.find((r) => r.id === selectedRole)?.icon}</span>
                  <div>
                    <p className="text-xs text-slate-400">Selected Role</p>
                    <p className="text-sm font-semibold text-white">
                      {ROLES.find((r) => r.id === selectedRole)?.title}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBackToRoles}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Change Role
                </button>
              </div>

              {/* Email Input with Autofill Prevention */}
              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Email Address *</span>
                <input
                  type="email"
                  name="user_email_ninja"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
              </label>

              {/* Phone Input */}
              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Contact Phone *</span>
                <input
                  type="tel"
                  name="user_phone_ninja"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01700000000"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
              </label>

              {/* Rider Vehicle selection (Only if Rider) */}
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

              {/* Password Input with new-password to stop browser fill */}
              <label className="block space-y-1.5 text-xs text-slate-300">
                <span>Create Password *</span>
                <input
                  type="password"
                  name="ninja_password_new"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                  required
                />
                <span className="text-[10px] text-slate-500">
                  Full legal name, NID, and map location will be configured on your first sign-in.
                </span>
              </label>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={handleBackToRoles}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                >
                  ← Back to Roles
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {loading ? "Creating Account..." : "Create Account ➔"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
