"use client";

import Image from "next/image";
import Link from "next/link";
import { Feather } from "lucide-react";
import { demoRevenueSeries } from "@/data/mock-orders";
import { formatDate, formatPrice } from "@/lib/format";
import { AdminTitle, Panel, StatusPill } from "@/components/admin/AdminShell";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { useAdminOrders, useAdminProducts } from "@/components/admin/useAdminData";

export function AdminOverview() {
  const orders = useAdminOrders();
  const products = useAdminProducts();
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const aov = live.length ? Math.round(revenue / live.length) : 0;
  const open = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const inscribed = orders.flatMap((o) => o.lines).filter((l) => l.inscription).length;
  const lowStock = products.filter((p) => p.availability !== "made_to_order" && p.stock <= 8).sort((a, b) => a.stock - b.stock);

  // Top pieces by units in the demo orders.
  const units = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of live)
    for (const l of o.lines) {
      const cur = units.get(l.productId) ?? { name: l.name, qty: 0, revenue: 0 };
      cur.qty += l.quantity;
      cur.revenue += l.quantity * l.unitPrice;
      units.set(l.productId, cur);
    }
  const top = [...units.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const topMax = top[0]?.[1].revenue ?? 1;

  return (
    <div className="space-y-8">
      <AdminTitle title="The studio, today" kicker="Overview · demo data" />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: "Revenue (demo orders)", value: formatPrice(revenue), note: `${live.length} orders` },
          { label: "Average order", value: formatPrice(aov), note: "excl. cancelled" },
          { label: "Awaiting action", value: String(open), note: "pending or processing" },
          { label: "Inheritance Cards", value: String(inscribed), note: "inscribed pieces", icon: true },
        ].map((k) => (
          <div key={k.label} className="border border-line bg-ivory p-5">
            <p className="flex items-center gap-1.5 text-[12px] text-taupe">
              {k.icon && <Feather className="size-3.5 text-camel-deep" strokeWidth={1.4} aria-hidden />}
              {k.label}
            </p>
            <p className="mt-3 font-display figures text-[clamp(28px,3vw,40px)] leading-none">{k.value}</p>
            <p className="mt-2 text-[12px] text-taupe">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel title="Revenue · last 14 days (demo)" className="xl:col-span-2">
          <div className="p-5">
            <RevenueChart data={demoRevenueSeries} />
          </div>
        </Panel>
        <Panel title="Top pieces">
          <ul className="space-y-4 p-5">
            {top.map(([id, t]) => (
              <li key={id}>
                <div className="flex justify-between gap-3 text-[13px]">
                  <span className="truncate">{t.name}</span>
                  <span className="shrink-0 tabular-nums text-taupe">{formatPrice(t.revenue)}</span>
                </div>
                <div className="mt-1.5 h-1 bg-cream">
                  <div className="h-1 rounded-r-[2px] bg-camel-deep" style={{ width: `${(t.revenue / topMax) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          title="Recent orders"
          className="xl:col-span-2"
          action={
            <Link href="/admin/orders" className="link-reveal text-[12.5px]">
              All orders
            </Link>
          }
        >
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead>
                <tr className="text-left text-[11.5px] text-taupe">
                  <th scope="col" className="px-5 py-3 font-normal">Order</th>
                  <th scope="col" className="px-5 py-3 font-normal">Client</th>
                  <th scope="col" className="px-5 py-3 font-normal">Date</th>
                  <th scope="col" className="px-5 py-3 font-normal">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-medium">
                      <Link href={`/admin/orders?open=${o.id}`} className="link-reveal">
                        {o.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">{o.customerName}</td>
                    <td className="px-5 py-3 text-taupe">{formatDate(o.placedAt)}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Low stock"
          action={
            <Link href="/admin/inventory" className="link-reveal text-[12.5px]">
              Inventory
            </Link>
          }
        >
          {lowStock.length === 0 ? (
            <p className="p-5 text-[13px] text-taupe">All pieces are comfortably stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="relative size-11 shrink-0 overflow-hidden bg-cream">
                    <Image src={p.images[0].src} alt="" fill sizes="44px" quality={70} className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px]">{p.name}</p>
                    <p className="text-[12px] text-taupe">{p.archiveNo}</p>
                  </div>
                  <span className="text-[13px] font-medium tabular-nums text-danger">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
