"use client";

import { Heart } from "lucide-react";
import { cx } from "@/lib/format";
import { useWishlist } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";

export function WishlistButton({
  productId,
  productName,
  variant = "icon",
  className,
}: {
  productId: string;
  productName: string;
  variant?: "icon" | "text";
  className?: string;
}) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(productId));
  const toggle = useWishlist((s) => s.toggle);
  const on = hydrated && saved;

  if (variant === "text") {
    return (
      <button type="button" onClick={() => toggle(productId)} aria-pressed={on} className={cx("inline-flex min-h-11 items-center gap-2 text-[12px] uppercase tracking-[0.14em]", className)}>
        <Heart className={cx("size-4 transition-colors", on && "fill-ink")} strokeWidth={1.25} />
        {on ? "Saved to wishlist" : "Save to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={on}
      aria-label={on ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cx("grid size-11 place-items-center text-ink transition-transform active:scale-90", className)}
    >
      <Heart className={cx("size-[17px] transition-colors duration-300", on ? "fill-ink" : "fill-ivory/40")} strokeWidth={1.25} />
    </button>
  );
}
