"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiLogin, isOnboarded, setAuthSession } from "@/lib/backend";
import { OnboardingModal } from "@/components/onboarding-modal";

const roles = [
  { id: "user", label: "Customer", hint: "Browse and order meals", redirect: "/home" },
  { id: "owner", label: "Restaurant Owner", hint: "Kitchen & menu operations", redirect: "/owner/dashboard" },
  { id: "rider", label: "Delivery Rider", hint: "Deliveries and live routing", redirect: "/rider/dashboard" },
  { id: "admin", label: "Platform Admin", hint: "Platform management & metrics", redirect: "/admin/dashboard" },
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
      // Backend expects user_info + password + user_type
      const backendUserType = selectedRole === "admin" ? "admin" : selectedRole === "rider" ? "rider" : "user";

      const payload = {
        user_type: backendUserType,
        user_info: userInfo.trim(),
        password,
      };

      const result = await apiLogin(payload as any);
      const activeUsername = result.username || userInfo.trim();

      if (result.token) {
        setAuthSession(result.token, {
          username: activeUsername,
          user_type: selectedRole as any,
          email: userInfo.includes("@") ? userInfo.trim() : undefined,
        });
      }

      toast(`Successfully signed in as ${roles.find((r) => r.id === selectedRole)?.label}!`, "success");

      const matchedRole = roles.find((r) => r.id === selectedRole);
      const targetPath = matchedRole ? matchedRole.redirect : "/home";

      // Check if user has completed first-time profile & map setup
      const hasOnboarded = isOnboarded(activeUsername);

      if (!hasOnboarded) {
        setOnboardingState({
          open: true,
          username: activeUsername,
          userType: selectedRole,
          initialPhone: userInfo.startsWith("01") || userInfo.startsWith("+8801") ? userInfo.trim() : "",
          targetRedirect: targetPath,
        });
      } else {
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
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
          ]}
        >
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            {/* Left Side: Role Selector */}
            <div className="flex flex-col justify-between rounded-[28px] border border-black/10 bg-white p-8 shadow-sm">
              <div className="space-y-4">
                <Badge tone="primary">Unified Sign-In</Badge>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Sign in to Food Ninja
                </h1>
                <p className="text-sm leading-6 text-slate-600">
                  Select your portal role below to authenticate directly against your account credentials.
                </p>
              </div>

              <div className="mt-8 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Role
                </p>
                <div className="grid gap-2.5">
                  {roles.map((item) => {
                    const isSelected = selectedRole === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedRole(item.id)}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all duration-150",
                          isSelected
                            ? "border-amber-500 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20"
                            : "border-black/5 bg-slate-50/80 hover:border-slate-300 hover:bg-slate-100"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.label}
                          </span>
                          <span className={cn(
                            "text-xs font-semibold",
                            isSelected ? "text-amber-700" : "text-slate-400"
                          )}>
                            {isSelected ? "● Active" : "Select"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="rounded-[28px] border border-black/10 bg-white p-8 shadow-sm">
              <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">
                {/* Hidden dummy fields to prevent aggressive browser autofill */}
                <input type="text" name="prevent_autofill_user" className="hidden" tabIndex={-1} autoComplete="off" />
                <input type="password" name="prevent_autofill_pwd" className="hidden" tabIndex={-1} autoComplete="off" />

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700">Credentials</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {roles.find((r) => r.id === selectedRole)?.label} Login
                  </h2>
                </div>

                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  <span>Username, Email, or Phone *</span>
                  <input
                    name="user_identifier"
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Enter your email, phone, or username"
                    required
                  />
                </label>

                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  <span>Password *</span>
                  <input
                    type="password"
                    name="user_secret"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                    placeholder="Enter your password"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {loading ? "Authenticating..." : `Sign in as ${roles.find((r) => r.id === selectedRole)?.label}`}
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-semibold text-amber-700 hover:underline">
                    Create an account
                  </Link>
                </div>
              </form>
            </div>
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
