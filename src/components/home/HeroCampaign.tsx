import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero } from "@/data/content";
import { media, videos } from "@/data/media";
import { AmbientVideo } from "@/components/ui/AmbientVideo";

/**
 * Split campaign hero. Desktop: the Art of Flight photograph (7/12) beside a
 * portrait film of the Coquette headband (5/12). Mobile is recomposed: the
 * photograph fills the screen with the headline set low, and the film follows
 * as its own panel rather than being squeezed alongside.
 */
export function HeroCampaign() {
  return (
    <section aria-labelledby="hero-title" className="on-dark relative bg-ink text-ivory">
      <div className="grid lg:h-[100svh] lg:min-h-[680px] lg:max-h-[1100px] lg:grid-cols-12">
        {/* Primary — The Art of Flight */}
        <div className="relative h-[88svh] min-h-[560px] overflow-hidden lg:col-span-7 lg:h-auto lg:min-h-0">
          <div className="hero-media absolute inset-0">
            <Image
              src={media.camelFlight.src}
              alt={media.camelFlight.alt}
              fill
              preload
              quality={85}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-[62%_50%] lg:object-[50%_50%]"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-ink/30" />

          <div className="hero-copy gutter absolute inset-x-0 bottom-0 pb-10 sm:pb-14 lg:pb-16">
            <p className="eyebrow text-ivory/80">{hero.kicker}</p>
            <h1 id="hero-title" className="mt-5 font-display text-[clamp(50px,8.4vw,128px)] font-light leading-[0.92] tracking-[-0.02em]">
              <span className="block">{hero.title[0]}</span>
              <span className="block italic">{hero.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-ivory/85">{hero.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href={hero.primary.href} className="btn btn-ivory">
                {hero.primary.label}
              </Link>
              <Link href={hero.secondary.href} className="link-line label inline-flex items-center gap-2 text-ivory">
                {hero.secondary.label} <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary — The NYVES Coquette film */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:col-span-5 lg:aspect-auto">
          <AmbientVideo
            video={videos.headbandPortrait}
            className="absolute inset-0"
            sizes="(min-width: 1024px) 42vw, 100vw"
            objectPosition="50% 28%"
            controlPosition="below-header"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          <Link
            href={hero.aside.href}
            className="group absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8 lg:p-10"
          >
            <span>
              <span className="eyebrow block text-ivory/75">{hero.aside.kicker}</span>
              <span className="mt-2 block max-w-[22ch] font-display text-[26px] leading-[1.05] sm:text-[30px]">{hero.aside.title}</span>
            </span>
            <span className="label flex shrink-0 items-center gap-2 border-b border-ivory/60 pb-1 transition-colors group-hover:border-ivory">
              {hero.aside.cta}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
