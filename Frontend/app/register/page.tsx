"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiRegister } from "@/lib/backend";

const ROLES = [
  { id: "user", title: "Customer", subtitle: "Order food & track deliveries", user_type: "user" },
  { id: "owner", title: "Restaurant Owner", subtitle: "Manage food menus & orders", user_type: "owner" },
  { id: "rider", title: "Delivery Partner", subtitle: "Earn by delivering in Dhaka", user_type: "rider" },
  { id: "admin", title: "Platform Admin", subtitle: "Platform operations & control", user_type: "admin" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleId>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "bicycle">("bike");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ROLES.some((r) => r.id === roleParam)) {
      setSelectedRole(roleParam as RoleId);
    }
  }, [searchParams]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast("Please provide both an Email address and Password", "warning");
      return;
    }

    if (password.length < 6) {
      toast("Password must be at least 6 characters long", "warning");
      return;
    }

    setLoading(true);

    try {
      // Ensure username prefix starts strictly with letters to satisfy backend regex
      const rawPrefix = email.split("@")[0].replace(/[^a-zA-Z]/g, "") || "ninja";
      const cleanPrefix = rawPrefix.slice(0, 15).toLowerCase();
      const derivedUsername = `${cleanPrefix}_${Math.floor(1000 + Math.random() * 9000)}`;
      const derivedName = cleanPrefix.charAt(0).toUpperCase() + cleanPrefix.slice(1);
      const placeholderPhone = `017${Math.floor(10000000 + Math.random() * 90000000)}`;

      if (selectedRole === "owner") {
        await apiRegister({
          user_type: "owner",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: placeholderPhone,
          password: password,
          nid: `NID${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        });
      } else if (selectedRole === "rider") {
        await apiRegister({
          user_type: "rider",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: placeholderPhone,
          password: password,
          vehicle: vehicle,
        });
      } else if (selectedRole === "admin") {
        await apiRegister({
          user_type: "admin",
          username: derivedUsername,
          email: email.trim(),
          phone: placeholderPhone,
          password: password,
        });
      } else {
        await apiRegister({
          user_type: "user",
          username: derivedUsername,
          name: derivedName,
          email: email.trim(),
          phone: placeholderPhone,
          password: password,
        });
      }

      toast(
        `Account created successfully as ${ROLES.find((r) => r.id === selectedRole)?.title}! Redirecting to login...`,
        "success"
      );

      setTimeout(() => {
        router.push(`/login?role=${selectedRole}&email=${encodeURIComponent(email.trim())}`);
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to register account";
      toast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      {/* Left Column: Role Details */}
      <div className="flex flex-col justify-between rounded-[28px] border border-black/10 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <Badge tone="primary">Simple Registration</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Join Food Ninja
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Sign up in seconds with just your email and password. Your personal details and map delivery location are calibrated right after your first sign-in.
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Choose Your Role
          </p>
          <div className="grid gap-2.5">
            {ROLES.map((r) => {
              const active = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all duration-150",
                    active
                      ? "border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20"
                      : "border-black/5 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{r.title}</span>
                    <span className={cn(
                      "text-xs font-semibold",
                      active ? "text-amber-700" : "text-slate-400"
                    )}>
                      {active ? "● Selected" : "Choose"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-sm">
        <form onSubmit={handleRegister} autoComplete="off" className="space-y-5">
          {/* Off-screen trap elements to absorb browser password manager autofill */}
          <div style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: "hidden" }} aria-hidden="true">
            <input type="text" name="chrome_trap_user" tabIndex={-1} defaultValue="" />
            <input type="password" name="chrome_trap_pass" tabIndex={-1} defaultValue="" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700">Account Setup</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Register as {ROLES.find((r) => r.id === selectedRole)?.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Only Email and Password are required. Name, NID & GPS location are set up on first login.
            </p>
          </div>

          <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
            <span>Email Address *</span>
            <input
              type="email"
              name="fn_reg_email_input"
              autoComplete="off"
              data-lpignore="true"
              data-1p-ignore="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="e.g. yourname@example.com"
              required
            />
          </label>

          <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
            <span>Create Password *</span>
            <input
              type="password"
              name="fn_reg_secret_input"
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          {/* Vehicle Type selection for Riders */}
          {selectedRole === "rider" && (
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <span>Delivery Vehicle *</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVehicle("bike")}
                  className={cn(
                    "rounded-2xl border p-3 text-center text-sm font-semibold transition",
                    vehicle === "bike"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-black/10 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  🏍️ Motorbike
                </button>
                <button
                  type="button"
                  onClick={() => setVehicle("bicycle")}
                  className={cn(
                    "rounded-2xl border p-3 text-center text-sm font-semibold transition",
                    vehicle === "bicycle"
                      ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20"
                      : "border-black/10 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  🚲 Bicycle
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Creating Account..." : `Register as ${ROLES.find((r) => r.id === selectedRole)?.title}`}
          </button>

          <p className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
          ]}
        >
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading registration...</div>}>
            <RegisterContent />
          </Suspense>
        </AuthChrome>
      </div>
    </main>
  );
}
