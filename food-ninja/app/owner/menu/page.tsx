import { AppShell } from "@/components/app-shell";
import { ActionButton } from "@/components/action-button";
import { Badge, Panel, SectionHeading, TableFrame } from "@/components/ui";
import { ownerNav, restaurantMenu } from "@/lib/platform";

export default function OwnerMenuPage() {
  return (
    <AppShell
      role="Restaurant owner"
      title="Menu management"
      subtitle="CRUD interface for Food_category and Foods tables with inline editing."
      nav={ownerNav}
      actions={<Badge tone="primary">Inventory sync</Badge>}
    >
      <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Food categories" title="Category builder" />
          <div className="flex flex-wrap gap-2">
            {["Mains", "Sides", "Drinks", "Desserts", "Combos"].map((category) => (
              <button key={category} type="button" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                {category}
              </button>
            ))}
          </div>
          <label className="space-y-2 text-sm text-slate-300">
            New category
            <input className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" placeholder="Seasonal specials" />
          </label>
          <ActionButton endpoint="/owner/categories/create" label="Add category" />
        </Panel>

        <Panel className="space-y-4 p-6">
          <SectionHeading eyebrow="Foods" title="Inline editable menu table" description="Prices and inventory fields are editable directly inside the table rows." />
          <TableFrame>
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Inventory</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {restaurantMenu.map((item) => (
                  <tr key={item.name} className="border-t border-white/10">
                    <td className="px-4 py-3 text-white">{item.name}</td>
                    <td className="px-4 py-3 text-slate-300">{item.category}</td>
                    <td className="px-4 py-3">
                      <input defaultValue={item.price.replace("$", "")} className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" />
                    </td>
                    <td className="px-4 py-3">
                      <input defaultValue={item.inventory} className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={item.status === "Low stock" ? "warning" : "success"}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ActionButton endpoint="/owner/menu/save" label="Save" tone="secondary" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableFrame>
        </Panel>
      </div>
    </AppShell>
  );
}
