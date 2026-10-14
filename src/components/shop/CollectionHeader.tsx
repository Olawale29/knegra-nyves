import Image from "next/image";
import type { MediaAsset, Provenance } from "@/lib/types";
import { Breadcrumbs, ProvenanceNote } from "@/components/ui/primitives";

export function CollectionHeader({
  kicker,
  title,
  intro,
  image,
  crumbs,
  provenance = "verified",
}: {
  kicker: string;
  title: string;
  intro: string;
  image?: MediaAsset;
  crumbs: { label: string; href?: string }[];
  provenance?: Provenance;
}) {
  return (
    <header className="gutter max-site pb-10 pt-8 lg:pb-14 lg:pt-10">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 grid items-end gap-10 lg:mt-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-taupe">{kicker}</p>
          <h1 className="mt-4 font-display text-[clamp(48px,7vw,112px)] font-light leading-[0.92] tracking-[-0.015em]">{title}</h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">{intro}</p>
          <ProvenanceNote provenance={provenance} className="mt-4" />
        </div>
        {image && (
          <div className="relative aspect-[16/10] overflow-hidden bg-cream lg:col-span-5 lg:col-start-8">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="(min-width:1024px) 40vw, 100vw"
              quality={80}
              className="hero-media object-cover"
              style={{ objectPosition: image.focus ?? "50% 50%" }}
            />
          </div>
        )}
      </div>
    </header>
  );
}
