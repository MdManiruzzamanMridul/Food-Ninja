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
      toast(`${label} submitted locally`, "success");
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
        tone === "primary" && "bg-primary text-primary-foreground shadow-lg shadow-amber-500/20 hover:bg-amber-600",
        tone === "secondary" && "border border-black/10 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
        className,
      )}
    >
      {loading ? "Sending..." : label}
    </button>
  );
}
