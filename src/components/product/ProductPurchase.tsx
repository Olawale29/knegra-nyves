"use client";

import { useEffect, useId, useState } from "react";
import { Check, Feather, Ruler } from "lucide-react";
import { defaultSelections, imagesFor, priceFor, requiredOptions, type Selections } from "@/lib/catalog";
import { cx, formatPrice } from "@/lib/format";
import type { Availability, Product, ProductOption } from "@/lib/types";
import { MAX_QTY, useBag, useRecent } from "@/store";
import { Dialog } from "@/components/ui/Dialog";
import { DemoTag, QuantitySelector } from "@/components/ui/primitives";
import { InheritanceCard } from "@/components/product/InheritanceCard";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductGallery } from "@/components/product/ProductGallery";

const availabilityCopy: Record<Availability, { label: string; tone: string }> = {
  in_stock: { label: "Available", tone: "bg-ok" },
  low_stock: { label: "Only a few remain", tone: "bg-camel" },
  made_to_order: { label: "Made to order", tone: "bg-taupe" },
  sold_out: { label: "Sold out", tone: "bg-danger" },
};

const INSCRIPTION_MAX = 90;

/**
 * Client island for the product page: owns the selected variant so the
 * gallery, price, availability and add-to-bag stay in sync.
 */
export function ProductExperience({ product, children }: { product: Product; children?: React.ReactNode }) {
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(product));
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [withCard, setWithCard] = useState(false);
  const [inscription, setInscription] = useState("");
  const [sizeGuide, setSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useBag((s) => s.add);
  const push = useRecent((s) => s.push);
  const inscriptionId = useId();

  useEffect(() => {
    push(product.id);
  }, [product.id, push]);

  const price = priceFor(product, selections);
  const images = imagesFor(product, selections);
  const required = requiredOptions(product);
  const missing = required.filter((o) => !selections[o.id]);
  const soldOut = product.availability === "sold_out";
  const status = availabilityCopy[product.availability];

  const choose = (option: ProductOption, valueId: string) => {
    setSelections((s) => ({ ...s, [option.id]: valueId }));
    setErrors((e) => e.filter((x) => x !== option.id));
  };

  const submit = () => {
    if (missing.length) {
      setErrors(missing.map((o) => o.id));
      document.getElementById(`opt-${missing[0].id}`)?.focus();
      return;
    }
    add(product.id, selections, quantity, withCard ? inscription : undefined);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <ProductGallery images={images} video={product.video} productName={product.name} />
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <p className="eyebrow text-taupe">
            {product.archiveNo} · Entered in the register
          </p>
          <h1 className="mt-4 font-display text-[clamp(36px,3.6vw,54px)] leading-[1]">{product.name}</h1>
          {product.subtitle && <p className="mt-3 text-[14px] text-taupe">{product.subtitle}</p>}

          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <p className="text-[20px] tabular-nums" aria-live="polite">
              {formatPrice(price)}
            </p>
            {product.priceProvenance === "demo" && <DemoTag>Illustrative price — to be confirmed</DemoTag>}
          </div>

          <p className="mt-4 flex items-center gap-2 text-[13px]">
            <span className={cx("size-1.5 rounded-full", status.tone)} aria-hidden />
            {status.label}
            <span className="text-taupe">· demo stock</span>
          </p>

          <div className="mt-8 space-y-7">
            {product.options.map((option) => (
              <OptionPicker
                key={option.id}
                option={option}
                value={selections[option.id]}
                onChange={(v) => choose(option, v)}
                error={errors.includes(option.id)}
                onSizeGuide={option.id === "size" ? () => setSizeGuide(true) : undefined}
              />
            ))}
          </div>

          {/* Inheritance Card */}
          <div className="mt-8 border-t border-line pt-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" className="mt-1 size-4 accent-ink" checked={withCard} onChange={(e) => setWithCard(e.target.checked)} />
              <span>
                <span className="flex items-center gap-2 text-[14px] font-medium">
                  <Feather className="size-4 text-camel-deep" strokeWidth={1.25} aria-hidden /> Add an Inheritance Card
                </span>
                <span className="mt-1 block text-[13px] text-taupe">A few words for the person this piece is ultimately meant for — packed with it.</span>
              </span>
            </label>
            {withCard && (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor={inscriptionId} className="sr-only">
                    Inscription
                  </label>
                  <textarea
                    id={inscriptionId}
                    rows={2}
                    maxLength={INSCRIPTION_MAX}
                    value={inscription}
                    onChange={(e) => setInscription(e.target.value)}
                    placeholder="For Amara — the first of many."
                    className="field resize-none font-display text-[19px] italic"
                    aria-describedby={`${inscriptionId}-count`}
                  />
                  <p id={`${inscriptionId}-count`} className="mt-1.5 text-right text-[11.5px] tabular-nums text-taupe">
                    {inscription.length}/{INSCRIPTION_MAX}
                  </p>
                </div>
                <InheritanceCard archiveNo={product.archiveNo} productName={product.name} inscription={inscription.trim()} placeholder="Your words will appear here." />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-stretch gap-3">
            <QuantitySelector value={quantity} onChange={setQuantity} max={MAX_QTY} />
            <button type="button" onClick={submit} disabled={soldOut} className="btn btn-ink flex-1">
              {soldOut ? "Sold out" : added ? (
                <>
                  <Check className="size-4" strokeWidth={1.5} /> Added to bag
                </>
              ) : (
                `Add to bag — ${formatPrice(price * quantity)}`
              )}
            </button>
          </div>
          {missing.length > 0 && errors.length > 0 && (
            <p role="alert" className="mt-3 text-[13px] text-danger">
              Please choose {missing.map((o) => o.label.toLowerCase()).join(" and ")} before adding to your bag.
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <WishlistButton productId={product.id} productName={product.name} variant="text" />
            {product.availability === "made_to_order" && <p className="text-[12.5px] text-taupe">Made to order — lead time to be confirmed</p>}
          </div>

          {children}
        </div>
      </div>

      <Dialog open={sizeGuide} onClose={() => setSizeGuide(false)} title="Size guide" side="right">
        <div className="space-y-6 px-5 py-8 sm:px-7">
          <DemoTag>Placeholder — measurements to be supplied by the house</DemoTag>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            The house has not yet published its measurements. This table shows the structure the guide will take; values are intentionally left blank rather than invented.
          </p>
          <table className="w-full border-collapse text-[13px]">
            <caption className="sr-only">Size guide (placeholder)</caption>
            <thead>
              <tr className="border-b border-line-strong text-left">
                <th scope="col" className="py-2 font-medium">Size</th>
                <th scope="col" className="py-2 font-medium">Chest</th>
                <th scope="col" className="py-2 font-medium">Waist</th>
                <th scope="col" className="py-2 font-medium">Length</th>
              </tr>
            </thead>
            <tbody>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <tr key={s} className="border-b border-line">
                  <th scope="row" className="py-2.5 text-left font-normal">{s}</th>
                  <td className="py-2.5 text-taupe">—</td>
                  <td className="py-2.5 text-taupe">—</td>
                  <td className="py-2.5 text-taupe">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
}

function OptionPicker({
  option,
  value,
  onChange,
  error,
  onSizeGuide,
}: {
  option: ProductOption;
  value?: string;
  onChange: (v: string) => void;
  error: boolean;
  onSizeGuide?: () => void;
}) {
  const chosen = option.values.find((v) => v.id === value);
  const single = option.values.length === 1;
  const groupId = `opt-${option.id}`;

  return (
    <fieldset aria-invalid={error} aria-describedby={error ? `${groupId}-err` : undefined}>
      <div className="mb-3 flex items-center justify-between">
        <legend className="text-[13px]">
          <span className="label text-[10.5px] text-taupe">{option.label}</span>
          <span className="ml-3">{chosen?.label ?? (single ? option.values[0].label : "")}</span>
          {chosen?.note && <span className="ml-2 text-taupe">· {chosen.note}</span>}
        </legend>
        {onSizeGuide && (
          <button type="button" onClick={onSizeGuide} className="link-reveal inline-flex min-h-9 items-center gap-1.5 text-[12.5px]">
            <Ruler className="size-3.5" strokeWidth={1.25} /> Size guide
          </button>
        )}
      </div>

      {option.id === "colour" ? (
        <div role="radiogroup" aria-label={option.label} id={groupId} tabIndex={-1} className="flex flex-wrap gap-2.5 outline-none">
          {option.values.map((v) => {
            const on = v.id === (value ?? (single ? v.id : undefined));
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${v.label}${v.soldOut ? " — sold out" : ""}`}
                title={v.label}
                disabled={v.soldOut || single}
                onClick={() => onChange(v.id)}
                className={cx(
                  "relative grid size-11 place-items-center rounded-full transition-shadow disabled:cursor-default",
                  on ? "ring-1 ring-ink" : "ring-1 ring-transparent hover:ring-line-strong",
                )}
              >
                <span className="size-7 rounded-full ring-1 ring-ink/15" style={{ background: v.swatch }} />
                {v.soldOut && <span aria-hidden className="absolute h-px w-9 rotate-45 bg-ink/60" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div role="radiogroup" aria-label={option.label} id={groupId} tabIndex={-1} className={cx("grid gap-1.5 outline-none", option.id === "size" ? "grid-cols-6" : "grid-cols-2")}>
          {option.values.map((v) => {
            const on = v.id === value;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={v.soldOut}
                onClick={() => onChange(v.id)}
                className={cx(
                  "min-h-12 border px-2 text-[13px] transition-colors disabled:text-taupe disabled:line-through",
                  on ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink",
                  error && !value && "border-danger/60",
                  option.id === "set" && "flex flex-col items-start justify-center px-4 py-2 text-left",
                )}
              >
                <span>{v.label}</span>
                {option.id === "set" && v.price !== undefined && <span className={cx("text-[12px] tabular-nums", on ? "text-ivory/75" : "text-taupe")}>{formatPrice(v.price)}</span>}
              </button>
            );
          })}
        </div>
      )}
      {error && (
        <p id={`${groupId}-err`} className="mt-2 text-[12.5px] text-danger">
          Choose a {option.label.toLowerCase()}.
        </p>
      )}
    </fieldset>
  );
}
