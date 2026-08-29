import Link from "next/link";
import { landingRestaurants } from "@/lib/platform";
import { getRestaurantCards } from "@/lib/restaurants";
import { LandingHeader } from "@/components/landing-header";

export const dynamic = "force-dynamic";

const heroImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
];

export default async function LandingPage() {
  const neonRestaurants = await getRestaurantCards(3);
  const isLive = neonRestaurants.length > 0;
  const restaurants = isLive
    ? neonRestaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: `${restaurant.area} • Dhaka`,
        rating: restaurant.rating,
        mapsUrl: restaurant.mapsUrl,
      }))
    : landingRestaurants.map((restaurant, idx) => ({
        id: String(idx + 1),
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        location: restaurant.eta,
        rating: restaurant.rating,
        mapsUrl: null,
      }));

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <LandingHeader />

        <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <div className="rounded-[36px] border border-black/5 bg-white p-8 shadow-sm md:p-12">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">Fastest Delivery, All over Dhaka City!</span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
                  Food that feels close to home.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Browse restaurants, place an order, and track it live — with a cleaner, more familiar food app feel.
                </p>
              </div>

              <form action="/home" method="GET" className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Please type your address here</span>
                  <input
                    name="address"
                    className="w-full rounded-2xl border border-black/10 bg-slate-50 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="House, road, area, Dhaka"
                  />
                </label>
                <button type="submit" className="mt-auto rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
                  Find food
                </button>
              </form>

              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-4 py-2">30 min average delivery</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">Live rider tracking</span>
                <span className="rounded-full bg-slate-100 px-4 py-2">Cashless and Taka</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div
              className="min-h-72 overflow-hidden rounded-[30px] bg-cover bg-center shadow-sm sm:row-span-2"
              style={{ backgroundImage: `linear-gradient(rgba(16,24,40,0.22), rgba(16,24,40,0.45)), url('${heroImages[0]}')` }}
            >
              <div className="flex h-full items-end p-5">
                <div className="rounded-2xl bg-white/90 px-4 py-3 text-sm text-slate-900 shadow">
                  Fresh, local, and ready to go
                </div>
              </div>
            </div>

            <div
              className="min-h-44 overflow-hidden rounded-[30px] bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `linear-gradient(rgba(16,24,40,0.18), rgba(16,24,40,0.5)), url('${heroImages[1]}')` }}
            />
            <div
              className="min-h-44 overflow-hidden rounded-[30px] bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `linear-gradient(rgba(16,24,40,0.18), rgba(16,24,40,0.5)), url('${heroImages[2]}')` }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-700">
                {isLive ? "Live from Neon" : "Popular restaurants"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {isLive ? "Top Dhaka restaurants" : "Quick picks people keep ordering"}
              </h2>
            </div>
            <Link href="/home" prefetch={false} className="text-sm font-medium text-amber-700 hover:underline">
              Browse all {isLive ? "(100+)" : ""} →
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {restaurants.map((restaurant, index) => (
              <article key={restaurant.name} className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition hover:shadow-md">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15,23,32,0.1), rgba(15,23,32,0.45)), url('${heroImages[index % heroImages.length]}')`,
                  }}
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{restaurant.name}</p>
                      <p className="text-sm text-slate-500">{restaurant.cuisine}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                      {restaurant.rating === "New" ? "New" : `${restaurant.rating} ★`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{restaurant.location}</span>
                    {restaurant.mapsUrl ? (
                      <a
                        href={restaurant.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-amber-700 hover:underline"
                      >
                        View map →
                      </a>
                    ) : (
                      <Link href="/home" className="text-xs font-medium text-amber-700 hover:underline">
                        Order now →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
