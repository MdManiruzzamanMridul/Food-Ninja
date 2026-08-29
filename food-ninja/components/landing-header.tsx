"use client";

import { useState } from "react";
import Link from "next/link";
import { RegisterRoleModal } from "./register-role-modal";

export function LandingHeader() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between rounded-[28px] border border-black/5 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-amber-700 font-bold">Food Ninja</p>
          <p className="text-sm text-slate-500">Fast delivery, simple ordering, and live tracking across Dhaka.</p>
        </div>
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
      </header>

      {/* Role Selection Registration Popup */}
      <RegisterRoleModal
        open={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
}
