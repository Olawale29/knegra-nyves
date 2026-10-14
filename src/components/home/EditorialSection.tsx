import Image from "next/image";
import Link from "next/link";
import { campaigns } from "@/data/content";
import { media } from "@/data/media";
import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Reveal } from "@/components/ui/Reveal";

/** The Art of Flight — film, still and copy in an off-grid composition. */
export function EditorialSection() {
  const c = campaigns[0];
  return (
    <section aria-labelledby="flight-title" className="bg-cream py-24 lg:py-36">
      <div className="gutter max-site grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          {c.video && <AmbientVideo video={c.video} className="aspect-[16/10] w-full" sizes="(min-width:1024px) 56vw, 100vw" controlPosition="bottom-left" />}
        </Reveal>

        <div className="flex flex-col justify-between gap-12 lg:col-span-4 lg:col-start-9">
          <Reveal>
            <p className="eyebrow text-taupe">{c.kicker}</p>
            <h2 id="flight-title" className="mt-5 font-display text-[clamp(40px,4.8vw,72px)] font-light italic leading-[0.98]">
              {c.title}
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">{c.body}</p>
            <Link href={c.href} className="btn btn-ink mt-9">
              {c.cta}
            </Link>
          </Reveal>
          <Reveal delay={150} className="relative ml-auto aspect-square w-3/5 overflow-hidden lg:w-4/5">
            <Image src={media.flightRail.src} alt={media.flightRail.alt} fill sizes="(min-width:1024px) 26vw, 60vw" quality={80} className="object-cover" />
          </Reveal>
        </div>
      </div>

      <div className="gutter max-site mt-16 grid grid-cols-3 gap-3 sm:gap-6 lg:mt-24 lg:grid-cols-12">
        {[media.camelSculpture, media.noirMarble, media.camelHat].map((m, i) => (
          <Reveal key={m.src} delay={i * 100} className={["lg:col-span-3", "lg:col-span-3 lg:col-start-6 lg:mt-20", "lg:col-span-3 lg:col-start-10"][i]}>
            <div className="relative aspect-square overflow-hidden bg-sand">
              <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 24vw, 33vw" quality={80} className="object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
