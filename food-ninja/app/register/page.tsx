"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge, cn } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { apiRegister } from "@/lib/backend";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const finalUsername =
      username.trim().toLowerCase() ||
      email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() ||
      name.replace(/\s+/g, "").toLowerCase();

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim() || !finalUsername) {
      toast("Please fill in all required fields (Name, Username, Phone, Email, Password)", "warning");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({
        user_type: "user",
        name: name.trim(),
        username: finalUsername,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
      });

      toast("Customer account registered successfully! Redirecting to login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create account";
      toast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="light-app min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <AuthChrome
          nav={[
            { href: "/login", label: "Login" },
            { href: "/register", label: "Register Customer" },
            { href: "/register/partner", label: "Register Rider / Admin" },
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <Panel className="p-8">
              <Badge tone="primary">Customer registration</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Create your customer profile.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Join Food Ninja to order food from top restaurants, track your deliveries live, and access exclusive deals.
              </p>
              <div className="mt-8 grid gap-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Saved addresses & instant checkout</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Live order & rider tracking</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">✓ Ratings, reviews & deals</div>
              </div>
            </Panel>

            <Panel className="p-8">
              <form onSubmit={handleRegister} className="grid gap-4">
                <label className="space-y-2 text-sm text-slate-300">
                  <span>Full name *</span>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase());
                      }
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. Ava Johnson"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Username *</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="e.g. avajohnson"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Phone number *</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="01700000000"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Email Address *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="name@example.com"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Password *</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  <span>Default delivery address (optional)</span>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Home, street, area"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                  )}
                >
                  {loading ? "Registering..." : "Register Customer Account"}
                </button>
              </form>

              <div className="mt-5 flex flex-col gap-1 text-sm text-slate-400">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-orange-300 hover:underline">
                    Sign in here
                  </Link>
                </p>
                <p>
                  Want to register as a Delivery Rider or Admin?{" "}
                  <Link href="/register/partner" className="text-orange-300 hover:underline">
                    Rider & Admin Registration
                  </Link>
                </p>
              </div>
            </Panel>
          </div>
        </AuthChrome>
      </div>
    </main>
  );
}
