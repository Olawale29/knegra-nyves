"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { productById } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { MockOrder } from "@/lib/types";
import { InheritanceCard } from "@/components/product/InheritanceCard";
import { DemoTag } from "@/components/ui/primitives";

export function OrderConfirmation({ order }: { order: MockOrder }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const inscribed = order.lines.find((l) => l.inscription);
  const inscribedProduct = inscribed ? productById.get(inscribed.productId) : undefined;
  const subtotal = order.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  return (
    <div className="gutter max-site pb-28 pt-12 lg:pt-20">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <DemoTag>Demo order — nothing was charged or sent</DemoTag>
          <h1 ref={ref} tabIndex={-1} className="mt-6 font-display text-[clamp(46px,6vw,92px)] font-light leading-[0.95] outline-none">
            Thank you, <span className="italic">{order.address.firstName || "Icon"}.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Your demo order has been recorded in this browser only. In the live store, a confirmation would be sent to {order.email}.
          </p>
          <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-y border-line py-6 text-[14px]">
            <div>
              <dt className="eyebrow text-taupe">Demo reference</dt>
              <dd className="mt-2 font-medium tracking-wide">{order.reference}</dd>
            </div>
            <div>
              <dt className="eyebrow text-taupe">Delivery</dt>
              <dd className="mt-2">{order.delivery.method}</dd>
            </div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/account" className="btn btn-ink">
              View in your account
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          {inscribed && inscribedProduct && (
            <div className="mb-10">
              <p className="eyebrow mb-4 text-taupe">Your Inheritance Card</p>
              <InheritanceCard archiveNo={inscribedProduct.archiveNo} productName={inscribedProduct.name} inscription={inscribed.inscription!} />
            </div>
          )}
          <div className="bg-cream p-6 sm:p-8">
            <h2 className="label">Order details</h2>
            <ul className="mt-5 divide-y divide-espresso/15 text-[14px]">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3">
                  <span>
                    {l.name} <span className="text-taupe">× {l.quantity}</span>
                    {l.variant && <span className="block text-[12.5px] text-taupe">{l.variant}</span>}
                  </span>
                  <span className="tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-espresso/15 pt-4 text-[14px]">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-taupe">
                <dt>Delivery (illustrative)</dt>
                <dd className="tabular-nums">{order.delivery.fee === 0 ? "No charge" : formatPrice(order.delivery.fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-espresso/15 pt-3 font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
