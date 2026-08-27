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

    const finalUsername = username.trim() || email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || name.replace(/\s+/g, "").toLowerCase();

    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim() || !finalUsername) {
      toast("Please fill in all required fields (Name, Username, Phone, Email, Password)", "warning");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({
        name: name.trim(),
        username: finalUsername,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        user_type: "user",
      });

      toast("Customer account created successfully! Redirecting to login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create account", "danger");
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
            { href: "/register", label: "Register" },
            { href: "/admin/dashboard", label: "Admin Portal" },
          ]}
        >
          <div className="mt-6 grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <Panel className="p-8">
              <Badge tone="primary">Customer registration</Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Create your customer profile.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Join Food Ninja to order food from your favorite restaurants across the city, track your deliveries in real-time, and earn rewards.
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
                  Full name *
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!username) {
                        setUsername(e.target.value.replace(/\s+/g, "").toLowerCase());
                      }
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  Username *
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Choose a unique username"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  Phone number *
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="+880 1700 000000"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  Email *
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
                  Password *
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Create password"
                    required
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-300">
                  Default delivery address (optional)
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Home, street, city"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-amber-500/20 transition hover:bg-amber-600 disabled:cursor-wait disabled:opacity-70"
                  )}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
              <p className="mt-5 text-sm text-slate-400">
                Already registered?{" "}
                <Link href="/login" className="text-orange-300 hover:underline">
                  Sign in here
                </Link>
              </p>
            </Panel>
          </div>
        </AuthChrome>
      </div>

      {/* Website Popup Modal for Successful DB Write */}
      <Modal
        open={Boolean(successData)}
        title="Admin Registered Successfully!"
        description="The admin data was transmitted to the local backend and inserted into the PostgreSQL database table."
        onClose={() => setSuccessData(null)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-lg">
              ✓
            </div>
            <div>
              <p className="font-semibold text-emerald-900">{successData?.message}</p>
              <p className="text-xs text-emerald-700 mt-0.5">PostgreSQL Table: <code>admin</code> (Status: pending)</p>
            </div>
          </div>

          {successData?.data ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Registered Admin Details</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500 text-xs block">Username:</span>
                  <span className="font-medium text-slate-900">{successData.data.username}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Email:</span>
                  <span className="font-medium text-slate-900">{successData.data.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Phone:</span>
                  <span className="font-medium text-slate-900">{successData.data.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">Password:</span>
                  <span className="font-medium text-slate-900">•••••••• (Encrypted in DB)</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/login"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
            >
              Go to Login
            </Link>
            <button
              type="button"
              onClick={() => setSuccessData(null)}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
