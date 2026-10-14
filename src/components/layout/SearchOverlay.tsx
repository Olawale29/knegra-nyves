"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { fromPrice, search } from "@/lib/catalog";
import { useUi } from "@/store";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/primitives";

const suggestions = ["Silk scarf", "Headband", "KN Forms", "Randolph", "Cap", "Noir"];

export function SearchOverlay() {
  const open = useUi((s) => s.searchOpen);
  const setSearch = useUi((s) => s.setSearch);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = search(deferred);
  const hasQuery = deferred.trim().length >= 2;
  const close = () => setSearch(false);

  return (
    <Dialog open={open} onClose={close} title="Search" side="top" initialFocus={inputRef} hideTitle className="max-h-[92dvh]">
      <div className="gutter max-site pb-10 pt-5 lg:pt-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-taupe">Search the house</p>
          <button type="button" onClick={close} className="-mr-2 grid size-11 place-items-center" aria-label="Close search">
            <X className="size-5" strokeWidth={1.25} />
          </button>
        </div>
        <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-2 flex items-center gap-3 border-b border-ink/40 pb-3 transition-colors focus-within:border-ink">
          <Search className="size-5 shrink-0" strokeWidth={1.25} aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search products and collections
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Scarves, headbands, KN Forms…"
            className="min-w-0 flex-1 bg-transparent font-display text-[28px] outline-none placeholder:text-taupe/70 sm:text-[40px]"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="label min-h-11 text-taupe hover:text-ink">
              Clear
            </button>
          )}
        </form>

        {!hasQuery && (
          <div className="mt-6 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)} className="min-h-10 border border-line-strong px-4 text-[13px] hover:border-ink">
                {s}
              </button>
            ))}
          </div>
        )}

        <div aria-live="polite" className="mt-8">
          {hasQuery && results.products.length === 0 && results.collections.length === 0 && (
            <div className="py-6">
              <p className="font-display text-[26px] italic">Nothing found for “{deferred}”.</p>
              <p className="mt-2 text-[14px] text-taupe">Try a piece, a colour or a collection — or browse everything.</p>
              <Link href="/shop" onClick={close} className="link-line label mt-5 inline-block">
                View all {products.length} pieces
              </Link>
            </div>
          )}

          {hasQuery && results.collections.length > 0 && (
            <div className="mb-8">
              <p className="eyebrow mb-3 text-taupe">Collections</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {results.collections.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} onClick={close} className="link-reveal font-display text-[24px]">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasQuery && results.products.length > 0 && (
            <>
              <p className="eyebrow mb-4 text-taupe">
                {results.products.length} {results.products.length === 1 ? "piece" : "pieces"}
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {results.products.slice(0, 12).map((p) => {
                  const fp = fromPrice(p);
                  return (
                    <li key={p.id}>
                      <Link href={`/products/${p.slug}`} onClick={close} className="group block">
                        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                          <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width:1024px) 16vw, 45vw" quality={70} className="tile-media object-cover" />
                        </div>
                        <p className="mt-2.5 text-[13px] font-medium leading-snug">{p.name}</p>
                        <Price amount={fp.amount} from={fp.isFrom} className="text-[12.5px] text-taupe" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
