"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Boxes, FolderOpen, LayoutDashboard, Megaphone, Package, RotateCcw, ShoppingBag, Users } from "lucide-react";
import { cx } from "@/lib/format";
import { useAdmin } from "@/store";
import { Wordmark } from "@/components/ui/primitives";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/content", label: "Campaigns", icon: Megaphone },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reset = useAdmin((s) => s.reset);
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col bg-[#f2ede4] lg:flex-row">
      <aside className="on-dark shrink-0 bg-ink text-ivory lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-[248px] lg:flex-col">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6 lg:py-7">
          <Link href="/admin" aria-label="Admin overview">
            <Wordmark className="h-5 text-ivory lg:h-6" />
          </Link>
          <p className="eyebrow mt-0 text-[9.5px] text-camel lg:mt-3">Commerce studio</p>
        </div>
        <nav aria-label="Admin" className="no-scrollbar overflow-x-auto px-3 pb-3 lg:flex-1 lg:px-3 lg:pb-0">
          <ul className="flex gap-1 lg:flex-col">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex min-h-10 items-center gap-3 whitespace-nowrap rounded-[3px] px-3 text-[13.5px] transition-colors",
                      active ? "bg-ivory/10 text-ivory" : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.4} aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden space-y-1 border-t border-white/10 p-3 lg:block">
          <Link href="/" className="flex min-h-10 items-center gap-3 rounded-[3px] px-3 text-[13px] text-ivory/65 hover:bg-ivory/5 hover:text-ivory">
            <ArrowUpRight className="size-4" strokeWidth={1.4} aria-hidden /> View storefront
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ivory px-5 py-3 lg:px-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-camel/60 bg-camel/10 px-3 py-1 text-[11.5px] font-medium text-camel-deep">
            <span className="size-1.5 animate-pulse rounded-full bg-camel" aria-hidden /> Demo mode — mock data, edits saved in this browser only
          </p>
          <div className="flex items-center gap-4">
            {confirm ? (
              <span className="flex items-center gap-2 text-[12.5px]">
                Reset all demo edits?
                <button
                  type="button"
                  className="font-medium text-danger underline underline-offset-2"
                  onClick={() => {
                    reset();
                    setConfirm(false);
                  }}
                >
                  Reset
                </button>
                <button type="button" className="text-taupe underline underline-offset-2" onClick={() => setConfirm(false)}>
                  Cancel
                </button>
              </span>
            ) : (
              <button type="button" onClick={() => setConfirm(true)} className="inline-flex min-h-9 items-center gap-1.5 text-[12.5px] text-taupe hover:text-ink">
                <RotateCcw className="size-3.5" strokeWidth={1.5} /> Reset demo
              </button>
            )}
            <Link href="/" className="inline-flex min-h-9 items-center gap-1.5 text-[12.5px] lg:hidden">
              Storefront <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </header>
        <main id="main" className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminTitle({ title, kicker, children }: { title: string; kicker?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && <p className="eyebrow text-taupe">{kicker}</p>}
        <h1 className="mt-2 font-display text-[40px] leading-none">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("border border-line bg-ivory", className)}>
      {title && (
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 className="label text-[10.5px]">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const statusStyles: Record<string, string> = {
  Pending: "bg-camel/15 text-camel-deep",
  Processing: "bg-[#e6dccb] text-espresso",
  Dispatched: "bg-ok/12 text-ok",
  Delivered: "bg-ink/8 text-ink",
  Cancelled: "bg-danger/10 text-danger",
};

export function StatusPill({ status }: { status: string }) {
  return <span className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", statusStyles[status] ?? "bg-cream")}>{status}</span>;
}
