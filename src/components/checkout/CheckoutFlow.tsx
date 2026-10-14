"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Feather, Lock } from "lucide-react";
import { deliveryOptions, nigerianStates } from "@/data/site";
import { resolveLines } from "@/lib/catalog";
import { cx, formatPrice } from "@/lib/format";
import type { MockOrder } from "@/lib/types";
import { useBag, useSession } from "@/store";
import { useHydrated } from "@/components/providers/StoreHydrator";
import { DemoTag, EmptyState, Wordmark } from "@/components/ui/primitives";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

type Step = 0 | 1 | 2;
const steps = ["Details", "Delivery", "Review"] as const;

interface Form {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postcode: string;
  notes: string;
}

const empty: Form = { email: "", phone: "", firstName: "", lastName: "", line1: "", line2: "", city: "", state: "Lagos", postcode: "", notes: "" };

const rules: Partial<Record<keyof Form, (v: string) => string | null>> = {
  email: (v) => (!v.trim() ? "Enter your email address." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : "Enter a valid email address, like name@example.com."),
  phone: (v) => (!v.trim() ? "Enter a phone number for delivery updates." : /^\+?[0-9\s-]{10,16}$/.test(v.trim()) ? null : "Enter a valid phone number, e.g. +234 803 000 0000."),
  firstName: (v) => (v.trim() ? null : "Enter your first name."),
  lastName: (v) => (v.trim() ? null : "Enter your last name."),
  line1: (v) => (v.trim().length >= 4 ? null : "Enter your street address."),
  city: (v) => (v.trim() ? null : "Enter your city or town."),
  state: (v) => (v ? null : "Choose your state."),
};

const labels: Record<keyof Form, string> = {
  email: "Email",
  phone: "Phone",
  firstName: "First name",
  lastName: "Last name",
  line1: "Address",
  line2: "Apartment, suite (optional)",
  city: "City / town",
  state: "State",
  postcode: "Postcode (optional)",
  notes: "Delivery notes (optional)",
};

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `DEMO-${s}`;
}

