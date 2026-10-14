import { cx } from "@/lib/format";
import { Wordmark } from "@/components/ui/primitives";

/** Visual of the inscribed card packed with a piece. Purely presentational. */
export function InheritanceCard({
  archiveNo,
  productName,
  inscription,
  placeholder = "Your words will appear here.",
  className,
}: {
  archiveNo: string;
  productName: string;
  inscription: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <figure
      className={cx(
        "relative border border-espresso/25 bg-[#fbf8f2] px-6 py-7 text-espresso shadow-[0_30px_60px_-30px_rgb(20_18_16/0.45)] sm:px-8 sm:py-9",
        className,
      )}
      aria-label="Inheritance card preview"
    >
      <div aria-hidden className="pointer-events-none absolute inset-2 border border-espresso/10" />
      <div className="flex items-center justify-between">
        <Wordmark className="h-3.5 text-espresso" />
        <span className="eyebrow text-[9px] text-camel-deep">{archiveNo}</span>
      </div>
      <p className="eyebrow mt-7 text-[9px] text-espresso/60">Entered in the register</p>
      <p className="mt-1 text-[12.5px]">{productName}</p>
      <blockquote className="mt-6 min-h-[3.3em] font-display text-[24px] italic leading-[1.15] sm:text-[27px]">
        {inscription ? `“${inscription}”` : <span className="text-espresso/40">“{placeholder.replace(/^“|”$/g, "")}”</span>}
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between border-t border-espresso/15 pt-4 text-[10px] uppercase tracking-[0.2em] text-espresso/60">
        <span>To be passed on</span>
        <span>Lagos</span>
      </figcaption>
    </figure>
  );
}
