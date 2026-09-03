"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
};

const ROLES: RoleOption[] = [
  {
    id: "user",
    title: "Customer (Foodie)",
    subtitle: "Explore 100+ Dhaka restaurants, order meals, & track deliveries in real time.",
    badge: "Customer",
    icon: "🛒",
  },
  {
    id: "rider",
    title: "Delivery Rider",
    subtitle: "Deliver orders with motorbike or bicycle and earn flexibly on your schedule.",
    badge: "Rider",
    icon: "🛵",
  },
  {
    id: "owner",
    title: "Restaurant Owner",
    subtitle: "List your restaurant, manage food menus, and grow business across Dhaka.",
    badge: "Partner",
    icon: "🏪",
  },
  {
    id: "admin",
    title: "Platform Admin",
    subtitle: "Oversee ecosystem operations, verify partner onboarding, and track metrics.",
    badge: "Staff",
    icon: "🛡️",
  },
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const queryRole = searchParams.get("role") as RoleOption["id"] | null;
  const [selectedRole, setSelectedRole] = useState<RoleOption["id"]>("user");

  useEffect(() => {
    if (queryRole && ROLES.some((r) => r.id === queryRole)) {
      setSelectedRole(queryRole);
    }
  }, [queryRole]);

  // Simplified Form state: strictly Email & Password ONLY (no phone field)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "bicycle">("bike");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const finalUsername =
      username.trim().toLowerCase() ||
      email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() ||
      name.replace(/\s+/g, "").toLowerCase();

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim() || !finalUsername) {
      toast("Please fill in all required fields (Name, Username, Phone, Email, Password)", "warning");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({
        user_type: "user",
        name: name.trim(),
        username: finalUsername,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      toast("Customer account registered successfully! Redirecting to login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 900);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create account";
      toast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
      {/* Left Column: Role Selection Cards */}
      <Panel className="flex flex-col justify-between p-8">
        <div className="space-y-4">
          <Badge tone="primary">Role selection</Badge>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Choose your account role
          </h1>
          <p className="text-sm leading-6 text-slate-400">
            Sign up in seconds with just your email and password. Your full name, phone, NID, and location are set up on your first login.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Role</p>
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

      {/* Right Column: Simplified Registration Form (Strictly Email & Password) */}
      <Panel className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{ROLES.find((r) => r.id === selectedRole)?.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-400 font-semibold">Quick Sign-Up</p>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {ROLES.find((r) => r.id === selectedRole)?.title} Registration
              </h2>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Only email and password required. Profile & contact details are configured after first sign-in.
          </p>
        </div>

        <form onSubmit={handleRegister} autoComplete="off" className="grid gap-4">
          {/* Email input with autofill protection */}
          <label className="space-y-1.5 text-xs text-slate-300">
            <span>Email Address *</span>
            <input
              type="email"
              name="ninja_reg_email_field"
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

          {/* Rider Vehicle selection (Only for Rider) */}
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
              name="ninja_reg_pass_field"
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
              "mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
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
  );
}

export default function RegisterPage() {
  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register Customer" },
            { href: "/register/partner", label: "Register Rider / Admin" },
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <Panel className="p-8">
              <Badge tone="primary">Customer registration</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Create your customer profile.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Join Food Ninja to order food from top restaurants, track your deliveries live, and access exclusive deals.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Saved addresses & instant checkout</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Live order & rider tracking</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Ratings, reviews & deals</div>
              </div>
            </Panel>

            <Panel className="p-8">
              <form onSubmit={handleRegister} className="grid gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Full name *</span>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase());
                      }
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. Ava Johnson"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Username *</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. avajohnson"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Phone number *</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="01700000000"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="name@example.com"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Password *</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Default delivery address (optional)</span>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Home, street, area"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                  )}
                >
                  {loading ? "Registering..." : "Register Customer Account"}
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-1 text-sm text-slate-400">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-orange-300 hover:underline">
                    Sign in here
                  </Link>
                </p>
                <p>
                  Want to register as a Delivery Rider or Admin?{" "}
                  <Link href="/register/partner" className="text-orange-300 hover:underline">
                    Rider & Admin Registration
                  </Link>
                </p>
              </div>
            </Panel>
          </div>
        </AuthChrome>
      </div>
    </main>
  );
}
