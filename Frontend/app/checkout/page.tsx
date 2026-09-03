"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Modal } from "@/components/modal";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { customerNav } from "@/lib/platform";
import { getAuthUser, getOnboardingDetails } from "@/lib/backend";
import { useToast } from "@/components/toast-provider";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Cart state: reads active cart from localStorage or defaults to empty
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      const details = getOnboardingDetails(user.username);
      if (details?.area) {
        setAddress(String(details.area));
      }
    }

    try {
      const savedCart = localStorage.getItem("fn_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const totalBill = subtotal + deliveryFee;

  async function handleConfirmOrder() {
    if (!address.trim()) {
      toast("Please enter your delivery destination address", "warning");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Clear cart
      localStorage.removeItem("fn_cart");

      toast("Order placed successfully! Redirecting to tracking...", "success");
      setOpen(false);

      const generatedOrderId = `OD-${Math.floor(10000 + Math.random() * 90000)}`;
      setTimeout(() => {
        router.push(`/orders/${generatedOrderId}`);
      }, 800);
    } catch {
      toast("Failed to place order. Please try again.", "danger");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return (
    <AppShell
      role="Customer portal"
      title="Checkout"
      subtitle="Review your order items, select a payment method, and confirm your delivery destination."
      nav={customerNav}
      actions={<Badge tone="primary">Secure checkout</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        {/* Left Column: Cart Review */}
        <Panel className="space-y-5 p-6">
          <SectionHeading eyebrow="Cart review" title="Selected Items" />

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-black/5 bg-slate-50/80 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">Your basket is currently empty</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore local eateries across Dhaka to add freshly prepared dishes to your checkout.
              </p>
              <Link
                href="/home"
                className="inline-flex items-center rounded-full bg-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition"
              >
                Browse Menu Dishes →
              </Link>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-slate-700">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-slate-50 p-4"
                >
                  <div>
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="ml-2 text-xs text-slate-500">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">৳{item.price * item.quantity}</span>
                </div>
              ))}

              <div className="border-t border-black/5 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery fee</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t border-black/5">
                  <span>Total Amount</span>
                  <span className="text-amber-700">৳{totalBill}</span>
                </div>
              </div>
            </div>
          )}
        </Panel>

        {/* Right Column: Address & Payment */}
        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Delivery" title="Delivery Address & Instructions" />
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 block">
              <span>Street Address / Area *</span>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter house, road, area, Dhaka"
                className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                required
              />
            </label>
            <label className="space-y-1.5 text-xs font-semibold text-slate-700 block">
              <span>Delivery Instructions (Optional)</span>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="e.g. Leave at reception, call upon arrival..."
                className="min-h-20 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 resize-none"
              />
            </label>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Payment" title="Select Payment Method" />
            <div className="grid gap-2.5">
              {[
                { id: "Cash on delivery", icon: "💵", label: "Cash on Delivery (COD)" },
                { id: "bKash / Nagad", icon: "📱", label: "Mobile Wallet (bKash / Nagad)" },
                { id: "Debit / Credit Card", icon: "💳", label: "Online Card Payment" },
              ].map((method) => {
                const active = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 text-sm cursor-pointer transition ${
                      active
                        ? "border-amber-500 bg-amber-50/70 font-semibold text-slate-900 ring-2 ring-amber-500/20"
                        : "border-black/5 bg-slate-50 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{method.icon}</span>
                      <span>{method.label}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={active}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-amber-600"
                    />
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Review & Place Order
            </button>
          </Panel>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <Modal
        open={open}
        title="Confirm Your Order"
        description="Please verify your delivery details before final submission."
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Destination:</span>
              <span className="font-semibold text-slate-900 text-right max-w-[60%] truncate">
                {address || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment:</span>
              <span className="font-semibold text-slate-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-black/5 pt-2 font-bold text-sm">
              <span>Total Payable:</span>
              <span className="text-amber-700">৳{totalBill > 0 ? totalBill : "As billed"}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Modify
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={isPlacingOrder}
              className="rounded-full bg-amber-500 px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition disabled:opacity-50"
            >
              {isPlacingOrder ? "Dispatching..." : "Confirm & Place Order"}
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
