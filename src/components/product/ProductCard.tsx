"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { canQuickAdd, defaultSelections, fromPrice } from "@/lib/catalog";
import { cx } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useBag } from "@/store";
import { DemoTag, Price } from "@/components/ui/primitives";
import { WishlistButton } from "@/components/product/WishlistButton";

export function ProductCard({
  product,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  aspect = "aspect-[4/5]",
  preload = false,
}: {
  product: Product;
  sizes?: string;
  aspect?: string;
  preload?: boolean;
}) {
  const add = useBag((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);
  const { amount, isFrom } = fromPrice(product);
  const quick = canQuickAdd(product);
  const colours = product.options.find((o) => o.id === "colour")?.values ?? [];
  const [primary, secondary] = product.images;
  const href = `/products/${product.slug}`;

  return (
    <article className="group relative flex flex-col">
      <div className={cx("relative overflow-hidden bg-cream", aspect)}>
        <Link href={href} className="absolute inset-0 block" aria-label={product.name} tabIndex={-1}>
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={sizes}
            quality={80}
            preload={preload}
            className="tile-media object-cover"
            style={{ objectPosition: primary.focus ?? "50% 50%" }}
          />
          {secondary && (
            <Image
              src={secondary.src}
              alt=""
              aria-hidden
              fill
              sizes={sizes}
              quality={80}
              className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-out)] group-hover:opacity-100 max-md:hidden"
              style={{ objectPosition: secondary.focus ?? "50% 50%" }}
            />
          )}
        </Link>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="eyebrow text-[9.5px] text-ink/70 mix-blend-multiply">{product.archiveNo}</span>
        </div>
        <div className="absolute right-1.5 top-1.5">
          <WishlistButton productId={product.id} productName={product.name} />
        </div>

        {/* Quick add — revealed on hover for desktop, always reachable by keyboard */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100 max-lg:hidden">
          {quick ? (
            <button
              type="button"
              className="btn btn-ivory w-full min-h-11"
              onClick={() => {
                add(product.id, defaultSelections(product));
                setJustAdded(true);
                window.setTimeout(() => setJustAdded(false), 1800);
              }}
            >
              {justAdded ? "Added to bag" : "Quick add"}
            </button>
          ) : (
            <Link href={href} className="btn btn-ivory w-full min-h-11">
              Choose options
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-medium leading-snug">
            <Link href={href} className="link-reveal">
              {product.name}
            </Link>
          </h3>
          <Price amount={amount} from={isFrom} className="shrink-0 text-[13.5px]" />
        </div>
        {product.subtitle && <p className="mt-1 text-[12.5px] text-taupe">{product.subtitle}</p>}
        <div className="mt-2.5 flex min-h-4 flex-wrap items-center gap-x-3 gap-y-1.5">
          {colours.length > 1 && (
            <span className="flex items-center gap-1" aria-label={`${colours.length} colours`}>
              {colours.slice(0, 6).map((c) => (
                <span key={c.id} className="size-2.5 rounded-full ring-1 ring-ink/15" style={{ background: c.swatch }} title={c.label} />
              ))}
            </span>
          )}
          {product.priceProvenance === "demo" && <DemoTag className="text-[9.5px]">Illustrative</DemoTag>}
        </div>
      </div>
    </article>
  );
}
