"use client";

import Image from "next/image";
import { ImageOff, Minus, Plus } from "lucide-react";
import { cx } from "@/lib/format";
import { useAdmin } from "@/store";
import { AdminTitle, Panel } from "@/components/admin/AdminShell";
import { useAdminProducts } from "@/components/admin/useAdminData";
import { availabilityLabel } from "@/components/admin/AdminProducts";

const LOW = 8;

export function AdminInventory() {
  const products = useAdminProducts();
  const patch = useAdmin((s) => s.patchProduct);
  const tracked = products.filter((p) => p.availability !== "made_to_order");
  const mto = products.filter((p) => p.availability === "made_to_order");
  const max = Math.max(...tracked.map((p) => p.stock), 1);
  const units = tracked.reduce((s, p) => s + p.stock, 0);
  const low = tracked.filter((p) => p.stock <= LOW).length;

  const adjust = (id: string, stock: number) => {
    const next = Math.max(0, stock);
    patch(id, { stock: next, availability: next === 0 ? "sold_out" : next <= LOW ? "low_stock" : "in_stock" });
  };

  return (
    <div>
      <AdminTitle title="Inventory" kicker="Demo stock levels" />
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          ["Units on hand", units],
          ["Low or out", low],
          ["Made to order", mto.length],
        ].map(([l, v]) => (
          <div key={l as string} className="border border-line bg-ivory p-5">
            <p className="text-[12px] text-taupe">{l}</p>
            <p className="mt-2 font-display figures text-[34px] leading-none">{v}</p>
          </div>
        ))}
      </div>

      <Panel title="Tracked pieces">
        <ul className="divide-y divide-line">
          {tracked.map((p) => (
            <li key={p.id} className="grid grid-cols-[48px_1fr] items-center gap-x-4 gap-y-3 px-5 py-4 md:grid-cols-[48px_1.2fr_2fr_auto]">
              <div className="relative grid size-12 place-items-center overflow-hidden bg-cream">
                {p.images[0] ? <Image src={p.images[0].src} alt="" fill sizes="48px" quality={70} className="object-cover" /> : <ImageOff className="size-4 text-taupe" strokeWidth={1.4} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-medium">{p.name}</p>
                <p className="text-[12px] text-taupe">
                  {p.archiveNo} · {availabilityLabel[p.availability]}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="h-1.5 bg-cream" role="img" aria-label={`${p.stock} units`}>
                  <div className={cx("h-1.5 rounded-r-[2px] transition-[width] duration-500", p.stock <= LOW ? "bg-danger" : "bg-camel-deep")} style={{ width: `${(p.stock / max) * 100}%` }} />
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-1">
                <button type="button" onClick={() => adjust(p.id, p.stock - 1)} disabled={p.stock === 0} className="grid size-8 place-items-center border border-line-strong disabled:opacity-30" aria-label={`Decrease stock of ${p.name}`}>
                  <Minus className="size-3" strokeWidth={1.5} />
                </button>
                <output className={cx("w-10 text-center text-[13.5px] tabular-nums", p.stock <= LOW && "font-medium text-danger")}>{p.stock}</output>
                <button type="button" onClick={() => adjust(p.id, p.stock + 1)} className="grid size-8 place-items-center border border-line-strong" aria-label={`Increase stock of ${p.name}`}>
                  <Plus className="size-3" strokeWidth={1.5} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {mto.length > 0 && (
        <Panel title="Made to order" className="mt-6">
          <ul className="divide-y divide-line">
            {mto.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3 text-[13.5px]">
                {p.name}
                <span className="text-[12px] text-taupe">No stock held · lead time to be confirmed</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
