"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiLogin } from "@/lib/backend";

type RoleOption = "Customer" | "Rider" | "Admin";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<RoleOption>("Customer");
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roles: RoleOption[] = ["Customer", "Rider", "Admin"];

  const roleToUserType: Record<RoleOption, "user" | "rider" | "admin"> = {
    Customer: "user",
    Rider: "rider",
    Admin: "admin",
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!userInfo.trim() || !password) {
      toast("Please enter your login identifier and password", "warning");
      return;
    }

    setLoading(true);

    try {
      const userType = roleToUserType[role];
      const result = await apiLogin({
        user_type: userType,
        user_info: userInfo.trim(),
        password: password,
      });

      toast(`Login successful as ${role}! Redirecting...`, "success");

      setTimeout(() => {
        if (userType === "admin") {
          router.push("/admin/dashboard");
        } else if (userType === "rider") {
          router.push("/rider/dashboard");
        } else {
          router.push("/home");
        }
      }, 600);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to log in";
      toast(errorMsg, "danger");
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
              { href: "/register/partner", label: "Register Rider / Admin" },
            ]}
          >
            <div className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
              <Panel className="flex flex-col justify-between p-8">
                <div className="space-y-5">
                  <Badge tone="primary">Unified authentication</Badge>
                  <h1 className="text-4xl font-semibold tracking-tight">Sign in to Food Ninja.</h1>
                  <p className="text-sm leading-6 text-slate-400">
                    Sign in with your Email, Phone Number, or Username. Select your role to authenticate against the database.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {roles.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRole(item.id)}
                      className={cn(
                        "rounded-2xl border p-3.5 text-left text-sm transition",
                        selectedRole === item.id
                          ? "border-orange-400/40 bg-orange-500/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      <span className="block font-medium">{item}</span>
                      <span className="text-xs text-slate-400">
                        {item === "Admin" ? "Admin Portal" : item === "Rider" ? "Rider Portal" : "Customer Feed"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

              <Panel className="p-8">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Login</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {role} Sign In
                    </h2>
                  </div>

                  <div className="grid gap-4">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Username, Email, or Phone Number *</span>
                      <input
                        value={userInfo}
                        onChange={(e) => setUserInfo(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                        placeholder={
                          role === "Admin"
                            ? "admin_sam or admin@foodninja.com"
                            : role === "Rider"
                            ? "rider_rahim or 01700000000"
                            : "username, name@example.com, or 01700000000"
                        }
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

                    <div className="space-y-2 text-sm text-slate-300">
                      <span>Sign In Target Role</span>
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

                  <div className="flex flex-col gap-1.5 pt-2 text-sm text-slate-400">
                    <p>
                      New customer?{" "}
                      <Link href="/register" className="text-orange-300 hover:underline">
                        Register Customer
                      </Link>
                    </p>
                    <p>
                      Need rider or admin account?{" "}
                      <Link href="/register/partner" className="text-orange-300 hover:underline">
                        Register Rider / Admin
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
