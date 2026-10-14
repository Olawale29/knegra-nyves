"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { productById } from "@/data/products";
import { canQuickAdd, defaultSelections, fromPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { useBag, useWishlist } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { Breadcrumbs, EmptyState, Price } from "@/components/ui/primitives";

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const add = useBag((s) => s.add);
  const list = ids.map((id) => productById.get(id)).filter((p): p is Product => !!p);

  return (
    <div className="gutter max-site pb-24 pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-8 font-display text-[clamp(44px,6vw,88px)] font-light leading-none">
        Wishlist {hydrated && list.length > 0 && <span className="text-[0.45em] text-taupe">({list.length})</span>}
      </h1>
      <p className="mt-4 text-[14px] text-taupe">Saved in this browser — a demo of the wishlist; no account needed.</p>

      {!hydrated ? (
        <div className="h-[40vh]" aria-busy="true" />
      ) : list.length === 0 ? (
        <EmptyState title="Nothing saved yet." body="Tap the heart on any piece to keep it here for later." action={{ label: "Browse the collections", href: "/shop" }} />
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => {
            const fp = fromPrice(p);
            const quick = canQuickAdd(p);
            return (
              <li key={p.id} className="flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                  <Link href={`/products/${p.slug}`} aria-label={p.name} className="absolute inset-0">
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width:1024px) 25vw, 50vw" quality={80} className="object-cover" />
                  </Link>
                  <button type="button" onClick={() => remove(p.id)} className="absolute right-2 top-2 grid size-10 place-items-center bg-ivory/85" aria-label={`Remove ${p.name} from wishlist`}>
                    <X className="size-4" strokeWidth={1.25} />
                  </button>
                </div>
                <p className="mt-4 text-[14px] font-medium">{p.name}</p>
                <Price amount={fp.amount} from={fp.isFrom} className="mt-1 text-[13px] text-taupe" />
                <div className="mt-4">
                  {quick ? (
                    <button type="button" onClick={() => add(p.id, defaultSelections(p))} className="btn btn-outline min-h-11 w-full px-3">
                      Add to bag
                    </button>
                  ) : (
                    <Link href={`/products/${p.slug}`} className="btn btn-outline min-h-11 w-full px-3">
                      Choose options
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
