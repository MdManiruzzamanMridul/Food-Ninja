"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiLogin, isOnboarded, setAuthSession } from "@/lib/backend";
import { OnboardingModal } from "@/components/onboarding-modal";

const roles = [
  { id: "user", label: "Customer", hint: "Browse and order food", redirect: "/home" },
  { id: "owner", label: "Restaurant Owner", hint: "Manage kitchen and food menus", redirect: "/owner/dashboard" },
  { id: "rider", label: "Delivery Rider", hint: "Deliveries and live tracking", redirect: "/rider/dashboard" },
  { id: "admin", label: "Platform Admin", hint: "Platform operations & metrics", redirect: "/admin/dashboard" },
] as const;

type RoleType = (typeof roles)[number]["id"];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleType>("user");
  const [userInfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Onboarding modal state for first-time login
  const [onboardingState, setOnboardingState] = useState<{
    open: boolean;
    username: string;
    userType: RoleType;
    initialPhone?: string;
    targetRedirect: string;
  }>({
    open: false,
    username: "",
    userType: "user",
    initialPhone: "",
    targetRedirect: "/home",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!userInfo.trim() || !password) {
      toast("Please enter your Username/Email/Phone and Password", "warning");
      return;
    }

    setLoading(true);

    try {
      // For backend login:
      // "admin" -> queries admin table
      // "rider" -> queries rider table
      // "user" / "owner" -> queries users table
      const backendUserType = selectedRole === "admin" ? "admin" : selectedRole === "rider" ? "rider" : "user";

      const payload = {
        user_type: backendUserType,
        user_info: userInfo.trim(),
        password,
      };

      const result = await apiLogin(payload as any);
      const activeUsername = result.username || userInfo.trim();

      // Ensure local session stores the selected role (e.g. owner)
      if (result.token) {
        setAuthSession(result.token, {
          username: activeUsername,
          user_type: selectedRole as any,
          email: userInfo.includes("@") ? userInfo.trim() : undefined,
        });
      }

      toast(`Successfully logged in as ${roles.find((r) => r.id === selectedRole)?.label}!`, "success");

      const matchedRole = roles.find((r) => r.id === selectedRole);
      const targetPath = matchedRole ? matchedRole.redirect : "/home";

      // Check if user has completed first-time profile setup
      const hasOnboarded = isOnboarded(activeUsername);

      if (!hasOnboarded) {
        // Trigger multi-step profile & map location onboarding
        setOnboardingState({
          open: true,
          username: activeUsername,
          userType: selectedRole,
          initialPhone: userInfo.startsWith("01") || userInfo.startsWith("+8801") ? userInfo.trim() : "",
          targetRedirect: targetPath,
        });
      } else {
        // Direct navigation for recurring logins
        setTimeout(() => {
          router.push(targetPath);
        }, 500);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Authentication failed";
      toast(errorMsg, "danger");
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
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <Panel className="flex flex-col justify-between p-8">
              <div className="space-y-5">
                <Badge tone="primary">Unified sign-in portal</Badge>
                <h1 className="text-4xl font-semibold tracking-tight text-white">Sign in to Food Ninja</h1>
                <p className="text-sm leading-6 text-slate-400">
                  Authenticate directly against the PostgreSQL backend database with your role-specific credentials.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Select Role</p>
                <div className="grid gap-2.5">
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
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-xs font-mono text-orange-400">
                          {selectedRole === item.id ? "✓ Active" : "Select"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{item.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel className="p-8">
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Sign In</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">
                    {roles.find((r) => r.id === selectedRole)?.label} Sign In
                  </h2>
                </div>

                <label className="block space-y-2 text-sm text-slate-300">
                  <span>Username, Email, or Phone *</span>
                  <input
                    name="ninja_login_user"
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    placeholder="Enter email, phone, or username"
                    required
                  />
                </label>

                <label className="block space-y-2 text-sm text-slate-300">
                  <span>Password *</span>
                  <input
                    type="password"
                    name="ninja_login_pass"
                    autoComplete="current-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-4 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                  )}
                >
                  {loading ? "Authenticating..." : `Sign in as ${roles.find((r) => r.id === selectedRole)?.label}`}
                </button>

                <div className="pt-2 text-xs text-slate-400 space-y-1">
                  <p>
                    Destination:{" "}
                    <code className="text-orange-300 font-mono">
                      {roles.find((r) => r.id === selectedRole)?.redirect}
                    </code>
                  </p>
                  <p>
                    Don't have an account?{" "}
                    <Link href="/register" className="text-orange-300 font-medium hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              </form>
            </Panel>
          </div>
        </AuthChrome>
      </div>

      {/* First-Time Profile & Map Location Onboarding Modal */}
      <OnboardingModal
        open={onboardingState.open}
        username={onboardingState.username}
        userType={onboardingState.userType}
        initialPhone={onboardingState.initialPhone}
        targetRedirect={onboardingState.targetRedirect}
        onComplete={(destination) => {
          setOnboardingState((prev) => ({ ...prev, open: false }));
          toast("Profile setup completed! Welcome to Food Ninja.", "success");
          router.push(destination);
        }}
      />
    </main>
  );
}
