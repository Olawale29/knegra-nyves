"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageOff, Plus, Search } from "lucide-react";
import { categories, categoryName, collections } from "@/data/collections";
import { fromPrice } from "@/lib/catalog";
import { cx, formatPrice } from "@/lib/format";
import type { Availability, CategorySlug, Product } from "@/lib/types";
import { useAdmin } from "@/store";
import { Dialog } from "@/components/ui/Dialog";
import { DemoTag } from "@/components/ui/primitives";
import { AdminTitle, Panel } from "@/components/admin/AdminShell";
import { useAdminProducts, type AdminProduct } from "@/components/admin/useAdminData";

export const availabilityLabel: Record<Availability, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  made_to_order: "Made to order",
  sold_out: "Sold out",
};

export function AdminProducts() {
  const products = useAdminProducts();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const term = q.trim().toLowerCase();
  const list = products.filter((p) => !term || `${p.name} ${p.archiveNo} ${p.category} ${p.collection}`.toLowerCase().includes(term));

  return (
    <div>
      <AdminTitle title="Products" kicker={`${products.length} pieces in the register`}>
        <button type="button" onClick={() => setCreating(true)} className="btn btn-ink min-h-10 px-5">
          <Plus className="size-4" strokeWidth={1.5} /> Add product
        </button>
      </AdminTitle>

      <label className="mb-5 flex min-h-10 w-full items-center gap-2 border border-line bg-ivory px-3 sm:w-80">
        <Search className="size-4 text-taupe" strokeWidth={1.4} aria-hidden />
        <span className="sr-only">Search products</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, archive no., collection" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
      </label>

      <Panel>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[820px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] text-taupe">
                <th scope="col" className="px-5 py-3 font-normal">Piece</th>
                <th scope="col" className="px-5 py-3 font-normal">Collection</th>
                <th scope="col" className="px-5 py-3 font-normal">Price</th>
                <th scope="col" className="px-5 py-3 font-normal">Stock</th>
                <th scope="col" className="px-5 py-3 font-normal">Status</th>
                <th scope="col" className="px-5 py-3 font-normal">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((p) => {
                const fp = fromPrice(p);
                return (
                  <tr key={p.id} className={cx("hover:bg-cream/50", p.hidden && "opacity-55")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden bg-cream">
                          {p.images[0] ? <Image src={p.images[0].src} alt="" fill sizes="48px" quality={70} className="object-cover" /> : <ImageOff className="size-4 text-taupe" strokeWidth={1.4} />}
                        </div>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-[12px] text-taupe">
                            {p.archiveNo} · {categoryName(p.category)}
                            {p.draft && " · draft"}
                            {p.hidden && " · hidden"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-taupe">{collections.find((c) => c.slug === p.collection)?.name ?? "—"}</td>
                    <td className="px-5 py-3 tabular-nums">
                      {fp.isFrom && <span className="text-taupe">From </span>}
                      {formatPrice(fp.amount)}
                      <span className={cx("ml-2 text-[11px]", p.priceProvenance === "verified" ? "text-ok" : "text-camel-deep")}>{p.priceProvenance === "verified" ? "confirmed" : "illustrative"}</span>
                    </td>
                    <td className="px-5 py-3 tabular-nums">{p.availability === "made_to_order" ? "—" : p.stock}</td>
                    <td className="px-5 py-3">{availabilityLabel[p.availability]}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-4">
                        {!p.draft && (
                          <Link href={`/products/${p.slug}`} className="link-reveal text-[12.5px] text-taupe">
                            View
                          </Link>
                        )}
                        <button type="button" onClick={() => setEditing(p)} className="link-reveal text-[12.5px] font-medium">
                          Edit<span className="sr-only"> {p.name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <ProductForm key={editing?.id ?? (creating ? "new" : "none")} product={editing} open={!!editing || creating} onClose={() => { setEditing(null); setCreating(false); }} />
    </div>
  );
}

function ProductForm({ product, open, onClose }: { product: AdminProduct | null; open: boolean; onClose: () => void }) {
  const patch = useAdmin((s) => s.patchProduct);
  const create = useAdmin((s) => s.createProduct);
  const isNew = !product;
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [availability, setAvailability] = useState<Availability>(product?.availability ?? "in_stock");
  const [collection, setCollection] = useState(product?.collection ?? collections[0].slug);
  const [category, setCategory] = useState<CategorySlug>(product?.category ?? "tees");
  const [description, setDescription] = useState(product?.description.join("\n\n") ?? "");
  const [hidden, setHidden] = useState(product?.hidden ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const priceN = Number(price);
    const stockN = Number(stock);
    if (!name.trim()) return setError("Give the piece a name.");
    if (!Number.isFinite(priceN) || priceN <= 0) return setError("Enter a price above zero.");
    if (!Number.isInteger(stockN) || stockN < 0) return setError("Stock must be a whole number, 0 or more.");
    setError(null);
    if (isNew) {
      const id = `p-new-${Date.now()}`;
      const draft: Product = {
        id,
        slug: id,
        archiveNo: "Nº —",
        name: name.trim(),
        description: [description.trim() || "Description to follow."],
        price: priceN,
        currency: "NGN",
        priceProvenance: "demo",
        images: [],
        collection,
        category,
        options: [],
        availability,
        stock: stockN,
        details: [],
        related: [],
        tags: [],
        addedAt: new Date().toISOString().slice(0, 10),
      };
      create(draft);
      onClose();
      return;
    }
    patch(product.id, { name: name.trim(), price: priceN, stock: stockN, availability, collection, category, description: description.trim(), hidden });
    setSaved(true);
    window.setTimeout(onClose, 700);
  };

  return (
    <Dialog open={open} onClose={onClose} title={isNew ? "Add product" : `Edit ${product?.archiveNo}`} side="right">
      <form onSubmit={save} noValidate className="space-y-5 px-5 py-6 sm:px-7">
        <DemoTag>{isNew ? "Creates a draft in this browser only" : "Changes are saved to this browser’s demo admin"}</DemoTag>
        {[
          ["pf-name", "Name", <input key="i" id="pf-name" className="field" value={name} onChange={(e) => setName(e.target.value)} />],
          [
            "pf-desc",
            "Description",
            <textarea key="i" id="pf-desc" rows={4} className="field resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />,
          ],
        ].map(([id, label, el]) => (
          <div key={id as string}>
            <label htmlFor={id as string} className="mb-1.5 block text-[12.5px] text-ink-soft">
              {label as string}
            </label>
            {el}
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="pf-price" className="mb-1.5 block text-[12.5px] text-ink-soft">
              Base price (₦)
            </label>
            <input id="pf-price" type="number" inputMode="numeric" min={0} step={500} className="field" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pf-stock" className="mb-1.5 block text-[12.5px] text-ink-soft">
              Stock
            </label>
            <input id="pf-stock" type="number" inputMode="numeric" min={0} className="field" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pf-coll" className="mb-1.5 block text-[12.5px] text-ink-soft">
              Collection
            </label>
            <select id="pf-coll" className="field" value={collection} onChange={(e) => setCollection(e.target.value)}>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pf-cat" className="mb-1.5 block text-[12.5px] text-ink-soft">
              Category
            </label>
            <select id="pf-cat" className="field" value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label htmlFor="pf-av" className="mb-1.5 block text-[12.5px] text-ink-soft">
              Availability
            </label>
            <select id="pf-av" className="field" value={availability} onChange={(e) => setAvailability(e.target.value as Availability)}>
              {(Object.keys(availabilityLabel) as Availability[]).map((a) => (
                <option key={a} value={a}>
                  {availabilityLabel[a]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {isNew ? (
          <div className="grid place-items-center gap-2 border border-dashed border-line-strong bg-cream/50 p-6 text-center">
            <ImageOff className="size-5 text-taupe" strokeWidth={1.4} />
            <p className="text-[12.5px] text-taupe">Image upload connects to storage in the full platform. Drafts appear here without photography.</p>
          </div>
        ) : (
          <label className="flex items-center gap-3 text-[13.5px]">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="size-4 accent-ink" />
            Hide from the storefront
          </label>
        )}
        {error && (
          <p role="alert" className="text-[13px] text-danger">
            {error}
          </p>
        )}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn btn-ink min-h-11">
            {saved ? "Saved" : isNew ? "Create draft" : "Save changes"}
          </button>
          <button type="button" onClick={onClose} className="btn btn-outline min-h-11">
            Cancel
          </button>
        </div>
        <p className="text-[12px] leading-relaxed text-taupe">The storefront in this demo reads the original catalogue. In the full platform, saved changes would publish to the live store.</p>
      </form>
    </Dialog>
  );
}
