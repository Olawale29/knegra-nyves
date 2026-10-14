"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { categoryName } from "@/data/collections";
import {
  facetsFor,
  filterProducts,
  priceBuckets,
  sortOptions,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/catalog";
import { cx } from "@/lib/format";
import type { MediaAsset, Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/primitives";

function readList(sp: URLSearchParams, key: string) {
  return sp.get(key)?.split(",").filter(Boolean) ?? [];
}

/**
 * Reusable product listing with URL-synced filters and sorting, so filtered
 * views are shareable and survive refresh. Facets only show values that the
 * products in this listing actually support.
 */
export function CollectionView({
  products,
  showCategoryFilter = true,
  editorial,
}: {
  products: Product[];
  showCategoryFilter?: boolean;
  /** Optional campaign image placed inside the grid. */
  editorial?: { media: MediaAsset; caption: string };
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const filters: Filters = {
    categories: readList(sp, "category"),
    colours: readList(sp, "colour"),
    sizes: readList(sp, "size"),
    price: sp.get("price"),
  };
  const sortParam = sp.get("sort") as SortKey | null;
  const sort: SortKey = sortOptions.some((o) => o.id === sortParam) ? (sortParam as SortKey) : "featured";

  const facets = useMemo(() => facetsFor(products), [products]);
  const results = useMemo(
    () => sortProducts(filterProducts(products, filters), sort),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, sp],
  );

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(sp.toString());
    mutate(next);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleIn = (key: "category" | "colour" | "size", value: string) =>
    update((p) => {
      const list = readList(p, key);
      const nextList = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      if (nextList.length) p.set(key, nextList.join(","));
      else p.delete(key);
    });

  const setPrice = (id: string | null) => update((p) => (id ? p.set("price", id) : p.delete("price")));
  const setSort = (id: SortKey) => update((p) => (id === "featured" ? p.delete("sort") : p.set("sort", id)));
  const clearAll = () => update((p) => ["category", "colour", "size", "price"].forEach((k) => p.delete(k)));

  const active: { label: string; remove: () => void }[] = [
    ...filters.categories.map((c) => ({ label: categoryName(c), remove: () => toggleIn("category", c) })),
    ...filters.colours.map((c) => ({ label: c, remove: () => toggleIn("colour", c) })),
    ...filters.sizes.map((s) => ({ label: `Size ${s}`, remove: () => toggleIn("size", s) })),
    ...(filters.price ? [{ label: priceBuckets.find((b) => b.id === filters.price)?.label ?? "Price", remove: () => setPrice(null) }] : []),
  ];

  const showCategories = showCategoryFilter && facets.categories.length > 1;

  const FilterBody = (
    <div className="space-y-10 px-5 py-8 sm:px-7">
      {showCategories && (
        <fieldset>
          <legend className="eyebrow mb-4 text-taupe">Piece</legend>
          <div className="flex flex-wrap gap-2">
            {facets.categories.map((c) => {
              const on = filters.categories.includes(c);
              return (
                <button key={c} type="button" aria-pressed={on} onClick={() => toggleIn("category", c)} className={cx("min-h-10 border px-4 text-[13px] transition-colors", on ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}>
                  {categoryName(c)}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}
      {facets.colours.length > 1 && (
        <fieldset>
          <legend className="eyebrow mb-4 text-taupe">Colour</legend>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {facets.colours.map((c) => {
              const on = filters.colours.includes(c.label);
              return (
                <label key={c.label} className="flex min-h-10 cursor-pointer items-center gap-3 text-[14px]">
                  <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggleIn("colour", c.label)} />
                  <span className="size-5 rounded-full ring-1 ring-ink/20 ring-offset-2 ring-offset-ivory peer-checked:ring-ink peer-focus-visible:outline peer-focus-visible:outline-1" style={{ background: c.swatch }} aria-hidden />
                  <span className={cx(on && "font-medium")}>{c.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      {facets.sizes.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-4 text-taupe">Size</legend>
          <div className="grid grid-cols-6 gap-1.5">
            {facets.sizes.map((s) => {
              const on = filters.sizes.includes(s);
              return (
                <button key={s} type="button" aria-pressed={on} onClick={() => toggleIn("size", s)} className={cx("min-h-11 border text-[13px] transition-colors", on ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}>
                  {s}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[12px] text-taupe">Sizes are demo data until the house confirms its size range.</p>
        </fieldset>
      )}
      <fieldset>
        <legend className="eyebrow mb-4 text-taupe">Price</legend>
        <div className="space-y-1">
          {priceBuckets.map((b) => (
            <label key={b.id} className="flex min-h-10 cursor-pointer items-center gap-3 text-[14px]">
              <input type="radio" name="price" className="size-4 accent-ink" checked={filters.price === b.id} onChange={() => setPrice(b.id)} />
              {b.label}
            </label>
          ))}
          {filters.price && (
            <button type="button" onClick={() => setPrice(null)} className="link-reveal mt-2 text-[12.5px] text-taupe">
              Any price
            </button>
          )}
        </div>
      </fieldset>
    </div>
  );

  // Place an editorial image after the 4th product when the grid is long enough.
  const gridItems: ({ type: "product"; product: Product } | { type: "editorial" })[] = results.map((p) => ({ type: "product" as const, product: p }));
  if (editorial && results.length >= 6 && active.length === 0) gridItems.splice(4, 0, { type: "editorial" });

  return (
    <div className="gutter max-site">
      {/* Toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-4 flex min-h-14 items-center justify-between gap-4 border-y border-line bg-ivory/95 px-4 backdrop-blur-sm sm:-mx-7 sm:px-7 lg:-mx-12 lg:px-12 2xl:-mx-[72px] 2xl:px-[72px]">
        <div className="flex min-w-0 items-center gap-6">
          <button type="button" onClick={() => setDrawer(true)} className="label inline-flex min-h-11 items-center gap-2.5 text-[11px]" aria-haspopup="dialog">
            <SlidersHorizontal className="size-4" strokeWidth={1.25} /> Filter
            {active.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] text-ivory">{active.length}</span>}
          </button>
          {showCategories && (
            <div className="no-scrollbar hidden items-center gap-5 overflow-x-auto md:flex">
              {facets.categories.map((c) => (
                <button key={c} type="button" aria-pressed={filters.categories.includes(c)} onClick={() => toggleIn("category", c)} className="link-reveal whitespace-nowrap text-[13px] text-taupe aria-pressed:text-ink aria-pressed:[background-size:100%_1px]">
                  {categoryName(c)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-5">
          <p className="hidden text-[12.5px] text-taupe sm:block" aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
          <label className="flex items-center gap-2 text-[12.5px]">
            <span className="text-taupe max-sm:sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="min-h-11 cursor-pointer bg-transparent pr-1 text-[13px] outline-none focus-visible:outline-1">
              {sortOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-5">
          {active.map((a) => (
            <button key={a.label} type="button" onClick={a.remove} className="inline-flex min-h-9 items-center gap-2 bg-cream px-3 text-[12.5px] hover:bg-sand" aria-label={`Remove filter ${a.label}`}>
              {a.label} <X className="size-3" strokeWidth={1.5} />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="link-reveal ml-2 min-h-9 text-[12.5px] text-taupe hover:text-ink">
            Clear all
          </button>
        </div>
      )}

      <p className="pt-5 text-[12.5px] text-taupe sm:hidden" aria-live="polite">
        {results.length} {results.length === 1 ? "piece" : "pieces"}
      </p>

      <h2 className="sr-only">Pieces</h2>
      {results.length === 0 ? (
        <div className="py-10">
          <EmptyState title="No pieces match." body="Try removing a filter — or clear them all to see the full collection." />
          <div className="-mt-12 flex justify-center pb-10">
            <button type="button" onClick={clearAll} className="btn btn-ink">
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <ul className={cx("grid grid-cols-2 gap-x-3 gap-y-12 pb-24 pt-8 sm:gap-x-5 lg:gap-x-6 lg:gap-y-16", results.length <= 2 ? "md:grid-cols-2 lg:mx-auto lg:max-w-[1100px]" : results.length === 3 ? "md:grid-cols-3" : "md:grid-cols-3 xl:grid-cols-4")}>
          {gridItems.map((item, i) =>
            item.type === "editorial" && editorial ? (
              <li key="editorial" className="col-span-2 row-span-1 max-md:hidden">
                <figure className="relative h-full min-h-[420px] overflow-hidden bg-cream">
                  <Image src={editorial.media.src} alt={editorial.media.alt} fill sizes="50vw" quality={80} className="object-cover" style={{ objectPosition: editorial.media.focus ?? "50% 50%" }} />
                  <figcaption className="on-dark absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 font-display text-[26px] italic text-ivory">
                    {editorial.caption}
                  </figcaption>
                </figure>
              </li>
            ) : item.type === "product" ? (
              <li key={item.product.id}>
                <ProductCard product={item.product} preload={i < 2} sizes={results.length <= 3 ? "(min-width:768px) 40vw, 50vw" : undefined} />
              </li>
            ) : null,
          )}
        </ul>
      )}

      <Dialog
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Filter"
        side="right"
        footer={
          <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-4 sm:px-7">
            <button type="button" onClick={clearAll} className="btn btn-outline px-3" disabled={active.length === 0}>
              Clear all
            </button>
            <button type="button" onClick={() => setDrawer(false)} className="btn btn-ink px-3">
              Show {results.length}
            </button>
          </div>
        }
      >
        {FilterBody}
      </Dialog>
    </div>
  );
}
