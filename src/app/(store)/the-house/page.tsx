import type { Metadata } from "next";
import Image from "next/image";
import { houseFacts, manifesto } from "@/data/content";
import { media } from "@/data/media";
import { Pillars } from "@/components/home/Pillars";
import { RegisterTeaser } from "@/components/home/RegisterTeaser";
import { Breadcrumbs, DemoTag } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "The House",
  description: "KNEGRA NYVES — a Lagos fashion house built on inheritance. The manifesto, the pillars and the Inheritance Register.",
  alternates: { canonical: "/the-house" },
};

export default function HousePage() {
  return (
    <>
      <section className="gutter max-site pb-20 pt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "The House" }]} />
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-taupe">The House · Lagos</p>
            <h1 className="mt-5 font-display text-[clamp(52px,8vw,132px)] font-light leading-[0.9] tracking-[-0.02em]">
              What will you <span className="italic">leave behind?</span>
            </h1>
          </div>
          <div className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-[15px] leading-relaxed text-ink-soft">{manifesto.body}</p>
          </div>
        </div>
      </section>

      <section aria-label="Manifesto" className="on-dark bg-ink text-ivory">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[560px]">
            <Image src={media.mamafela.src} alt={media.mamafela.alt} fill sizes="(min-width:1024px) 50vw, 100vw" quality={80} className="object-cover object-[50%_60%]" />
          </div>
          <div className="flex flex-col justify-center gap-6 px-4 py-20 sm:px-10 lg:px-20">
            {manifesto.inherit.map((l, i) => (
              <Reveal key={l} delay={i * 120} className="font-display text-[clamp(28px,3vw,44px)] font-light leading-tight text-ivory/60">
                {l}
              </Reveal>
            ))}
            <Reveal delay={500} className="mt-4 font-display text-[clamp(30px,3.2vw,48px)] italic text-camel">
              Yet every generation is given the same question.
            </Reveal>
            <Reveal delay={600} className="mt-6 space-y-3 text-[15px] leading-relaxed text-ivory/80">
              <p>Because true luxury has never been about ownership. It has been about permanence — about creating something worthy of being remembered, and worthy of being passed on.</p>
              <p className="font-display text-[26px] text-ivory">This is not simply a fashion house. It is a house for those building their legacy.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <Pillars />

      <section aria-labelledby="facts-title" className="gutter max-site py-24">
        <h2 id="facts-title" className="eyebrow text-taupe">
          The house, in brief
        </h2>
        <dl className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {houseFacts.map((f) => (
            <div key={f.label} className="bg-ivory py-6 pr-6 sm:p-6">
              <dt className="text-[12.5px] text-taupe">{f.label}</dt>
              <dd className="mt-2 font-display text-[24px] leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-2xl text-[12.5px] leading-relaxed text-taupe">
          Facts and words on this page come from the house’s own Instagram and draft site. Founder story, production and sourcing details are awaiting the house’s own account and are not invented here.
        </p>
        <DemoTag className="mt-3">Founder story — to be supplied</DemoTag>
      </section>

      <div className="border-t border-line">
        <RegisterTeaser />
      </div>
    </>
  );
}
