import Image from "next/image";
import Link from "next/link";
import { campaigns } from "@/data/content";
import { media } from "@/data/media";
import { cx } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

const frames = [
  { m: media.randolphShoreHat, cls: "lg:col-span-4", aspect: "aspect-[3/4]" },
  { m: media.randolphPortrait, cls: "lg:col-span-3 lg:mt-28", aspect: "aspect-[3/4]" },
  { m: media.randolphShoreBag, cls: "lg:col-span-3 lg:mt-10", aspect: "aspect-[3/4]" },
  { m: media.randolphDetail, cls: "lg:col-span-2 lg:mt-48", aspect: "aspect-[3/4]" },
];

/** The Randolph — a beach lookbook straight from the client's own shoot. */
export function Lookbook() {
  const c = campaigns[1];
  return (
    <section aria-labelledby="lookbook-title" className="overflow-hidden border-t border-line py-24 lg:py-36">
      <div className="gutter max-site">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-taupe">{c.kicker}</p>
            <h2 id="lookbook-title" className="mt-4 font-display text-[clamp(44px,6.4vw,104px)] font-light leading-[0.9]">
              The future <span className="block italic">of style.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-relaxed text-ink-soft">{c.body}</p>
            <Link href="/products/the-randolph-pajama-duo" className="link-line label mt-6 inline-block">
              Shop the Randolph
            </Link>
          </Reveal>
        </div>

        <div className="no-scrollbar -mx-4 mt-14 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 sm:-mx-7 sm:scroll-px-7 sm:px-7 lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:overflow-visible lg:px-0">
          {frames.map(({ m, cls, aspect }, i) => (
            <Reveal key={m.src} delay={i * 90} className={cx("w-[64vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none", cls)}>
              <div className={cx("relative overflow-hidden bg-sand", aspect)}>
                <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 33vw, 64vw" quality={80} className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
