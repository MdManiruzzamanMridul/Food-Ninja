"use client";

import type { ReactNode } from "react";
import { cn } from "./ui";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn("w-full max-w-2xl rounded-[28px] border border-white/10 bg-panel p-6 shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
          </div>
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
