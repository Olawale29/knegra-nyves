"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { megaMenu } from "@/data/collections";
import { media } from "@/data/media";
import { announcements } from "@/data/site";
import { manifesto } from "@/data/content";
import { cx } from "@/lib/format";
import { bagCount, useBag, useUi } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { Wordmark } from "@/components/ui/primitives";

type MenuId = "collections" | "shop" | "house";

const menuLabels: { id: MenuId; label: string }[] = [
  { id: "collections", label: "Collections" },
  { id: "shop", label: "Shop" },
  { id: "house", label: "The House" },
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || announcements.length < 2) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % announcements.length), 5200);
    return () => window.clearInterval(t);
  }, [paused]);
  const a = announcements[i];
  return (
    <div
      className="on-dark flex h-[var(--announce-h)] items-center justify-center bg-ink px-4 text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p key={i} className="eyebrow animate-[kn-fade_600ms_var(--ease-out)] truncate text-[10px] tracking-[0.24em]" aria-live="polite">
        {a.href ? (
          <Link href={a.href} className="link-reveal">
            {a.text}
          </Link>
        ) : (
          a.text
        )}
      </p>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuId | null>(null);
  const closeTimer = useRef<number | null>(null);
  const hydrated = useHydrated();
  const count = useBag((s) => bagCount(s.lines));
  const openDrawer = useBag((s) => s.openDrawer);
  const setSearch = useUi((s) => s.setSearch);
  const setMenu = useUi((s) => s.setMenu);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega menu when the route changes (derived during render).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const solid = !overlay || scrolled || open !== null;
  const tone = solid ? "text-ink" : "text-ivory";

  return (
    <>
      <header
        ref={headerRef}
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out)]",
          scrolled && "-translate-y-[var(--announce-h)]",
        )}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <AnnouncementBar />
        <div
          className={cx(
            "relative transition-[background-color,color,border-color] duration-500 ease-[var(--ease-out)]",
            solid ? "border-b border-line bg-ivory" : "on-dark border-b border-transparent bg-gradient-to-b bg-origin-border from-ink/35 to-transparent",
            tone,
          )}
        >
          <div className="gutter max-site grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center">
            {/* Left: desktop nav / mobile menu + search */}
            <nav aria-label="Primary" className="flex items-center">
              <div className="flex items-center gap-1 lg:hidden">
                <button type="button" className="-ml-2.5 grid size-11 place-items-center" aria-label="Open menu" onClick={() => setMenu(true)}>
                  <Menu className="size-5" strokeWidth={1.25} />
                </button>
                <button type="button" className="grid size-11 place-items-center" aria-label="Search" onClick={() => setSearch(true)}>
                  <Search className="size-[18px]" strokeWidth={1.25} />
                </button>
              </div>
              <ul className="hidden items-center gap-8 lg:flex">
                {menuLabels.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      className="label link-reveal min-h-11 text-[11px]"
                      aria-expanded={open === m.id}
                      aria-controls={`mega-${m.id}`}
                      onClick={(e) => setOpen((cur) => (e.detail === 0 || cur !== m.id ? (cur === m.id ? null : m.id) : cur))}
                      onMouseEnter={() => {
                        cancelClose();
                        setOpen(m.id);
                      }}
                    >
                      {m.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <Link href="/" aria-label="KNEGRA NYVES — home" className="block px-2">
              <Wordmark className="h-[22px] sm:h-[26px] lg:h-[30px]" />
            </Link>

            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <button type="button" className="hidden size-11 place-items-center lg:grid" aria-label="Search" onClick={() => setSearch(true)}>
                <Search className="size-[18px]" strokeWidth={1.25} />
              </button>
              <Link href="/account" className="hidden size-11 place-items-center sm:grid" aria-label="Account">
                <User className="size-[18px]" strokeWidth={1.25} />
              </Link>
              <Link href="/wishlist" className="hidden size-11 place-items-center sm:grid" aria-label="Wishlist">
                <Heart className="size-[18px]" strokeWidth={1.25} />
              </Link>
              <button type="button" onClick={openDrawer} className="relative -mr-2.5 grid size-11 place-items-center" aria-label={`Shopping bag, ${hydrated ? count : 0} items`}>
                <ShoppingBag className="size-[18px]" strokeWidth={1.25} />
                <span
                  className={cx(
                    "absolute right-1 top-1.5 grid min-w-4 place-items-center rounded-full px-1 text-[9.5px] font-medium leading-4 tabular-nums transition-transform duration-300",
                    solid ? "bg-ink text-ivory" : "bg-ivory text-ink",
                    hydrated && count > 0 ? "scale-100" : "scale-0",
                  )}
                  aria-hidden
                >
                  {hydrated ? count : 0}
                </span>
              </button>
            </div>
          </div>

          <MegaMenu open={open} onNavigate={() => setOpen(null)} />
        </div>
      </header>
      {/* Spacer so content never sits beneath the fixed header (except the full-bleed home hero). */}
      {!overlay && <div aria-hidden className="h-[calc(var(--announce-h)+var(--header-h))]" />}
    </>
  );
}

