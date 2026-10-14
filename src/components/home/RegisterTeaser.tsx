"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { media } from "@/data/media";
import { InheritanceCard } from "@/components/product/InheritanceCard";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Introduces the Inheritance Register: every piece carries an archive number,
 * and can be sent with an inscribed card. Visitors can try the inscription here.
 */
export function RegisterTeaser() {
  const [name, setName] = useState("");

  return (
    <section id="register" aria-labelledby="register-title" className="gutter max-site scroll-mt-28 py-24 lg:py-36">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-cream">
            <Image src={media.flightFlat.src} alt={media.flightFlat.alt} fill sizes="(min-width:1024px) 40vw, 100vw" quality={80} className="object-cover" />
          </Reveal>
          <Reveal delay={200} className="absolute -bottom-10 right-4 w-[78%] sm:right-8 lg:-right-16 lg:w-[86%]">
            <InheritanceCard
              archiveNo="Nº 001"
              productName="The Art of Flight Silk Scarf"
              inscription={name ? `For ${name} — the first chapter.` : ""}
              placeholder="For you — the first chapter."
            />
          </Reveal>
        </div>

        <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0">
          <Reveal>
            <p className="eyebrow text-taupe">The Inheritance Register</p>
            <h2 id="register-title" className="mt-5 font-display text-[clamp(38px,4.6vw,66px)] leading-[1]">
              Not clothing — <span className="italic">a chapter of your story.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              Every KNEGRA NYVES piece is entered in the house register with its own archive number. Add an Inheritance Card to any piece: a few words for the person it is ultimately meant for, packed with the piece.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-9">
            <label htmlFor="register-name" className="eyebrow text-taupe">
              Try it — who is it for?
            </label>
            <input
              id="register-name"
              type="text"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="A name"
              autoComplete="off"
              className="field mt-3 font-display text-[22px]"
            />
            <Link href="/products/the-art-of-flight-silk-scarf" className="link-line label mt-8 inline-block">
              Begin with Nº 001
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