export function CheckoutFlow() {
  const hydrated = useHydrated();
  const lines = useBag((s) => s.lines);
  const clear = useBag((s) => s.clear);
  const profile = useSession((s) => s.profile);
  const addOrder = useSession((s) => s.addOrder);

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<Form>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [deliveryId, setDeliveryId] = useState(deliveryOptions[0].id);
  const [acknowledged, setAcknowledged] = useState(false);
  const [placed, setPlaced] = useState<MockOrder | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Prefill from the demo account, once.
  useEffect(() => {
    if (profile) setForm((f) => ({ ...f, email: f.email || profile.email, phone: f.phone || profile.phone, firstName: f.firstName || profile.firstName, lastName: f.lastName || profile.lastName }));
  }, [profile]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const resolved = useMemo(() => (hydrated ? resolveLines(lines) : []), [hydrated, lines]);
  const subtotal = resolved.reduce((s, r) => s + r.total, 0);
  const delivery = deliveryOptions.find((d) => d.id === deliveryId)!;
  const total = subtotal + delivery.fee;

  const errors = useMemo(() => {
    const e: Partial<Record<keyof Form, string>> = {};
    (Object.keys(rules) as (keyof Form)[]).forEach((k) => {
      const msg = rules[k]!(form[k]);
      if (msg) e[k] = msg;
    });
    return e;
  }, [form]);

  if (placed) return <OrderConfirmation order={placed} />;

  if (!hydrated) return <div className="h-[70vh]" aria-busy="true" />;

  if (resolved.length === 0) {
    return (
      <div className="gutter max-site py-10">
        <EmptyState as="h1" title="Nothing to check out yet." body="Your bag is empty — add a piece to begin." action={{ label: "Enter the House", href: "/shop" }} />
      </div>
    );
  }

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const fieldError = (k: keyof Form) => ((touched[k] || showErrors) && errors[k]) || null;

  const nextFromDetails = () => {
    if (Object.keys(errors).length) {
      setShowErrors(true);
      window.setTimeout(() => summaryRef.current?.focus(), 30);
      return;
    }
    setShowErrors(false);
    setStep(1);
  };

  const place = () => {
    if (!acknowledged) return;
    const order: MockOrder = {
      id: `local-${Date.now()}`,
      reference: makeReference(),
      placedAt: new Date().toISOString().slice(0, 10),
      customerId: "local",
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      status: "Pending",
      lines: resolved.map((r) => ({ productId: r.product.id, name: r.product.name, variant: r.variant, quantity: r.line.quantity, unitPrice: r.unit, inscription: r.line.inscription })),
      delivery: { method: delivery.label, fee: delivery.fee },
      address: { firstName: form.firstName, lastName: form.lastName, line1: form.line1, line2: form.line2 || undefined, city: form.city, state: form.state, postcode: form.postcode || undefined, country: "Nigeria", phone: form.phone },
      total,
      demo: true,
    };
    addOrder(order);
    clear();
    setPlaced(order);
    window.scrollTo({ top: 0 });
  };

  const input = (k: keyof Form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const err = fieldError(k);
    const id = `co-${k}`;
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-[12.5px] text-ink-soft">
          {labels[k]}
          {rules[k] && <span aria-hidden className="text-camel-deep"> *</span>}
        </label>
        <input
          id={id}
          name={k}
          value={form[k]}
          onChange={(e) => set(k, e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
          aria-invalid={!!err}
          aria-describedby={err ? `${id}-err` : undefined}
          aria-required={!!rules[k]}
          className="field"
          {...props}
        />
        {err && (
          <p id={`${id}-err`} className="mt-1.5 text-[12.5px] text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  const errorList = Object.entries(errors) as [keyof Form, string][];

  return (
    <div className="gutter max-site pb-24 pt-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <Link href="/" aria-label="KNEGRA NYVES — home" className="lg:hidden">
          <Wordmark className="h-5" />
        </Link>
        <ol className="flex items-center gap-3 text-[12px] sm:gap-5" aria-label="Checkout progress">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2" aria-current={i === step ? "step" : undefined}>
              <span className={cx("grid size-6 place-items-center rounded-full text-[11px]", i < step ? "bg-ink text-ivory" : i === step ? "ring-1 ring-ink" : "ring-1 ring-line-strong text-taupe")}>
                {i < step ? <Check className="size-3" strokeWidth={2} /> : i + 1}
              </span>
              <span className={cx(i === step ? "text-ink" : "text-taupe", "max-sm:sr-only")}>{s}</span>
            </li>
          ))}
        </ol>
        <p className="flex items-center gap-2 text-[12px] text-taupe">
          <Lock className="size-3.5" strokeWidth={1.25} aria-hidden /> Demo checkout — no payment taken
        </p>
      </div>

      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 ref={headingRef} tabIndex={-1} className="font-display text-[clamp(36px,4vw,56px)] leading-none outline-none">
            {step === 0 ? "Your details" : step === 1 ? "Delivery" : "Review your order"}
          </h1>

          {step === 0 && (
            <form
              noValidate
              className="mt-10 space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                nextFromDetails();
              }}
            >
              {showErrors && errorList.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} role="alert" className="border border-danger/40 bg-danger/5 p-5 outline-none">
                  <p className="text-[14px] font-medium text-danger">Please check {errorList.length === 1 ? "one field" : `${errorList.length} fields`}:</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px]">
                    {errorList.map(([k, msg]) => (
                      <li key={k}>
                        <a href={`#co-${k}`} className="underline underline-offset-2">
                          {msg}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <fieldset className="space-y-5">
                <legend className="label mb-5">Contact</legend>
                {input("email", { type: "email", autoComplete: "email", inputMode: "email" })}
                {input("phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+234" })}
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="label mb-5">Delivery address</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  {input("firstName", { autoComplete: "given-name" })}
                  {input("lastName", { autoComplete: "family-name" })}
                </div>
                {input("line1", { autoComplete: "address-line1" })}
                {input("line2", { autoComplete: "address-line2" })}
                <div className="grid gap-5 sm:grid-cols-3">
                  {input("city", { autoComplete: "address-level2" })}
                  <div>
                    <label htmlFor="co-state" className="mb-1.5 block text-[12.5px] text-ink-soft">
                      State<span aria-hidden className="text-camel-deep"> *</span>
                    </label>
                    <select id="co-state" value={form.state} onChange={(e) => set("state", e.target.value)} autoComplete="address-level1" className="field cursor-pointer">
                      {nigerianStates.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {input("postcode", { autoComplete: "postal-code" })}
                </div>
                <p className="text-[12px] text-taupe">Country: Nigeria (demo — international delivery not yet confirmed by the house).</p>
              </fieldset>

              <button type="submit" className="btn btn-ink w-full sm:w-auto">
                Continue to delivery
              </button>
            </form>
          )}

          {step === 1 && (
            <div className="mt-10 space-y-8">
              <fieldset>
                <legend className="label mb-5">Choose a delivery option</legend>
                <div className="space-y-3">
                  {deliveryOptions.map((d) => (
                    <label key={d.id} className={cx("flex cursor-pointer items-start gap-4 border p-5 transition-colors", deliveryId === d.id ? "border-ink" : "border-line-strong hover:border-ink/60")}>
                      <input type="radio" name="delivery" value={d.id} checked={deliveryId === d.id} onChange={() => setDeliveryId(d.id)} className="mt-1 size-4 accent-ink" />
                      <span className="flex-1">
                        <span className="flex justify-between gap-4 text-[14px] font-medium">
                          {d.label}
                          <span className="tabular-nums">{d.fee === 0 ? "No charge" : formatPrice(d.fee)}</span>
                        </span>
                        <span className="mt-1 block text-[13px] text-taupe">
                          {d.description} · {d.eta}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <DemoTag className="mt-4">All delivery fees and timings are illustrative demo data</DemoTag>
              </fieldset>

              <div>
                <label htmlFor="co-notes" className="mb-1.5 block text-[12.5px] text-ink-soft">
                  {labels.notes}
                </label>
                <textarea id="co-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className="field resize-none" placeholder="Gate codes, a preferred time, a landmark…" />
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn btn-ink">
                  Review order
                </button>
                <button type="button" onClick={() => setStep(0)} className="btn btn-outline">
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-10 space-y-8">
              <dl className="divide-y divide-line border-y border-line text-[14px]">
                <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-start">
                  <dt className="text-taupe">Contact</dt>
                  <dd>
                    {form.email}
                    <br />
                    {form.phone}
                  </dd>
                  <button type="button" onClick={() => setStep(0)} className="link-reveal justify-self-start text-[12.5px] sm:justify-self-end">
                    Edit<span className="sr-only"> contact</span>
                  </button>
                </div>
                <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-start">
                  <dt className="text-taupe">Deliver to</dt>
                  <dd>
                    {form.firstName} {form.lastName}
                    <br />
                    {form.line1}
                    {form.line2 && <>, {form.line2}</>}
                    <br />
                    {form.city}, {form.state} {form.postcode}
                  </dd>
                  <button type="button" onClick={() => setStep(0)} className="link-reveal justify-self-start text-[12.5px] sm:justify-self-end">
                    Edit<span className="sr-only"> address</span>
                  </button>
                </div>
                <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-start">
                  <dt className="text-taupe">Delivery</dt>
                  <dd>
                    {delivery.label} — {delivery.fee === 0 ? "no charge" : formatPrice(delivery.fee)} <span className="text-taupe">(illustrative)</span>
                  </dd>
                  <button type="button" onClick={() => setStep(1)} className="link-reveal justify-self-start text-[12.5px] sm:justify-self-end">
                    Edit<span className="sr-only"> delivery</span>
                  </button>
                </div>
              </dl>

              <div className="bg-cream p-6">
                <p className="flex items-center gap-2 text-[14px] font-medium">
                  <Lock className="size-4" strokeWidth={1.25} aria-hidden /> Payment
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  This demonstration does not collect card details or connect to a payment provider. In the live store, a secure payment step (for example a Nigerian payment gateway) would appear here.
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-[13.5px]">
                <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)} className="mt-0.5 size-4 accent-ink" />
                <span>I understand this is a demo: no payment will be taken and no real order will be placed.</span>
              </label>

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={place} disabled={!acknowledged} className="btn btn-ink">
                  Complete demo order — {formatPrice(total)}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" aria-label="Order summary">
          <div className="bg-cream p-6 sm:p-8 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <h2 className="label">Order summary</h2>
            <ul className="mt-6 space-y-5">
              {resolved.map(({ line, product, total: t, variant, image }) => (
                <li key={line.key} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-sand">
                    <Image src={image.src} alt="" fill sizes="64px" quality={70} className="object-cover" />
                    <span className="absolute -right-0 -top-0 grid size-5 place-items-center bg-ink text-[10px] text-ivory">{line.quantity}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-[13px]">
                    <p className="font-medium leading-snug">{product.name}</p>
                    {variant && <p className="text-taupe">{variant}</p>}
                    {line.inscription && (
                      <p className="mt-1 flex items-start gap-1 italic text-ink-soft">
                        <Feather className="mt-0.5 size-3 shrink-0" strokeWidth={1.25} aria-hidden />“{line.inscription}”
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-[13px] tabular-nums">{formatPrice(t)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2.5 border-t border-espresso/15 pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-taupe">
                <dt>Delivery</dt>
                <dd className="tabular-nums">{step === 0 ? "Next step" : delivery.fee === 0 ? "No charge" : formatPrice(delivery.fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-espresso/15 pt-3 text-[15px] font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(step === 0 ? subtotal : total)}</dd>
              </div>
            </dl>
            <Link href="/cart" className="link-reveal mt-6 inline-block text-[12.5px] text-taupe">
              Edit bag
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
