import Image from "next/image";
import Link from "next/link";
import { pillars } from "@/data/content";
import { media } from "@/data/media";
import { Reveal } from "@/components/ui/Reveal";

/** Brand story — the three pillars from the client's draft site. */
export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="bg-cream">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[520px] lg:min-h-[820px]">
          <Image src={media.recognizedDuo.src} alt={media.recognizedDuo.alt} fill sizes="(min-width:1024px) 50vw, 100vw" quality={80} className="object-cover object-[50%_35%]" />
        </div>
        <div className="flex flex-col justify-center px-4 py-20 sm:px-10 lg:px-20 lg:py-28">
          <Reveal>
            <p className="eyebrow text-taupe">The pillars</p>
            <h2 id="pillars-title" className="mt-4 font-display text-[clamp(38px,4.4vw,64px)] leading-[1]">
              A house built <span className="italic">on inheritance.</span>
            </h2>
          </Reveal>
          <ol className="mt-12 divide-y divide-espresso/15 border-y border-espresso/15">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 110} className="grid grid-cols-[3.5rem_1fr] gap-4 py-8">
                <span className="font-display text-[22px] italic text-camel-deep">{p.n}</span>
                <div>
                  <h3 className="font-display text-[30px] leading-none">{p.title}</h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={200}>
            <Link href="/the-house" className="link-line label mt-10 inline-block">
              Enter the House
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
