"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Feather, Search } from "lucide-react";
import { cx, formatDate, formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { useAdmin } from "@/store";
import { Dialog } from "@/components/ui/Dialog";
import { DemoTag } from "@/components/ui/primitives";
import { AdminTitle, Panel, StatusPill } from "@/components/admin/AdminShell";
import { useAdminOrders } from "@/components/admin/useAdminData";

const statuses: OrderStatus[] = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled"];

export function AdminOrders() {
  const orders = useAdminOrders();
  const setStatus = useAdmin((s) => s.setOrderStatus);
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [q, setQ] = useState("");
  const openId = sp.get("open");
  const open = orders.find((o) => o.id === openId) ?? null;

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (filter === "All" || o.status === filter) &&
        (!term || [o.reference, o.customerName, o.email, ...o.lines.map((l) => l.name)].join(" ").toLowerCase().includes(term)),
    );
  }, [orders, filter, q]);

  const counts = Object.fromEntries(statuses.map((s) => [s, orders.filter((o) => o.status === s).length]));
  const setOpen = (id: string | null) => router.replace(id ? `${pathname}?open=${id}` : pathname, { scroll: false });

  return (
    <div>
      <AdminTitle title="Orders" kicker={`${orders.length} orders · demo data`} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter by status" className="no-scrollbar flex gap-1 overflow-x-auto">
          {(["All", ...statuses] as const).map((s) => (
            <button
              key={s}
              role="tab"
              type="button"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={cx("min-h-9 whitespace-nowrap rounded-full px-3.5 text-[12.5px] transition-colors", filter === s ? "bg-ink text-ivory" : "bg-ivory text-ink-soft hover:bg-cream")}
            >
              {s} <span className="opacity-60">{s === "All" ? orders.length : counts[s]}</span>
            </button>
          ))}
        </div>
        <label className="flex min-h-10 w-full items-center gap-2 border border-line bg-ivory px-3 sm:w-72">
          <Search className="size-4 text-taupe" strokeWidth={1.4} aria-hidden />
          <span className="sr-only">Search orders</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, client or piece" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </label>
      </div>

      <Panel>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] text-taupe">
                <th scope="col" className="px-5 py-3 font-normal">Order</th>
                <th scope="col" className="px-5 py-3 font-normal">Client</th>
                <th scope="col" className="px-5 py-3 font-normal">Placed</th>
                <th scope="col" className="px-5 py-3 font-normal">Pieces</th>
                <th scope="col" className="px-5 py-3 font-normal">Delivery</th>
                <th scope="col" className="px-5 py-3 font-normal">Status</th>
                <th scope="col" className="px-5 py-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((o) => (
                <tr key={o.id} className="hover:bg-cream/50">
                  <td className="px-5 py-3.5">
                    <button type="button" onClick={() => setOpen(o.id)} className="link-reveal font-medium">
                      {o.reference}
                    </button>
                    {o.lines.some((l) => l.inscription) && <Feather className="ml-2 inline size-3.5 text-camel-deep" strokeWidth={1.4} aria-label="Includes an Inheritance Card" />}
                  </td>
                  <td className="px-5 py-3.5">
                    {o.customerName}
                    <span className="block text-[12px] text-taupe">{o.email}</span>
                  </td>
                  <td className="px-5 py-3.5 text-taupe">{formatDate(o.placedAt)}</td>
                  <td className="px-5 py-3.5">{o.lines.reduce((n, l) => n + l.quantity, 0)}</td>
                  <td className="px-5 py-3.5 text-taupe">{o.delivery.method}</td>
                  <td className="px-5 py-3.5">
                    <label className="sr-only" htmlFor={`st-${o.id}`}>
                      Status for {o.reference}
                    </label>
                    <select id={`st-${o.id}`} value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="cursor-pointer rounded-full border border-line bg-transparent px-2 py-1 text-[12px]">
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums">{formatPrice(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <p className="p-8 text-center text-[13px] text-taupe">No orders match.</p>}
        </div>
      </Panel>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? `Order ${open.reference}` : "Order"} side="right">
        {open && (
          <div className="space-y-7 px-5 py-6 sm:px-7">
            <div className="flex items-center justify-between">
              <StatusPill status={open.status} />
              <DemoTag>Demo order</DemoTag>
            </div>
            <dl className="grid grid-cols-2 gap-5 text-[13px]">
              <div>
                <dt className="text-taupe">Client</dt>
                <dd className="mt-1">{open.customerName}</dd>
                <dd className="text-taupe">{open.email}</dd>
              </div>
              <div>
                <dt className="text-taupe">Placed</dt>
                <dd className="mt-1">{formatDate(open.placedAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-taupe">Deliver to</dt>
                <dd className="mt-1">
                  {open.address.line1}, {open.address.city}, {open.address.state}
                </dd>
              </div>
            </dl>
            <ul className="divide-y divide-line border-y border-line text-[13px]">
              {open.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3">
                  <span>
                    {l.name} × {l.quantity}
                    <span className="block text-taupe">{l.variant}</span>
                    {l.inscription && (
                      <span className="mt-1 flex items-start gap-1.5 italic text-ink-soft">
                        <Feather className="mt-0.5 size-3.5 shrink-0 text-camel-deep" strokeWidth={1.4} aria-hidden />
                        Card: “{l.inscription}”
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-[14px] font-medium">
              <span>Total incl. {open.delivery.method.toLowerCase()}</span>
              <span className="tabular-nums">{formatPrice(open.total)}</span>
            </div>
            <div>
              <p className="mb-2 text-[12.5px] text-taupe">Update status</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(open.id, s)} aria-pressed={open.status === s} className={cx("min-h-9 rounded-full border px-3 text-[12.5px]", open.status === s ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-taupe">In the live platform this would notify the client. Here it updates only this browser’s demo.</p>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
