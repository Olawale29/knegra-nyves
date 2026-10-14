"use client";

import { productById } from "@/data/products";
import { useRecent } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function RecentlyViewed({ excludeId }: { excludeId: string }) {
  const hydrated = useHydrated();
  const ids = useRecent((s) => s.ids);
  if (!hydrated) return null;
  const list = ids
    .filter((id) => id !== excludeId)
    .map((id) => productById.get(id))
    .filter((p): p is Product => !!p)
    .slice(0, 4);
  if (!list.length) return null;
  return (
    <section aria-labelledby="recent-title" className="gutter max-site border-t border-line py-20">
      <h2 id="recent-title" className="font-display text-[clamp(28px,3vw,40px)]">
        Recently viewed
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4 lg:gap-x-6">
        {list.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} sizes="(min-width:768px) 25vw, 50vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