function MegaMenu({ open, onNavigate }: { open: MenuId | null; onNavigate: () => void }) {
  return (
    <div
      className={cx(
        "absolute inset-x-0 top-full hidden border-b border-line bg-ivory text-ink lg:block",
        "origin-top transition-[opacity,transform,visibility] duration-500 ease-[var(--ease-out)]",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
      )}
    >
      <div className="gutter max-site grid grid-cols-12 gap-10 py-12">
        {open === "collections" && (
          <div id="mega-collections" className="contents">
            <ul className="col-span-4 space-y-3.5">
              {megaMenu.collections.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onNavigate} className="group/link flex items-baseline gap-4">
                    <span className="font-display text-[28px] leading-tight transition-colors group-hover/link:text-camel-deep">{l.label}</span>
                    <span className="text-[12px] text-taupe">{l.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <MegaTile className="col-span-4" href="/collections/the-art-of-flight" image={media.camelFlight} kicker="Campaign" title="The Art of Flight" onNavigate={onNavigate} />
            <MegaTile className="col-span-4" href="/collections/kn-forms" image={media.formsOrbis} kicker="SS26 · The Inheritance Drop" title="KN Forms" onNavigate={onNavigate} />
          </div>
        )}
        {open === "shop" && (
          <div id="mega-shop" className="contents">
            <ul className="col-span-3 space-y-2">
              {megaMenu.shop.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onNavigate} className="link-reveal text-[15px]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-3 space-y-2">
              <p className="eyebrow mb-4 text-taupe">Most asked for</p>
              <Link href="/products/nyves-coquette-headband" onClick={onNavigate} className="link-reveal block text-[15px]">The NYVES Coquette Headband</Link>
              <Link href="/products/the-art-of-flight-silk-scarf" onClick={onNavigate} className="link-reveal block text-[15px]">The Art of Flight Silk Scarf</Link>
              <Link href="/products/the-randolph-pajama-duo" onClick={onNavigate} className="link-reveal block text-[15px]">The Randolph Pajama Duo</Link>
              <Link href="/shop?sort=newest" onClick={onNavigate} className="link-reveal block text-[15px]">New in</Link>
            </div>
            <MegaTile className="col-span-3" href="/collections/coquette" image={media.headbandCobaltWorn} kicker="Headbands" title="The NYVES Coquette" onNavigate={onNavigate} />
            <MegaTile className="col-span-3" href="/collections/the-randolph" image={media.randolphShoreHat} kicker="Unisex" title="The Randolph" onNavigate={onNavigate} />
          </div>
        )}
        {open === "house" && (
          <div id="mega-house" className="contents">
            <ul className="col-span-3 space-y-2">
              {megaMenu.house.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onNavigate} className="link-reveal text-[15px]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-5 flex flex-col justify-center border-l border-line pl-10">
              <p className="eyebrow mb-5 text-taupe">{manifesto.kicker}</p>
              <p className="font-display text-[40px] italic leading-[1.05]">{manifesto.question}</p>
              <Link href="/the-house" onClick={onNavigate} className="link-line label mt-6 self-start">
                Read the manifesto
              </Link>
            </div>
            <MegaTile className="col-span-4" href="/the-house" image={media.recognizedDuo} kicker="The House" title="Icons, recognised" onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </div>
  );
}

function MegaTile({
  href,
  image,
  kicker,
  title,
  className,
  onNavigate,
}: {
  href: string;
  image: { src: string; alt: string; focus?: string };
  kicker: string;
  title: string;
  className?: string;
  onNavigate: () => void;
}) {
  return (
    <Link href={href} onClick={onNavigate} className={cx("group block", className)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <Image src={image.src} alt={image.alt} fill sizes="25vw" quality={70} className="tile-media object-cover" style={{ objectPosition: image.focus ?? "50% 50%" }} />
      </div>
      <p className="eyebrow mt-3 text-taupe">{kicker}</p>
      <p className="mt-1 font-display text-[22px]">{title}</p>
    </Link>
  );
}
