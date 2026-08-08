import Link from "next/link";
import { landingRestaurants } from "@/lib/platform";
import { Badge, Panel, SectionHeading, StatCard } from "@/components/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_32%),linear-gradient(180deg,#050816_0%,#02040b_100%)] px-4 py-6 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex items-center justify-between rounded-[28px] border border-white/10 bg-panel/70 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-orange-300/80">Food Ninja</p>
            <p className="text-sm text-slate-400">Multi-role delivery UX for customers, restaurants, riders, and admins.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" prefetch={false} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10">
              Login
            </Link>
            <Link href="/register" prefetch={false} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-orange-500">
              Create account
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <Panel className="relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_38%)]" />
            <div className="relative space-y-6">
              <Badge tone="primary">High contrast, real-time first</Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                  Fast food delivery UI built for every role in the platform.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  Food Ninja is designed as a mobile-first customer experience and a dense operational workspace for owners, riders, and administrators.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/home" prefetch={false} className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-orange-500">
                  Explore restaurants
                </Link>
                <Link href="/orders/FD-2025" prefetch={false} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10">
                  Track an order
                </Link>
              </div>
            </div>
          </Panel>

          <div className="space-y-4">
            <StatCard label="Average delivery time" value="24 min" delta="-12%" tone="success" />
            <StatCard label="Active restaurants" value="480+" delta="+38" />
            <StatCard label="Realtime riders online" value="1.2k" delta="+8%" tone="success" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300/80">Customer</p>
            <p className="mt-3 text-xl font-semibold text-white">Browse, order, and track without friction.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Hero search, category scroll, restaurant cards, checkout modal, and live order tracking.</p>
          </Panel>
          <Panel>
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300/80">Operations</p>
            <p className="mt-3 text-xl font-semibold text-white">Owner, rider, and admin workspaces.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Kanban orders, editable menus, routing maps, dense tables, and transaction controls.</p>
          </Panel>
          <Panel>
            <p className="text-sm uppercase tracking-[0.25em] text-orange-300/80">Backend ready</p>
            <p className="mt-3 text-xl font-semibold text-white">Button actions are contract-first placeholders.</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Swap <code className="rounded bg-white/5 px-1.5 py-0.5">NEXT_PUBLIC_API_BASE_URL</code> in when the backend team ships endpoints.</p>
          </Panel>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Top restaurants"
            title="A minimal feed with strong contrast"
            description="The landing page should showcase trust, speed, and the kind of ordering experience users expect from modern delivery platforms."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {landingRestaurants.map((restaurant) => (
              <Panel key={restaurant.name} className="overflow-hidden p-0">
                <div className={`h-28 bg-gradient-to-br ${restaurant.accent}`} />
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold text-white">{restaurant.name}</p>
                      <p className="text-sm text-slate-400">{restaurant.cuisine}</p>
                    </div>
                    <Badge tone="success">{restaurant.rating} ★</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{restaurant.eta}</span>
                    <span>{restaurant.cuisine}</span>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
