import Image from "next/image";
import Link from "next/link";
import { collectionBySlug } from "@/data/collections";
import { productsInCollection } from "@/lib/catalog";
import { cx } from "@/lib/format";
import type { Collection } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

function Tile({
  collection,
  className,
  aspect,
  sizes,
  large = false,
}: {
  collection: Collection;
  className?: string;
  aspect: string;
  sizes: string;
  large?: boolean;
}) {
  const count = productsInCollection(collection.slug).length;
  return (
    <Link href={`/collections/${collection.slug}`} className={cx("group block", className)}>
      <div className={cx("relative overflow-hidden bg-cream", aspect)}>
        <Image
          src={collection.tile.src}
          alt={collection.tile.alt}
          fill
          sizes={sizes}
          quality={80}
          className="tile-media object-cover"
          style={{ objectPosition: collection.tile.focus ?? "50% 50%" }}
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-6">
        <div>
          <p className="eyebrow text-taupe">{collection.kicker}</p>
          <h3 className={cx("mt-2 font-display leading-none", large ? "text-[clamp(30px,3.4vw,48px)]" : "text-[clamp(26px,2.4vw,34px)]")}>{collection.name}</h3>
        </div>
        <span className="label link-reveal mt-1 shrink-0 text-[10.5px] group-hover:bg-[length:100%_1px]">
          {count} {count === 1 ? "piece" : "pieces"}
        </span>
      </div>
      {large && <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-soft">{collection.intro}</p>}
    </Link>
  );
}

export function CollectionTiles() {
  const get = (s: string) => collectionBySlug.get(s)!;
  return (
    <section aria-labelledby="collections-title" className="gutter max-site py-24 lg:py-36">
      <div className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow text-taupe">The collections</p>
          <h2 id="collections-title" className="mt-4 font-display text-[clamp(38px,5vw,72px)]">
            Six chapters, <span className="italic">one house.</span>
          </h2>
        </Reveal>
        <Reveal className="self-end lg:col-span-4 lg:col-start-9" delay={120}>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            From silk released into the wind to the headband the Icons made their own — each collection is a chapter in an inheritance still being written.
          </p>
        </Reveal>
      </div>

      {/* Desktop: deliberate asymmetric composition. Mobile: a swipeable rail. */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24">
        <Reveal className="col-span-7">
          <Tile collection={get("the-art-of-flight")} aspect="aspect-[6/5]" sizes="56vw" large />
        </Reveal>
        <Reveal className="col-span-4 col-start-9 mt-40" delay={120}>
          <Tile collection={get("kn-forms")} aspect="aspect-[4/5]" sizes="32vw" />
        </Reveal>
        <Reveal className="col-span-4">
          <Tile collection={get("coquette")} aspect="aspect-[4/5]" sizes="32vw" />
        </Reveal>
        <Reveal className="col-span-4 mt-28" delay={100}>
          <Tile collection={get("the-randolph")} aspect="aspect-[3/4]" sizes="32vw" />
        </Reveal>
        <Reveal className="col-span-4 mt-10" delay={200}>
          <Tile collection={get("monogram")} aspect="aspect-square" sizes="32vw" />
          <div className="mt-14">
            <Tile collection={get("essentials")} aspect="aspect-[16/10]" sizes="32vw" />
          </div>
        </Reveal>
      </div>

      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:-mx-7 sm:scroll-px-7 sm:px-7 lg:hidden">
        {["the-art-of-flight", "kn-forms", "coquette", "the-randolph", "monogram", "essentials"].map((s) => (
          <Tile key={s} collection={get(s)} aspect="aspect-[4/5]" sizes="80vw" className="w-[78vw] max-w-[360px] shrink-0 snap-start" />
        ))}
      </div>
    </section>
  );
}
