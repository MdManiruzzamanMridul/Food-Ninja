"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PartnerRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register?role=rider");
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f6f1e8] flex items-center justify-center p-8 text-slate-700">
      <div className="rounded-[28px] border border-black/10 bg-white p-8 text-center shadow-sm max-w-md">
        <p className="font-semibold text-slate-900">Redirecting to Partner Registration...</p>
        <p className="mt-1 text-xs text-slate-500">
          Partner registration has been merged into the unified registration portal.
        </p>
      </div>
    </main>
  );
}
