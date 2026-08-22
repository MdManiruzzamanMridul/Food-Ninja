"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthChrome } from "@/components/auth-chrome";
import { Panel, Badge } from "@/components/ui";
import { Modal } from "@/components/modal";
import { useToast } from "@/components/toast-provider";

export default function RegisterPage() {
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
      toast("Please provide all 4 required admin attributes (username, email, phone, password)", "warning");
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
        throw new Error(result.message || "Failed to register admin in database");
      }

      toast(result.message || "Admin registered successfully!", "success");
      setSuccessData({
        message: result.message || "Admin record successfully written to database!",
        data: result.data || {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
        },
      });

      // Clear the form on successful registration
      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to connect to local backend (http://localhost:5000)";
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
                <Badge tone="primary">Admin Registration</Badge>
                <h1 className="text-4xl font-semibold tracking-tight text-white">
                  Create Admin Account.
                </h1>
                <p className="text-sm leading-6 text-slate-400">
                  Register a new administrator according to the database schema. Data is received by the local Python Flask service and stored directly into PostgreSQL.
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-orange-300 uppercase tracking-wider">Admin Schema Specification:</p>
                  <div className="grid gap-2 text-slate-300">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-mono text-orange-200">username</span>
                      <span className="text-slate-400">VARCHAR (NOT NULL)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-mono text-orange-200">email</span>
                      <span className="text-slate-400">VARCHAR (NOT NULL)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-mono text-orange-200">phone</span>
                      <span className="text-slate-400">VARCHAR (NOT NULL)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-orange-200">password_hash</span>
                      <span className="text-slate-400">VARCHAR (NOT NULL)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                <span className="font-semibold">Target Route:</span> <code className="text-white">POST http://localhost:5000/login</code>
              </div>
            </Panel>

            <Panel className="p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-orange-300/80">Register</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Admin Details</h2>
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
                      placeholder="e.g. system_admin"
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
                      placeholder="Create admin password"
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
                        Saving Admin to Database...
                      </span>
                    ) : (
                      "Register Admin & Write to DB"
                    )}
                  </button>
                </form>

                <p className="text-sm text-slate-400">
                  Already registered?{" "}
                  <Link href="/login" className="text-orange-300 hover:underline">
                    Back to Admin Login
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
