"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Panel } from "@/components/ui";
import { getAuthUser, apiGetRiderStatus } from "@/lib/backend";
import { riderNav } from "@/lib/platform";

export default function RiderLayout({ children }: { children: ReactNode }) {
  void children;
  const router = useRouter();
  const [state, setState] = useState<"loading" | "approved" | "pending" | "blocked">("loading");

  useEffect(() => {
    const user = getAuthUser();
    if (!user || user.user_type !== "rider") {
      setState("blocked");
      router.replace("/login?role=rider");
      return;
    }

    apiGetRiderStatus()
      .then((data) => setState(data.status === "offline" || data.status === "online" || data.status === "delivering" ? "approved" : "pending"))
      .catch(() => setState("pending"));
  }, [router]);

  if (state === "loading") {
    return <div className="min-h-screen bg-[#f6f1e8] flex items-center justify-center text-sm text-slate-600">Checking rider approval...</div>;
  }

  if (state === "blocked") return null;

  if (state === "pending") {
    return (
      <AppShell role="Rider app" title="Waiting for approval" subtitle="Your rider application is being reviewed by an administrator." nav={[{ href: "/rider/dashboard", label: "Approval Status", hint: "Review queue" }]}>
        <Panel className="mx-auto max-w-xl space-y-4 p-10 text-center">
          <div className="text-4xl">⏳</div>
          <h1 className="text-2xl font-bold text-slate-900">Waiting for approval</h1>
          <p className="text-sm text-slate-600">Rider tools will become available after an admin approves your account.</p>
        </Panel>
      </AppShell>
    );
  }

  return (
    <AppShell role="Rider app" title="Rider workspace" subtitle="Rider tools will be added in a future release." nav={riderNav}>
      <Panel className="mx-auto max-w-xl space-y-3 p-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Rider workspace coming soon</h1>
        <p className="text-sm text-slate-600">Your rider account is approved. Delivery operations are not available yet.</p>
      </Panel>
    </AppShell>
  );
}
