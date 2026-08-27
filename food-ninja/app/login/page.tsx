"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiLogin } from "@/lib/backend";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<"Customer" | "Admin">("Customer");
  const [open, setOpen] = useState(false);

  // Form Fields matching login.py exactly
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles: Array<"Customer" | "Admin"> = ["Customer", "Admin"];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (role === "Admin") {
      if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        toast("Admin login requires Username, Email, Phone, and Password", "warning");
        return;
      }
    } else {
      if (!email.trim() || !phone.trim() || !password.trim()) {
        toast("Customer login requires Email, Phone, and Password", "warning");
        return;
      }
    }

    setLoading(true);
    try {
      if (role === "Admin") {
        await apiLogin({
          user_type: "admin",
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
        });
      } else {
        await apiLogin({
          user_type: "user",
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
        });
      }

      toast("Login successful! Redirecting...", "success");

      setTimeout(() => {
        if (role === "Admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/home");
        }
      }, 600);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to log in", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="lg:col-span-2">
          <AuthChrome
            nav={[
              { href: "/login", label: "Login" },
              { href: "/register", label: "Register Customer" },
              { href: "/register/partner", label: "Register Admin" },
            ]}
          >
            <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <Panel className="flex flex-col justify-between p-8">
                <div className="space-y-5">
                  <Badge tone="primary">Unified login portal</Badge>
                  <h1 className="text-4xl font-semibold tracking-tight">Sign in to Food Ninja.</h1>
                  <p className="text-sm leading-6 text-slate-400">
                    Authenticate directly against the backend PostgreSQL database using role-specific credentials.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {roles.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRole(item)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        role === item
                          ? "border-orange-400/40 bg-orange-500/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="block font-medium">{item} Login</span>
                      <span className="text-xs text-slate-400">
                        {item === "Admin" ? "Username, Email, Phone, Pass" : "Email, Phone, Password"}
                      </span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel className="p-8">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Login</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {role === "Admin" ? "Admin Sign In" : "Customer Sign In"}
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    {/* Admin Only: Username field */}
                    {role === "Admin" && (
                      <label className="space-y-2 text-sm text-slate-300">
                        <span>Admin Username *</span>
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                          placeholder="e.g. admin_sam"
                          required
                        />
                      </label>
                    )}

                    {/* Email field (Both Admin & Customer) */}
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

                    {/* Phone field (Both Admin & Customer) */}
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Phone Number *</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                        placeholder="+880 1700 000000"
                        required
                      />
                    </label>

                    {/* Password field (Both Admin & Customer) */}
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

                    <div className="space-y-2 text-sm text-slate-300">
                      <span>Selected Role</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpen((current) => !current)}
                          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none transition hover:bg-white/10"
                        >
                          <span>{role}</span>
                          <span className="text-slate-400">{open ? "▴" : "▾"}</span>
                        </button>
                        {open ? (
                          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
                            {roles.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => {
                                  setRole(item);
                                  setOpen(false);
                                }}
                                className={`flex w-full items-center px-4 py-3 text-left transition ${
                                  role === item ? "bg-orange-500/15 text-white" : "text-slate-300 hover:bg-white/5"
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                      )}
                    >
                      {loading ? "Signing in..." : `Sign in as ${role}`}
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-slate-400">
                    <p>
                      New customer?{" "}
                      <Link href="/register" className="text-orange-300 hover:underline">
                        Create customer account
                      </Link>
                    </p>
                    <p>
                      Need admin access?{" "}
                      <Link href="/register/partner" className="text-orange-300 hover:underline">
                        Register as Admin
                      </Link>
                    </p>
                  </div>
                </form>
              </Panel>
            </div>
          </AuthChrome>
        </div>
      </div>
    </main>
  );
}
