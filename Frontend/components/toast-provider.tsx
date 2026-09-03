"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cn } from "./ui";

type ToastTone = "default" | "success" | "warning" | "danger";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastApi = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "default") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { id, message, tone }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-5 top-5 z-[9999] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl text-sm font-semibold transition-all duration-200 animate-fadeIn",
              item.tone === "success" && "border-emerald-600 bg-emerald-600 text-white shadow-emerald-950/25",
              item.tone === "warning" && "border-amber-600 bg-amber-500 text-white shadow-amber-950/25",
              item.tone === "danger" && "border-rose-600 bg-rose-600 text-white shadow-rose-950/25",
              item.tone === "default" && "border-slate-800 bg-slate-900 text-white shadow-black/40",
            )}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white">
              {item.tone === "success" ? "✓" : item.tone === "warning" ? "!" : item.tone === "danger" ? "✕" : "ℹ"}
            </span>
            <span className="leading-snug text-white font-medium">{item.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
