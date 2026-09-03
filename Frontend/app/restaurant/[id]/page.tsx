import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading } from "@/components/ui";
import { customerNav } from "@/lib/platform";
import { OwnerAccessGuard } from "@/components/owner-access-guard";

export default function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const restaurantName = `Restaurant ${params.id}`;

  const menuSections = [
    { title: "Popular picks", items: ["Smash Burger", "Truffle Fries", "Chicken Wings"] },
    { title: "Mains", items: ["Rice Bowl", "Grilled Salmon", "Noodle Box"] },
    { title: "Drinks & desserts", items: ["Lemonade", "Cold Brew", "Lava Cake"] },
  ];

  return (
    <AppShell
      role="Customer portal"
      title={restaurantName}
      subtitle="Restaurant detail page with menu browsing, fast add-to-cart actions, and checkout handoff."
      nav={customerNav}
      actions={
        <Link href="/checkout" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-orange-500">
          Checkout
        </Link>
      }
    >
      <OwnerAccessGuard />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success">Open now</Badge>
              <Badge tone="primary">4.8 rating</Badge>
              <Badge tone="neutral">24 min delivery</Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">{restaurantName}</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              Restaurant details should eventually come from the Restaurant and Foods tables in your ERD. This screen already matches that backend shape, so the API can be attached later without a layout rewrite.
            </p>
          </Panel>

          {menuSections.map((section) => (
            <section key={section.title} className="space-y-3">
              <SectionHeading eyebrow="Menu section" title={section.title} />
              <div className="grid gap-4 md:grid-cols-3">
                {section.items.map((item) => (
                  <Panel key={item} className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-white">{item}</p>
                      <p className="text-sm text-slate-400">Fresh ingredients • high margin</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">৳12.00</span>
                      <ActionButton endpoint="/cart/items" label="Add" tone="secondary" />
                    </div>
                  </Panel>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-6">
          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Cart summary" title="Small, focused checkout card" />
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Chicken Bowl x1</span><span>৳14</span></div>
              <div className="flex items-center justify-between"><span>Fries x1</span><span>৳5</span></div>
              <div className="flex items-center justify-between"><span>Delivery</span><span>৳2</span></div>
              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-white">
                <span className="font-medium">Total</span>
                <span className="text-xl font-semibold">৳21</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-2 block rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition hover:bg-orange-500">
              Go to checkout
            </Link>
          </Panel>

          <Panel className="space-y-4 p-6">
            <SectionHeading eyebrow="Kitchen notes" title="Backend hook points" />
            <p className="text-sm leading-6 text-slate-400">
              Use this page to connect menu fetches, cart mutation, and restaurant availability once the backend exposes the corresponding endpoints.
            </p>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
