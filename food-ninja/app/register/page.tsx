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
  { id: "rider", title: "Delivery Rider", subtitle: "Earn by delivering in Dhaka", user_type: "rider" },
  { id: "admin", title: "Platform Admin", subtitle: "Platform operations & control", user_type: "admin" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleId>("user");

  // Form Fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nid, setNid] = useState("");
  const [vehicle, setVehicle] = useState<"bike" | "bicycle">("bike");

  const [loading, setLoading] = useState(false);

  // Auto-select role if forwarded via query params
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && ROLES.some((r) => r.id === roleParam)) {
      setSelectedRole(roleParam as RoleId);
    }
  }, [searchParams]);

  // Suggest username when name or email changes if username hasn't been manually set
  function handleNameChange(val: string) {
    setName(val);
    if (!username) {
      const generated = val.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (generated) setUsername(generated);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();
    const cleanNid = nid.trim();

    // 1. Common validation for all roles
    if (!cleanUsername || !cleanEmail || !cleanPhone || !password) {
      toast("Please fill in all required fields (Username, Email, Phone, and Password)", "warning");
      return;
    }

    if (password.length < 6) {
      toast("Password must be at least 6 characters long", "warning");
      return;
    }

    // 2. Role-specific validation
    if (selectedRole !== "admin" && !cleanName) {
      toast("Please enter your Full Name", "warning");
      return;
    }

    if (selectedRole === "owner" && !cleanNid) {
      toast("Please enter your National ID (NID) number", "warning");
      return;
    }

    setLoading(true);

    try {
      if (selectedRole === "owner") {
        await apiRegister({
          user_type: "owner",
          username: cleanUsername,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password,
          nid: cleanNid,
        });
      } else if (selectedRole === "rider") {
        await apiRegister({
          user_type: "rider",
          username: cleanUsername,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password,
          vehicle: vehicle,
        });
      } else if (selectedRole === "admin") {
        await apiRegister({
          user_type: "admin",
          username: cleanUsername,
          email: cleanEmail,
          phone: cleanPhone,
          password: password,
        });
      } else {
        await apiRegister({
          user_type: "user",
          username: cleanUsername,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password,
        });
      }

      toast(
        `Account created successfully as ${ROLES.find((r) => r.id === selectedRole)?.title}! Redirecting to login...`,
        "success"
      );

      setTimeout(() => {
        router.push(`/login?role=${selectedRole}&email=${encodeURIComponent(cleanEmail)}`);
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
          <Badge tone="primary">Account Registration</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Join Food Ninja
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Select your account type below and provide your registration details. Your account is verified and stored in our database.
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Role
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
        <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700">Registration Details</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Register as {ROLES.find((r) => r.id === selectedRole)?.title}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Please enter your actual information to create your account.
            </p>
          </div>

          {/* Full Name (for Customer, Owner, Rider) */}
          {selectedRole !== "admin" && (
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              <span>Full Name *</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                placeholder="e.g. Rahim Khan"
                required
              />
            </label>
          )}

          {/* Username */}
          <label className="block space-y-1 text-xs font-semibold text-slate-700">
            <span>Username * (letters, numbers, underscore)</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="e.g. rahim_01"
              required
            />
          </label>

          {/* Email */}
          <label className="block space-y-1 text-xs font-semibold text-slate-700">
            <span>Email Address *</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!username && e.target.value.includes("@")) {
                  const prefix = e.target.value.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
                  if (prefix) setUsername(prefix);
                }
              }}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="e.g. name@example.com"
              required
            />
          </label>

          {/* Phone Number */}
          <label className="block space-y-1 text-xs font-semibold text-slate-700">
            <span>Phone Number * (e.g. 01700000000)</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="01XXXXXXXXX"
              required
            />
          </label>

          {/* NID Number (for Restaurant Owner) */}
          {selectedRole === "owner" && (
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              <span>National ID (NID) Number *</span>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                placeholder="e.g. 19901234567890123"
                required
              />
            </label>
          )}

          {/* Vehicle Type (for Delivery Rider) */}
          {selectedRole === "rider" && (
            <label className="block space-y-1 text-xs font-semibold text-slate-700">
              <span>Vehicle Type *</span>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value as "bike" | "bicycle")}
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                required
              >
                <option value="bike">Motorbike / Bike</option>
                <option value="bicycle">Bicycle</option>
              </select>
            </label>
          )}

          {/* Password */}
          <label className="block space-y-1 text-xs font-semibold text-slate-700">
            <span>Create Password * (Minimum 6 characters)</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? "Registering..." : `Register as ${ROLES.find((r) => r.id === selectedRole)?.title}`}
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
