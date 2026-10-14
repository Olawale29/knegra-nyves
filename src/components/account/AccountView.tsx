"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Feather } from "lucide-react";
import { customers, demoCustomerId, mockOrders } from "@/data/mock-orders";
import { productById } from "@/data/products";
import { cx, formatDate, formatPrice } from "@/lib/format";
import type { MockOrder } from "@/lib/types";
import { useSession, useWishlist, type DemoProfile } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { DemoTag, EmptyState } from "@/components/ui/primitives";

const demoCustomer = customers.find((c) => c.id === demoCustomerId)!;
const demoProfile: DemoProfile = { firstName: demoCustomer.firstName, lastName: demoCustomer.lastName, email: demoCustomer.email, phone: "+234 800 000 0000" };
const sampleOrders = mockOrders.filter((o) => o.customerId === demoCustomerId);

type Tab = "overview" | "orders" | "profile";

export function AccountView() {
  const hydrated = useHydrated();
  const signedIn = useSession((s) => s.signedIn);
  if (!hydrated) return <div className="h-[70vh]" aria-busy="true" />;
  return signedIn ? <Dashboard /> : <SignIn />;
}

function SignIn() {
  const signIn = useSession((s) => s.signIn);
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Use at least 6 characters for the demo password.");
    if (mode === "register" && (!first.trim() || !last.trim())) return setError("Enter your first and last name.");
    const [fallbackFirst] = email.split("@");
    signIn({ firstName: mode === "register" ? first.trim() : fallbackFirst.replace(/[._-]+/g, " ").replace(/^\w/, (c) => c.toUpperCase()), lastName: mode === "register" ? last.trim() : "", email: email.trim(), phone: "" });
  };

  return (
    <div className="gutter max-site grid gap-16 pb-24 pt-12 lg:grid-cols-12 lg:pt-20">
      <div className="lg:col-span-5">
        <p className="eyebrow text-taupe">Your account</p>
        <h1 className="mt-4 font-display text-[clamp(44px,5.6vw,84px)] font-light leading-[0.95]">
          Welcome to <span className="italic">the House.</span>
        </h1>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">Track your orders, keep your Inheritance Cards and save your details for next time.</p>

        <div className="mt-10 border border-camel/60 bg-cream p-5 text-[13.5px] leading-relaxed">
          <DemoTag>Demo session</DemoTag>
          <p className="mt-2 text-ink-soft">
            Sign-in here is simulated. Nothing is verified or sent: any email and password of six or more characters will open a demo session stored only in this browser. Passwords are never saved.
          </p>
          <button type="button" onClick={() => signIn(demoProfile)} className="btn btn-ink mt-4 min-h-11 w-full">
            Continue as the demo client
          </button>
        </div>
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        <div role="tablist" aria-label="Account access" className="flex border-b border-line">
          {(["signin", "register"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={cx("label -mb-px min-h-12 flex-1 border-b text-[11px]", mode === m ? "border-ink" : "border-transparent text-taupe")}
            >
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <form noValidate onSubmit={submit} className="mt-8 space-y-5" aria-describedby={error ? "auth-err" : undefined}>
          {mode === "register" && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="a-first" className="mb-1.5 block text-[12.5px] text-ink-soft">First name</label>
                <input id="a-first" className="field" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>
              <div>
                <label htmlFor="a-last" className="mb-1.5 block text-[12.5px] text-ink-soft">Last name</label>
                <input id="a-last" className="field" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="a-email" className="mb-1.5 block text-[12.5px] text-ink-soft">Email</label>
            <input id="a-email" type="email" inputMode="email" autoComplete="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="a-pass" className="mb-1.5 block text-[12.5px] text-ink-soft">Password (demo)</label>
            <input id="a-pass" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && (
            <p id="auth-err" role="alert" className="text-[13px] text-danger">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-outline w-full">
            {mode === "signin" ? "Sign in to demo" : "Create demo account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const profile = useSession((s) => s.profile)!;
  const placed = useSession((s) => s.placedOrders);
  const signOut = useSession((s) => s.signOut);
  const wishCount = useWishlist((s) => s.ids.length);
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = (["overview", "orders", "profile"].includes(sp.get("tab") ?? "") ? sp.get("tab") : "overview") as Tab;
  const orderRef = sp.get("order");
  const isDemoClient = profile.email === demoProfile.email;
  const history: { order: MockOrder; sample: boolean }[] = [...placed.map((o) => ({ order: o, sample: false })), ...(isDemoClient ? sampleOrders.map((o) => ({ order: o, sample: true })) : [])];
  const selected = orderRef ? history.find((h) => h.order.reference === orderRef) : undefined;

  const go = (t: Tab, order?: string) => {
    const p = new URLSearchParams();
    if (t !== "overview") p.set("tab", t);
    if (order) p.set("order", order);
    router.push(p.size ? `${pathname}?${p}` : pathname, { scroll: false });
  };

  return (
    <div className="gutter max-site pb-24 pt-10 lg:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <DemoTag>Demo session</DemoTag>
          <h1 className="mt-3 font-display text-[clamp(40px,5vw,72px)] font-light leading-none">
            Hello, <span className="italic">{profile.firstName || "Icon"}.</span>
          </h1>
        </div>
        <button type="button" onClick={signOut} className="link-line label">
          Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <nav aria-label="Account" className="lg:col-span-3">
          <ul className="flex gap-6 overflow-x-auto lg:flex-col lg:gap-3">
            {(
              [
                ["overview", "Overview"],
                ["orders", "Orders"],
                ["profile", "Profile"],
              ] as [Tab, string][]
            ).map(([t, label]) => (
              <li key={t}>
                <button type="button" onClick={() => go(t)} aria-current={tab === t ? "page" : undefined} className="link-reveal min-h-10 whitespace-nowrap text-[15px] aria-[current=page]:font-medium">
                  {label}
                </button>
              </li>
            ))}
            <li>
              <Link href="/wishlist" className="link-reveal inline-flex min-h-10 items-center whitespace-nowrap text-[15px]">
                Wishlist ({wishCount})
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-9">
          {tab === "overview" && (
            <div className="grid gap-6 md:grid-cols-3">
              <Stat label="Orders" value={String(history.length)} />
              <Stat label="Saved pieces" value={String(wishCount)} />
              <Stat label="Membership" value={isDemoClient ? "Icon" : "New"} />
              <div className="md:col-span-3">
                <h2 className="label mb-4 mt-6">Latest order</h2>
                {history[0] ? <OrderRow item={history[0]} onOpen={() => go("orders", history[0].order.reference)} /> : <p className="text-[14px] text-taupe">No orders yet.</p>}
              </div>
            </div>
          )}

          {tab === "orders" && !selected && (
            <div>
              <h2 className="sr-only">Orders</h2>
              {history.length === 0 ? (
                <EmptyState title="No orders yet." body="Demo orders you complete at checkout will appear here." action={{ label: "Enter the House", href: "/shop" }} />
              ) : (
                <ul className="space-y-3">
                  {history.map((h) => (
                    <li key={h.order.reference}>
                      <OrderRow item={h} onOpen={() => go("orders", h.order.reference)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "orders" && selected && <OrderDetail item={selected} onBack={() => go("orders")} />}
          {tab === "orders" && orderRef && !selected && <p className="text-[14px] text-taupe">That order could not be found in this demo session.</p>}

          {tab === "profile" && <ProfileForm />}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream p-6">
      <p className="eyebrow text-taupe">{label}</p>
      <p className="mt-3 font-display figures text-[44px] leading-none">{value}</p>
    </div>
  );
}

const statusTone: Record<string, string> = {
  Pending: "bg-camel",
  Processing: "bg-camel",
  Dispatched: "bg-ok",
  Delivered: "bg-ink",
  Cancelled: "bg-danger",
};

function OrderRow({ item, onOpen }: { item: { order: MockOrder; sample: boolean }; onOpen: () => void }) {
  const { order, sample } = item;
  const first = productById.get(order.lines[0]?.productId);
  return (
    <button type="button" onClick={onOpen} className="flex w-full items-center gap-5 border border-line p-4 text-left transition-colors hover:border-ink/50">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">{first && <Image src={first.images[0].src} alt="" fill sizes="64px" quality={70} className="object-cover" />}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">{order.reference}</p>
        <p className="text-[12.5px] text-taupe">
          {formatDate(order.placedAt)} · {order.lines.length} {order.lines.length === 1 ? "piece" : "pieces"} · {sample ? "sample history" : "placed in this browser"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[14px] tabular-nums">{formatPrice(order.total)}</p>
        <p className="mt-1 inline-flex items-center gap-1.5 text-[12px]">
          <span className={cx("size-1.5 rounded-full", statusTone[order.status])} aria-hidden /> {order.status}
        </p>
      </div>
    </button>
  );
}

function OrderDetail({ item, onBack }: { item: { order: MockOrder; sample: boolean }; onBack: () => void }) {
  const { order, sample } = item;
  const sub = order.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const stages = ["Pending", "Processing", "Dispatched", "Delivered"];
  const at = stages.indexOf(order.status);
  return (
    <div>
      <button type="button" onClick={onBack} className="label mb-6 inline-flex min-h-10 items-center gap-1.5 text-taupe hover:text-ink">
        <ChevronLeft className="size-3.5" strokeWidth={1.5} /> All orders
      </button>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-[40px] leading-none">{order.reference}</h2>
        <DemoTag>{sample ? "Sample order — demo data" : "Demo order placed in this browser"}</DemoTag>
      </div>
      <p className="mt-2 text-[13px] text-taupe">Placed {formatDate(order.placedAt)}</p>

      {order.status !== "Cancelled" ? (
        <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Order progress">
          {stages.map((s, i) => (
            <li key={s} className="text-[12px]">
              <span className={cx("block h-0.5", i <= at ? "bg-ink" : "bg-line-strong")} />
              <span className={cx("mt-2 block", i <= at ? "text-ink" : "text-taupe")}>{s}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-[13px] text-danger">This order was cancelled.</p>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <ul className="divide-y divide-line border-y border-line">
          {order.lines.map((l, i) => {
            const p = productById.get(l.productId);
            return (
              <li key={i} className="flex gap-4 py-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">{p && <Image src={p.images[0].src} alt="" fill sizes="80px" quality={70} className="object-cover" />}</div>
                <div className="flex-1 text-[13.5px]">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-taupe">{l.variant} · × {l.quantity}</p>
                  {l.inscription && (
                    <p className="mt-1 flex items-start gap-1.5 italic text-ink-soft">
                      <Feather className="mt-0.5 size-3.5 shrink-0 text-camel-deep" strokeWidth={1.25} aria-hidden />“{l.inscription}”
                    </p>
                  )}
                </div>
                <p className="text-[13.5px] tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</p>
              </li>
            );
          })}
        </ul>
        <div className="space-y-6 text-[14px]">
          <div>
            <p className="eyebrow text-taupe">Deliver to</p>
            <p className="mt-2 leading-relaxed">
              {order.address.firstName} {order.address.lastName}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.state}
            </p>
          </div>
          <dl className="space-y-2 border-t border-line pt-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(sub)}</dd>
            </div>
            <div className="flex justify-between text-taupe">
              <dt>{order.delivery.method}</dt>
              <dd className="tabular-nums">{order.delivery.fee ? formatPrice(order.delivery.fee) : "No charge"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function ProfileForm() {
  const profile = useSession((s) => s.profile)!;
  const update = useSession((s) => s.updateProfile);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const fields: [keyof DemoProfile, string, string][] = [
    ["firstName", "First name", "given-name"],
    ["lastName", "Last name", "family-name"],
    ["email", "Email", "email"],
    ["phone", "Phone", "tel"],
  ];
  return (
    <form
      className="max-w-xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        update(form);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
      }}
    >
      <h2 className="label mb-6">Profile details</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(([k, label, ac]) => (
          <div key={k}>
            <label htmlFor={`p-${k}`} className="mb-1.5 block text-[12.5px] text-ink-soft">
              {label}
            </label>
            <input id={`p-${k}`} className="field" autoComplete={ac} type={k === "email" ? "email" : k === "phone" ? "tel" : "text"} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <button type="submit" className="btn btn-ink">
          Save details
        </button>
        {saved && (
          <p role="status" className="text-[13px] text-ok">
            Saved in this browser.
          </p>
        )}
      </div>
    </form>
  );
}
