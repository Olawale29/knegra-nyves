"use client";

import Image from "next/image";
import Link from "next/link";
import { Feather } from "lucide-react";
import type { resolveLines } from "@/lib/catalog";
import { cx, formatPrice } from "@/lib/format";
import { MAX_QTY, useBag } from "@/store";
import { DemoTag, QuantitySelector } from "@/components/ui/primitives";

type Resolved = ReturnType<typeof resolveLines>;

export function BagLines({ resolved, compact = false, highlight }: { resolved: Resolved; compact?: boolean; highlight?: string | null }) {
  const setQuantity = useBag((s) => s.setQuantity);
  const remove = useBag((s) => s.remove);

  return (
    <ul className="divide-y divide-line">
      {resolved.map(({ line, product, unit, total, variant, image }) => (
        <li key={line.key} className={cx("flex gap-4 py-5 transition-colors duration-700", highlight === line.key && "bg-cream/40")}>
          <Link href={`/products/${product.slug}`} className={cx("relative shrink-0 overflow-hidden bg-cream", compact ? "h-[120px] w-24" : "h-[170px] w-[136px]")}>
            <Image src={image.src} alt={image.alt} fill sizes={compact ? "96px" : "136px"} quality={70} className="object-cover" />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow text-[9.5px] text-taupe">{product.archiveNo}</p>
                <Link href={`/products/${product.slug}`} className="link-reveal mt-1 block text-[14px] font-medium leading-snug">
                  {product.name}
                </Link>
                {variant && <p className="mt-1 text-[12.5px] text-taupe">{variant}</p>}
              </div>
              <p className="shrink-0 text-[14px] tabular-nums">{formatPrice(total)}</p>
            </div>
            {line.inscription && (
              <p className="mt-2 flex items-start gap-1.5 text-[12.5px] italic text-ink-soft">
                <Feather className="mt-0.5 size-3.5 shrink-0 text-camel-deep" strokeWidth={1.25} aria-hidden />
                <span>
                  <span className="sr-only">Inheritance card: </span>“{line.inscription}”
                </span>
              </p>
            )}
            {!compact && <p className="mt-1 text-[12.5px] text-taupe tabular-nums">{formatPrice(unit)} each</p>}
            <div className="mt-auto flex items-center justify-between gap-3 pt-3">
              <QuantitySelector
                size="sm"
                value={line.quantity}
                max={MAX_QTY}
                min={1}
                label={`Quantity of ${product.name}`}
                onChange={(n) => setQuantity(line.key, n)}
              />
              <button type="button" onClick={() => remove(line.key)} className="link-reveal min-h-9 text-[12px] text-taupe hover:text-ink">
                Remove<span className="sr-only"> {product.name}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BagSummary({ subtotal, compact = false, deliveryFee }: { subtotal: number; compact?: boolean; deliveryFee?: number | null }) {
  const total = subtotal + (deliveryFee ?? 0);
  return (
    <dl className="space-y-2.5 text-[14px]">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-taupe">
        <dt>Delivery</dt>
        <dd>{deliveryFee == null ? "Calculated at checkout" : deliveryFee === 0 ? "Complimentary" : formatPrice(deliveryFee)}</dd>
      </div>
      {!compact && (
        <div className="flex items-baseline justify-between border-t border-line pt-3.5 text-[15px] font-medium">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(total)}</dd>
        </div>
      )}
      <div className="pt-1">
        <DemoTag>Demo — delivery rates are illustrative</DemoTag>
      </div>
    </dl>
  );
}
