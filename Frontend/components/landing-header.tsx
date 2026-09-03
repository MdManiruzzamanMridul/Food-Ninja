"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterRoleModal } from "./register-role-modal";
import { getAuthUser, clearAuthSession, apiLogout, type AuthUser } from "@/lib/backend";

export function LandingHeader() {
  const router = useRouter();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  async function handleSignOut() {
    try {
      await apiLogout();
    } catch {
      // ignore network errors on logout
    }
    clearAuthSession();
    setUser(null);
    router.refresh();
  }

  // Determine appropriate profile / dashboard link based on role
  const profileLink = user
    ? user.user_type === "admin"
      ? "/admin/dashboard"
      : user.user_type === "rider"
      ? "/rider/dashboard"
      : user.user_type === "owner"
      ? "/owner/dashboard"
      : "/profile"
    : "/profile";

  return (
    <>
      <header className="flex items-center justify-between rounded-[28px] border border-black/5 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-amber-700 font-bold">Food Ninja</p>
          <p className="text-sm text-slate-500">Fast delivery, simple ordering, and live tracking across Dhaka.</p>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href={profileLink}
              prefetch={false}
              className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-xs transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800"
            >
              <span>👤 Profile</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                {user.username}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 shadow-xs transition hover:bg-rose-100 hover:border-rose-300"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              prefetch={false}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Login
            </Link>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 shadow-sm shadow-amber-500/20"
            >
              Create account
            </button>
          </div>
        )}
      </header>

      {/* Role Selection Registration Popup */}
      <RegisterRoleModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
}
