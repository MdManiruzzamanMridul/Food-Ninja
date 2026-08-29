"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getAuthUser, clearAuthSession } from "@/lib/backend";
import { useToast } from "@/components/toast-provider";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState<string>("");

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user || user.user_type !== "admin") {
      setIsAuthenticated(false);
      toast("Admin authentication required. Please sign in with your admin password.", "warning");
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      setAdminName(user.username || "Admin");
    }
  }, [router, toast]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f6f1e8] flex items-center justify-center p-4">
        <div className="rounded-[28px] border border-black/5 bg-white p-8 shadow-sm text-center max-w-sm w-full space-y-4">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-amber-100 text-amber-800 font-bold">
            🛡️
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Verifying Admin Access</h3>
            <p className="text-xs text-slate-500">Checking security credentials & token permissions...</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
