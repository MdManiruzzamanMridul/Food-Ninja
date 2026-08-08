"use client";

import { useState } from "react";
import { submitPlatformRequest } from "@/lib/backend";
import { cn } from "./ui";
import { useToast } from "./toast-provider";

export function StatusToggle({
  endpoint,
  initial = false,
  onLabel = "Online",
  offLabel = "Offline",
}: {
  endpoint: string;
  initial?: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  const [isOn, setIsOn] = useState(initial);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  async function handleToggle() {
    setBusy(true);

    try {
      const next = !isOn;
      await submitPlatformRequest(endpoint, { status: next ? onLabel : offLabel });
      setIsOn(next);
      toast(`Availability set to ${next ? onLabel : offLabel}`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Status update failed", "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-wait disabled:opacity-70",
        isOn ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100" : "border-white/10 bg-white/5 text-slate-100",
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", isOn ? "bg-emerald-400" : "bg-slate-500")} />
      {busy ? "Updating..." : isOn ? onLabel : offLabel}
    </button>
  );
}
