"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Modal } from "@/components/modal";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { customerNav } from "@/lib/platform";

export default function CheckoutPage() {
  const [open, setOpen] = useState(false);

  return (
    <AppShell
      role="Customer portal"
      title="Checkout"
      subtitle="Cart review, payment method selection, and address confirmation."
      nav={customerNav}
      actions={<Badge tone="primary">Secure checkout</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Panel className="space-y-5 p-6">
          <SectionHeading eyebrow="Cart review" title="Verify the order before payment" />
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span>Chicken Bowl x1</span><span>৳14</span></div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span>Lemonade x1</span><span>৳4</span></div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"><span>Delivery fee</span><span>৳2</span></div>
          </div>
          <ActionButton endpoint="/checkout/calculate" label="Recalculate totals" tone="secondary" />
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Delivery" title="Address confirmation" />
            <label className="space-y-2 text-sm text-slate-300">
              Saved address
              <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Home, 12 Lake Road" />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Delivery notes
              <textarea className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" defaultValue="Call on arrival." />
            </label>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Payment" title="Select a method" />
            <div className="grid gap-3">
              {["Card", "Wallet", "Cash on delivery"].map((method) => (
                <label key={method} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span>{method}</span>
                  <input type="radio" name="payment" defaultChecked={method === "Card"} />
                </label>
              ))}
            </div>
            <button type="button" onClick={() => setOpen(true)} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-orange-500">
              Confirm checkout
            </button>
          </Panel>
        </div>
      </div>

      <Modal open={open} title="Checkout confirmation" description="This modal is the contract point for the future order placement API." onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-slate-300">
            The backend team can connect payment intent creation, address validation, and order creation here. The button below already sends a blank payload.
          </p>
          <div className="flex flex-wrap gap-3">
            <ActionButton endpoint="/checkout/place-order" label="Place order" />
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Keep editing
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
