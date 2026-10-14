import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { brandMarks } from "@/data/media";
import { cx, formatPrice } from "@/lib/format";
import type { Provenance } from "@/lib/types";

/** The client's wordmark, rendered as a CSS mask so it can take any colour. */
export function Wordmark({ className, stacked = false, label = "KNEGRA NYVES" }: { className?: string; stacked?: boolean; label?: string }) {
  const mark = stacked ? brandMarks.stacked : brandMarks.wordmark;
  return (
    <span
      role="img"
      aria-label={label}
      className={cx("block bg-current", className)}
      style={{
        aspectRatio: `${mark.width} / ${mark.height}`,
        WebkitMaskImage: `url(${mark.src})`,
        maskImage: `url(${mark.src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function Price({ amount, from, className }: { amount: number; from?: boolean; className?: string }) {
  return (
    <span className={cx("tabular-nums", className)}>
      {from && <span className="mr-1 text-taupe">From</span>}
      {formatPrice(amount)}
    </span>
  );
}

/** Small marker for anything that is demo/illustrative rather than confirmed. */
export function DemoTag({ children = "Illustrative", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-camel-deep", className)}>
      <span aria-hidden className="size-1 rounded-full bg-camel" />
      {children}
    </span>
  );
}

export function ProvenanceNote({ provenance, className }: { provenance: Provenance; className?: string }) {
  if (provenance === "verified") return null;
  return <DemoTag className={className}>Placeholder copy</DemoTag>;
}

export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("text-[12px] text-taupe", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} className="link-reveal hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "size-9" : "size-12";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line-strong">
      <button type="button" className={cx("grid place-items-center disabled:opacity-30", btn)} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <output aria-live="polite" className={cx("min-w-8 text-center tabular-nums", size === "sm" ? "text-[13px]" : "text-[14px]")}>
        {value}
      </output>
      <button type="button" className={cx("grid place-items-center disabled:opacity-30", btn)} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export function Accordion({ items, className }: { items: { title: string; content: ReactNode; defaultOpen?: boolean }[]; className?: string }) {
  return (
    <div className={cx("border-t border-line", className)}>
      {items.map((item) => (
        <details key={item.title} className="group border-b border-line" open={item.defaultOpen}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span className="label">{item.title}</span>
            <span aria-hidden className="relative size-3">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="pb-6 text-[14px] leading-relaxed text-ink-soft">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

export function EmptyState({ title, body, action, as: Title = "p" }: { title: string; body?: string; action?: { label: string; href: string }; as?: "p" | "h1" | "h2" }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <Title className="font-display text-[34px] font-normal italic">{title}</Title>
      {body && <p className="mt-4 text-[14px] text-taupe">{body}</p>}
      {action && (
        <Link href={action.href} className="btn btn-ink mt-8">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  children,
  align = "left",
  className,
  as: As = "h2",
}: {
  kicker?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cx(align === "center" && "text-center", className)}>
      {kicker && <p className="eyebrow mb-4 text-taupe">{kicker}</p>}
      <As className="font-display text-[clamp(34px,4.6vw,64px)]">{title}</As>
      {children && <div className={cx("mt-5 max-w-xl text-[15px] text-ink-soft", align === "center" && "mx-auto")}>{children}</div>}
    </div>
  );
}
