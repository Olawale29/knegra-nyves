"use client";

import Link from "next/link";
import { resolveLines } from "@/lib/catalog";
import { useBag } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { BagLines, BagSummary } from "@/components/cart/BagParts";
import { Breadcrumbs, EmptyState } from "@/components/ui/primitives";

export function BagPage() {
  const hydrated = useHydrated();
  const lines = useBag((s) => s.lines);
  const resolved = hydrated ? resolveLines(lines) : [];
  const subtotal = resolved.reduce((s, r) => s + r.total, 0);
  const count = resolved.reduce((n, r) => n + r.line.quantity, 0);

  return (
    <div className="gutter max-site pb-24 pt-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag" }]} />
      <h1 className="mt-8 font-display text-[clamp(44px,6vw,88px)] font-light leading-none">
        Your bag {hydrated && count > 0 && <span className="text-[0.45em] text-taupe">({count})</span>}
      </h1>

      {!hydrated ? (
        <div className="h-[40vh]" aria-busy="true" />
      ) : resolved.length === 0 ? (
        <EmptyState title="Your bag is empty." body="Every inheritance begins with a single piece." action={{ label: "Enter the House", href: "/shop" }} />
      ) : (
        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BagLines resolved={resolved} />
            <Link href="/shop" className="link-line label mt-8 inline-block">
              Continue shopping
            </Link>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Order summary">
            <div className="bg-cream p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <h2 className="label mb-6">Summary</h2>
              <BagSummary subtotal={subtotal} />
              <Link href="/checkout" className="btn btn-ink mt-8 w-full">
                Proceed to checkout
              </Link>
              <p className="mt-4 text-[12px] leading-relaxed text-taupe">
                This is a demonstration: checkout collects no payment details and places no real order.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
