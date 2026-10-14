import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";

const posts = [media.recognizedHer, media.headbandIconic, media.mamafela, media.anniversary, media.futureOfStyle, media.recognizedHim];

/** Social discovery — real posts from the client's feed, linking to Instagram. */
export function SocialGrid() {
  return (
    <section aria-labelledby="social-title" className="gutter max-site py-24 lg:py-32">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <Reveal>
          <p className="eyebrow text-taupe">The Icons</p>
          <h2 id="social-title" className="mt-4 font-display text-[clamp(34px,4vw,56px)]">
            Recognised, <span className="italic">in the wild.</span>
          </h2>
        </Reveal>
        <a href={site.instagram.url} target="_blank" rel="noreferrer" className="link-line label inline-flex items-center gap-2">
          {site.instagram.handle} <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
          <span className="sr-only">(opens Instagram in a new tab)</span>
        </a>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3">
        {posts.map((m, i) => (
          <Reveal as="li" key={m.src} delay={(i % 6) * 70}>
            <a href={site.instagram.url} target="_blank" rel="noreferrer" className="group relative block aspect-[4/5] overflow-hidden bg-cream">
              <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw" quality={70} className="tile-media object-cover" />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" aria-hidden />
              <span className="sr-only">View on Instagram (opens in a new tab)</span>
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
