import Link from "next/link";
import { manifesto } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/ui/primitives";

/**
 * The client's own manifesto (from her draft site), staged as a typographic
 * set piece. Lines arrive one by one as they enter the viewport — no scroll
 * hijacking, and fully static for reduced-motion users.
 */
export function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="on-dark relative overflow-hidden bg-ink text-ivory">
      {/* Oversized wordmark as a quiet watermark */}
      <div aria-hidden className="pointer-events-none absolute -right-[12vw] top-1/2 w-[80vw] -translate-y-1/2 text-ivory/[0.035]">
        <Wordmark stacked className="w-full" />
      </div>

      <div className="gutter max-site relative grid gap-16 py-28 lg:grid-cols-12 lg:py-44">
        <div className="lg:col-span-3">
          <p className="eyebrow text-camel">{manifesto.kicker}</p>
          <p className="mt-3 text-[12px] text-ivory/65">In the words of the house</p>
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <ul className="space-y-1">
            {manifesto.inherit.map((line, i) => (
              <Reveal as="li" key={line} delay={i * 140} className="font-display text-[clamp(30px,4.2vw,62px)] font-light leading-[1.08] text-ivory/65">
                {line}
              </Reveal>
            ))}
          </ul>

          <Reveal delay={200}>
            <h2 id="manifesto-title" className="mt-14 font-display text-[clamp(44px,7vw,108px)] font-light italic leading-[0.95] text-camel">
              {manifesto.question}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <Reveal delay={120}>
              <p className="text-[15px] leading-relaxed text-ivory/80">{manifesto.body}</p>
            </Reveal>
            <Reveal delay={240}>
              {manifesto.close.map((l) => (
                <p key={l} className="font-display text-[24px] leading-snug">
                  {l}
                </p>
              ))}
              <Link href="/the-house" className="link-line label mt-8 inline-block text-ivory">
                A house built on inheritance
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
