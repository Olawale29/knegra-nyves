"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { collections, categories } from "@/data/collections";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { cx } from "@/lib/format";
import { useUi } from "@/store";
import { Dialog } from "@/components/ui/Dialog";

type Panel = "root" | "collections" | "shop";

export function MobileNavigation() {
  const open = useUi((s) => s.menuOpen);
  const setMenu = useUi((s) => s.setMenu);
  const [panel, setPanel] = useState<Panel>("root");
  const close = () => {
    setMenu(false);
    window.setTimeout(() => setPanel("root"), 400);
  };

  const row = "flex min-h-14 w-full items-center justify-between border-b border-line text-left font-display text-[26px]";

  return (
    <Dialog open={open} onClose={close} title="Menu" side="left">
      <div className="flex min-h-full flex-col px-5 pb-8 pt-2">
        {panel === "root" && (
          <nav aria-label="Mobile">
            <button type="button" className={row} onClick={() => setPanel("collections")}>
              Collections <ChevronRight className="size-4" strokeWidth={1.25} />
            </button>
            <button type="button" className={row} onClick={() => setPanel("shop")}>
              Shop <ChevronRight className="size-4" strokeWidth={1.25} />
            </button>
            <Link href="/the-house" className={row} onClick={close}>
              The House
            </Link>
            <Link href="/client-care" className={row} onClick={close}>
              Client care
            </Link>
            <div className="mt-8 grid grid-cols-2 gap-3 text-[13px]">
              <Link href="/account" onClick={close} className="btn btn-outline min-h-11 px-3">Account</Link>
              <Link href="/wishlist" onClick={close} className="btn btn-outline min-h-11 px-3">Wishlist</Link>
            </div>
          </nav>
        )}

        {panel !== "root" && (
          <div>
            <button type="button" onClick={() => setPanel("root")} className="label mb-4 flex min-h-11 items-center gap-2 text-taupe">
              <ChevronRight className="size-3.5 rotate-180" strokeWidth={1.5} /> Back
            </button>
            {panel === "collections" && (
              <ul>
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collections/${c.slug}`} onClick={close} className="flex items-center gap-4 border-b border-line py-3">
                      <span className="relative block size-16 shrink-0 overflow-hidden bg-cream">
                        <Image src={c.tile.src} alt="" fill sizes="64px" quality={70} className="object-cover" />
                      </span>
                      <span>
                        <span className="block font-display text-[22px] leading-tight">{c.name}</span>
                        <span className="text-[12px] text-taupe">{c.kicker}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {panel === "shop" && (
              <ul>
                <li>
                  <Link href="/shop" onClick={close} className={cx(row, "text-[22px]")}>All pieces</Link>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop?category=${c.slug}`} onClick={close} className={cx(row, "text-[22px]")}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-auto pt-10">
          <Link href="/collections/the-art-of-flight" onClick={close} className="relative block aspect-[16/10] overflow-hidden bg-cream">
            <Image src={media.camelFlight.src} alt={media.camelFlight.alt} fill sizes="400px" quality={70} className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-ivory">
              <span className="eyebrow block">Campaign</span>
              <span className="font-display text-[24px]">The Art of Flight</span>
            </span>
          </Link>
          <p className="mt-6 text-[12px] text-taupe">
            {site.city} · <a className="link-reveal" href={site.instagram.url} target="_blank" rel="noreferrer">{site.instagram.handle}</a>
          </p>
        </div>
      </div>
    </Dialog>
  );
}
