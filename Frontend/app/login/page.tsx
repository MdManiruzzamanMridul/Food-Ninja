"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiGetLocation, apiLogin, setOnboarded, setAuthSession } from "@/lib/backend";
import { OnboardingModal } from "@/components/onboarding-modal";

const roles = [
  { id: "user", label: "Customer", hint: "Browse and order meals", redirect: "/home" },
  { id: "owner", label: "Restaurant Owner", hint: "Kitchen & menu operations", redirect: "/owner/dashboard" },
  { id: "rider", label: "Delivery Rider", hint: "Deliveries and live routing", redirect: "/rider/dashboard" },
  { id: "admin", label: "Platform Admin", hint: "Platform management & metrics", redirect: "/admin/dashboard" },
] as const;

type RoleType = (typeof roles)[number]["id"];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleType>("user");
  const [userInfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-select role and email if forwarded from registration
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam && roles.some((r) => r.id === roleParam)) {
      setSelectedRole(roleParam as RoleType);
    }
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setUserInfo(emailParam);
    }
  }, [searchParams]);

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
      const payload = {
        user_type: selectedRole,
        user_info: userInfo.trim(),
        password,
      };

      const result = await apiLogin(payload as any);
      const activeUsername = result.username || userInfo.trim();

      if (result.token) {
        setAuthSession(result.token, {
          username: activeUsername,
          user_type: selectedRole,
          email: userInfo.includes("@") ? userInfo.trim() : undefined,
          status: result.status,
        });
      }

      toast(`Successfully signed in as ${roles.find((r) => r.id === selectedRole)?.label}!`, "success");

      const matchedRole = roles.find((r) => r.id === selectedRole);
      const targetPath = matchedRole ? matchedRole.redirect : "/home";

      // Only customers and riders use location setup, and only while their database location is null.
      const needsLocationSetup = selectedRole === "user" || selectedRole === "rider";
      let hasLocation = true;
      if (needsLocationSetup) {
        const location = await apiGetLocation();
        hasLocation = location.has_location;
      }

      if (!hasLocation) {
        setOnboardingState({
          open: true,
          username: activeUsername,
          userType: selectedRole,
          initialPhone: userInfo.startsWith("01") || userInfo.startsWith("+8801") ? userInfo.trim() : "",
          targetRedirect: targetPath,
        });
      } else {
        if (selectedRole === "admin") {
          setOnboarded(activeUsername);
        }
        setTimeout(() => {
          router.push(targetPath);
        }, 500);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Authentication failed";
      if (errorMsg === "Invalid credentials") {
        toast(
          `Invalid credentials for ${roles.find((r) => r.id === selectedRole)?.label} login. If your account is registered under a different role, please switch the role on the left.`,
          "danger"
        );
      } else {
        toast(errorMsg, "danger");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
            {/* Off-screen trap elements to absorb browser password manager autofill */}
            <div style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: "hidden" }} aria-hidden="true">
              <input type="text" name="chrome_login_trap_user" tabIndex={-1} defaultValue="" />
              <input type="password" name="chrome_login_trap_pwd" tabIndex={-1} defaultValue="" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-amber-700">Credentials</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {roles.find((r) => r.id === selectedRole)?.label} Login
              </h2>
            </div>

            <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
              <span>Username, Email, or Phone *</span>
              <input
                type="text"
                name="fn_login_ident"
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
                name="fn_login_secret"
                autoComplete="current-password"
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
              Don&apos;t have an account?{" "}
              <Link href={`/register?role=${selectedRole}`} className="font-semibold text-amber-700 hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
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
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register" },
          ]}
        >
          <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading sign in...</div>}>
            <LoginContent />
          </Suspense>
        </AuthChrome>
      </div>
    </main>
  );
}
