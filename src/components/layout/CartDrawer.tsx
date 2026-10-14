"use client";

import Link from "next/link";
import { useBag } from "@/store";
import { resolveLines } from "@/lib/catalog";
import { Dialog } from "@/components/ui/Dialog";
import { BagLines, BagSummary } from "@/components/cart/BagParts";
import { EmptyState } from "@/components/ui/primitives";
import { useHydrated } from "@/components/providers/StoreHydrator";

export function CartDrawer() {
  const open = useBag((s) => s.drawerOpen);
  const close = useBag((s) => s.closeDrawer);
  const lines = useBag((s) => s.lines);
  const lastAdded = useBag((s) => s.lastAdded);
  const hydrated = useHydrated();
  const resolved = hydrated ? resolveLines(lines) : [];
  const subtotal = resolved.reduce((s, r) => s + r.total, 0);

  return (
    <Dialog
      open={open}
      onClose={close}
      title={`Your bag${resolved.length ? ` (${resolved.reduce((n, r) => n + r.line.quantity, 0)})` : ""}`}
      side="right"
      footer={
        resolved.length > 0 ? (
          <div className="border-t border-line px-5 py-5 sm:px-7">
            <BagSummary subtotal={subtotal} compact />
            <div className="mt-5 grid gap-2.5">
              <Link href="/checkout" onClick={close} className="btn btn-ink w-full">
                Checkout
              </Link>
              <Link href="/cart" onClick={close} className="btn btn-outline w-full">
                View bag
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      {lastAdded && resolved.some((r) => r.line.key === lastAdded) && (
        <p role="status" className="flex items-center gap-2 bg-cream px-5 py-3 text-[13px] sm:px-7">
          <span aria-hidden className="size-1.5 rounded-full bg-camel" /> Added to your bag
        </p>
      )}
      {resolved.length === 0 ? (
        <EmptyState title="Your bag is empty." body="Every inheritance begins with a single piece." action={{ label: "Enter the House", href: "/shop" }} />
      ) : (
        <div className="px-5 sm:px-7">
          <BagLines resolved={resolved} compact highlight={lastAdded} />
        </div>
      )}
    </Dialog>
  );
}
