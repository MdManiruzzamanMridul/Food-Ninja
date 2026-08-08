"use client";

import { useState } from "react";
import { submitPlatformRequest } from "@/lib/backend";
import { cn } from "./ui";
import { useToast } from "./toast-provider";

export function ActionButton({
  endpoint,
  label,
  payload = {},
  tone = "primary",
  className,
}: {
  endpoint: string;
  label: string;
  payload?: Record<string, unknown>;
  tone?: "primary" | "secondary";
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleClick() {
    setLoading(true);

    try {
      await submitPlatformRequest(endpoint, payload);
      toast(`${label} request queued`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Request failed", "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-wait disabled:opacity-70",
        tone === "primary" && "bg-primary text-primary-foreground shadow-lg shadow-orange-500/20 hover:bg-orange-500",
        tone === "secondary" && "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
        className,
      )}
    >
      {loading ? "Sending..." : label}
    </button>
  );
}
