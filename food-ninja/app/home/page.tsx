import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { customerCategories, customerNav, customerRestaurants } from "@/lib/platform";
import { getRestaurantCards } from "@/lib/restaurants";

export const dynamic = "force-dynamic";

export default async function CustomerHomePage() {
  const neonRestaurants = await getRestaurantCards();
  const fallbackRestaurants = customerRestaurants.map((restaurant) => ({ ...restaurant, mapsUrl: null }));
  const restaurants = neonRestaurants.length > 0
    ? neonRestaurants.map((restaurant) => ({
        ...restaurant,
        eta: "Delivery details soon",
        delivery: `${restaurant.area} • View location and menu`,
        price: "Dhaka",
        status: "Open directory listing",
      }))
    : fallbackRestaurants;
  return (
    <AppShell
      role="Customer portal"
      title="Find your next meal"
      subtitle="Mobile-first feed with search, categories, restaurant cards, and a persistent cart entry point."
      nav={customerNav}
      actions={
      <Link href="/checkout" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
          Cart 2 • Checkout
        </Link>
      }
    >
      <div className="space-y-6">
        <Panel className="space-y-5 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Badge tone="primary">Location based search</Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">What do you want to eat today?</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-400">
                Search by address, cuisine, delivery time, or rating. The backend team can wire live geo-search into the placeholder actions here later.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1.1fr_.9fr_auto]">
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search restaurants or dishes" />
              <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500" placeholder="Use current location" />
              <ActionButton endpoint="/customer/search" label="Search" tone="secondary" />
            </div>
          </div>
        </Panel>

        <section className="space-y-3">
          <SectionHeading eyebrow="Categories" title="Horizontal browsing, built for thumbs" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {customerCategories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${index === 0 ? "border-amber-300/20 bg-amber-500/10 text-amber-100" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/8"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow={neonRestaurants.length > 0 ? "Live from Neon" : "Restaurants"}
            title="Restaurants near you"
            description={neonRestaurants.length > 0 ? "Real directory records from your Neon database." : "Showing sample restaurants while the database is unavailable."}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {restaurants.map((restaurant) => (
              <Panel key={restaurant.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold text-white">{restaurant.name}</p>
                    <p className="text-sm text-slate-400">{restaurant.cuisine}</p>
                  </div>
                  <Badge tone="success">{restaurant.rating === "New" ? "New" : `${restaurant.rating} ★`}</Badge>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p>{restaurant.delivery}</p>
                  <p className="mt-2 flex items-center justify-between text-slate-400">
                    <span>{restaurant.price}</span>
                    <span>{restaurant.eta}</span>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge tone={restaurant.status === "Open now" ? "success" : "primary"}>{restaurant.status}</Badge>
                  {restaurant.mapsUrl ? (
                    <a href={restaurant.mapsUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-amber-700">
                      View map →
                    </a>
                  ) : (
                    <Link href={`/restaurant/${restaurant.id}`} className="text-sm font-medium text-amber-700">
                      View menu →
                    </Link>
                  )}
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <Panel className="flex flex-col items-start justify-between gap-4 border-amber-300/20 bg-amber-500/10 p-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-700">Persistent cart</p>
            <p className="mt-2 text-xl font-semibold text-white">Floating checkout remains visible while browsing.</p>
          </div>
          <Link href="/checkout" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            Open cart
          </Link>
        </Panel>
      </div>

      <Link
        href="/checkout"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground shadow-2xl shadow-orange-500/25 transition hover:scale-[1.02] hover:bg-orange-500"
      >
        Cart • 2 items
      </Link>
    </AppShell>
  );
}
