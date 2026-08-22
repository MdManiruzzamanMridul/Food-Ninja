"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge } from "@/components/ui";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast-provider";

export default function LoginPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    message: string;
    data?: { username: string; email: string; phone: string };
  } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.phone || !formData.password) {
      toast("Please fill in all 4 admin fields (username, email, phone, password)", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to authenticate/save admin");
      }

      toast(result.message || "Admin saved successfully!", "success");
      setSuccessData({
        message: result.message || "Admin data successfully written to database!",
        data: result.data || {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        },
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error connecting to backend server on port 5000";
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
            { href: "/register", label: "Register" },
            { href: "/admin/dashboard", label: "Admin Portal" },
          ]}
        >
          <div className="mt-6 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <Panel className="flex flex-col justify-between p-8">
              <div className="space-y-5">
                <Badge tone="primary">Admin Authentication</Badge>
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Sign in to Food Ninja Admin.
                </h1>
                <p className="text-sm leading-6 text-slate-400">
                  Authentication is wired directly to the local Python Flask backend (<code className="text-orange-300">app.py</code>) and PostgreSQL database using the Admin schema.
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-orange-300 uppercase tracking-wider">Required Admin Schema Attributes:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li><strong className="text-slate-200">username:</strong> Admin username identifier</li>
                    <li><strong className="text-slate-200">email:</strong> Official admin email address</li>
                    <li><strong className="text-slate-200">phone:</strong> Contact telephone number</li>
                    <li><strong className="text-slate-200">password:</strong> Security credential stored into DB</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                <span className="font-semibold">Backend Status:</span> Connected to Flask API (<code className="text-white">http://localhost:5000/login</code>)
              </div>
            </Panel>

            <Panel className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Admin Schema</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Admin Login & DB Write</h2>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                  <label className="space-y-1.5 text-sm text-slate-300">
                    <span>Username</span>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="e.g. admin_ninja"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/60 focus:bg-white/10"
                    />
                  </label>

                  <label className="space-y-1.5 text-sm text-slate-300">
                    <span>Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="admin@foodninja.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/60 focus:bg-white/10"
                    />
                  </label>

                  <label className="space-y-1.5 text-sm text-slate-300">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+880 1700-000000"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/60 focus:bg-white/10"
                    />
                  </label>

                  <label className="space-y-1.5 text-sm text-slate-300">
                    <span>Password</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/60 focus:bg-white/10"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Writing to Database...
                      </span>
                    ) : (
                      "Submit Admin Login & Insert to DB"
                    )}
                  </button>
                </form>

                <p className="text-sm text-slate-400">
                  Want to register a new admin?{" "}
                  <Link href="/register" className="text-orange-300 hover:underline">
                    Go to Admin Register
                  </Link>
                </p>
              </div>
            </Panel>
          </div>
        </AuthChrome>
      </div>

      {/* Website Popup Modal for Successful DB Write */}
      <Modal
        open={Boolean(successData)}
        title="Database Write Successful!"
        description="The admin record was successfully transmitted to app.py and written into the PostgreSQL database."
        onClose={() => setSuccessData(null)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-lg">
              ✓
            </div>
            <div>
              <p className="font-semibold text-emerald-900">{successData?.message}</p>
              <p className="text-xs text-emerald-700 mt-0.5">Stored in PostgreSQL &gt; table: admin</p>
            </div>
          </div>

          {successData?.data ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Stored Admin Attributes</p>
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
                  <span className="text-slate-500 text-xs block">Password Hash:</span>
                  <span className="font-medium text-slate-900">•••••••• (Protected)</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSuccessData(null)}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
